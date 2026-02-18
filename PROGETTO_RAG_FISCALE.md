# Progetto: Sistema RAG per Normativa IVA e Interpelli Fiscali

## 1. Obiettivo

Costruire un sistema di ricerca intelligente per fiscalisti e commercialisti che, data una domanda dell'utente (generica o specifica), risponda con il contesto normativo dal Testo Unico IVA (D.Lgs. 10/2026) e proponga gli interpelli pertinenti dell'Agenzia delle Entrate.

---

## 2. Dati disponibili

| Dataset | Documenti | Dimensione | Stato |
|---------|-----------|------------|-------|
| TU IVA | 171 articoli | ~128K token | `testo_unico_iva_database.json` |
| Interpelli 2024-2025 | 525 con testo completo | ~2M token | `interpelli_2024_2025_database.json` |

Punti di forza dei dati:
- 56 articoli del TU hanno interpelli collegabili tramite riferimenti DPR 633/72
- 19 temi in comune tra i due database per filtraggio incrociato
- Mappatura bidirezionale vecchio codice ↔ nuovo TU (125 voci)

---

## 3. Architettura del Sistema

```
┌──────────────────────────────────────────────────────────────┐
│                      QUERY UTENTE                            │
│  "Aliquota IVA per somministrazione alimenti in università?" │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │    QUERY ANALYZER (LLM) │
         │                         │
         │  Classifica la query:   │
         │  • tipo (generica /     │
         │    specifica / normativa)│
         │  • temi probabili       │
         │  • rif. normativi       │
         │    espliciti            │
         │  • riformulazione per   │
         │    embedding            │
         └────┬───────┬───────┬────┘
              │       │       │
     ┌────────┘       │       └────────┐
     ▼                ▼                ▼
┌─────────┐   ┌─────────────┐   ┌──────────┐
│ PATH A  │   │   PATH B    │   │  PATH C  │
│ Lookup  │   │  Semantic   │   │ Metadata │
│ Diretto │   │  Search     │   │  Filter  │
│         │   │  (Pinecone) │   │          │
│ Rif.    │   │             │   │ Tag +    │
│ normativo│  │  Embedding  │   │ Tema +   │
│ esplicito│  │  query →    │   │ Anno     │
│ → mappa │   │  top-K      │   │          │
└────┬────┘   └──────┬──────┘   └────┬─────┘
     │               │               │
     └───────┐       │       ┌───────┘
             ▼       ▼       ▼
         ┌─────────────────────────┐
         │     FUSION & RERANKER   │
         │                         │
         │  1. Unione risultati    │
         │  2. Deduplicazione      │
         │  3. Reranking per       │
         │     rilevanza + data    │
         │  4. Selezione top-N     │
         └────────────┬────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │    RESPONSE GENERATOR   │
         │         (LLM)           │
         │                         │
         │  Input:                 │
         │  • Query originale      │
         │  • Articoli TU IVA      │
         │  • Interpelli rilevanti │
         │                         │
         │  Output strutturato:    │
         │  1. Contesto normativo  │
         │  2. Interpelli          │
         │  3. Fonti e citazioni   │
         └─────────────────────────┘
```

---

## 4. Storage: Pinecone — Due Namespace, Un Indice

### Perché un unico indice con due namespace

Pinecone permette di avere un singolo indice con namespace separati. Questo semplifica la gestione e permette di fare ricerche cross-namespace quando serve.

```
Indice: "fisco-iva"
├── Namespace: "tu-iva"         → chunk degli articoli del TU
└── Namespace: "interpelli"     → chunk degli interpelli
```

### 4.1 Namespace `tu-iva` — Chunking Strategy

**Regola: ogni chunk deve stare sotto i ~1500 token (~6000 char) per embedding ottimali.**

| Tipo articolo | Strategia | Chunk risultanti |
|--------------|-----------|------------------|
| < 3000 char (119 articoli) | Articolo intero = 1 chunk | 119 |
| 3000-6000 char (34 articoli) | Articolo intero = 1 chunk | 34 |
| > 6000 char (18 articoli) | Spezzato per comma, con contesto | ~90 stimati |
| **Totale stimato** | | **~243 chunk** |

**Struttura di ogni chunk:**

```json
{
  "id": "tu_art_34",
  "values": [0.012, -0.034, ...],  // embedding vector
  "metadata": {
    "source": "tu_iva",
    "articolo": "34",
    "titolo_articolo": "Aliquote dell'imposta",
    "titolo_sezione": "VIII - Aliquote",
    "capo": "I - Aliquote dell'imposta",
    "comma": null,
    "temi": ["aliquote", "iva_agevolata", "base_imponibile"],
    "vecchio_codice": ["DPR 633/1972 art. 16"],
    "citazione": "Art. 34 D.Lgs. 10/2026",
    "text": "Aliquote dell'imposta. L'aliquota dell'imposta è stabilita nella misura del 22 per cento..."
  }
}
```

Per gli articoli spezzati per comma:

```json
{
  "id": "tu_art_37_comma_1",
  "values": [0.012, -0.034, ...],
  "metadata": {
    "source": "tu_iva",
    "articolo": "37",
    "titolo_articolo": "Operazioni esenti dall'imposta",
    "titolo_sezione": "IX - Esenzioni e non imponibilità",
    "capo": "I - Operazioni esenti",
    "comma": "1",
    "parent_id": "tu_art_37",
    "temi": ["esenzioni"],
    "vecchio_codice": ["DPR 633/1972 art. 10"],
    "citazione": "Art. 37, comma 1, D.Lgs. 10/2026",
    "text": "Operazioni esenti dall'imposta – comma 1. Sono esenti dall'imposta: a) le prestazioni di servizi concernenti la concessione..."
  }
}
```

**Nota sul campo `text`:** il testo viene prepeso con titolo dell'articolo + contesto gerarchico per dare segnale all'embedding anche quando il comma isolato sarebbe ambiguo.

### 4.2 Namespace `interpelli` — Chunking Strategy

Gli interpelli hanno due componenti utili per il retrieval: la **massima** (breve, densa, perfetta per embedding) e il **parere completo** (lungo, dettagliato, serve come contesto per la risposta).

**Strategia a due livelli:**

| Componente | Ruolo | Chunk |
|-----------|-------|-------|
| Massima + Oggetto + Quesito (riassunto) | Retrieval primario | 1 per interpello = 525 |
| Parere AdE (se > 6000 char, spezzato) | Contesto per generazione | ~700 stimati |
| **Totale stimato** | | **~1225 chunk** |

**Chunk primario (per retrieval):**

```json
{
  "id": "ip_2024_19",
  "values": [0.023, -0.056, ...],
  "metadata": {
    "source": "interpello",
    "numero": 19,
    "anno": 2024,
    "data": "2024-01-26",
    "tag": "ALIQ. IVA",
    "oggetto": "IVA Alimenti e Bevande",
    "temi": ["aliquote", "esenzioni", "prestazioni_servizi"],
    "rif_dpr633": ["DPR 633/1972 art. 16"],
    "rif_tu_iva": ["art_34"],
    "link_pdf": "https://...",
    "citazione": "Risposta a interpello n. 19/2024",
    "chunk_type": "summary",
    "text": "IVA Alimenti e Bevande. Alla somministrazione di alimenti e bevande effettuata tramite il servizio bar-tavola fredda in un'università è applicabile l'aliquota IVA del 10%..."
  }
}
```

**Chunk del parere (per contesto alla generazione):**

```json
{
  "id": "ip_2024_19_parere_1",
  "values": [0.023, -0.056, ...],
  "metadata": {
    "source": "interpello",
    "parent_id": "ip_2024_19",
    "chunk_type": "parere",
    "numero": 19,
    "anno": 2024,
    "tag": "ALIQ. IVA",
    "temi": ["aliquote", "prestazioni_servizi"],
    "text": "Il n. 37) della Tabella A, Parte II, allegata al decreto del Presidente della Repubblica 26 ottobre 1972..."
  }
}
```

---

## 5. Retrieval Pipeline — I Tre Percorsi

### 5.1 PATH A — Lookup Diretto (per query con riferimento normativo)

Attivato quando il Query Analyzer rileva un riferimento esplicito:
- "art. 10 DPR 633" → mappatura → Art. 37 TU IVA
- "art. 34 Testo Unico IVA" → diretto → Art. 34 TU
- "interpello 19/2024" → diretto → ID `ip_2024_19`

**Implementazione:** semplice lookup sul JSON locale (non serve Pinecone). Veloce, deterministico, preciso.

```python
def path_a_lookup(query_analysis):
    results = []

    # Se cita un articolo del vecchio codice
    if query_analysis.old_code_refs:
        for ref in query_analysis.old_code_refs:
            if ref in mapping_vecchio_nuovo:
                tu_articles = mapping_vecchio_nuovo[ref]
                results.extend(tu_articles)

    # Se cita un articolo del TU IVA
    if query_analysis.tu_iva_refs:
        for art_num in query_analysis.tu_iva_refs:
            results.append(get_tu_article(art_num))

    # Se cita un interpello specifico
    if query_analysis.interpello_refs:
        for num, anno in query_analysis.interpello_refs:
            results.append(get_interpello(num, anno))

    return results
```

### 5.2 PATH B — Ricerca Semantica (per query generiche e specifiche)

Attivato sempre. Il Query Analyzer riformula la query per ottimizzare l'embedding.

```python
def path_b_semantic(query_embedding, query_analysis):
    # Ricerca su entrambi i namespace
    tu_results = pinecone_index.query(
        vector=query_embedding,
        namespace="tu-iva",
        top_k=5,
        filter=build_filter(query_analysis),  # tema, se identificato
        include_metadata=True
    )

    ip_results = pinecone_index.query(
        vector=query_embedding,
        namespace="interpelli",
        top_k=10,
        filter={
            "chunk_type": "summary",
            **build_filter(query_analysis)
        },
        include_metadata=True
    )

    return tu_results, ip_results
```

### 5.3 PATH C — Filtro per Metadata (raffinamento)

Usato per restringere i risultati quando il Query Analyzer identifica filtri chiari.

Filtri disponibili in Pinecone:
- `temi` (lista) — es. `{"temi": {"$in": ["aliquote", "esenzioni"]}}`
- `tag` — es. `{"tag": {"$in": ["IVA", "ALIQ. IVA"]}}`
- `anno` — es. `{"anno": {"$gte": 2024}}`
- `articolo` — es. `{"articolo": "34"}`

Questi filtri si combinano con la ricerca semantica (Pinecone li applica prima del nearest-neighbor).

---

## 6. Fusion & Reranking

I risultati dei tre path vanno fusi e ordinati.

```python
def fuse_and_rerank(path_a_results, path_b_tu, path_b_ip, query):
    all_results = []

    # Path A ha priorità massima (match esatto)
    for r in path_a_results:
        all_results.append({"doc": r, "score": 1.0, "source": "lookup"})

    # Path B risultati semantici
    for r in path_b_tu.matches:
        all_results.append({"doc": r, "score": r.score, "source": "semantic"})
    for r in path_b_ip.matches:
        all_results.append({"doc": r, "score": r.score, "source": "semantic"})

    # Deduplicazione
    seen = set()
    unique = []
    for r in all_results:
        doc_id = r["doc"].id
        if doc_id not in seen:
            seen.add(doc_id)
            unique.append(r)

    # Reranking con bonus:
    for r in unique:
        # Bonus per interpelli più recenti
        if r["doc"].metadata.get("anno") == 2025:
            r["score"] *= 1.1
        # Bonus per match esatto da Path A
        if r["source"] == "lookup":
            r["score"] *= 1.5
        # Bonus per interpelli collegati a un articolo TU trovato
        # (se ho trovato Art. 34 TU, gli interpelli che citano art. 34 salgono)
        if has_cross_reference(r, all_results):
            r["score"] *= 1.2

    unique.sort(key=lambda x: -x["score"])
    return unique
```

### Selezione finale per il prompt

Da passare al LLM come contesto:
- **Top 3 articoli TU IVA** (con testo integrale o comma rilevanti)
- **Top 5 interpelli** (con massima + parere completo, recuperato con query by parent_id)

---

## 7. Query Analyzer — Prompt di Sistema

Il Query Analyzer è un LLM leggero (es. GPT-4o-mini, Claude Haiku) con questo prompt:

```
Sei un analizzatore di query fiscali. Data la domanda dell'utente,
estrai le seguenti informazioni in formato JSON:

{
  "tipo_query": "generica" | "specifica" | "normativa",
  "temi_probabili": ["aliquote", "esenzioni", ...],
  "riferimenti_normativi": {
    "vecchio_codice": ["DPR 633/1972 art. 10", ...],
    "tu_iva": ["art. 34", ...],
    "interpelli": [{"numero": 19, "anno": 2024}, ...]
  },
  "query_riformulata": "testo ottimizzato per ricerca semantica",
  "filtri_suggeriti": {
    "tag": ["IVA", "ALIQ. IVA"],
    "anno_min": 2024
  }
}

Temi disponibili: aliquote, esenzioni, detrazione, base_imponibile,
fatturazione, registrazione, dichiarazione, rimborsi, operazioni_intra,
importazioni, esportazioni, regime_speciale, cessioni_beni,
prestazioni_servizi, reverse_charge, split_payment, iva_edilizia,
commercio_elettronico, gruppo_iva, territorialita, compensazioni,
cessione_credito
```

---

## 8. Response Generator — Struttura Output

Il LLM finale (Claude Sonnet o GPT-4o) genera la risposta strutturata:

```
## Contesto Normativo

[Spiegazione chiara della normativa pertinente, citando gli articoli
del TU IVA con numero e titolo. Linguaggio professionale ma accessibile.]

**Fonti normative:**
- Art. 34 D.Lgs. 10/2026 (TU IVA) — Aliquote dell'imposta
  (ex art. 16 DPR 633/1972)
- Tabella A, Parte III, n. 121

## Interpelli Pertinenti

1. **Interpello n. 19/2024** (26/01/2024) — IVA Alimenti e Bevande
   Alla somministrazione di alimenti e bevande effettuata tramite il
   servizio bar-tavola fredda in un'università è applicabile l'aliquota
   IVA del 10%...
   📄 [Leggi il PDF completo](link)

2. **Interpello n. 106/2024** (15/05/2024) — IVA Dispositivi Medici
   ...
   📄 [Leggi il PDF completo](link)
```

---

## 9. Modello di Embedding Consigliato

| Modello | Dimensioni | Pro | Contro |
|---------|-----------|-----|--------|
| `text-embedding-3-large` (OpenAI) | 3072 | Ottimo italiano giuridico, Pinecone nativo | Costo per token |
| `multilingual-e5-large` | 1024 | Open source, buono per italiano | Meno preciso su linguaggio giuridico |
| `voyage-3` (Voyage AI) | 1024 | Eccellente per documenti lunghi | Meno testato su italiano |

**Raccomandazione:** `text-embedding-3-large` con dimensione ridotta a 1024 (Pinecone supporta la truncation nativa di OpenAI). Miglior rapporto qualità/costo per testo giuridico italiano.

---

## 10. Stack Tecnologico Consigliato

```
Frontend:        Next.js / React
Backend API:     Python (FastAPI)
Vector DB:       Pinecone (Serverless, piano gratuito per iniziare)
Embedding:       OpenAI text-embedding-3-large
Query Analyzer:  Claude Haiku / GPT-4o-mini
Response Gen:    Claude Sonnet / GPT-4o
Orchestratore:   LangChain o custom pipeline
Storage JSON:    I due file JSON come source of truth
```

---

## 11. Costi Stimati (Piano Iniziale)

| Componente | Stima mensile |
|-----------|--------------|
| Pinecone Serverless (starter) | Gratuito (fino a 100K vettori) |
| OpenAI Embedding (una tantum) | ~$0.50 per indicizzazione completa |
| LLM per query (100 query/giorno) | ~$15-30/mese (dipende dal modello) |
| Hosting API (Vercel/Railway) | ~$5-20/mese |
| **Totale** | **~$20-50/mese** |

---

## 12. Prossimi Step di Implementazione

1. **Preparare i chunk** — Script Python che legge i due JSON e produce i chunk con la struttura definita sopra
2. **Generare embedding** — Chiamare OpenAI per ogni chunk
3. **Upsert su Pinecone** — Caricare vettori + metadata
4. **Costruire API backend** — FastAPI con i tre path di retrieval
5. **Query Analyzer** — Prompt engineering e test
6. **Response Generator** — Prompt engineering con template di risposta
7. **Test end-to-end** — Batteria di domande tipo per validare la qualità
8. **Frontend** — UI per fiscalisti con visualizzazione PDF
