import type { TestCase } from "./types";

// ══════════════════════════════════════════════════════════
// CATEGORIA 1: NORMATIVA (10 casi)
// Riferimenti diretti ad articoli e interpelli.
// Ground truth verificato su mappatura_vecchio_nuovo_codice
// e dati interpelli del database JSON.
// ══════════════════════════════════════════════════════════

const NORMATIVA_CASES: TestCase[] = [
  {
    id: "norm_01",
    category: "normativa",
    query: "Art. 10 DPR 633/72 - quali sono le operazioni esenti?",
    description:
      "DPR 633 art. 10 → art_37 (Operazioni esenti) + art_29 (Esclusioni base imponibile). Testa la mappatura vecchio→nuovo codice via Path A.",
    ground_truth: {
      expected_articles: ["art_37"],
      expected_interpelli: [],
      acceptable_articles: ["art_29"],
      expected_tipo_query: "normativa",
      expected_temi: ["esenzioni"],
      must_mention: ["esent"],
      must_not_mention: [],
    },
    difficulty: "easy",
  },
  {
    id: "norm_02",
    category: "normativa",
    query: "Interpello 19/2024 - cosa dice?",
    description:
      "Lookup diretto interpello_2024_19: IVA Alimenti e Bevande, tag ALIQ. IVA, collegato a art_28, art_3, art_37.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: ["interpello_2024_19"],
      acceptable_articles: ["art_28", "art_3", "art_37"],
      expected_tipo_query: "normativa",
      must_mention: ["aliment"],
      must_not_mention: [],
    },
    difficulty: "easy",
  },
  {
    id: "norm_03",
    category: "normativa",
    query: "Cosa prevede l'art. 17 del DPR 633/72 sul reverse charge?",
    description:
      "DPR 633 art. 17 → art_64 (Debitore d'imposta). Testa mappatura + cross-reference interpelli collegati.",
    ground_truth: {
      expected_articles: ["art_64"],
      expected_interpelli: [],
      acceptable_articles: [],
      acceptable_interpelli: ["interpello_2024_20"],
      expected_tipo_query: "normativa",
      expected_temi: ["reverse_charge"],
      must_mention: ["debitore"],
      must_not_mention: [],
    },
    difficulty: "easy",
  },
  {
    id: "norm_04",
    category: "normativa",
    query: "Art. 56 del TU IVA sulla detrazione",
    description:
      "Riferimento diretto TU IVA art_56 (Detrazione). Testa lookup diretto senza mappatura vecchio codice.",
    ground_truth: {
      expected_articles: ["art_56"],
      expected_interpelli: [],
      expected_tipo_query: "normativa",
      expected_temi: ["detrazione"],
      must_mention: ["detrazione"],
      must_not_mention: [],
    },
    difficulty: "easy",
  },
  {
    id: "norm_05",
    category: "normativa",
    query: "Art. 19 DPR 633/72 - diritto alla detrazione IVA",
    description:
      "DPR 633 art. 19 → art_56 (Detrazione). Stessa destinazione di norm_04 ma via mappatura vecchio codice.",
    ground_truth: {
      expected_articles: ["art_56"],
      expected_interpelli: [],
      acceptable_articles: ["art_57", "art_58"],
      expected_tipo_query: "normativa",
      expected_temi: ["detrazione"],
      must_mention: ["detrazione"],
      must_not_mention: [],
    },
    difficulty: "easy",
  },
  {
    id: "norm_06",
    category: "normativa",
    query: "Art. 21 DPR 633/72 - obblighi di fatturazione",
    description:
      "DPR 633 art. 21 → art_72 (Fattura). Testa mappatura per fatturazione.",
    ground_truth: {
      expected_articles: ["art_72"],
      expected_interpelli: [],
      acceptable_articles: ["art_73", "art_74"],
      expected_tipo_query: "normativa",
      expected_temi: ["fatturazione"],
      must_mention: ["fattura"],
      must_not_mention: [],
    },
    difficulty: "easy",
  },
  {
    id: "norm_07",
    category: "normativa",
    query: "Interpello 210/2024 sullo split payment",
    description:
      "Lookup interpello_2024_210: Split Payment IVA, tag IVA, collegato a art_56, art_64, art_86, art_92.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: ["interpello_2024_210"],
      acceptable_articles: ["art_64", "art_65"],
      expected_tipo_query: "normativa",
      expected_temi: ["split_payment"],
      must_mention: ["split payment"],
      must_not_mention: [],
    },
    difficulty: "easy",
  },
  {
    id: "norm_08",
    category: "normativa",
    query: "Interpello 20/2024 sul reverse charge IVA",
    description:
      "Lookup interpello_2024_20: Reverse Charge IVA, tag IVA, collegato a art_64, art_72.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: ["interpello_2024_20"],
      acceptable_articles: ["art_64", "art_72"],
      expected_tipo_query: "normativa",
      must_mention: ["reverse charge"],
      must_not_mention: [],
    },
    difficulty: "easy",
  },
  {
    id: "norm_09",
    category: "normativa",
    query: "Art. 17-ter DPR 633/72 - scissione dei pagamenti",
    description:
      "DPR 633 art. 17-ter → art_65 (Operazioni effettuate nei confronti di PA). Testa mappatura con articolo 'ter'.",
    ground_truth: {
      expected_articles: ["art_65"],
      expected_interpelli: [],
      expected_tipo_query: "normativa",
      expected_temi: ["split_payment"],
      must_mention: ["pubblica amministrazione"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "norm_10",
    category: "normativa",
    query:
      "Art. 10 DPR 633/72 e interpello 20/2024 - esenzioni e reverse charge",
    description:
      "Riferimenti multipli: art. 10 → art_37 + interpello_2024_20. Testa la capacità di gestire più riferimenti.",
    ground_truth: {
      expected_articles: ["art_37"],
      expected_interpelli: ["interpello_2024_20"],
      acceptable_articles: ["art_29", "art_64"],
      expected_tipo_query: "normativa",
      must_mention: ["esent", "reverse charge"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
];

// ══════════════════════════════════════════════════════════
// CATEGORIA 2: SPECIFICA (12 casi)
// Domande precise da fiscalista su tematiche IVA.
// ══════════════════════════════════════════════════════════

const SPECIFICA_CASES: TestCase[] = [
  {
    id: "spec_01",
    category: "specifica",
    query: "Come funziona il reverse charge per i servizi edili?",
    description:
      "Deve trovare art_64 (debitore d'imposta) via semantica + tema reverse_charge. Interpelli collegati: interpello_2024_20.",
    ground_truth: {
      expected_articles: ["art_64"],
      expected_interpelli: [],
      acceptable_articles: ["art_72"],
      acceptable_interpelli: [
        "interpello_2024_20",
        "interpello_2024_58",
        "interpello_2024_70",
      ],
      expected_tipo_query: "specifica",
      expected_temi: ["reverse_charge"],
      must_mention: ["inversione contabile"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "spec_02",
    category: "specifica",
    query: "Territorialità IVA per prestazioni di servizi a soggetti UE",
    description:
      "Deve trovare articoli su territorialità: art_2 (definizioni), art_16-18 (luogo prestazioni servizi). Qualunque art su territorialità è accettabile.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: [
        "art_2",
        "art_15",
        "art_16",
        "art_17",
        "art_18",
        "art_22",
        "art_23",
      ],
      expected_tipo_query: "specifica",
      expected_temi: ["territorialita", "prestazioni_servizi"],
      must_mention: ["territorial"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "spec_03",
    category: "specifica",
    query:
      "Come funziona lo split payment per le forniture alla pubblica amministrazione?",
    description:
      "Deve trovare art_65 (operazioni PA) e interpello_2024_210 (split payment). Temi: split_payment.",
    ground_truth: {
      expected_articles: ["art_65"],
      expected_interpelli: [],
      acceptable_articles: ["art_64"],
      acceptable_interpelli: [
        "interpello_2024_210",
        "interpello_2024_193",
        "interpello_2024_194",
      ],
      expected_tipo_query: "specifica",
      expected_temi: ["split_payment"],
      must_mention: ["scissione dei pagamenti"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "spec_04",
    category: "specifica",
    query: "Quali sono i requisiti per costituire un gruppo IVA?",
    description:
      "Deve trovare articoli Titolo XV (Gruppo IVA): art_121 e seguenti. Interpello_2024_52 è su Gruppo IVA.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: [
        "art_121",
        "art_122",
        "art_123",
        "art_124",
        "art_125",
      ],
      acceptable_interpelli: ["interpello_2024_52", "interpello_2024_69"],
      expected_tipo_query: "specifica",
      expected_temi: ["gruppo_iva"],
      must_mention: ["gruppo IVA"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "spec_05",
    category: "specifica",
    query: "Regime IVA per cessioni di fabbricati abitativi",
    description:
      "Temi: iva_edilizia, cessioni_beni, esenzioni. Dovrebbe trovare articoli su cessioni di fabbricati.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_37", "art_5"],
      expected_tipo_query: "specifica",
      expected_temi: ["iva_edilizia", "cessioni_beni"],
      must_mention: ["fabbricat"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "spec_06",
    category: "specifica",
    query:
      "Come funziona la detrazione IVA per le auto aziendali ad uso promiscuo?",
    description:
      "Temi: detrazione. Deve trovare art_56 (detrazione) e possibilmente art_58 (esclusione/riduzione detrazione).",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_56", "art_57", "art_58"],
      expected_tipo_query: "specifica",
      expected_temi: ["detrazione"],
      must_mention: ["detrazione"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "spec_07",
    category: "specifica",
    query: "Obblighi IVA per vendite a distanza intra-UE di beni",
    description:
      "Temi: operazioni_intra, commercio_elettronico. Deve trovare art_6 (vendite a distanza) o art_39.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_6", "art_39", "art_40"],
      expected_tipo_query: "specifica",
      expected_temi: ["operazioni_intra"],
      must_mention: ["distanza"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "spec_08",
    category: "specifica",
    query:
      "Quando e come si emette la nota di variazione IVA in diminuzione?",
    description:
      "Deve trovare articoli sulle variazioni (note di credito). Temi: fatturazione, base_imponibile.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_30", "art_31"],
      expected_tipo_query: "specifica",
      expected_temi: ["fatturazione"],
      must_mention: ["variazione"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "spec_09",
    category: "specifica",
    query:
      "Qual è l'aliquota IVA per la somministrazione di alimenti in università?",
    description:
      "Domanda identica a interpello_2024_19. Deve trovare l'interpello via semantica e articoli su aliquote.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_28", "art_37"],
      acceptable_interpelli: ["interpello_2024_19"],
      expected_tipo_query: "specifica",
      expected_temi: ["aliquote", "iva_agevolata"],
      must_mention: ["aliquota", "10%"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "spec_10",
    category: "specifica",
    query:
      "Come funziona il rimborso IVA per i soggetti non residenti stabiliti in UE?",
    description:
      "Temi: rimborsi, territorialita. Deve trovare art_117 (rimborso imposta altri Stati UE) e/o art_114-116.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_114", "art_115", "art_116", "art_117"],
      acceptable_interpelli: ["interpello_2024_66"],
      expected_tipo_query: "specifica",
      expected_temi: ["rimborsi"],
      must_mention: ["rimborso"],
      must_not_mention: [],
    },
    difficulty: "hard",
  },
  {
    id: "spec_11",
    category: "specifica",
    query:
      "Stabile organizzazione ai fini IVA: quando un soggetto estero ha una stabile organizzazione in Italia?",
    description:
      "Temi: soggetti_passivi, territorialita. Argomento complesso con molti articoli potenziali.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_2", "art_4", "art_64"],
      expected_tipo_query: "specifica",
      expected_temi: ["soggetti_passivi", "territorialita"],
      must_mention: ["stabile organizzazione"],
      must_not_mention: [],
    },
    difficulty: "hard",
  },
  {
    id: "spec_12",
    category: "specifica",
    query:
      "Come funziona il regime IVA dei depositi fiscali per le merci importate?",
    description:
      "Temi: importazioni, regime_speciale. Interpello_2024_100 è sui depositi fiscali IVA.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_11", "art_101"],
      acceptable_interpelli: ["interpello_2024_100"],
      expected_tipo_query: "specifica",
      expected_temi: ["importazioni"],
      must_mention: ["deposit"],
      must_not_mention: [],
    },
    difficulty: "hard",
  },
];

// ══════════════════════════════════════════════════════════
// CATEGORIA 3: GENERICA (10 casi)
// Domande ampie e concettuali sull'IVA.
// ══════════════════════════════════════════════════════════

const GENERICA_CASES: TestCase[] = [
  {
    id: "gen_01",
    category: "generica",
    query: "Quali sono le aliquote IVA ridotte previste dal TU IVA?",
    description:
      "Domanda ampia sulle aliquote ridotte. Deve trovare art_28 (aliquote) e possibilmente tabelle.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_28"],
      expected_tipo_query: "generica",
      expected_temi: ["aliquote"],
      must_mention: ["aliquot"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "gen_02",
    category: "generica",
    query: "Quali operazioni sono esenti da IVA?",
    description:
      "Domanda generica sulle esenzioni. Deve trovare art_37 (operazioni esenti).",
    ground_truth: {
      expected_articles: ["art_37"],
      expected_interpelli: [],
      expected_tipo_query: "generica",
      expected_temi: ["esenzioni"],
      must_mention: ["esent"],
      must_not_mention: [],
    },
    difficulty: "easy",
  },
  {
    id: "gen_03",
    category: "generica",
    query: "Come funzionano i regimi speciali IVA?",
    description:
      "Domanda ampia. Titolo XVI copre i regimi speciali (art_132 e seguenti).",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: [
        "art_132",
        "art_133",
        "art_134",
        "art_139",
        "art_140",
      ],
      expected_tipo_query: "generica",
      expected_temi: ["regime_speciale"],
      must_mention: ["regime special"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "gen_04",
    category: "generica",
    query: "Quali sono gli obblighi contabili ai fini IVA?",
    description:
      "Titolo XII copre gli obblighi dei soggetti passivi. Articoli 72+ (fatturazione, registrazione).",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_72", "art_86", "art_87", "art_88", "art_92"],
      expected_tipo_query: "generica",
      expected_temi: ["obblighi_contabili"],
      must_mention: ["obbligh"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "gen_05",
    category: "generica",
    query: "Come funziona la rivalsa IVA?",
    description:
      "Titolo X: Rivalsa e detrazione. Art_55 (rivalsa) è l'articolo chiave.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_55", "art_56"],
      expected_tipo_query: "generica",
      expected_temi: ["rivalsa"],
      must_mention: ["rivalsa"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "gen_06",
    category: "generica",
    query: "Come funzionano le operazioni intracomunitarie ai fini IVA?",
    description:
      "Temi: operazioni_intra. Articoli su cessioni/acquisti intraunionali.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_8", "art_39", "art_40", "art_66"],
      expected_tipo_query: "generica",
      expected_temi: ["operazioni_intra"],
      must_mention: ["intra"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "gen_07",
    category: "generica",
    query: "Panoramica dei rimborsi IVA: quando e come si ottengono?",
    description:
      "Titolo XIV: Rimborsi. Art_114 (versamento conguaglio e rimborso), art_115-117.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_114", "art_115", "art_116", "art_117"],
      expected_tipo_query: "generica",
      expected_temi: ["rimborsi"],
      must_mention: ["rimborso"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "gen_08",
    category: "generica",
    query: "Cosa sono le esportazioni ai fini IVA e come vengono trattate?",
    description:
      "Temi: esportazioni. Articoli su cessioni non imponibili (Titolo IX).",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_38", "art_41", "art_42", "art_51"],
      expected_tipo_query: "generica",
      expected_temi: ["esportazioni"],
      must_mention: ["esportazion"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "gen_09",
    category: "generica",
    query: "Quando diventa esigibile l'IVA?",
    description:
      "Titolo VI: Fatto generatore ed esigibilità. Art_22-26.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_22", "art_23", "art_24", "art_25", "art_26"],
      expected_tipo_query: "generica",
      expected_temi: ["esigibilita"],
      must_mention: ["esigibil"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
  {
    id: "gen_10",
    category: "generica",
    query: "Come funziona l'IVA sulle importazioni di beni da paesi extra-UE?",
    description:
      "Temi: importazioni. Art_11 (importazioni), art_67+ (applicazione imposta importazione).",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_11", "art_67", "art_68", "art_69"],
      expected_tipo_query: "generica",
      expected_temi: ["importazioni"],
      must_mention: ["importazion"],
      must_not_mention: [],
    },
    difficulty: "medium",
  },
];

// ══════════════════════════════════════════════════════════
// CATEGORIA 4: EDGE CASES (8 casi)
// Stress test, ambiguità, casi limite.
// ══════════════════════════════════════════════════════════

const EDGE_CASES: TestCase[] = [
  {
    id: "edge_01",
    category: "edge_case",
    query: "Art. 1 DPR 633/72",
    description:
      "DPR 633 art. 1 mappa a 7 articoli diversi (art_1, art_58, art_117, art_37, art_51, art_64, art_116). Testa gestione mapping many-to-many.",
    ground_truth: {
      expected_articles: ["art_1"],
      expected_interpelli: [],
      acceptable_articles: [
        "art_58",
        "art_117",
        "art_37",
        "art_51",
        "art_64",
        "art_116",
      ],
      expected_tipo_query: "normativa",
      must_mention: ["operazion"],
      must_not_mention: [],
    },
    difficulty: "hard",
  },
  {
    id: "edge_02",
    category: "edge_case",
    query: "Interpello 999/2024 - cosa dice?",
    description:
      "Interpello inesistente. Il sistema deve gestire gracefully il caso. La citation accuracy non è verificabile per interpelli inesistenti.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      expected_tipo_query: "normativa",
      must_mention: [],
      must_not_mention: ["il contribuente chiede"],
    },
    difficulty: "hard",
  },
  {
    id: "edge_03",
    category: "edge_case",
    query: "Qual è l'IRPEF per un reddito di 50.000 euro?",
    description:
      "Domanda fuori scope IVA. Il sistema dovrebbe riconoscere il limite e non inventare risposte IVA.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      must_mention: [],
      must_not_mention: [],
    },
    difficulty: "hard",
  },
  {
    id: "edge_04",
    category: "edge_case",
    query: "IVA",
    description:
      "Query minima. Il sistema deve restituire qualcosa di utile o chiedere di specificare.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      expected_tipo_query: "generica",
      must_mention: [],
      must_not_mention: [],
    },
    difficulty: "hard",
  },
  {
    id: "edge_05",
    category: "edge_case",
    query:
      "Art. 10 DPR 633/72 e interpello 66/2024 sul rimborso IVA - come si collegano le esenzioni con il rimborso?",
    description:
      "Riferimenti multipli + domanda concettuale. art. 10 → art_37, interpello_2024_66 (Rimborso IVA, collegato a art_114, art_115).",
    ground_truth: {
      expected_articles: ["art_37"],
      expected_interpelli: ["interpello_2024_66"],
      acceptable_articles: ["art_29", "art_114", "art_115"],
      expected_tipo_query: "normativa",
      must_mention: ["esenzion", "rimborso"],
      must_not_mention: [],
    },
    difficulty: "hard",
  },
  {
    id: "edge_06",
    category: "edge_case",
    query: "What is the Italian VAT rate for restaurant services?",
    description:
      "Query in inglese. Il sistema dovrebbe comunque comprendere e rispondere in italiano.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_28"],
      expected_temi: ["aliquote"],
      must_mention: [],
      must_not_mention: [],
    },
    difficulty: "hard",
  },
  {
    id: "edge_07",
    category: "edge_case",
    query:
      "Un'azienda italiana vende macchinari a un'impresa tedesca con consegna in Germania. L'azienda italiana fattura con IVA o senza? Si tratta di una cessione intracomunitaria non imponibile? Ci sono interpelli recenti in merito? E se il cliente tedesco non ha partita IVA comunitaria, cambia qualcosa?",
    description:
      "Query molto lunga e dettagliata (>300 char). Testa la capacità di analisi su query complesse multi-aspetto.",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: [],
      acceptable_articles: ["art_39", "art_40", "art_15"],
      expected_tipo_query: "specifica",
      expected_temi: ["operazioni_intra", "cessioni_beni"],
      must_mention: ["intracomunitari"],
      must_not_mention: [],
    },
    difficulty: "hard",
  },
  {
    id: "edge_08",
    category: "edge_case",
    query: "Interpello 52/2024 sul gruppo IVA e art. 3 DPR 633/72",
    description:
      "Combinazione interpello + vecchio codice. interpello_2024_52 (Gruppo IVA), DPR 633 art. 3 → art_10 (Prestazioni servizi).",
    ground_truth: {
      expected_articles: [],
      expected_interpelli: ["interpello_2024_52"],
      acceptable_articles: ["art_10", "art_27", "art_56"],
      expected_tipo_query: "normativa",
      must_mention: ["gruppo IVA"],
      must_not_mention: [],
    },
    difficulty: "hard",
  },
];

// ══════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════

export const TEST_CASES: TestCase[] = [
  ...NORMATIVA_CASES,
  ...SPECIFICA_CASES,
  ...GENERICA_CASES,
  ...EDGE_CASES,
];
