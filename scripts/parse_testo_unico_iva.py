#!/usr/bin/env python3
"""
Parser del Testo Unico IVA (D.Lgs. 10 del 19 gennaio 2026)
Genera un database JSON strutturato per sistema RAG sugli interpelli fiscali.
"""

import re
import json
import pdfplumber
from collections import OrderedDict

PDF_PATH = "/sessions/sharp-adoring-babbage/mnt/FISCO/Testo Unico IVA (DLgs 10 del 19 gennaio 2026).pdf"
OUTPUT_PATH = "/sessions/sharp-adoring-babbage/mnt/FISCO/testo_unico_iva_database.json"

# ─── Step 1: Extract text ───────────────────────────────────────────────────

def extract_text(pdf_path):
    """Estrae il testo completo dal PDF."""
    pages_text = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                pages_text.append(t)
    return "\n".join(pages_text)


# ─── Step 2: Clean text ─────────────────────────────────────────────────────

def clean_text(text):
    """Rimuove header/footer della Gazzetta Ufficiale e pagine vuote."""
    # Remove page markers like "— 2 —"
    text = re.sub(r'—\s*\d+\s*—', '', text)
    # Remove Gazzetta Ufficiale headers
    text = re.sub(r'30-1-2026\s+Supplemento ordinario n\.\s*4/L alla GAZZETTA UFFICIALE\s+Serie generale\s*-\s*n\.\s*24', '', text)
    # Collapse multiple blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


# ─── Step 3: Separate main body from Tabelle and Note ───────────────────────

def separate_sections(text):
    """Separa il corpo principale degli articoli dalle Tabelle e dalle Note."""

    # Find where "Tabella A" starts (after last article)
    tabella_match = re.search(r'\nTESTO UNICO IVA\s*\nTabella A\s*\*', text)
    note_match = re.search(r'\nNOTE\s+[Ab]', text)  # NOTE followed by text

    if tabella_match:
        body = text[:tabella_match.start()]
        rest = text[tabella_match.start():]
    else:
        body = text
        rest = ""

    return body, rest


# ─── Step 4: Parse structure ────────────────────────────────────────────────

def parse_titoli(body):
    """Identifica tutti i Titoli."""
    pattern = r'TITOLO\s+([IVXLCDM]+)\s*\n\s*(.+?)(?=\n)'
    return [(m.start(), m.group(1).strip(), m.group(2).strip()) for m in re.finditer(pattern, body)]


def parse_capi(body):
    """Identifica tutti i Capi."""
    pattern = r'Capo\s+([IVXLCDM]+)\s*\n\s*(.+?)(?=\n)'
    return [(m.start(), m.group(1).strip(), m.group(2).strip()) for m in re.finditer(pattern, body)]


def parse_articoli(body):
    """
    Identifica tutti gli articoli con:
    - Numero e titolo
    - Riferimenti normativi (vecchio codice)
    - Testo completo
    """
    # Pattern for ART. N\nTitolo\n(riferimenti)\nTesto
    art_pattern = r'ART\.\s*(\d+(?:\s*-\s*bis|\s*-\s*ter|\s*-\s*quater|\s*-\s*quinquies|\s*-\s*sexies|\s*-\s*septies|\s*-\s*octies|\s*-\s*novies|\s*-\s*decies)?)\s*\n'

    matches = list(re.finditer(art_pattern, body, re.IGNORECASE))
    articles = []

    for i, match in enumerate(matches):
        art_num = re.sub(r'\s+', '', match.group(1))  # normalize "1 - bis" -> "1-bis"
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)

        raw_content = body[start:end].strip()
        articles.append({
            'position': match.start(),
            'numero': art_num,
            'raw': raw_content
        })

    return articles


def parse_article_detail(raw):
    """Parsa il dettaglio di un singolo articolo."""
    lines = raw.split('\n')

    # First line(s) = titolo
    titolo = lines[0].strip()

    # Look for reference in parentheses (vecchio codice)
    riferimenti_normativi = []
    ref_text = ""
    content_start = 1

    # The reference is typically in parentheses right after the title
    # It can span multiple lines
    in_ref = False
    for idx, line in enumerate(lines[1:], 1):
        stripped = line.strip()
        if stripped.startswith('(') and not in_ref:
            in_ref = True
            ref_text = stripped
            if stripped.endswith(')'):
                in_ref = False
                content_start = idx + 1
                break
        elif in_ref:
            ref_text += ' ' + stripped
            if stripped.endswith(')'):
                in_ref = False
                content_start = idx + 1
                break
        else:
            content_start = idx
            break

    # Parse reference text to extract law references
    if ref_text:
        ref_text = ref_text.strip('()')
        # Extract individual references
        refs = extract_law_references(ref_text)
        riferimenti_normativi = refs

    # Content = everything after title and reference
    content_lines = lines[content_start:]
    testo = '\n'.join(content_lines).strip()

    return titolo, ref_text, riferimenti_normativi, testo


def extract_law_references(ref_text):
    """Estrae i riferimenti normativi strutturati."""
    refs = []

    # Pattern: "articolo X decreto..." or "articolo X, comma Y..."
    # Split by semicolons first
    parts = re.split(r';\s*', ref_text)

    for part in parts:
        part = part.strip()
        if not part:
            continue
        refs.append(part)

    return refs


def extract_old_dpr_references(ref_text):
    """Estrae specificamente i riferimenti al DPR 633/72 e al DL 331/93."""
    old_refs = []

    # DPR 633/72
    dpr_matches = re.findall(
        r'articol[oi]\s+([\d,\s\-bis\-ter\-quater\-quinquies]+)\s+decreto del Presidente della Repubblica\s+26\s+ottobre\s+1972,?\s*n\.\s*633',
        ref_text, re.IGNORECASE
    )
    for m in dpr_matches:
        arts = re.findall(r'(\d+(?:\s*-\s*(?:bis|ter|quater|quinquies|sexies|septies|octies|novies|decies))?)', m)
        for a in arts:
            old_refs.append({
                'norma': 'DPR 633/1972',
                'articolo': re.sub(r'\s+', '', a)
            })

    # DL 331/93
    dl_matches = re.findall(
        r'articol[oi]\s+([\d,\s\-bis\-ter\-quater\-quinquies]+)\s+decreto-?\s*legge\s+30\s+agosto\s+1993,?\s*n\.\s*331',
        ref_text, re.IGNORECASE
    )
    for m in dl_matches:
        arts = re.findall(r'(\d+(?:\s*-\s*(?:bis|ter|quater|quinquies|sexies|septies|octies|novies|decies))?)', m)
        for a in arts:
            old_refs.append({
                'norma': 'DL 331/1993',
                'articolo': re.sub(r'\s+', '', a)
            })

    return old_refs


# ─── Step 5: Extract keywords and topics ─────────────────────────────────────

# Mapping di temi/argomenti IVA per arricchire il RAG
IVA_TOPICS = {
    'aliquote': [r'aliquot[ae]', r'\d+\s*per\s*cento', r'\d+%', r'tabella\s+a', r'tabella\s+b'],
    'esenzioni': [r'esent[ei]', r'esenzione', r'esclus[aeiou]', r'non\s+imponibil'],
    'detrazione': [r'detrazion[ei]', r'detraibil[ei]', r'pro[\s-]*rata', r'rettifica della detrazione'],
    'base_imponibile': [r'base\s+imponibile', r'corrispettivo', r'valore\s+normal'],
    'fatturazione': [r'fattur[ae]', r'fatturazione', r'documento\s+fiscal', r'scontrino'],
    'registrazione': [r'registr[oi]', r'registrazione', r'libro\s+giornale'],
    'dichiarazione': [r'dichiarazion[ei]', r'dichiarazione\s+annuale', r'comunicazione'],
    'liquidazione': [r'liquidazion[ei]', r'versament[oi]', r'accont[oi]'],
    'rimborsi': [r'rimbors[oi]', r'credito\s+iva', r'eccedenz[ae]'],
    'operazioni_intra': [r'intra(?:unional|comunitari)[aeiou]', r'acquist[oi]\s+intra', r'cession[ei]\s+intra'],
    'importazioni': [r'importazion[ei]', r'dogan[ae]', r'territori\s+terzi'],
    'esportazioni': [r'esportazion[ei]', r'operazion[ei]\s+con\s+l.estero', r'plafond'],
    'regime_speciale': [r'regime\s+special[ei]', r'regime\s+forfet', r'regime\s+del\s+margine', r'regime\s+agricol'],
    'cessioni_beni': [r'cession[ei]\s+di\s+beni', r'trasferimento\s+di\s+propriet'],
    'prestazioni_servizi': [r'prestazion[ei]\s+di\s+servizi', r'obbligazion[ei]\s+di\s+fare'],
    'soggetti_passivi': [r'soggett[oi]\s+passiv', r'contribuent[ei]', r'identificazione\s+diretta'],
    'territorialita': [r'territorialit', r'luogo\s+di\s+imposizione', r'Stato\s+membro'],
    'gruppo_iva': [r'gruppo\s+iva', r'consolidat'],
    'reverse_charge': [r'reverse\s+charge', r'inversione\s+contabile', r'debitore\s+d.imposta'],
    'split_payment': [r'split\s+payment', r'scissione\s+dei\s+pagamenti'],
    'sanzioni': [r'sanzion[ei]', r'violazion[ei]', r'irrogazione'],
    'accertamento': [r'accertament[oi]', r'rettifica', r'verifica'],
    'obblighi_contabili': [r'obblig[hoi]\s+contabil', r'tenuta\s+dei\s+registri', r'conservazione'],
    'iva_edilizia': [r'edilizi[ao]', r'costruzion[ei]', r'ristrutturazion[ei]', r'immobil[ei]'],
    'iva_agevolata': [r'agevolat[ao]', r'ridott[ao]', r'super[\s-]*ridott'],
    'franchigia': [r'franchigi[ae]', r'piccol[aei]\s+impres[ae]', r'soglia'],
    'commercio_elettronico': [r'commercio\s+elettronico', r'e[\s-]*commerce', r'interfaccia\s+elettronica', r'piattaforma'],
    'esigibilita': [r'esigibilit', r'fatto\s+generatore', r'momento\s+impositivo'],
    'rivalsa': [r'rivalsa', r'addebitare', r'addebito\s+dell.imposta'],
    'volume_affari': [r'volume\s+d.affari', r'attivit.\s+separate'],
}


def extract_topics(text, titolo):
    """Identifica i temi trattati nell'articolo."""
    combined = (titolo + ' ' + text).lower()
    found = []
    for topic, patterns in IVA_TOPICS.items():
        for p in patterns:
            if re.search(p, combined, re.IGNORECASE):
                found.append(topic)
                break
    return found


def extract_commi(testo):
    """Estrae i singoli commi dall'articolo."""
    commi = []
    # Pattern: starts with digit followed by period or dot at beginning of line
    parts = re.split(r'(?:^|\n)(\d+)\s*[.)]\s*', testo)

    if len(parts) > 1:
        # parts[0] is text before first comma (usually empty or preamble)
        for i in range(1, len(parts), 2):
            if i + 1 < len(parts):
                comma_num = parts[i]
                comma_text = parts[i + 1].strip()
                if comma_text:
                    commi.append({
                        'numero': int(comma_num),
                        'testo': comma_text.split('\n')[0][:500] + ('...' if len(comma_text) > 500 else '')  # truncated preview
                    })

    return commi


def extract_cross_references(testo):
    """Estrae i riferimenti incrociati ad altri articoli del TU."""
    refs = set()
    # "articolo X" or "articoli X, Y e Z" within the TU
    matches = re.finditer(
        r'(?:articol[oi]|art\.)\s+(\d+(?:\s*-\s*(?:bis|ter|quater|quinquies|sexies|septies|octies|novies|decies))?)',
        testo, re.IGNORECASE
    )
    for m in matches:
        ref = re.sub(r'\s+', '', m.group(1))
        refs.add(ref)
    return sorted(refs)


def generate_search_text(titolo, testo, topics):
    """Genera un testo ottimizzato per la ricerca semantica nel RAG."""
    # Combine title + key sentences for embedding
    sentences = testo.split('.')
    key_sentences = [s.strip() for s in sentences[:5] if len(s.strip()) > 20]

    topic_labels = {
        'aliquote': 'aliquote IVA percentuali',
        'esenzioni': 'esenzioni IVA operazioni esenti',
        'detrazione': 'detrazione IVA imposta detraibile',
        'base_imponibile': 'base imponibile corrispettivo valore',
        'fatturazione': 'fattura fatturazione elettronica documento fiscale',
        'registrazione': 'registri IVA registrazione contabile',
        'dichiarazione': 'dichiarazione IVA annuale comunicazione',
        'liquidazione': 'liquidazione IVA versamento periodico',
        'rimborsi': 'rimborso IVA credito eccedenza',
        'operazioni_intra': 'operazioni intraunionali intracomunitarie',
        'importazioni': 'importazioni dogana paesi terzi',
        'esportazioni': 'esportazioni plafond operazioni con estero',
        'regime_speciale': 'regime speciale forfettario margine agricolo',
        'cessioni_beni': 'cessione di beni trasferimento proprietà',
        'prestazioni_servizi': 'prestazione di servizi',
        'soggetti_passivi': 'soggetto passivo contribuente partita IVA',
        'territorialita': 'territorialità luogo operazione',
        'gruppo_iva': 'gruppo IVA consolidato',
        'reverse_charge': 'reverse charge inversione contabile',
        'split_payment': 'split payment scissione pagamenti PA',
        'sanzioni': 'sanzioni violazioni',
        'accertamento': 'accertamento rettifica verifica fiscale',
        'obblighi_contabili': 'obblighi contabili registri conservazione',
        'iva_edilizia': 'IVA edilizia costruzioni ristrutturazioni immobili',
        'iva_agevolata': 'IVA agevolata ridotta beni prima necessità',
        'franchigia': 'franchigia piccole imprese regime minori',
        'commercio_elettronico': 'e-commerce commercio elettronico piattaforme',
        'esigibilita': 'esigibilità fatto generatore momento impositivo',
        'rivalsa': 'rivalsa addebito imposta',
        'volume_affari': 'volume affari attività separate',
    }

    topic_text = ' '.join(topic_labels.get(t, t) for t in topics)

    return f"{titolo}. {' '.join(key_sentences)}. {topic_text}"


# ─── Step 6: Parse Tabelle ──────────────────────────────────────────────────

def parse_tabelle(rest_text):
    """Parsa le Tabelle A e B con le aliquote."""
    tabelle = {}

    # Tabella A - Parti I, II, III
    parts_map = {
        'Parte I': 'Prodotti agricoli e ittici',
        'Parte II': 'Beni e servizi soggetti all\'aliquota del 4%',
        'Parte II-bis': 'Beni e servizi soggetti all\'aliquota del 5%',
        'Parte III': 'Beni e servizi soggetti all\'aliquota del 10%',
    }

    for part_key, part_desc in parts_map.items():
        pattern = rf'{re.escape(part_key)}\s*\*{{0,2}}\s*\n\s*{re.escape(part_desc.split("(")[0].strip().split("Beni")[0].strip()) if "Beni" in part_desc else re.escape(part_desc)}'
        match = re.search(part_key.replace('-', r'[\s-]*'), rest_text, re.IGNORECASE)
        if match:
            tabelle[part_key] = {
                'descrizione': part_desc,
                'nota': f'Vedi Tabella A - {part_key} del Testo Unico IVA'
            }

    # Tabella B
    tab_b_match = re.search(r'Tabella\s+B', rest_text, re.IGNORECASE)
    if tab_b_match:
        tabelle['Tabella B'] = {
            'descrizione': 'Prodotti e servizi soggetti ad aliquota specifica',
            'nota': 'Vedi Tabella B del Testo Unico IVA'
        }

    return tabelle


# ─── Step 7: Build the database ─────────────────────────────────────────────

def roman_to_int(roman):
    """Converte numeri romani in interi."""
    roman_values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    result = 0
    prev = 0
    for char in reversed(roman.upper()):
        val = roman_values.get(char, 0)
        if val < prev:
            result -= val
        else:
            result += val
        prev = val
    return result


def build_database():
    print("Estrazione testo dal PDF...")
    raw_text = extract_text(PDF_PATH)

    print("Pulizia testo...")
    text = clean_text(raw_text)

    print("Separazione corpo principale / tabelle / note...")
    body, rest = separate_sections(text)

    print("Parsing struttura...")
    titoli = parse_titoli(body)
    capi = parse_capi(body)
    raw_articles = parse_articoli(body)

    print(f"  Trovati {len(titoli)} Titoli, {len(capi)} Capi, {len(raw_articles)} Articoli")

    # Build hierarchical context
    # For each article, determine which Titolo and Capo it belongs to
    def find_parent(position, parents):
        """Trova il genitore più vicino (prima della posizione dell'articolo)."""
        best = None
        for pos, num, name in parents:
            if pos < position:
                best = (num, name)
        return best

    print("Costruzione database articoli...")
    articles_db = []

    for art in raw_articles:
        titolo_parent = find_parent(art['position'], titoli)
        capo_parent = find_parent(art['position'], capi)

        titolo_art, ref_text, rif_normativi, testo = parse_article_detail(art['raw'])
        old_refs = extract_old_dpr_references(ref_text) if ref_text else []
        topics = extract_topics(testo, titolo_art)
        commi = extract_commi(testo)
        cross_refs = extract_cross_references(testo)
        search_text = generate_search_text(titolo_art, testo, topics)

        article_entry = {
            'id': f"art_{art['numero']}",
            'articolo': art['numero'],
            'titolo': titolo_art,
            'norma': 'D.Lgs. 19 gennaio 2026, n. 10 - Testo Unico IVA',
            'struttura': {
                'titolo': {
                    'numero': titolo_parent[0] if titolo_parent else None,
                    'nome': titolo_parent[1] if titolo_parent else None
                },
                'capo': {
                    'numero': capo_parent[0] if capo_parent else None,
                    'nome': capo_parent[1] if capo_parent else None
                }
            },
            'riferimenti_vecchio_codice': {
                'testo_completo': ref_text if ref_text else None,
                'riferimenti_strutturati': old_refs
            },
            'testo_integrale': testo,
            'commi': commi,
            'numero_commi': len(commi),
            'temi': topics,
            'riferimenti_interni': cross_refs,  # articoli citati nel testo
            'metadati_rag': {
                'search_text': search_text,
                'citazione_formale': f"Art. {art['numero']} D.Lgs. 10/2026 (Testo Unico IVA)",
                'citazione_breve': f"Art. {art['numero']} TU IVA",
                'parole_chiave': topics,
                'lunghezza_caratteri': len(testo),
            }
        }

        articles_db.append(article_entry)

    # Parse tabelle
    print("Parsing Tabelle...")
    tabelle = parse_tabelle(rest)

    # Build complete database
    database = {
        'metadata': {
            'norma': 'Decreto Legislativo 19 gennaio 2026, n. 10',
            'titolo': 'Testo Unico delle disposizioni legislative in materia di imposta sul valore aggiunto',
            'gazzetta_ufficiale': 'Supplemento ordinario n. 4/L alla G.U. Serie generale n. 24 del 30 gennaio 2026',
            'entrata_in_vigore': '1 gennaio 2027',
            'numero_articoli': len(articles_db),
            'numero_titoli': len(titoli),
            'numero_capi': len(capi),
            'struttura_titoli': [
                {'numero': t[1], 'nome': t[2]} for t in titoli
            ],
            'note_per_rag': {
                'descrizione': 'Database strutturato del Testo Unico IVA per sistema RAG su interpelli fiscali',
                'campi_utili_per_retrieval': [
                    'metadati_rag.search_text - testo ottimizzato per embedding/ricerca semantica',
                    'temi - classificazione tematica per filtraggio',
                    'riferimenti_vecchio_codice - per collegare interpelli al vecchio DPR 633/72',
                    'riferimenti_interni - grafo di connessioni tra articoli',
                    'commi - per retrieval granulare a livello di comma',
                    'struttura.titolo/capo - per contestualizzazione gerarchica'
                ],
                'suggerimento_chunking': 'Ogni articolo è un chunk naturale. Per articoli lunghi, spezzare per comma mantenendo titolo e struttura come contesto.',
                'tabelle_aliquote': 'Le Tabelle A (Parti I-III) e B contengono le specifiche aliquote per categoria merceologica. Vanno indicizzate separatamente.'
            }
        },
        'articoli': articles_db,
        'tabelle_riferimento': tabelle,
        'indice_tematico': {}
    }

    # Build thematic index (inverted: topic -> list of article IDs)
    thematic_index = {}
    for art in articles_db:
        for topic in art['temi']:
            if topic not in thematic_index:
                thematic_index[topic] = []
            thematic_index[topic].append({
                'articolo': art['articolo'],
                'titolo': art['titolo'],
                'id': art['id']
            })
    database['indice_tematico'] = thematic_index

    # Build cross-reference graph
    cross_ref_graph = {}
    for art in articles_db:
        if art['riferimenti_interni']:
            cross_ref_graph[art['id']] = art['riferimenti_interni']
    database['grafo_riferimenti_interni'] = cross_ref_graph

    # Build old-to-new mapping
    old_to_new = {}
    for art in articles_db:
        for ref in art['riferimenti_vecchio_codice']['riferimenti_strutturati']:
            key = f"{ref['norma']} art. {ref['articolo']}"
            if key not in old_to_new:
                old_to_new[key] = []
            old_to_new[key].append({
                'nuovo_articolo': art['articolo'],
                'nuovo_titolo': art['titolo'],
                'id': art['id']
            })
    database['mappatura_vecchio_nuovo_codice'] = old_to_new

    return database


# ─── Main ────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    db = build_database()

    print(f"\nSalvataggio in {OUTPUT_PATH}...")
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    # Summary
    print("\n" + "=" * 60)
    print("DATABASE GENERATO CON SUCCESSO")
    print("=" * 60)
    print(f"Articoli:          {db['metadata']['numero_articoli']}")
    print(f"Titoli:            {db['metadata']['numero_titoli']}")
    print(f"Capi:              {db['metadata']['numero_capi']}")
    print(f"Temi indicizzati:  {len(db['indice_tematico'])}")
    print(f"Mapping vecchio→nuovo: {len(db['mappatura_vecchio_nuovo_codice'])} riferimenti")
    print(f"Grafo riferimenti:     {len(db['grafo_riferimenti_interni'])} articoli con cross-ref")

    # Show some examples
    print("\n--- Esempio articolo (Art. 1) ---")
    art1 = db['articoli'][0]
    print(f"  Titolo: {art1['titolo']}")
    print(f"  Struttura: {art1['struttura']}")
    print(f"  Vecchio codice: {art1['riferimenti_vecchio_codice']['riferimenti_strutturati']}")
    print(f"  Temi: {art1['temi']}")
    print(f"  Commi: {art1['numero_commi']}")

    print("\n--- Indice tematico 'aliquote' ---")
    if 'aliquote' in db['indice_tematico']:
        for a in db['indice_tematico']['aliquote']:
            print(f"  Art. {a['articolo']} - {a['titolo']}")

    print(f"\nFile salvato: {OUTPUT_PATH}")
    import os
    size = os.path.getsize(OUTPUT_PATH)
    print(f"Dimensione: {size / 1024 / 1024:.1f} MB")
