#!/usr/bin/env python3
"""
Prepara i chunk e li carica su Pinecone per il sistema RAG fiscale.

Uso:
    # 1. Imposta le variabili d'ambiente:
    export PINECONE_API_KEY="pc-..."
    export OPENAI_API_KEY="sk-..."

    # 2. Lancia:
    python prepara_pinecone.py

Genera i chunk dai due JSON (TU IVA + Interpelli), calcola gli embedding
con OpenAI text-embedding-3-large, e li carica su Pinecone.
"""

import os
import sys
import json
import time
import hashlib
from pathlib import Path

# ─── Config ──────────────────────────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).parent
BASE_DIR = SCRIPT_DIR.parent
TU_PATH = BASE_DIR / "data" / "testo_unico_iva_database.json"
IP_PATH = BASE_DIR / "data" / "interpelli_2024_2025_database.json"
CHUNKS_OUTPUT = BASE_DIR / "pinecone_chunks.json"  # backup locale dei chunk

PINECONE_INDEX_NAME = "fisco-assolombarda"
PINECONE_CLOUD = "aws"
PINECONE_REGION = "us-east-1"
EMBEDDING_MODEL = "text-embedding-3-large"
EMBEDDING_DIMENSIONS = 1024  # ridotto da 3072 per costi/performance
MAX_CHUNK_CHARS = 6000       # ~1500 token, ottimale per embedding
BATCH_SIZE_EMBEDDING = 100   # OpenAI batch limit
BATCH_SIZE_UPSERT = 100      # Pinecone batch limit


# ─── Step 1: Genera chunk dal TU IVA ────────────────────────────────────────

def chunk_tu_iva(tu_data):
    """Genera chunk dagli articoli del TU IVA."""
    chunks = []
    articles = tu_data['articoli']

    for art in articles:
        art_id = art['id']
        titolo = art['titolo']
        struttura = art['struttura']
        testo = art['testo_integrale']

        # Context prefix che viene prepeso a ogni chunk
        context_prefix = (
            f"Testo Unico IVA - Titolo {struttura['titolo']['numero']} "
            f"({struttura['titolo']['nome']}) - "
            f"Capo {struttura['capo']['numero']} "
            f"({struttura['capo']['nome']}) - "
            f"Art. {art['articolo']}: {titolo}. "
        )

        # Metadata comune
        base_meta = {
            "source": "tu_iva",
            "articolo": art['articolo'],
            "titolo_articolo": titolo,
            "titolo_sezione": f"{struttura['titolo']['numero']} - {struttura['titolo']['nome']}",
            "capo": f"{struttura['capo']['numero']} - {struttura['capo']['nome']}",
            "temi": art['temi'],
            "citazione": f"Art. {art['articolo']} D.Lgs. 10/2026 (TU IVA)",
            "citazione_breve": f"Art. {art['articolo']} TU IVA",
        }

        # Aggiungi vecchio codice se presente
        vecchio = art['riferimenti_vecchio_codice'].get('riferimenti_strutturati', [])
        if vecchio:
            base_meta["vecchio_codice"] = [f"{r['norma']} art. {r['articolo']}" for r in vecchio]

        # Decisione: chunk intero o per comma?
        if len(testo) <= MAX_CHUNK_CHARS:
            # Articolo intero come singolo chunk
            chunk_text = context_prefix + testo
            chunks.append({
                "id": f"tu_{art_id}",
                "text": chunk_text,
                "metadata": {
                    **base_meta,
                    "comma": None,
                    "chunk_type": "articolo_intero",
                }
            })
        else:
            # Spezza per comma
            commi = split_by_commi(testo)
            for i, (comma_num, comma_text) in enumerate(commi):
                chunk_text = context_prefix + f"Comma {comma_num}. " + comma_text

                # Se un singolo comma è ancora troppo lungo, tronca
                if len(chunk_text) > MAX_CHUNK_CHARS:
                    chunk_text = chunk_text[:MAX_CHUNK_CHARS]

                chunks.append({
                    "id": f"tu_{art_id}_c{comma_num}",
                    "text": chunk_text,
                    "metadata": {
                        **base_meta,
                        "comma": str(comma_num),
                        "chunk_type": "comma",
                        "parent_id": f"tu_{art_id}",
                    }
                })

    return chunks


def split_by_commi(testo):
    """Spezza un testo in commi (1., 2., 3., ecc.)."""
    import re
    parts = re.split(r'(?:^|\n)(\d+)\s*[.)]\s*', testo)

    commi = []
    if len(parts) > 1:
        for i in range(1, len(parts), 2):
            if i + 1 < len(parts):
                num = parts[i]
                text = parts[i + 1].strip()
                if text:
                    commi.append((num, text))

    # Se non riesce a splittare (formato diverso), restituisci chunk per dimensione
    if not commi:
        commi = split_by_size(testo, MAX_CHUNK_CHARS - 500)

    return commi


def split_by_size(testo, max_size):
    """Fallback: split per dimensione su confine di frase."""
    chunks = []
    sentences = testo.split('.')
    current = ""
    chunk_num = 1

    for sent in sentences:
        if len(current) + len(sent) + 1 > max_size and current:
            chunks.append((str(chunk_num), current.strip()))
            current = sent + "."
            chunk_num += 1
        else:
            current += sent + "."

    if current.strip():
        chunks.append((str(chunk_num), current.strip()))

    return chunks


# ─── Step 2: Genera chunk dagli Interpelli ───────────────────────────────────

def chunk_interpelli(ip_data):
    """Genera chunk dagli interpelli."""
    chunks = []

    for entry in ip_data['interpelli']:
        eid = entry['id']

        # ── Chunk SUMMARY (per retrieval) ──
        # Combina: oggetto + massima + inizio quesito
        summary_parts = [
            f"Interpello n. {entry['numero']}/{entry['anno']}.",
            f"Oggetto: {entry['oggetto']}.",
            entry['massima'],
        ]

        # Aggiungi inizio quesito se disponibile (max 500 char)
        quesito = (entry['sezioni'].get('quesito') or '')[:500]
        if quesito:
            summary_parts.append(f"Quesito: {quesito}")

        summary_text = ' '.join(summary_parts)

        # Metadata
        base_meta = {
            "source": "interpello",
            "numero": entry['numero'],
            "anno": entry['anno'],
            "data": entry['data'],
            "tag": entry['tag'],
            "oggetto": entry['oggetto'],
            "temi": entry['temi'],
            "citazione": f"Risposta a interpello n. {entry['numero']}/{entry['anno']}",
            "link_pdf": entry.get('link_pdf', ''),
        }

        # Aggiungi riferimenti al TU IVA
        if entry.get('articoli_tu_iva_collegati'):
            base_meta["articoli_tu_collegati"] = entry['articoli_tu_iva_collegati']

        # Aggiungi riferimenti normativi specifici
        rif_spec = entry.get('riferimenti_normativi', {}).get('riferimenti_specifici', [])
        if rif_spec:
            base_meta["rif_normativi"] = rif_spec

        chunks.append({
            "id": f"ip_{eid}",
            "text": summary_text,
            "metadata": {
                **base_meta,
                "chunk_type": "summary",
            }
        })

        # ── Chunk PARERE (per contesto nella generazione) ──
        parere = entry['sezioni'].get('parere_ade', '')
        if not parere:
            continue

        if len(parere) <= MAX_CHUNK_CHARS:
            parere_text = (
                f"Interpello n. {entry['numero']}/{entry['anno']} - {entry['oggetto']}. "
                f"Parere dell'Agenzia delle Entrate: {parere}"
            )
            chunks.append({
                "id": f"ip_{eid}_parere",
                "text": parere_text[:MAX_CHUNK_CHARS + 500],  # un po' di margine per il context
                "metadata": {
                    **base_meta,
                    "chunk_type": "parere",
                    "parent_id": f"ip_{eid}",
                }
            })
        else:
            # Spezza il parere in chunk
            parere_chunks = split_by_size(parere, MAX_CHUNK_CHARS - 500)
            for i, (num, text) in enumerate(parere_chunks):
                parere_text = (
                    f"Interpello n. {entry['numero']}/{entry['anno']} - {entry['oggetto']}. "
                    f"Parere dell'Agenzia delle Entrate (parte {i+1}): {text}"
                )
                chunks.append({
                    "id": f"ip_{eid}_parere_{i+1}",
                    "text": parere_text[:MAX_CHUNK_CHARS + 500],
                    "metadata": {
                        **base_meta,
                        "chunk_type": "parere",
                        "parent_id": f"ip_{eid}",
                        "parere_parte": i + 1,
                    }
                })

    return chunks


# ─── Step 3: Genera embedding con OpenAI ─────────────────────────────────────

def generate_embeddings(chunks):
    """Genera embedding per tutti i chunk usando OpenAI."""
    from openai import OpenAI
    client = OpenAI()

    total = len(chunks)
    print(f"\n🧮 Generazione embedding per {total} chunk...")
    print(f"   Modello: {EMBEDDING_MODEL} (dim={EMBEDDING_DIMENSIONS})")

    for i in range(0, total, BATCH_SIZE_EMBEDDING):
        batch = chunks[i:i + BATCH_SIZE_EMBEDDING]
        texts = [c['text'] for c in batch]

        try:
            response = client.embeddings.create(
                model=EMBEDDING_MODEL,
                input=texts,
                dimensions=EMBEDDING_DIMENSIONS,
            )
            for j, emb in enumerate(response.data):
                chunks[i + j]['values'] = emb.embedding

            progress = min(i + BATCH_SIZE_EMBEDDING, total)
            print(f"\r   [{progress}/{total}] {progress/total*100:.1f}%", end='', flush=True)

        except Exception as e:
            print(f"\n   ❌ Errore batch {i}: {e}")
            # Retry after pause
            time.sleep(5)
            try:
                response = client.embeddings.create(
                    model=EMBEDDING_MODEL,
                    input=texts,
                    dimensions=EMBEDDING_DIMENSIONS,
                )
                for j, emb in enumerate(response.data):
                    chunks[i + j]['values'] = emb.embedding
            except Exception as e2:
                print(f"\n   ❌ Retry fallito: {e2}")
                sys.exit(1)

        time.sleep(0.1)  # rate limit safety

    print(f"\n   ✅ Embedding generati per {total} chunk")
    return chunks


# ─── Step 4: Carica su Pinecone ──────────────────────────────────────────────

def setup_pinecone():
    """Crea l'indice Pinecone se non esiste."""
    from pinecone import Pinecone, ServerlessSpec

    pc = Pinecone(api_key=os.environ['PINECONE_API_KEY'])

    # Check if index exists
    existing = [idx.name for idx in pc.list_indexes()]
    if PINECONE_INDEX_NAME not in existing:
        print(f"\n📌 Creazione indice '{PINECONE_INDEX_NAME}'...")
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=EMBEDDING_DIMENSIONS,
            metric="cosine",
            spec=ServerlessSpec(
                cloud=PINECONE_CLOUD,
                region=PINECONE_REGION
            )
        )
        print(f"   ✅ Indice creato")
        # Wait for index to be ready
        time.sleep(10)
    else:
        print(f"\n📌 Indice '{PINECONE_INDEX_NAME}' già esistente")

    return pc.Index(PINECONE_INDEX_NAME)


def upsert_to_pinecone(index, chunks, namespace):
    """Carica i chunk su Pinecone in batch."""
    total = len(chunks)
    print(f"\n📤 Caricamento {total} chunk su namespace '{namespace}'...")

    for i in range(0, total, BATCH_SIZE_UPSERT):
        batch = chunks[i:i + BATCH_SIZE_UPSERT]

        vectors = []
        for c in batch:
            if 'values' not in c:
                continue

            # Pinecone metadata: stringhe e liste di stringhe, numeri
            # Rimuovi campi non supportati o troppo lunghi
            meta = {}
            for k, v in c['metadata'].items():
                if isinstance(v, (str, int, float, bool)):
                    meta[k] = v
                elif isinstance(v, list) and all(isinstance(x, str) for x in v):
                    meta[k] = v
                # Skip nested dicts, None, etc.

            # Aggiungi il testo per retrieval (Pinecone lo salva nei metadata)
            meta['text'] = c['text'][:39000]  # Pinecone max metadata ~40KB

            vectors.append({
                "id": c['id'],
                "values": c['values'],
                "metadata": meta,
            })

        if vectors:
            index.upsert(vectors=vectors, namespace=namespace)

        progress = min(i + BATCH_SIZE_UPSERT, total)
        print(f"\r   [{progress}/{total}] {progress/total*100:.1f}%", end='', flush=True)

    print(f"\n   ✅ {total} chunk caricati su '{namespace}'")


# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("PREPARAZIONE PINECONE — Sistema RAG Fiscale")
    print("=" * 60)

    # Verifica API keys
    if not os.environ.get('PINECONE_API_KEY'):
        print("\n❌ PINECONE_API_KEY non impostata!")
        print("   export PINECONE_API_KEY='pc-...'")
        sys.exit(1)
    if not os.environ.get('OPENAI_API_KEY'):
        print("\n❌ OPENAI_API_KEY non impostata!")
        print("   export OPENAI_API_KEY='sk-...'")
        sys.exit(1)

    # Carica dati
    print(f"\n📂 Caricamento dati...")
    with open(TU_PATH) as f:
        tu = json.load(f)
    with open(IP_PATH) as f:
        ip = json.load(f)

    # Step 1: Genera chunk
    print(f"\n📦 Generazione chunk...")
    tu_chunks = chunk_tu_iva(tu)
    ip_chunks = chunk_interpelli(ip)
    all_chunks = tu_chunks + ip_chunks

    print(f"   TU IVA:     {len(tu_chunks)} chunk")
    print(f"   Interpelli: {len(ip_chunks)} chunk")
    print(f"   Totale:     {len(all_chunks)} chunk")

    # Salva backup locale (senza embedding, per debug)
    backup = [{"id": c["id"], "metadata": c["metadata"], "text_length": len(c["text"])} for c in all_chunks]
    with open(CHUNKS_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(backup, f, ensure_ascii=False, indent=2)
    print(f"   Backup chunk salvato in: {CHUNKS_OUTPUT}")

    # Step 2: Genera embedding
    all_chunks = generate_embeddings(all_chunks)

    # Step 3: Setup Pinecone
    index = setup_pinecone()

    # Step 4: Upsert
    upsert_to_pinecone(index, tu_chunks, namespace="tu-iva")
    upsert_to_pinecone(index, ip_chunks, namespace="interpelli")

    # Stats finali
    time.sleep(3)
    stats = index.describe_index_stats()
    print(f"\n{'=' * 60}")
    print(f"✅ COMPLETATO!")
    print(f"{'=' * 60}")
    print(f"   Indice: {PINECONE_INDEX_NAME}")
    print(f"   Namespace 'tu-iva':     {stats.namespaces.get('tu-iva', {}).get('vector_count', '?')} vettori")
    print(f"   Namespace 'interpelli': {stats.namespaces.get('interpelli', {}).get('vector_count', '?')} vettori")
    print(f"   Dimensione vettori:     {EMBEDDING_DIMENSIONS}")
    print(f"   Modello embedding:      {EMBEDDING_MODEL}")


if __name__ == '__main__':
    main()
