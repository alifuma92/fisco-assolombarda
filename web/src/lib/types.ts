// ══════════════════════════════════════════════════════════
// SOURCE DATA TYPES (mirror the JSON database structures)
// ══════════════════════════════════════════════════════════

export interface TUArticle {
  id: string;
  articolo: string;
  titolo: string;
  norma: string;
  struttura: {
    titolo: { numero: string; nome: string };
    capo: { numero: string; nome: string };
  };
  riferimenti_vecchio_codice: {
    testo_completo: string;
    riferimenti_strutturati: Array<{
      norma: string;
      articolo: string;
    }>;
  };
  testo_integrale: string;
  commi: Array<{
    numero: number;
    testo: string;
  }>;
  numero_commi: number;
  temi: string[];
  riferimenti_interni: string[];
  metadati_rag: {
    search_text: string;
    citazione_formale: string;
    citazione_breve: string;
    parole_chiave: string[];
    lunghezza_caratteri: number;
  };
}

export interface TUDatabase {
  metadata: {
    norma: string;
    titolo: string;
    numero_articoli: number;
    struttura_titoli: Array<{ numero: string; nome: string }>;
  };
  articoli: TUArticle[];
  tabelle_riferimento: Record<string, { descrizione: string; nota: string }>;
  indice_tematico: Record<
    string,
    Array<{ articolo: string; titolo: string; id: string }>
  >;
  grafo_riferimenti_interni: Record<string, string[]>;
  mappatura_vecchio_nuovo_codice: Record<
    string,
    Array<{ nuovo_articolo: string; nuovo_titolo: string; id: string }>
  >;
  interpelli_collegati: Record<
    string,
    Array<{ id: string; numero: number; anno: number; oggetto: string }>
  >;
}

export interface Interpello {
  id: string;
  numero: number;
  anno: number;
  data: string;
  tag: string;
  oggetto: string;
  massima: string;
  link_pdf: string;
  sezioni: {
    oggetto_completo: string | null;
    quesito: string | null;
    soluzione_contribuente: string | null;
    parere_ade: string | null;
  };
  testo_integrale: string | null;
  riferimenti_normativi: {
    riferimenti_specifici: string[];
    articoli_citati: string[];
  };
  temi: string[];
  metadati_rag: {
    search_text: string;
    citazione: string;
    citazione_breve: string;
    ha_testo_completo: boolean;
    lunghezza_caratteri: number;
  };
  articoli_tu_iva_collegati: string[];
}

export interface InterpelliDatabase {
  metadata: {
    descrizione: string;
    totale_interpelli: number;
    per_anno: Record<string, number>;
    per_tag: Record<string, number>;
    con_testo_completo: number;
  };
  interpelli: Interpello[];
}

// ══════════════════════════════════════════════════════════
// QUERY ANALYSIS TYPES
// ══════════════════════════════════════════════════════════

export type QueryType = "generica" | "specifica" | "normativa";

export interface QueryAnalysis {
  tipo_query: QueryType;
  temi_probabili: string[];
  riferimenti_normativi: {
    vecchio_codice: string[];
    tu_iva: string[];
    interpelli: Array<{ numero: number; anno: number }>;
  };
  query_riformulata: string;
  filtri_suggeriti: {
    tag?: string[];
    anno_min?: number;
  };
}

// ══════════════════════════════════════════════════════════
// RETRIEVAL TYPES
// ══════════════════════════════════════════════════════════

export type ResultSource = "lookup" | "semantic" | "metadata_filter";
export type ResultType = "tu_article" | "interpello";

export interface RetrievalResult {
  id: string;
  type: ResultType;
  score: number;
  source: ResultSource;
  article?: TUArticle;
  interpello?: Interpello;
  chunkType?: string;
}

export interface FusedResults {
  articles: RetrievalResult[];
  interpelli: RetrievalResult[];
  totalCandidates: number;
}

// ══════════════════════════════════════════════════════════
// API TYPES
// ══════════════════════════════════════════════════════════

export interface QueryRequest {
  query: string;
}

export interface SourceArticle {
  id: string;
  articolo: string;
  titolo: string;
  citazione: string;
  vecchio_codice?: string[];
  struttura: {
    titolo: { numero: string; nome: string };
    capo: { numero: string; nome: string };
  };
  temi: string[];
  commi: Array<{ numero: number; testo: string }>;
  numero_commi: number;
  riferimenti_interni: string[];
  testo_integrale: string;
}

export interface SourceInterpello {
  id: string;
  numero: number;
  anno: number;
  data: string;
  tag: string;
  oggetto: string;
  massima: string;
  link_pdf: string;
  citazione: string;
  temi: string[];
  articoli_tu_iva_collegati: string[];
  ha_testo_completo: boolean;
  sezioni: {
    quesito: string | null;
    soluzione_contribuente: string | null;
    parere_ade: string | null;
  };
}

export interface SourceMetadata {
  queryAnalysis: QueryAnalysis;
  sources: {
    articles: SourceArticle[];
    interpelli: SourceInterpello[];
  };
  timing: {
    analysis_ms: number;
    retrieval_ms: number;
  };
}
