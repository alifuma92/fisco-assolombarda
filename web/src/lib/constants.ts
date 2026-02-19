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
    interpelli: 10,
  },
} as const;

export const FINAL_LIMITS = {
  articles: 5,
  interpelli: 2,
  minScoreArticles: 0.40,
  minScoreInterpelli: 0.70,
} as const;

export const EXAMPLE_QUERIES = [
  "Qual è l'aliquota IVA per la somministrazione di alimenti in università?",
  "Quali sono le operazioni esenti dall'art. 10 DPR 633/72?",
  "Cosa dice l'interpello 19/2024?",
  "Come funziona il reverse charge per i servizi edili?",
  "Qual è la territorialità IVA per prestazioni a soggetti UE?",
  "Quale regime IVA si applica alle cessioni di fabbricati abitativi?",
  "Come si detrae l'IVA sui veicoli aziendali?",
  "Quando si applica lo split payment per enti pubblici?",
  "Quali sono gli obblighi di fatturazione elettronica IVA?",
  "Quali operazioni sanitarie sono esenti da IVA?",
] as const;
