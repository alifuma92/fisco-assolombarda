export const TEMI = [
  "accertamento",
  "aliquote",
  "base_imponibile",
  "cessione_credito",
  "cessioni_beni",
  "commercio_elettronico",
  "compensazioni",
  "detrazione",
  "dichiarazione",
  "esenzioni",
  "esigibilita",
  "esportazioni",
  "fatturazione",
  "franchigia",
  "gruppo_iva",
  "importazioni",
  "iva_agevolata",
  "iva_edilizia",
  "liquidazione",
  "obblighi_contabili",
  "operazioni_intra",
  "prestazioni_servizi",
  "regime_speciale",
  "registrazione",
  "reverse_charge",
  "rimborsi",
  "rivalsa",
  "sanzioni",
  "soggetti_passivi",
  "split_payment",
  "territorialita",
  "volume_affari",
] as const;

export type Tema = (typeof TEMI)[number];

export const INTERPELLO_TAGS = [
  "IVA",
  "RLD",
  "RI",
  "DETR. EDILIZIE",
  "INDIRETTE",
  "AG.",
  "ALIQ. IVA",
  "IRPEF",
  "OP. STR.",
  "RL AUT.",
  "DS",
  "RISCOSSIONE",
  "SOSTITUTIVE",
  "AG. COVID",
  "LOCALI",
] as const;

export const PINECONE_CONFIG = {
  indexName: process.env.PINECONE_INDEX_NAME || "fisco-assolombarda",
  namespaces: {
    tuIva: "tu-iva",
    interpelli: "interpelli",
  },
  topK: {
    tuIva: 8,
    interpelli: 15,
  },
} as const;

export const FINAL_LIMITS = {
  articles: 3,
  interpelli: 5,
  minScoreArticles: 0.45,
  minScoreInterpelli: 0.55,
} as const;

export const EXAMPLE_QUERIES = [
  "Qual è l'aliquota IVA per la somministrazione di alimenti in università?",
  "Art. 10 DPR 633/72 - quali sono le operazioni esenti?",
  "Interpello 19/2024 - cosa dice?",
  "Come funziona il reverse charge per i servizi edili?",
  "Territorialità IVA per prestazioni di servizi a soggetti UE",
  "Regime IVA per cessioni di fabbricati abitativi",
] as const;
