# Brief Progetto: RAG Fiscale Assolombarda

## Cosa abbiamo costruito

Sistema di ricerca intelligente per fiscalisti/commercialisti sul Testo Unico IVA e interpelli dell'Agenzia delle Entrate.

## Stato attuale

### Dati pronti (nella cartella `data/`)

| File | Contenuto |
|------|-----------|
| `testo_unico_iva_database.json` | 171 articoli del D.Lgs. 10/2026 (TU IVA), strutturati per Titolo→Capo→Articolo, con testo integrale, commi, temi, riferimenti al vecchio DPR 633/72, cross-reference interni |
| `interpelli_2024_2025_database.json` | 544 interpelli (525 con testo PDF completo), con sezioni estratte (oggetto, quesito, soluzione contribuente, parere AdE), riferimenti normativi, temi, link PDF |

### Pinecone (già caricato e operativo)

- **Indice:** `fisco-assolombarda`
- **Namespace `tu-iva`:** 364 chunk (153 articoli interi + 211 commi per articoli lunghi)
- **Namespace `interpelli`:** 1.684 chunk (544 summary + 1.140 pareri)
- **Embedding:** OpenAI `text-embedding-3-large` a 1024 dimensioni
- **Metrica:** cosine similarity

### Struttura metadata in Pinecone

Ogni vettore ha questi metadata (usabili come filtri):

```
source:              "tu_iva" | "interpello"
chunk_type:          "articolo_intero" | "comma" | "summary" | "parere"
temi:                ["aliquote", "esenzioni", ...]  (31 temi unificati)
articolo:            "34"  (per TU)
numero/anno:         19, 2024  (per interpelli)
tag:                 "IVA" | "ALIQ. IVA" | ...  (per interpelli)
citazione:           "Art. 34 D.Lgs. 10/2026 (TU IVA)"
vecchio_codice:      ["DPR 633/1972 art. 16"]  (per TU)
articoli_tu_collegati: ["art_34", "art_37"]  (per interpelli)
rif_normativi:       ["DPR 633/1972 art. 10"]  (per interpelli)
link_pdf:            "https://..."  (per interpelli)
parent_id:           "tu_art_37" | "ip_interpello_2024_19"  (per chunk figli)
text:                il testo del chunk
```

## Architettura da implementare

### Pipeline di retrieval (3 path paralleli)

```
Query utente
    │
    ▼
Query Analyzer (LLM leggero: Haiku/GPT-4o-mini)
    │  Output: tipo_query, temi, rif_normativi, query_riformulata, filtri
    │
    ├── PATH A: Lookup diretto (sui JSON locali)
    │   Attivato se l'utente cita un articolo/interpello specifico.
    │   Usa mappatura_vecchio_nuovo_codice per convertire "art. 10 DPR 633" → "Art. 37 TU IVA"
    │
    ├── PATH B: Ricerca semantica (Pinecone)
    │   Embedding della query riformulata → top-K su entrambi i namespace
    │   Con metadata filter se il Query Analyzer ha identificato temi/tag
    │
    └── PATH C: Filtro metadata (Pinecone)
        Filtraggio per temi, tag, anno sui namespace
    │
    ▼
Fusion & Reranking
    Unione risultati, dedup, bonus per: match esatti, interpelli recenti, cross-reference
    Selezione: top 3 articoli TU + top 5 interpelli
    │
    ▼
Response Generator (LLM principale: Sonnet/GPT-4o)
    Input: query + articoli TU + interpelli
    Output strutturato: contesto normativo + interpelli pertinenti + fonti
```

### Struttura output per l'utente

```
## Contesto Normativo
[Spiegazione della norma, citando articoli del TU IVA]
Fonti: Art. X, Art. Y D.Lgs. 10/2026

## Interpelli Pertinenti
1. Interpello n. 19/2024 — [Massima] — [Link PDF]
2. Interpello n. 106/2024 — [Massima] — [Link PDF]
```

## Decisioni tecniche già prese

- **Embedding model:** `text-embedding-3-large` dim 1024 (buon italiano giuridico, costo contenuto)
- **Chunking TU:** articolo intero se < 6000 char, altrimenti per comma con context prefix
- **Chunking interpelli:** summary (massima+oggetto+quesito) per retrieval, parere separato per context
- **Temi:** vocabolario unificato di 31 temi condiviso tra TU e interpelli
- **Collegamento TU↔Interpelli:** 160 interpelli con link diretto al TU via DPR 633/72, bidirezionale
- **Mappatura vecchio→nuovo codice:** 125 voci (es. "DPR 633/1972 art. 10" → "Art. 37 TU IVA")

## Stack consigliato per il progetto Next.js

```
Framework:       Next.js 14+ (App Router)
UI:              Tailwind + shadcn/ui
Backend:         API Routes Next.js (o Route Handlers)
Vector DB:       Pinecone (già operativo)
Embedding:       OpenAI text-embedding-3-large
Query Analyzer:  Claude Haiku / GPT-4o-mini
Response Gen:    Claude Sonnet / GPT-4o
Env vars:        PINECONE_API_KEY, OPENAI_API_KEY (o ANTHROPIC_API_KEY)
```

## Variabili d'ambiente necessarie

```env
PINECONE_API_KEY=...
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...   # se usi Claude come LLM
```

## File da mettere in `data/` nel progetto

```
data/
├── testo_unico_iva_database.json        ← lookup locale Path A
├── interpelli_2024_2025_database.json   ← lookup locale Path A
└── PROGETTO_RAG_FISCALE.md              ← documentazione architettura
```

## Cosa manca da costruire

1. Progetto Next.js con UI per la chat/ricerca
2. API route `/api/query` che implementa i 3 path di retrieval
3. Query Analyzer (prompt + chiamata LLM)
4. Response Generator (prompt + template risposta)
5. Componente UI per visualizzare risultati (norma + interpelli + link PDF)
6. (Opzionale) Funzione "approfondisci interpello" che mostra riassunto + link PDF
