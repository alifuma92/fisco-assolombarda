import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Database,
  FileText,
  Filter,
  Gavel,
  GitCompareArrows,
  Layers,
  MessageSquareText,
  Scale,
  Search,
  Shield,
  Sparkles,
  Zap,
  Code2,
  Hash,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CircleDot,
  Info,
  Lightbulb,
  BookMarked,
  RefreshCw,
  Globe,
  Target,
} from "lucide-react";
import { ScoreTooltip } from "@/components/score-tooltip";

export const metadata = {
  title: "Architettura Tecnica — Fisco AI",
  description:
    "Approfondimento tecnico completo su come funziona il sistema RAG di Fisco AI: analisi query, ricerca multi-path, fusion, e generazione risposte.",
};

export default function ArchitetturaPage() {
  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh">
        <div className="gradient-mesh-inner" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        {/* ── Back link ── */}
        <Link
          href="/come-funziona"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#004489] hover:text-[#003366] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna a Come Funziona
        </Link>

        {/* ── Hero ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#004489]/50 bg-[#e8f1fa]/60 px-3.5 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            <Code2 className="h-3 w-3" />
            Approfondimento tecnico
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient mb-4 leading-[1.1]">
            Architettura del Sistema
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Cosa succede esattamente dal momento in cui scrivi una domanda a
            quando ricevi la risposta. Ogni passaggio spiegato nel dettaglio, con
            un esempio reale.
          </p>
        </div>

        {/* ── Esempio guida ── */}
        <div className="glass-subtle rounded-xl border border-[#ED7203]/20 p-5 mb-10">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#fef3e6] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4 text-[#ED7203]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">
                L&apos;esempio che seguiremo
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Per rendere tutto concreto, seguiremo passo per passo questa
                domanda reale attraverso l&apos;intero sistema:
              </p>
              <div className="mt-2 bg-white/60 border border-white/80 rounded-lg px-4 py-2.5">
                <p className="text-sm font-semibold text-foreground italic">
                  &quot;Quale regime IVA si applica alle cessioni di fabbricati
                  abitativi?&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════ */}
        {/* PANORAMICA                                    */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-12">
          <SectionHeader
            step="0"
            icon={<Layers className="h-5 w-5" />}
            title="Il Quadro Generale"
            subtitle="Le 5 fasi che ogni domanda attraversa"
          />

          <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Quando premi &quot;Cerca&quot;, la tua domanda attraversa{" "}
              <strong className="text-foreground">5 fasi</strong> in sequenza.
              L&apos;intero processo dura circa 10-15 secondi:
            </p>

            <div className="space-y-2">
              <PipelineStep
                n="1"
                label="Analisi della domanda"
                detail="Un primo modello AI capisce cosa stai chiedendo"
                time="~1-2s"
              />
              <PipelineStep
                n="2"
                label="Ricerca su 3 canali paralleli"
                detail="Ricerca diretta + semantica + tematica, tutte insieme"
                time="~2-3s"
              />
              <PipelineStep
                n="3"
                label="Combinazione e classificazione"
                detail="I risultati vengono fusi e ordinati per rilevanza"
                time="<0.1s"
              />
              <PipelineStep
                n="4"
                label="Preparazione del contesto"
                detail="Le fonti migliori vengono formattate per l'AI"
                time="<0.1s"
              />
              <PipelineStep
                n="5"
                label="Generazione della risposta"
                detail="Un secondo modello AI scrive la risposta con citazioni"
                time="~5-10s"
              />
            </div>

            <div className="rounded-lg bg-[#e8f1fa]/30 border border-[#004489]/5 p-3.5 mt-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-[#004489]">Nota:</strong> Le fasi 1-4
                avvengono prima che tu veda qualcosa. La fase 5 è quella che
                vedi come &quot;testo che si scrive in tempo reale&quot; —
                tecnicamente si chiama{" "}
                <strong className="text-foreground">streaming</strong>: la
                risposta viene generata e inviata parola per parola.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* FASE 1: ANALISI QUERY                         */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-12">
          <SectionHeader
            step="1"
            icon={<Search className="h-5 w-5" />}
            title="Analisi della Domanda"
            subtitle="L'AI capisce cosa stai chiedendo"
          />

          <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-5">
            {/* Spiegazione */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">
                Cosa succede
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                La domanda viene inviata a un primo modello di intelligenza
                artificiale (
                <strong className="text-foreground">GPT-4o-mini</strong>, un
                modello veloce e poco costoso di OpenAI). Questo modello non
                genera la risposta — il suo unico compito è{" "}
                <strong className="text-foreground">capire la domanda</strong>{" "}
                e produrre una &quot;scheda di analisi&quot; strutturata.
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed">
                La scheda di analisi contiene:
              </p>
              <ul className="space-y-2 ml-1">
                <AnalysisItem
                  label="Tipo di domanda"
                  detail='Il modello classifica la domanda in una di 3 categorie: "normativa" (cita un articolo specifico), "specifica" (chiede di un istituto preciso), "generica" (panoramica ampia). Questo influenza come verranno pesati i risultati più avanti.'
                />
                <AnalysisItem
                  label="Temi identificati"
                  detail='Il modello seleziona uno o più temi da una lista predefinita di 34 argomenti fiscali (es. "esenzioni", "iva_edilizia", "cessioni_beni"). Servono per la ricerca tematica (fase 2) e per la classificazione dei risultati (fase 3).'
                />
                <AnalysisItem
                  label="Riferimenti normativi"
                  detail='Se la domanda cita articoli o interpelli specifici (es. "Art. 10 DPR 633/72"), il modello li estrae in formato strutturato per il lookup diretto.'
                />
                <AnalysisItem
                  label="Query riformulata"
                  detail={`Una versione ottimizzata della domanda, arricchita con sinonimi e terminologia tecnica. Ad esempio: "cessioni fabbricati" diventa "cessioni di fabbricati a destinazione abitativa, esenzione IVA cessioni immobiliari, opzione per l'imposizione, reverse charge cessioni fabbricati". Questa versione viene usata per la ricerca semantica.`}
                />
                <AnalysisItem
                  label="Filtri suggeriti"
                  detail='Tag opzionali per filtrare gli interpelli (es. "IVA", "INDIRETTE") e un anno minimo (es. 2024).'
                />
              </ul>
            </div>

            {/* Esempio concreto */}
            <ExampleBox title="Esempio: la nostra domanda analizzata">
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Ecco l&apos;output reale che il modello produce per la nostra
                domanda di esempio:
              </p>
              <div className="bg-[#1a1a2e] rounded-lg p-4 text-xs font-mono leading-relaxed overflow-x-auto">
                <code className="text-green-300">
                  {`{`}
                  <br />
                  {"  "}
                  <span className="text-blue-300">
                    &quot;tipo_query&quot;
                  </span>
                  : <span className="text-amber-300">&quot;specifica&quot;</span>
                  ,<br />
                  {"  "}
                  <span className="text-blue-300">
                    &quot;temi_probabili&quot;
                  </span>
                  :{" "}
                  <span className="text-amber-300">
                    [&quot;iva_edilizia&quot;, &quot;cessioni_beni&quot;,
                    &quot;esenzioni&quot;]
                  </span>
                  ,<br />
                  {"  "}
                  <span className="text-blue-300">
                    &quot;riferimenti_normativi&quot;
                  </span>
                  : {"{"} <span className="text-gray-500">nessuno</span> {"}"},
                  <br />
                  {"  "}
                  <span className="text-blue-300">
                    &quot;query_riformulata&quot;
                  </span>
                  :{" "}
                  <span className="text-amber-300">
                    &quot;regime IVA applicabile alle cessioni
                    <br />
                    {"    "}di fabbricati a destinazione abitativa, esenzione IVA
                    <br />
                    {"    "}cessioni immobiliari, opzione per l&apos;imposizione,
                    <br />
                    {"    "}reverse charge cessioni fabbricati&quot;
                  </span>
                  ,<br />
                  {"  "}
                  <span className="text-blue-300">
                    &quot;filtri_suggeriti&quot;
                  </span>
                  : {"{"}{" "}
                  <span className="text-blue-300">&quot;tag&quot;</span>:{" "}
                  <span className="text-amber-300">
                    [&quot;IVA&quot;, &quot;INDIRETTE&quot;]
                  </span>{" "}
                  {"}"}
                  <br />
                  {`}`}
                </code>
              </div>
              <div className="mt-3 space-y-1.5">
                <Annotation color="blue">
                  <strong>Tipo &quot;specifica&quot;</strong> — il modello ha
                  capito che la domanda riguarda un istituto preciso (cessioni
                  immobiliari), non è una panoramica generica.
                </Annotation>
                <Annotation color="orange">
                  <strong>3 temi individuati</strong> — edilizia + cessioni +
                  esenzioni. Questi temi sono cruciali: verranno usati per
                  trovare l&apos;Art. 37 (operazioni esenti), che è proprio
                  l&apos;articolo chiave.
                </Annotation>
                <Annotation color="blue">
                  <strong>Nessun riferimento esplicito</strong> — la domanda non
                  cita un articolo specifico, quindi la ricerca diretta (Path A)
                  non troverà nulla.
                </Annotation>
                <Annotation color="orange">
                  <strong>Query riformulata</strong> — la versione arricchita
                  aggiunge termini come &quot;esenzione IVA&quot;,
                  &quot;opzione per l&apos;imposizione&quot;, &quot;reverse
                  charge&quot; che la ricerca semantica potrà intercettare meglio.
                </Annotation>
              </div>
            </ExampleBox>

            {/* Dettaglio tecnico: fallback */}
            <TechDetail>
              <strong>Se il modello AI fallisce</strong> (errore di rete,
              risposta malformata), il sistema ha un meccanismo di fallback
              basato su espressioni regolari (pattern matching): estrae
              riferimenti ad articoli e interpelli dal testo della domanda
              usando pattern come{" "}
              <code className="text-xs bg-white/50 px-1 rounded">
                /art\.\s*(\d+)\s+DPR\s+633/
              </code>
              . Il risultato è meno preciso ma il sistema non si blocca mai.
            </TechDetail>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* FASE 2: RICERCA 3 VIE                         */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-12">
          <SectionHeader
            step="2"
            icon={<Database className="h-5 w-5" />}
            title="Ricerca su 3 Canali Paralleli"
            subtitle="Tre strategie diverse, eseguite contemporaneamente"
          />

          <div className="space-y-5">
            {/* Intro */}
            <div className="glass-subtle rounded-xl border border-white/30 p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                A questo punto la scheda di analisi viene passata alla{" "}
                <strong className="text-foreground">pipeline di ricerca</strong>
                . Vengono lanciati{" "}
                <strong className="text-foreground">3 percorsi</strong> (li
                chiamiamo Path A, B e C). Il Path A è velocissimo (dati
                locali), i Path B e C partono in parallelo subito dopo.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Ogni percorso cerca in modo diverso e produce una lista di
                risultati, ciascuno con un{" "}
                <strong className="text-foreground">
                  punteggio di rilevanza
                </strong>{" "}
                (un numero da 0 a 1, dove 1 = match perfetto).
              </p>
            </div>

            {/* PATH A */}
            <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#e8f1fa] flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-[#004489]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Path A — Ricerca Diretta (Lookup)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Velocissimo, deterministico, nessuna AI
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Questo percorso cerca{" "}
                <strong className="text-foreground">
                  corrispondenze esatte
                </strong>{" "}
                tra i riferimenti normativi trovati nella fase 1 e il database.
                Non usa intelligenza artificiale: è un semplice lookup in
                tabella, come cercare un nome in rubrica.
              </p>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  I 5 passaggi del Path A
                </h4>

                <LookupStep
                  n="1"
                  title="Mappatura vecchio → nuovo codice"
                  description='Se la domanda cita un articolo del vecchio DPR 633/1972 (es. "Art. 10 DPR 633/72"), il sistema lo cerca nella tabella di mappatura e trova il corrispondente nel nuovo Testo Unico. Esempio: art. 10 DPR 633 → art. 37 TU IVA.'
                  score="1.0"
                  scoreTooltip="Score 1.0 = massima fiducia. L'utente ha citato esplicitamente un articolo e il sistema lo ha trovato per corrispondenza esatta nella tabella di mappatura. Non c'è margine di errore: o lo trova o non lo trova. Se lo trova, è sicuramente quello giusto."
                />
                <LookupStep
                  n="2"
                  title="Riferimenti diretti al TU IVA"
                  description='Se la domanda cita un articolo del TU IVA (es. "Art. 37"), il sistema lo recupera direttamente dal database.'
                  score="1.0"
                  scoreTooltip="Score 1.0 = massima fiducia. Come il passaggio 1, è un lookup esatto: l'utente ha chiesto un articolo specifico e il sistema lo ha trovato per numero. Zero ambiguità."
                />
                <LookupStep
                  n="3"
                  title="Interpelli citati"
                  description='Se la domanda cita un interpello specifico (es. "Interpello 19/2024"), il sistema lo recupera dal database per numero e anno.'
                  score="1.0"
                  scoreTooltip="Score 1.0 = massima fiducia. Stesso principio: un interpello citato per numero è un match deterministico. Se il numero esiste nel database, il risultato è certo."
                />
                <LookupStep
                  n="4"
                  title="Arricchimento: articoli → interpelli"
                  description="Per ogni articolo trovato nei passaggi 1-2, il sistema recupera anche gli interpelli che citano quell'articolo. È un dato pre-calcolato nel database."
                  score="0.8"
                  scoreTooltip="Score 0.8 = fiducia alta ma non massima. Questi interpelli non sono stati chiesti direttamente dall'utente, ma sono collegati a un articolo che l'utente ha chiesto. Sono molto probabilmente rilevanti, ma non con la stessa certezza di un riferimento esplicito. Se fosse più alto (1.0) rischierebbero di 'inquinare' i risultati con troppi interpelli laterali."
                />
                <LookupStep
                  n="5"
                  title="Arricchimento: interpelli → articoli"
                  description="Viceversa: per ogni interpello trovato al passaggio 3, recupera gli articoli TU IVA che l'interpello cita."
                  score="0.8"
                  scoreTooltip="Score 0.8 = fiducia alta ma non massima. Questi articoli non sono stati chiesti direttamente, ma sono citati in un interpello che l'utente ha chiesto. Hanno alta probabilità di essere pertinenti, ma lo score ridotto evita che dominino la classifica rispetto agli articoli trovati per via semantica o tematica."
                />
              </div>

              <ExampleBox title="Esempio: Path A per la nostra domanda">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  La nostra domanda (&quot;cessioni di fabbricati
                  abitativi&quot;) <strong>non cita nessun articolo</strong>, né
                  del vecchio né del nuovo codice. Quindi il Path A{" "}
                  <strong>non trova nulla</strong>. Tutti e 5 i passaggi
                  restituiscono zero risultati.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                  Se invece avessi scritto{" "}
                  <em>&quot;Art. 10 DPR 633/72&quot;</em>, il Path A avrebbe
                  trovato immediatamente l&apos;Art. 37 TU IVA (mappatura) +
                  tutti gli interpelli collegati.
                </p>
              </ExampleBox>
            </div>

            {/* PATH B */}
            <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#e8f1fa] flex items-center justify-center shrink-0">
                  <Brain className="h-5 w-5 text-[#004489]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Path B — Ricerca Semantica (Embedding)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    AI-powered, cerca per significato, non per parole
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Questo è il percorso più sofisticato. Usa l&apos;intelligenza
                artificiale per capire il{" "}
                <strong className="text-foreground">significato</strong> della
                domanda e trovare le fonti più simili per concetto.
              </p>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Come funziona, passo per passo
                </h4>

                <div className="rounded-lg bg-white/40 border border-white/50 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <StepBadge n="1" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        La query riformulata diventa un vettore
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        La query riformulata (prodotta nella fase 1) viene
                        inviata al modello{" "}
                        <strong className="text-foreground">
                          text-embedding-3-large
                        </strong>{" "}
                        di OpenAI. Questo modello converte il testo in una lista
                        di{" "}
                        <strong className="text-foreground">
                          1.024 numeri decimali
                        </strong>{" "}
                        (un &quot;vettore&quot;). Questa lista di numeri
                        rappresenta il significato concettuale del testo in uno
                        spazio matematico.
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        Immagina che ogni testo possibile abbia una posizione in
                        uno spazio a 1.024 dimensioni. Testi con significato
                        simile si trovano &quot;vicini&quot; in questo spazio,
                        anche se usano parole diverse. &quot;Esenzione IVA
                        immobili&quot; e &quot;operazioni esenti cessioni
                        fabbricati&quot; sono &quot;vicini&quot; in questo
                        spazio.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <StepBadge n="2" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Confronto con il database vettoriale (Pinecone)
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        Tutti i 171 articoli e i 544 interpelli sono già stati
                        convertiti in vettori e salvati in un database
                        specializzato chiamato{" "}
                        <strong className="text-foreground">Pinecone</strong>.
                        Il sistema manda il vettore della domanda a Pinecone e
                        chiede: &quot;dammi i vettori più vicini&quot;.
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        Pinecone calcola la{" "}
                        <strong className="text-foreground">
                          similarità coseno
                        </strong>{" "}
                        tra il vettore della domanda e ogni vettore nel
                        database. Più alto il numero (da 0 a 1), più il testo è
                        concettualmente vicino alla domanda.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <StepBadge n="3" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Recupero dei risultati
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        Pinecone restituisce i{" "}
                        <strong className="text-foreground">
                          top 8 articoli
                        </strong>{" "}
                        e i{" "}
                        <strong className="text-foreground">
                          top 10 interpelli
                        </strong>{" "}
                        più vicini, con il punteggio di similarità. Per ogni
                        risultato, il sistema recupera il documento completo dal
                        database locale.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <ExampleBox title="Esempio: Path B per la nostra domanda">
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  La ricerca semantica per &quot;cessioni di fabbricati
                  abitativi&quot; restituisce (tra gli altri) questi articoli,
                  ordinati per similarità coseno:
                </p>
                <div className="space-y-1.5">
                  <ScoreRow
                    label="Art. 8 — Cessioni di beni"
                    score={0.82}
                    note="Alta similarità (parla di cessioni), ma troppo generico"
                    scoreTooltip="0.82 = similarità coseno alta. Significa che il vettore di questo articolo è molto 'vicino' al vettore della domanda nello spazio a 1.024 dimensioni. Score sopra 0.80 indica forte affinità testuale. Però attenzione: score semantico alto non vuol dire necessariamente 'risposta giusta' — questo articolo parla genericamente di cessioni, non specificamente di fabbricati abitativi."
                  />
                  <ScoreRow
                    label="Art. 3 — Presupposto oggettivo"
                    score={0.79}
                    note="Simile per parole, ma non specifico per fabbricati"
                    scoreTooltip="0.79 = similarità coseno buona. Il modello di embedding ha rilevato affinità concettuale tra la domanda e questo articolo. Valori tra 0.70 e 0.80 indicano una buona corrispondenza semantica, ma non eccezionale. Se fosse più basso (sotto 0.60), il match sarebbe probabilmente irrilevante."
                  />
                  <ScoreRow
                    label="Art. 5 — Cessioni che costituiscono..."
                    score={0.77}
                    note="Parla di cessioni, non specificamente di immobili"
                    scoreTooltip="0.77 = il modello ha trovato un'affinità concettuale con la parola 'cessioni', che appare sia nella domanda sia in questo articolo. Questo è un tipico 'falso positivo semantico': le parole si somigliano ma il contesto è diverso. I bonus tematici nella fase 3 correggeranno questa imprecisione."
                  />
                  <ScoreRow
                    label="Art. 37 — Operazioni esenti"
                    score={0.74}
                    note="L'articolo chiave! Ma ha score più basso"
                    scoreTooltip="0.74 = similarità coseno moderata. Paradossalmente l'articolo più rilevante ha lo score semantico più basso! Perché? Perché il testo dell'Art. 37 copre molti temi (finanziarie, assicurative, sanitarie, immobiliari...) e le parole 'cessioni fabbricati abitativi' sono solo una piccola parte del testo. La ricerca semantica 'diluisce' la rilevanza. Questo è esattamente il motivo per cui servono anche Path C (tematico) e i bonus della fase 3."
                  />
                </div>
                <div className="mt-3 rounded-lg bg-[#fef3e6]/50 border border-[#ED7203]/10 p-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-[#ED7203]">
                      Il problema della ricerca semantica:
                    </strong>{" "}
                    L&apos;Art. 37 (che è quello giusto) ha un punteggio{" "}
                    <em>più basso</em> di articoli generici come Art. 8 o Art.
                    3. Perché? Perché il testo dell&apos;Art. 37 parla di
                    &quot;operazioni esenti&quot; in generale (prestazioni
                    finanziarie, assicurative, sanitarie, locazioni, cessioni
                    immobiliari...) e non solo di &quot;cessioni di
                    fabbricati&quot;. La ricerca semantica trova le parole
                    giuste in articoli generici prima dell&apos;articolo
                    specifico.{" "}
                    <strong>
                      Per questo servono anche gli altri percorsi.
                    </strong>
                  </p>
                </div>
              </ExampleBox>

              <TechDetail>
                <strong>Nota sugli interpelli nel Path B:</strong> nel database
                Pinecone, ogni interpello è stato diviso in &quot;chunk&quot;
                (pezzi): quesito, soluzione del contribuente, parere AdE. Ma per
                la ricerca si filtra sempre per{" "}
                <code className="text-xs bg-white/50 px-1 rounded">
                  chunk_type: &quot;summary&quot;
                </code>{" "}
                — si cerca solo sul riassunto (la &quot;massima&quot;), non su
                ogni pezzo dell&apos;interpello. Questo evita risultati duplicati
                e migliora la qualità.
              </TechDetail>
            </div>

            {/* PATH C */}
            <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#e8f1fa] flex items-center justify-center shrink-0">
                  <Filter className="h-5 w-5 text-[#004489]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Path C — Filtro Tematico (Metadata)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Cerca per argomento, non per significato testuale
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Questo percorso sfrutta i{" "}
                <strong className="text-foreground">metadati strutturati</strong>{" "}
                del database. Ogni articolo e interpello è stato classificato
                manualmente con dei temi (es. &quot;esenzioni&quot;,
                &quot;iva_edilizia&quot;). Il Path C confronta i temi della
                domanda (individuati nella fase 1) con i temi di ogni documento.
              </p>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Calcolo del punteggio
                </h4>

                <div className="rounded-lg bg-white/40 border border-white/50 p-4 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Per gli articoli:</strong>{" "}
                    il punteggio è il rapporto tra temi in comune e temi totali
                    della domanda.
                  </p>
                  <div className="bg-[#1a1a2e] rounded-lg p-3 text-xs font-mono">
                    <code className="text-green-300">
                      score = temi_in_comune / temi_totali_domanda
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">
                      Per gli interpelli:
                    </strong>{" "}
                    stessa formula, ma moltiplicata per 0.7 (gli interpelli
                    trovati solo per metadati hanno meno peso).
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">
                      Filtri aggiuntivi sugli interpelli:
                    </strong>{" "}
                    vengono applicati anche il tag suggerito (es. &quot;IVA&quot;)
                    e l&apos;anno minimo. Massimo 5 interpelli dal Path C.
                  </p>
                </div>
              </div>

              <ExampleBox title="Esempio: Path C per la nostra domanda">
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  La domanda ha 3 temi:{" "}
                  <Badge>iva_edilizia</Badge>{" "}
                  <Badge>cessioni_beni</Badge>{" "}
                  <Badge>esenzioni</Badge>
                </p>
                <div className="space-y-1.5 mt-3">
                  <ScoreRow
                    label="Art. 37 — Operazioni esenti"
                    score={1.0}
                    note="Temi: esenzioni, iva_edilizia, cessioni_beni → 3/3 = 1.0"
                    scoreTooltip="1.0 = copertura tematica perfetta. L'articolo ha tutti e 3 i temi della domanda (esenzioni, iva_edilizia, cessioni_beni). Formula: 3 temi in comune / 3 temi totali = 1.0. Questo è il massimo possibile nel Path C. Un articolo con score 1.0 tematico è quasi certamente rilevante — copre tutti gli argomenti della domanda."
                  />
                  <ScoreRow
                    label="Art. 8 — Cessioni di beni"
                    score={0.33}
                    note="Temi: cessioni_beni → 1/3 = 0.33"
                    scoreTooltip="0.33 = copertura tematica bassa. L'articolo ha solo 1 tema in comune su 3 richiesti (cessioni_beni). Formula: 1/3 = 0.33. Score sotto 0.50 indica che l'articolo copre meno della metà dei temi cercati — probabilmente è tangenziale, non direttamente pertinente. Dopo la pesatura ×0.65 del Path C, diventerà ~0.21, troppo basso per competere."
                  />
                  <ScoreRow
                    label="Art. 148 — Aliquota 10% per edilizia"
                    score={0.67}
                    note="Temi: iva_edilizia, aliquote → 1/3 solo iva_edilizia matchato"
                    scoreTooltip="0.67 = copertura parziale. Questo articolo ha il tema 'iva_edilizia' in comune (match), ma 'aliquote' non è tra i temi della domanda. Score: 2/3 = 0.67. Un articolo con score 0.50-0.70 è potenzialmente rilevante ma non centrale. Dopo la pesatura ×0.65 del Path C scenderà a ~0.43 — potrebbe rientrare nei risultati finali ma con priorità bassa."
                  />
                </div>
                <div className="mt-3 rounded-lg bg-[#e8f1fa]/50 border border-[#004489]/10 p-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-[#004489]">
                      Ecco dove il Path C brilla:
                    </strong>{" "}
                    L&apos;Art. 37 ha punteggio <strong>1.0</strong> (copre
                    tutti e 3 i temi), molto più alto di qualsiasi risultato
                    semantico. Il Path C è la &quot;rete di sicurezza&quot; che
                    recupera l&apos;articolo che la ricerca semantica aveva
                    classificato più in basso.
                  </p>
                </div>
              </ExampleBox>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* FASE 3: FUSION                                */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-12">
          <SectionHeader
            step="3"
            icon={<Layers className="h-5 w-5" />}
            title="Combinazione e Classificazione"
            subtitle={`L'algoritmo di "fusion" che decide quali fonti contano di più`}
          />

          <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ora abbiamo 3 liste di risultati (una per ogni percorso), ciascuna
              con i propri punteggi. L&apos;algoritmo di{" "}
              <strong className="text-foreground">fusion</strong> li combina in
              un&apos;unica lista, applicando regole precise per decidere la
              classifica finale.
            </p>

            {/* Step 1: Merge */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <StepBadge n="A" />
                Merge: combinare i punteggi
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Quando lo stesso articolo appare in più percorsi (es. Path B +
                Path C), i punteggi vengono{" "}
                <strong className="text-foreground">combinati</strong>, non si
                prende semplicemente il più alto. La formula è:
              </p>
              <div className="bg-[#1a1a2e] rounded-lg p-3 text-xs font-mono">
                <code className="text-green-300">
                  score = max(score_esistente, score_nuovo) + 0.1
                </code>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Il <strong>+0.1</strong> è il &quot;bonus multi-path&quot;: se
                una fonte è trovata da più strategie, è probabilmente molto
                rilevante.
              </p>
            </div>

            {/* Step 2: Path weights */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <StepBadge n="B" />
                Pesatura: non tutti i percorsi valgono uguale
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Prima del merge, i punteggi del Path C vengono ridimensionati:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                <WeightCard
                  path="Path A"
                  weight="×1.0"
                  label="Fiducia massima"
                  desc="Lookup diretto = certezza"
                  scoreTooltip="Moltiplicatore ×1.0 = nessuna riduzione. I risultati del Path A (lookup diretto) mantengono il loro score originale perché sono certi: se l'utente cita un articolo e il sistema lo trova, non c'è motivo di ridurne il punteggio. Ridurre questo peso significherebbe dubitare di una corrispondenza esatta."
                />
                <WeightCard
                  path="Path B"
                  weight="×1.0"
                  label="Fiducia alta"
                  desc="AI semantica affidabile"
                  scoreTooltip="Moltiplicatore ×1.0 = nessuna riduzione. La ricerca semantica di Pinecone produce score già calibrati (similarità coseno 0-1) che riflettono accuratamente la vicinanza concettuale. Ridurre questo peso penalizzerebbe ingiustamente il percorso di ricerca più sofisticato e solitamente più preciso."
                />
                <WeightCard
                  path="Path C"
                  weight="×0.65 / ×0.5"
                  label="Fiducia moderata"
                  desc="0.65 per articoli, 0.5 per interpelli"
                  scoreTooltip="Moltiplicatore ridotto: ×0.65 per articoli, ×0.5 per interpelli. Il Path C (filtro tematico) ha score meno affidabili perché un match tematico è un segnale debole: un articolo può avere il tema giusto ma trattare un aspetto completamente diverso. Gli interpelli hanno peso ancora più basso (×0.5) perché la classificazione tematica degli interpelli è meno precisa. Se questi pesi fossero ×1.0, troppi risultati tematici irrilevanti finirebbero in cima alla classifica."
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Perché Path C pesa meno? Perché un match tematico è un segnale
                più debole di un match semantico: un articolo può avere il tema
                giusto ma parlare di un aspetto diverso.
              </p>
            </div>

            {/* Step 3: Bonuses */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <StepBadge n="C" />
                Bonus e penalità: 5 regole di aggiustamento
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dopo il merge, vengono applicati 5 aggiustamenti al punteggio:
              </p>

              <div className="space-y-2">
                <BonusRow
                  n="1"
                  label="Riferimento diretto"
                  value="+0.5"
                  type="up"
                  desc="Se la fonte è stata trovata per lookup diretto (Path A), riceve un bonus forte. Un riferimento esplicito è il segnale più affidabile."
                  scoreTooltip="+0.5 è il bonus più alto del sistema. Viene applicato quando l'utente ha citato esplicitamente un articolo o interpello. Se fosse più basso, un articolo citato dall'utente potrebbe essere 'superato' da risultati semantici generici. Se fosse più alto, dominerebbe troppo e impedirebbe all'AI di mostrare articoli correlati che l'utente potrebbe non conoscere."
                />
                <BonusRow
                  n="2"
                  label="Interpelli recenti"
                  value="+0.05"
                  type="up"
                  desc="Gli interpelli del 2025 ricevono un piccolo bonus. La prassi più recente è tendenzialmente più utile."
                  scoreTooltip="+0.05 è un bonus molto piccolo, intenzionalmente. Serve come 'tie-breaker': a parità di rilevanza, un interpello del 2025 viene preferito a uno del 2024. Se fosse più alto, rischierebbe di far prevalere interpelli recenti ma poco rilevanti su interpelli vecchi ma molto pertinenti."
                />
                <BonusRow
                  n="3"
                  label="Collegamento incrociato"
                  value="+0.1"
                  type="up"
                  desc='Se un interpello cita un articolo che è già nei risultati (o viceversa), riceve un bonus. Significa che "parlano della stessa cosa".'
                  scoreTooltip="+0.1 è un bonus moderato che premia la coerenza tra fonti. Se un interpello cita un articolo già selezionato, è molto probabile che sia pertinente. Questo bonus è identico al bonus multi-path (+0.1). Se fosse più alto potrebbe creare 'bolle' di risultati tutti collegati tra loro ma tangenziali alla domanda."
                />
                <BonusRow
                  n="4"
                  label="Temi in comune (interpelli)"
                  value="+0.02/tema"
                  type="up"
                  desc={`Per ogni tema in comune tra la domanda e l'interpello, +0.02. Un interpello con 3 temi in comune riceve +0.06.`}
                  scoreTooltip="+0.02 per tema è un micro-bonus cumulativo. Con 3 temi in comune = +0.06, con 5 temi = +0.10. Serve a differenziare interpelli che trattano gli stessi argomenti della domanda. Il valore basso evita che un interpello con molti temi generici (ma poco specifico) superi uno con pochi temi ma molto pertinente per la ricerca semantica."
                />
                <BonusRow
                  n="5"
                  label="Rilevanza tematica (articoli)"
                  value="variabile"
                  type="complex"
                  desc="Il bonus più importante. Confronta i temi dell'articolo con quelli della domanda."
                  scoreTooltip="Questo bonus varia da -30% (penalità ×0.7) a +0.3 (bonus pieno). È il correttore principale della ricerca semantica: premia gli articoli che coprono tutti i temi della domanda e penalizza quelli che sono stati trovati solo per affinità testuale ma non trattano lo stesso argomento. È il bonus che ha fatto salire l'Art. 37 dal 4° al 1° posto nel nostro esempio."
                />
              </div>

              {/* Bonus 5 detail */}
              <div className="rounded-lg bg-[#e8f1fa]/30 border border-[#004489]/5 p-4 space-y-2">
                <p className="text-xs font-bold text-foreground">
                  Dettaglio Bonus 5 — Rilevanza tematica articoli:
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Si attiva solo se la domanda ha almeno 2 temi identificati.
                  Calcola quanti dei temi della domanda l&apos;articolo copre:
                </p>
                <div className="space-y-1.5 mt-2">
                  <BonusDetail
                    condition="Copertura 100%"
                    effect="+0.3"
                    example="Domanda ha 3 temi, articolo li ha tutti e 3"
                    type="up"
                  />
                  <BonusDetail
                    condition="Copertura ≥50%"
                    effect="+0.1"
                    example="Domanda ha 3 temi, articolo ne ha almeno 2"
                    type="up"
                  />
                  <BonusDetail
                    condition="Zero temi in comune"
                    effect="×0.7 (penalità)"
                    example="Articolo trovato solo dal Path B semantico, nessun tema in comune"
                    type="down"
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                  <strong>Eccezione:</strong> gli articoli trovati via lookup
                  diretto (Path A) non vengono mai penalizzati, anche se hanno
                  zero temi in comune — se l&apos;utente ha citato un articolo,
                  ci fidiamo.
                </p>
              </div>
            </div>

            {/* Step 4: Query type */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <StepBadge n="D" />
                Adattamento per tipo di domanda
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/40 border border-white/50 p-3">
                  <p className="text-xs font-bold text-foreground mb-1">
                    Domanda &quot;generica&quot;
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Max <strong>6 articoli</strong> + <strong>1 interpello</strong>.
                    Una panoramica ampia ha bisogno di più normativa.
                  </p>
                </div>
                <div className="rounded-lg bg-white/40 border border-white/50 p-3">
                  <p className="text-xs font-bold text-foreground mb-1">
                    Domanda &quot;specifica&quot; o &quot;normativa&quot;
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Max <strong>5 articoli</strong> + <strong>2 interpelli</strong>.
                    Un caso specifico beneficia anche dalla prassi.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5: Final filter */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <StepBadge n="E" />
                Filtro finale e selezione
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Per l&apos;ultimo passaggio, vengono eliminati i risultati con
                punteggio troppo basso e selezionati solo i migliori:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/40 border border-white/50 p-3">
                  <p className="text-xs font-bold text-foreground mb-1">
                    Articoli: soglia ≥ 0.40
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Soglia permissiva — meglio includere un articolo in più che
                    perderne uno rilevante. Ordinati per score, top 5.
                  </p>
                </div>
                <div className="rounded-lg bg-white/40 border border-white/50 p-3">
                  <p className="text-xs font-bold text-foreground mb-1">
                    Interpelli: soglia ≥ 0.70
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Soglia molto più alta — gli interpelli devono essere davvero
                    pertinenti per essere inclusi. Ordinati per score, top 2.
                  </p>
                </div>
              </div>
            </div>

            {/* FULL EXAMPLE */}
            <ExampleBox title="Esempio completo: scoring per la nostra domanda">
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Ecco come cambia il punteggio dell&apos;Art. 37 attraverso i
                vari passaggi:
              </p>
              <div className="space-y-1.5">
                <ScoringTrace
                  step="Path B (semantico)"
                  score="0.74"
                  note="4° posto nella ricerca semantica"
                  scoreTooltip="0.74 è lo score di similarità coseno dal Path B. L'Art. 37 parte in 4ª posizione perché il suo testo è molto lungo e copre molti temi diversi, 'diluendo' la vicinanza semantica con la domanda specifica sui fabbricati. A questo punto, articoli generici come Art. 8 (0.82) lo superano."
                />
                <ScoringTrace
                  step="Path C (tematico) × 0.65"
                  score="0.65"
                  note="Score 1.0 × peso Path C 0.65"
                  scoreTooltip="Il Path C ha dato score 1.0 (copertura tematica perfetta: 3/3 temi), ma il peso del Path C è ×0.65, quindi diventa 0.65. Questo score pesato viene usato nel merge. Senza la pesatura, il Path C tenderebbe a dominare con score 1.0 su risultati che in realtà sono solo vagamente correlati."
                />
                <ScoringTrace
                  step="Merge multi-path"
                  score="0.84"
                  note="max(0.74, 0.65) + 0.1 bonus"
                  scoreTooltip="Il merge prende il massimo tra i due score (0.74 dal Path B, 0.65 dal Path C) → 0.74, poi aggiunge +0.1 perché l'articolo è stato trovato da 2 percorsi diversi. Risultato: 0.84. Essere trovato da più percorsi è un forte segnale di rilevanza. L'Art. 37 sale dal 4° al 2° posto già dopo il merge."
                />
                <ScoringTrace
                  step="Bonus 5 (100% temi)"
                  score="1.14"
                  note="+0.3 perché copre 3/3 temi"
                  scoreTooltip="Il Bonus 5 aggiunge +0.3 perché l'Art. 37 copre il 100% dei temi della domanda (3 su 3). Score finale: 0.84 + 0.3 = 1.14. Questo è il punteggio più alto possibile per questo articolo. Per confronto, l'Art. 8 (che aveva 0.82 semantico) non ha temi in comune e viene penalizzato ×0.7 → ~0.57. L'Art. 37 vince con quasi il doppio del punteggio."
                />
              </div>
              <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Score finale: 1.14</strong>{" "}
                — primo in classifica. Per confronto, l&apos;Art. 8 (score
                semantico 0.82) dopo la penalità ×0.7 (zero temi in comune)
                scende a ~0.57. L&apos;Art. 37 vince nettamente.
              </div>
            </ExampleBox>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* FASE 4: CONTEXT BUILDER                       */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-12">
          <SectionHeader
            step="4"
            icon={<FileText className="h-5 w-5" />}
            title="Preparazione del Contesto"
            subtitle="Formattare le fonti per l'AI che scriverà la risposta"
          />

          <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le fonti selezionate (max 5 articoli + 2 interpelli) vengono ora
              formattate in un unico testo strutturato che sarà passato al
              modello AI che genera la risposta. Questo testo è il{" "}
              <strong className="text-foreground">contesto</strong> — tutto ciò
              che l&apos;AI potrà &quot;vedere&quot; e citare.
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Formato per ogni articolo
              </h4>
              <div className="bg-[#1a1a2e] rounded-lg p-4 text-xs font-mono leading-loose overflow-x-auto">
                <code className="text-green-300">
                  --- Art. 37 TU IVA (D.Lgs. 10/2026) ---
                  <br />
                  <span className="text-blue-300">Titolo:</span> Operazioni
                  esenti dall&apos;imposta
                  <br />
                  <span className="text-blue-300">Struttura:</span> Titolo II
                  &gt; Capo I
                  <br />
                  <span className="text-blue-300">Temi:</span> esenzioni,
                  iva_edilizia, cessioni_beni
                  <br />
                  <span className="text-blue-300">Vecchio codice:</span> DPR
                  633/1972 art. 10
                  <br />
                  <span className="text-blue-300">Rif. interni:</span> artt. 5,
                  38, 39
                  <br />
                  <br />
                  <span className="text-blue-300">Testo:</span>
                  <br />
                  1. Sono esenti dall&apos;imposta:
                  <br />
                  {"  "}a) le prestazioni di servizi...
                  <br />
                  {"  "}...
                  <br />
                  <span className="text-gray-500">
                    [max 4.000 caratteri, poi troncato]
                  </span>
                </code>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Formato per ogni interpello
              </h4>
              <div className="bg-[#1a1a2e] rounded-lg p-4 text-xs font-mono leading-loose overflow-x-auto">
                <code className="text-green-300">
                  --- Interpello n. 19/2024 (15/01/2024) ---
                  <br />
                  <span className="text-blue-300">Tag:</span> IVA
                  <br />
                  <span className="text-blue-300">Oggetto:</span> Cessione
                  fabbricato abitativo...
                  <br />
                  <span className="text-blue-300">Massima:</span> La cessione
                  di...
                  <br />
                  <span className="text-blue-300">Temi:</span> esenzioni,
                  iva_edilizia
                  <br />
                  <br />
                  <span className="text-blue-300">Parere AdE:</span>
                  <br />
                  L&apos;Agenzia delle Entrate ritiene che...
                  <br />
                  <span className="text-gray-500">
                    [max 1.500 caratteri, poi troncato]
                  </span>
                </code>
              </div>
            </div>

            <TechDetail>
              <strong>Perché il limite di caratteri?</strong> I modelli AI hanno
              una &quot;finestra di contesto&quot; — una quantità massima di
              testo che possono leggere. Più testo = più costoso e più lento. I
              limiti (4.000 per articoli, 1.500 per interpelli) sono un
              compromesso: abbastanza testo per dare informazioni utili, ma non
              così tanto da saturare il contesto con 5 articoli + 2 interpelli.
            </TechDetail>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* FASE 5: GENERAZIONE RISPOSTA                  */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-12">
          <SectionHeader
            step="5"
            icon={<MessageSquareText className="h-5 w-5" />}
            title="Generazione della Risposta"
            subtitle="L'AI scrive la risposta basandosi solo sulle fonti trovate"
          />

          <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Il contesto formattato e la domanda originale vengono inviati a{" "}
              <strong className="text-foreground">GPT-4o</strong>, il modello
              AI più avanzato di OpenAI. Questo è il modello che scrive la
              risposta che vedi sullo schermo.
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Cosa viene inviato al modello
              </h4>
              <div className="rounded-lg bg-white/40 border border-white/50 p-4 space-y-3">
                <div>
                  <p className="text-xs font-bold text-foreground mb-1">
                    1. System Prompt (istruzioni fisse)
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Un testo di ~2.000 parole che definisce le regole che il
                    modello deve seguire: come strutturare la risposta, come
                    citare le fonti, cosa NON fare (allucinare), il formato
                    markdown da usare, etc.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground mb-1">
                    2. User Message (contesto + domanda)
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Il testo del contesto (articoli + interpelli formattati) +
                    la domanda originale dell&apos;utente.
                  </p>
                </div>
              </div>
            </div>

            {/* Anti-hallucination */}
            <div className="rounded-lg bg-red-50/30 border border-red-200/30 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-500" />
                <h4 className="text-sm font-bold text-foreground">
                  La Regola Zero: Anti-allucinazione
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                La regola più importante nel system prompt. I modelli AI
                possono &quot;inventare&quot; fatti plausibili ma falsi (si
                chiama &quot;allucinazione&quot;). Per un sistema legale, questo
                sarebbe catastrofico. Ecco cosa dice la Regola Zero:
              </p>
              <div className="space-y-1.5 mt-2">
                <RuleItem>
                  Nella sezione &quot;Fonti normative&quot; puoi citare{" "}
                  <strong>SOLO</strong> gli articoli presenti nel contesto
                  fornito
                </RuleItem>
                <RuleItem>
                  <strong>MAI</strong> citare articoli che conosci ma che non
                  sono nel contesto
                </RuleItem>
                <RuleItem>
                  Se un articolo rilevante manca dal contesto, puoi solo
                  accennare &quot;potrebbe essere rilevante anche l&apos;art.
                  X&quot; nella sezione <em>Note</em>
                </RuleItem>
                <RuleItem>
                  Se il contesto non contiene gli articoli fondamentali,{" "}
                  <strong>dichiaralo esplicitamente</strong>
                </RuleItem>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                <strong>Risultato pratico:</strong> se la pipeline di ricerca
                non trova l&apos;articolo giusto, la risposta dirà
                &quot;Le fonti fornite non contengono articoli specifici su questo tema&quot;
                anziché inventare una citazione falsa.
              </p>
            </div>

            {/* Struttura risposta */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Struttura obbligatoria della risposta
              </h4>
              <div className="space-y-2">
                <ResponseSection
                  title="Risposta"
                  desc="Risposta diretta alla domanda in 1-2 frasi, poi eventualmente sotto-sezioni per diverse casistiche"
                />
                <ResponseSection
                  title="Normativa di Riferimento"
                  desc="Analisi delle fonti con citazioni precise: articolo, comma, lettera del TU IVA + corrispondente nel DPR 633/1972"
                />
                <ResponseSection
                  title="Prassi (Interpelli)"
                  desc="Solo se pertinenti. Per ogni interpello: la fattispecie, il parere dell'Agenzia, e la rilevanza per il caso dell'utente"
                />
                <ResponseSection
                  title="Note"
                  desc="Avvertenze, limiti dell'analisi, suggerimenti per approfondimento, regime transitorio vecchio→nuovo codice"
                />
              </div>
            </div>

            {/* Streaming */}
            <TechDetail>
              <strong>Lo streaming:</strong> la risposta non viene generata
              tutta e poi inviata. Viene generata{" "}
              <strong>token per token</strong> (un token ≈ una parola o parte di
              parola) e inviata man mano al browser tramite{" "}
              <strong>Server-Sent Events (SSE)</strong>. Ecco perché vedi il
              testo che si scrive progressivamente.
              <br />
              <br />
              Il primo messaggio SSE contiene i{" "}
              <strong>metadati</strong> (analisi della query + elenco fonti con
              dati completi) — per questo le fonti appaiono istantaneamente,
              prima ancora che la risposta sia finita.
            </TechDetail>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* I MODELLI AI                                  */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-12">
          <SectionHeader
            step="+"
            icon={<Brain className="h-5 w-5" />}
            title="I Modelli AI Utilizzati"
            subtitle="Tre modelli diversi per tre compiti diversi"
          />

          <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Il sistema usa{" "}
              <strong className="text-foreground">3 modelli diversi</strong> di
              OpenAI, ciascuno scelto per il compito specifico:
            </p>

            <div className="space-y-3">
              <ModelCard
                name="GPT-4o-mini"
                task="Analisi della domanda (Fase 1)"
                why="Veloce (~1s) e poco costoso (~$0.0003 per query). Per classificare una domanda non serve il modello più potente."
                cost="~$0.0003"
              />
              <ModelCard
                name="text-embedding-3-large"
                task="Generazione embedding (Fase 2)"
                why='Converte testo in vettori a 1.024 dimensioni. È il modello di embedding più potente di OpenAI, fondamentale per la qualità della ricerca semantica. Usato con dimensioni ridotte (1.024 invece di 3.072 default) per bilanciare qualità e costo.'
                cost="~$0.0001"
              />
              <ModelCard
                name="GPT-4o"
                task="Generazione risposta (Fase 5)"
                why="Il modello più avanzato. La qualità della risposta finale è critica: deve capire il contesto legale, citare con precisione, strutturare in markdown, e non allucinare."
                cost="~$0.020"
              />
            </div>

            <div className="rounded-lg bg-[#fef3e6]/40 border border-[#ED7203]/10 p-3.5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-[#ED7203]">Costo totale per query:</strong>{" "}
                circa <strong>$0.021</strong> (~€0.02). Il 97% del costo è
                GPT-4o per la risposta. La scelta di modelli diversi per compiti
                diversi è intenzionale: usare GPT-4o anche per l&apos;analisi
                della domanda costerebbe 10× di più senza migliorare la qualità.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* IL DATABASE                                   */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-12">
          <SectionHeader
            step="+"
            icon={<Database className="h-5 w-5" />}
            title="La Struttura dei Dati"
            subtitle="Come sono organizzati articoli e interpelli"
          />

          <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Il sistema si basa su due database principali (file JSON caricati
              in memoria) + un database vettoriale esterno (Pinecone).
            </p>

            {/* Database 1 */}
            <div className="rounded-lg bg-white/40 border border-white/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#004489]" />
                <h4 className="text-sm font-bold text-foreground">
                  Database Articoli TU IVA
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Contiene i 171 articoli completi. Per ogni articolo:
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <DataField label="ID" example="art_37" />
                <DataField label="Numero articolo" example="37" />
                <DataField label="Titolo" example="Operazioni esenti..." />
                <DataField
                  label="Struttura"
                  example="Titolo II > Capo I"
                />
                <DataField label="Testo integrale" example="4.000+ caratteri" />
                <DataField label="Commi" example="[{numero, testo}, ...]" />
                <DataField
                  label="Temi"
                  example='["esenzioni", "iva_edilizia"]'
                />
                <DataField
                  label="Vecchio codice"
                  example="DPR 633/72 art. 10"
                />
                <DataField
                  label="Riferimenti interni"
                  example="artt. 5, 38, 39"
                />
                <DataField
                  label="Citazione formale"
                  example="Art. 37 TU IVA"
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                Include anche: <strong>indice tematico</strong> (tema → lista
                articoli), <strong>tabella di mappatura</strong>{" "}
                vecchio→nuovo codice, <strong>grafo dei riferimenti</strong>{" "}
                interni tra articoli, e{" "}
                <strong>interpelli collegati</strong> per ogni articolo.
              </p>
            </div>

            {/* Database 2 */}
            <div className="rounded-lg bg-white/40 border border-white/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Gavel className="h-4 w-4 text-[#ED7203]" />
                <h4 className="text-sm font-bold text-foreground">
                  Database Interpelli AdE
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Contiene 544 interpelli completi. Per ogni interpello:
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <DataField label="Numero e anno" example="19/2024" />
                <DataField label="Data" example="15/01/2024" />
                <DataField label="Tag" example="IVA" />
                <DataField label="Oggetto" example="Cessione fabbricato..." />
                <DataField label="Massima" example="La cessione di..." />
                <DataField label="Quesito" example="Testo del quesito" />
                <DataField
                  label="Soluzione contribuente"
                  example="Il contribuente ritiene..."
                />
                <DataField label="Parere AdE" example="L'Agenzia ritiene..." />
                <DataField
                  label="Temi"
                  example='["esenzioni", "iva_edilizia"]'
                />
                <DataField
                  label="Articoli TU collegati"
                  example='["art_37", "art_38"]'
                />
              </div>
            </div>

            {/* Database 3 */}
            <div className="rounded-lg bg-white/40 border border-white/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-[#4B92DB]" />
                <h4 className="text-sm font-bold text-foreground">
                  Database Vettoriale (Pinecone)
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Un database cloud specializzato per la ricerca per similarità.
                Contiene gli <strong>embedding</strong> (vettori numerici) di
                ogni articolo e interpello. Diviso in due
                &quot;namespace&quot;:
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="rounded bg-[#e8f1fa]/40 p-2">
                  <p className="text-xs font-bold text-foreground">
                    tu-iva
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Vettori degli articoli
                  </p>
                </div>
                <div className="rounded bg-[#fef3e6]/40 p-2">
                  <p className="text-xs font-bold text-foreground">
                    interpelli
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Vettori degli interpelli (solo riassunti)
                  </p>
                </div>
              </div>
            </div>

            <TechDetail>
              I database JSON sono caricati in memoria all&apos;avvio e
              indicizzati con strutture{" "}
              <code className="text-xs bg-white/50 px-1 rounded">Map</code> per
              lookup O(1) (tempo costante). Cercare un articolo per ID o numero
              è istantaneo, non importa quanti articoli ci sono nel database.
            </TechDetail>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* RIEPILOGO PARAMETRI                           */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-12">
          <SectionHeader
            step="+"
            icon={<Scale className="h-5 w-5" />}
            title="Tutti i Parametri del Sistema"
            subtitle="I numeri che governano il comportamento"
          />

          <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ogni parametro è stato calibrato attraverso test su 40 domande
              diverse, ottimizzando per qualità delle risposte e precisione
              delle citazioni.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2 pr-4 font-bold text-foreground">
                      Parametro
                    </th>
                    <th className="text-left py-2 pr-4 font-bold text-foreground">
                      Valore
                    </th>
                    <th className="text-left py-2 font-bold text-foreground">
                      Spiegazione
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <ParamRow
                    name="Pinecone topK articoli"
                    value="8"
                    desc="Quanti articoli Pinecone restituisce nella ricerca semantica"
                    scoreTooltip="8 articoli è un buon compromesso: abbastanza per catturare anche risultati meno ovvi, ma non troppi da includere rumore. Se fosse più alto (es. 15), si rischierebbero articoli irrilevanti che 'confondono' il fusion. Se fosse più basso (es. 3), si perderebbero articoli importanti che hanno score semantico medio ma verranno promossi dai bonus tematici."
                  />
                  <ParamRow
                    name="Pinecone topK interpelli"
                    value="10"
                    desc="Quanti interpelli Pinecone restituisce"
                    scoreTooltip="10 interpelli (più che per gli articoli) perché gli interpelli sono più numerosi (544 vs 171) e la probabilità di trovare quelli giusti è minore. Il sistema ne recupera 10 ma ne userà solo 2 massimo nella risposta finale, dopo una selezione molto severa."
                  />
                  <ParamRow
                    name="TopK ridotto (normativa)"
                    value="3"
                    desc="Quando la domanda cita un articolo specifico, si cerca meno nel semantico"
                    scoreTooltip="Quando la domanda è di tipo 'normativa' (cita un articolo specifico), il Path A ha già trovato la fonte principale. Il topK si riduce a 3 per risparmiare risorse: non serve cercare ampiamente se sappiamo già cosa l'utente vuole. I pochi risultati semantici servono solo come complemento."
                  />
                  <ParamRow
                    name="Max articoli finali"
                    value="5"
                    desc="Massimo articoli passati al modello per la risposta"
                    scoreTooltip="5 articoli è il massimo nel contesto del modello AI. Se fossero di più, il contesto diventerebbe troppo lungo (5 × 4.000 caratteri = 20.000 caratteri solo di articoli) e il modello potrebbe 'perdersi'. Se fossero meno, la risposta potrebbe mancare di riferimenti importanti, specialmente per domande ampie."
                  />
                  <ParamRow
                    name="Max interpelli finali"
                    value="2"
                    desc="Massimo interpelli passati al modello per la risposta"
                    scoreTooltip="Solo 2 interpelli nella risposta finale. Gli interpelli sono lunghi e dettagliati, e troppi rischierebbero di saturare il contesto. Inoltre, la prassi interpretativa è un complemento alla normativa, non il focus principale. Per domande specifiche/normative sono 2, per domande generiche solo 1."
                  />
                  <ParamRow
                    name="Soglia articoli"
                    value="≥ 0.40"
                    desc="Score minimo per includere un articolo"
                    scoreTooltip="Soglia 0.40 = permissiva. È meglio includere un articolo marginalmente rilevante che escluderne uno utile. Il modello AI nella fase 5 è intelligente abbastanza da ignorare articoli poco pertinenti, ma non può citare articoli che non ha ricevuto. Se fosse più alta (es. 0.70), si perderebbero articoli importanti con score medio-basso."
                  />
                  <ParamRow
                    name="Soglia interpelli"
                    value="≥ 0.70"
                    desc="Score minimo per includere un interpello (più severo)"
                    scoreTooltip="Soglia 0.70 = molto severa. Gli interpelli poco rilevanti sono dannosi: allungano il contesto e possono confondere la risposta. Solo interpelli con alta certezza di rilevanza vengono inclusi. Se fosse più bassa (es. 0.40 come gli articoli), troppi interpelli generici finirebbero nella risposta."
                  />
                  <ParamRow
                    name="Peso Path C articoli"
                    value="×0.65"
                    desc="Riduzione score per match solo tematici"
                    scoreTooltip="Il Path C (filtro tematico) produce score meno affidabili del Path B (semantico). Un articolo con tema 'esenzioni' potrebbe parlare di esenzioni finanziarie, non immobiliari. Il peso ×0.65 riduce l'influenza del Path C nel ranking finale. Se fosse ×1.0, troppi falsi positivi tematici finirebbero in cima."
                  />
                  <ParamRow
                    name="Peso Path C interpelli"
                    value="×0.50"
                    desc="Riduzione score ancora maggiore per interpelli tematici"
                    scoreTooltip="Peso ancora più basso per gli interpelli tematici (×0.50 vs ×0.65 degli articoli). La classificazione tematica degli interpelli è meno precisa di quella degli articoli, e includere un interpello irrilevante nel contesto ha un costo più alto (spreco di spazio nel contesto per un testo lungo)."
                  />
                  <ParamRow
                    name="Bonus lookup"
                    value="+0.5"
                    desc="Bonus per fonti trovate per riferimento diretto"
                    scoreTooltip="Il bonus più alto del sistema. Se l'utente cita esplicitamente un articolo (es. 'Art. 10 DPR 633'), quel risultato deve finire in cima alla classifica. +0.5 garantisce che anche con uno score base basso, il lookup diretto superi qualsiasi risultato semantico."
                  />
                  <ParamRow
                    name="Bonus multi-path"
                    value="+0.1"
                    desc="Bonus per fonti trovate da più percorsi"
                    scoreTooltip="+0.1 ogni volta che lo stesso articolo viene trovato da un percorso diverso. Un articolo trovato sia dal Path B (semantico) sia dal Path C (tematico) riceve +0.1. L'idea: se due strategie indipendenti concordano, il risultato è probabilmente corretto. Bonus moderato per non sovrastimare la concordanza casuale."
                  />
                  <ParamRow
                    name="Bonus tema 100%"
                    value="+0.3"
                    desc="Bonus per articolo che copre tutti i temi della domanda"
                    scoreTooltip="+0.3 è un bonus forte, secondo solo al lookup (+0.5). Si attiva quando l'articolo copre il 100% dei temi della domanda. Nel nostro esempio, l'Art. 37 copre tutti e 3 i temi (esenzioni, iva_edilizia, cessioni_beni) → +0.3. Questo bonus è stato fondamentale per portare l'Art. 37 dal 4° al 1° posto."
                  />
                  <ParamRow
                    name="Penalità zero temi"
                    value="×0.7"
                    desc="Penalità per articoli senza temi in comune (probabile rumore)"
                    scoreTooltip="×0.7 = riduzione del 30% dello score. Si applica ad articoli trovati dal Path B (semantico) che non hanno nessun tema in comune con la domanda. Sono probabilmente 'falsi positivi semantici': parole simili ma contesto diverso. La penalità li fa scendere in classifica senza eliminarli del tutto (potrebbero essere ancora utili)."
                  />
                  <ParamRow
                    name="Max caratteri articolo"
                    value="4.000"
                    desc="Limite testo per articolo nel contesto"
                    scoreTooltip="4.000 caratteri (~1.000 parole) per articolo. La maggior parte degli articoli del TU IVA sta entro questo limite. Per i pochi articoli molto lunghi, il testo viene troncato. Se fosse più alto, il contesto totale (5 articoli × 4.000 = 20.000 caratteri) diventerebbe troppo costoso e lento."
                  />
                  <ParamRow
                    name="Max caratteri interpello"
                    value="1.500"
                    desc="Limite testo per interpello nel contesto"
                    scoreTooltip="1.500 caratteri per interpello (meno degli articoli). Gli interpelli possono essere molto lunghi (10+ pagine), ma la parte utile è quasi sempre nel parere dell'Agenzia. Il sistema include la massima + il parere AdE, troncando se necessario. Se fosse più alto, due interpelli da 5.000 caratteri saturerebbero il contesto."
                  />
                  <ParamRow
                    name="Embedding dimensioni"
                    value="1.024"
                    desc="Numero di dimensioni del vettore (ridotto da 3.072)"
                    scoreTooltip="1.024 dimensioni invece delle 3.072 default del modello. Ridurre le dimensioni ha 3 vantaggi: ricerca più veloce su Pinecone, costi di storage inferiori, e leggermente meno rumore nei risultati. La qualità della ricerca con 1.024 dimensioni è quasi identica a 3.072 per il nostro caso d'uso (dominio specifico, testi tecnici)."
                  />
                  <ParamRow
                    name="Max token risposta"
                    value="2.048"
                    desc="Lunghezza massima della risposta generata"
                    scoreTooltip="2.048 token (~1.500 parole) è il limite massimo per la risposta del modello. Una risposta tipica è di 500-1.000 parole. Il limite alto permette risposte dettagliate per domande complesse, ma nella pratica il modello raramente lo raggiunge. Se fosse troppo basso (es. 512), le risposte verrebbero troncate a metà frase."
                  />
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* EVOLUZIONI FUTURE                              */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-12">
          <SectionHeader
            step="+"
            icon={<Lightbulb className="h-5 w-5" />}
            title="Evoluzioni Future"
            subtitle="Dove il sistema può ancora migliorare"
          />

          <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Il sistema attuale è un{" "}
              <strong className="text-foreground">MVP solido</strong> — produce
              risposte accurate con citazioni verificabili nel 97.5% dei test
              effettuati. Ma i test hanno anche evidenziato alcuni scenari dove
              la qualità può migliorare. Ecco le aree di evoluzione, ordinate
              per impatto.
            </p>

            {/* ── 1. Vocabolario concetto → articolo ── */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#fef3e6] flex items-center justify-center shrink-0 mt-0.5">
                  <BookMarked className="h-4 w-4 text-[#ED7203]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    1. Dizionario concetti fiscali → articoli
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ED7203] bg-[#fef3e6]/60 px-2 py-0.5 rounded">
                      Impatto alto
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 bg-gray-100/60 px-2 py-0.5 rounded">
                      Richiede lavoro manuale
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Il problema emerso dai test:</strong>{" "}
                    quando la domanda usa un termine fiscale preciso senza
                    citare un articolo specifico — ad esempio{" "}
                    <em>&quot;note di variazione in diminuzione dell&apos;IVA&quot;</em>{" "}
                    — il sistema fatica a trovare l&apos;articolo giusto (Art. 28
                    TU IVA). Il Path A non si attiva (nessun riferimento
                    esplicito), e il Path B/C non sempre collegano il concetto
                    all&apos;articolo corretto.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    <strong className="text-foreground">La soluzione:</strong>{" "}
                    un dizionario curato manualmente da un fiscalista che mappi i
                    concetti chiave agli articoli. Esempi:
                  </p>
                  <div className="mt-2.5 space-y-1.5">
                    <DictEntry
                      concept="note di variazione"
                      article="Art. 28 TU IVA"
                    />
                    <DictEntry
                      concept="detrazione IVA"
                      article="Artt. 19, 19-bis, 19-bis.1 → Artt. 79, 81, 82"
                    />
                    <DictEntry
                      concept="momento impositivo / esigibilità"
                      article="Artt. 6, 6-bis → Artt. 18, 19"
                    />
                    <DictEntry
                      concept="operazioni esenti"
                      article="Art. 10 → Art. 37"
                    />
                    <DictEntry
                      concept="reverse charge"
                      article="Art. 17 → Art. 64"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2.5">
                    In pratica funzionerebbe come un{" "}
                    <strong className="text-foreground">Path A potenziato</strong>:
                    oltre a riconoscere citazioni esplicite (&quot;Art. 10
                    DPR 633/72&quot;), riconoscerebbe anche i concetti (&quot;note
                    di variazione&quot;) e li tratterebbe come lookup diretti.
                    Basterebbero <strong className="text-foreground">50-80 voci</strong>{" "}
                    per coprire i concetti fiscali più ricorrenti.
                  </p>
                  <div className="mt-2.5 rounded-lg bg-[#fef3e6]/30 border border-[#ED7203]/10 p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-[#ED7203]">Perché serve un fiscalista:</strong>{" "}
                      questa mappatura non può essere automatizzata. Un modello AI
                      potrebbe sbagliare le associazioni (es. &quot;compensazione&quot;
                      ha un significato diverso in ambito IVA rispetto a quello
                      tributario generale). Serve l&apos;esperienza di chi conosce la
                      materia per creare mappature corrette e complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 2. Cache embeddings ── */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#e8f1fa] flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="h-4 w-4 text-[#004489]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    2. Cache delle ricerche
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#004489] bg-[#e8f1fa]/60 px-2 py-0.5 rounded">
                      Impatto medio
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-700/70 bg-green-50/60 px-2 py-0.5 rounded">
                      Automatizzabile
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Domande simili generano embedding simili e quindi gli stessi
                    risultati di ricerca. Un sistema di cache per query
                    semanticamente equivalenti (es.{" "}
                    <em>&quot;reverse charge edilizia&quot;</em> ≈{" "}
                    <em>&quot;inversione contabile settore edile&quot;</em>)
                    eliminerebbe il costo dell&apos;embedding e la latenza di
                    Pinecone per le domande ricorrenti. Tempo di risposta
                    stimato: da ~15 secondi a ~5 secondi per query frequenti.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 3. Ampliamento dataset ── */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#e8f1fa] flex items-center justify-center shrink-0 mt-0.5">
                  <Database className="h-4 w-4 text-[#004489]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    3. Ampliamento del database
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#004489] bg-[#e8f1fa]/60 px-2 py-0.5 rounded">
                      Impatto medio
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 bg-gray-100/60 px-2 py-0.5 rounded">
                      Richiede acquisizione dati
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Attualmente il database contiene gli interpelli del 2024-2025.
                    L&apos;architettura è già predisposta per integrare:
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="h-3.5 w-3.5 text-[#004489] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">Interpelli precedenti</strong>{" "}
                        (2020-2023) per ampliare la copertura della prassi interpretativa
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="h-3.5 w-3.5 text-[#004489] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">Circolari dell&apos;Agenzia delle Entrate</strong>{" "}
                        che forniscono interpretazioni ufficiali di portata generale
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="h-3.5 w-3.5 text-[#004489] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">Risoluzioni</strong>{" "}
                        e altri documenti di prassi rilevanti per l&apos;IVA
                      </span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    Il pipeline di indicizzazione è lo stesso: estrazione →
                    classificazione temi → embedding → Pinecone. Non richiede
                    modifiche architetturali.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 4. Aggiornamento automatico ── */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#e8f1fa] flex items-center justify-center shrink-0 mt-0.5">
                  <RefreshCw className="h-4 w-4 text-[#004489]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    4. Aggiornamento automatico
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 bg-gray-100/60 px-2 py-0.5 rounded">
                      Impatto futuro
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-700/70 bg-green-50/60 px-2 py-0.5 rounded">
                      Automatizzabile
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Un job periodico (settimanale o mensile) che scarica i nuovi
                    interpelli pubblicati dall&apos;Agenzia delle Entrate, li
                    processa con lo stesso pipeline, e li aggiunge al database
                    automaticamente. Così il sistema rimane sempre aggiornato
                    senza intervento manuale.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 5. Multi-normativa ── */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#e8f1fa] flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="h-4 w-4 text-[#004489]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    5. Espansione ad altre normative
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 bg-gray-100/60 px-2 py-0.5 rounded">
                      Visione a lungo termine
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    L&apos;architettura è modulare: il sistema di analisi, ricerca
                    multi-path e fusion non è specifico per l&apos;IVA. La stessa
                    infrastruttura può essere replicata per altre aree normative —
                    IRES, IRPEF, tributi locali — creando un{" "}
                    <strong className="text-foreground">
                      assistente fiscale completo
                    </strong>
                    . Ogni normativa avrebbe il suo database, le sue mappature, e
                    il suo dizionario di concetti, ma condividerebbe l&apos;intero
                    engine di ricerca e generazione.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Riepilogo priorità ── */}
            <div className="rounded-lg bg-[#e8f1fa]/30 border border-[#004489]/5 p-4">
              <div className="flex items-start gap-3">
                <Target className="h-4 w-4 text-[#004489] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1.5">
                    Priorità consigliata
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    L&apos;evoluzione con il <strong className="text-foreground">miglior rapporto
                    impatto/sforzo</strong> è il dizionario concetti → articoli (punto 1).
                    È l&apos;unico intervento che migliora direttamente la qualità
                    delle risposte per le domande più comuni — quelle dove
                    l&apos;utente usa un termine fiscale senza citare un articolo
                    specifico. Richiede ~2-3 giorni di lavoro con un fiscalista
                    per creare le 50-80 mappature iniziali, poi può essere
                    esteso nel tempo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/come-funziona"
            className="inline-flex items-center gap-2 bg-white/50 border border-white/60 hover:bg-white/70 text-foreground font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Come Funziona
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#004489] hover:bg-[#003366] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Inizia a cercare
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="pb-6 text-center mt-8">
        <p className="text-sm text-muted-foreground/50">
          powered by{" "}
          <a
            href="https://dglen.it"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-foreground/40 hover:text-[#004489] transition-colors"
          >
            dglen srl
          </a>
        </p>
      </footer>
    </main>
  );
}

/* ═══════════════════════════════════════════════ */
/* Helper Components                               */
/* ═══════════════════════════════════════════════ */

function SectionHeader({
  step,
  icon,
  title,
  subtitle,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="h-10 w-10 rounded-lg bg-[#e8f1fa] flex items-center justify-center shrink-0 text-[#004489]">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          {step !== "+" && (
            <span className="text-xs font-bold text-[#004489]/50 uppercase">
              Fase {step}
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function PipelineStep({
  n,
  label,
  detail,
  time,
}: {
  n: string;
  label: string;
  detail: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-white/40 border border-white/50 rounded-lg px-4 py-3">
      <div className="h-6 w-6 rounded-full bg-[#004489] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
        {n}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0">
            {time}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
          {detail}
        </p>
      </div>
    </div>
  );
}

function StepBadge({ n }: { n: string }) {
  return (
    <div className="h-5 w-5 rounded-full bg-[#004489]/10 text-[#004489] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
      {n}
    </div>
  );
}

function ExampleBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-[#fef3e6]/30 border border-[#ED7203]/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <CircleDot className="h-3.5 w-3.5 text-[#ED7203]" />
        <h4 className="text-xs font-bold text-[#ED7203] uppercase tracking-wider">
          {title}
        </h4>
      </div>
      {children}
    </div>
  );
}

function Annotation({
  color,
  children,
}: {
  color: "blue" | "orange";
  children: React.ReactNode;
}) {
  const styles =
    color === "blue"
      ? "border-[#004489]/10 bg-[#e8f1fa]/30"
      : "border-[#ED7203]/10 bg-[#fef3e6]/30";
  return (
    <div className={`rounded px-3 py-1.5 border ${styles}`}>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function TechDetail({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-gray-50/50 border border-gray-200/30 p-3.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Code2 className="h-3 w-3 text-muted-foreground/50" />
        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">
          Dettaglio tecnico
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function AnalysisItem({
  label,
  detail,
}: {
  label: string;
  detail: string;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <ChevronRight className="h-3.5 w-3.5 text-[#004489] shrink-0 mt-0.5" />
      <div>
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
          {detail}
        </p>
      </div>
    </li>
  );
}

function LookupStep({
  n,
  title,
  description,
  score,
  scoreTooltip,
}: {
  n: string;
  title: string;
  description: string;
  score: string;
  scoreTooltip?: string;
}) {
  const badge = (
    <span className="text-[10px] font-mono text-[#004489]/60 bg-[#e8f1fa]/60 px-1.5 py-0.5 rounded shrink-0 inline-flex items-center gap-1 cursor-help">
      score: {score}
      {scoreTooltip && <Info className="h-2.5 w-2.5 text-[#004489]/40" />}
    </span>
  );
  return (
    <div className="flex items-start gap-3 rounded-lg bg-white/40 border border-white/50 p-3">
      <StepBadge n={n} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-foreground">{title}</span>
          {scoreTooltip ? (
            <ScoreTooltip content={scoreTooltip}>{badge}</ScoreTooltip>
          ) : (
            badge
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  score,
  note,
  scoreTooltip,
}: {
  label: string;
  score: number;
  note: string;
  scoreTooltip?: string;
}) {
  const width = `${Math.round(score * 100)}%`;
  const scoreBadge = (
    <span className="text-xs font-mono text-muted-foreground inline-flex items-center gap-1 cursor-help">
      {score.toFixed(2)}
      {scoreTooltip && <Info className="h-2.5 w-2.5 text-muted-foreground/40" />}
    </span>
  );
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        {scoreTooltip ? (
          <ScoreTooltip content={scoreTooltip}>{scoreBadge}</ScoreTooltip>
        ) : (
          scoreBadge
        )}
      </div>
      <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#004489]/40 rounded-full"
          style={{ width }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground/70">{note}</p>
    </div>
  );
}

function WeightCard({
  path,
  weight,
  label,
  desc,
  scoreTooltip,
}: {
  path: string;
  weight: string;
  label: string;
  desc: string;
  scoreTooltip?: string;
}) {
  const weightEl = (
    <p className={`text-lg font-extrabold text-[#004489] mt-1 inline-flex items-center gap-1 ${scoreTooltip ? "cursor-help" : ""}`}>
      {weight}
      {scoreTooltip && <Info className="h-3 w-3 text-[#004489]/40" />}
    </p>
  );
  return (
    <div className="rounded-lg bg-white/40 border border-white/50 p-3 text-center">
      <p className="text-xs font-bold text-foreground">{path}</p>
      {scoreTooltip ? (
        <ScoreTooltip content={scoreTooltip}>{weightEl}</ScoreTooltip>
      ) : (
        weightEl
      )}
      <p className="text-[10px] font-semibold text-foreground mt-0.5">
        {label}
      </p>
      <p className="text-[10px] text-muted-foreground">{desc}</p>
    </div>
  );
}

function BonusRow({
  n,
  label,
  value,
  type,
  desc,
  scoreTooltip,
}: {
  n: string;
  label: string;
  value: string;
  type: "up" | "down" | "complex";
  desc: string;
  scoreTooltip?: string;
}) {
  const Icon =
    type === "up" ? TrendingUp : type === "down" ? TrendingDown : Award;
  const iconColor =
    type === "up"
      ? "text-green-500"
      : type === "down"
        ? "text-red-400"
        : "text-[#004489]";
  const valueBadge = (
    <span className={`text-[10px] font-mono text-[#004489]/60 bg-[#e8f1fa]/60 px-1.5 py-0.5 rounded shrink-0 inline-flex items-center gap-1 ${scoreTooltip ? "cursor-help" : ""}`}>
      {value}
      {scoreTooltip && <Info className="h-2.5 w-2.5 text-[#004489]/40" />}
    </span>
  );
  return (
    <div className="flex items-start gap-3 rounded-lg bg-white/40 border border-white/50 p-3">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-bold text-muted-foreground/50">
          #{n}
        </span>
        <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-foreground">{label}</span>
          {scoreTooltip ? (
            <ScoreTooltip content={scoreTooltip}>{valueBadge}</ScoreTooltip>
          ) : (
            valueBadge
          )}
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
          {desc}
        </p>
      </div>
    </div>
  );
}

function BonusDetail({
  condition,
  effect,
  example,
  type,
}: {
  condition: string;
  effect: string;
  example: string;
  type: "up" | "down";
}) {
  const Icon = type === "up" ? TrendingUp : TrendingDown;
  const color = type === "up" ? "text-green-600" : "text-red-500";
  return (
    <div className="flex items-start gap-2 text-xs">
      <Icon className={`h-3.5 w-3.5 ${color} shrink-0 mt-0.5`} />
      <div>
        <span className="font-semibold text-foreground">{condition}</span>
        <span className={`font-mono ${color} ml-1.5`}>{effect}</span>
        <p className="text-muted-foreground/70 text-[10px] mt-0.5">{example}</p>
      </div>
    </div>
  );
}

function ScoringTrace({
  step,
  score,
  note,
  scoreTooltip,
}: {
  step: string;
  score: string;
  note: string;
  scoreTooltip?: string;
}) {
  const scoreBadge = (
    <span className={`font-mono font-bold text-[#004489] shrink-0 inline-flex items-center gap-1 ${scoreTooltip ? "cursor-help" : ""}`}>
      {score}
      {scoreTooltip && <Info className="h-2.5 w-2.5 text-[#004489]/40" />}
    </span>
  );
  return (
    <div className="flex items-center gap-3 text-xs">
      <ChevronRight className="h-3 w-3 text-[#ED7203] shrink-0" />
      <span className="font-semibold text-foreground min-w-0 flex-1">
        {step}
      </span>
      {scoreTooltip ? (
        <ScoreTooltip content={scoreTooltip}>{scoreBadge}</ScoreTooltip>
      ) : (
        scoreBadge
      )}
      <span className="text-muted-foreground/60 text-[10px] hidden sm:block shrink-0 max-w-[200px]">
        {note}
      </span>
    </div>
  );
}

function RuleItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <AlertTriangle className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function ResponseSection({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-white/40 border border-white/50 p-3">
      <CheckCircle2 className="h-4 w-4 text-[#004489] shrink-0 mt-0.5" />
      <div>
        <span className="text-xs font-bold text-foreground">{title}</span>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
          {desc}
        </p>
      </div>
    </div>
  );
}

function ModelCard({
  name,
  task,
  why,
  cost,
}: {
  name: string;
  task: string;
  why: string;
  cost: string;
}) {
  return (
    <div className="rounded-lg bg-white/40 border border-white/50 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-foreground">{name}</h4>
        <span className="text-[10px] font-mono text-muted-foreground/60 bg-white/50 px-2 py-0.5 rounded">
          {cost}/query
        </span>
      </div>
      <p className="text-xs font-semibold text-[#004489]">{task}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{why}</p>
    </div>
  );
}

function DataField({ label, example }: { label: string; example: string }) {
  return (
    <div className="py-1">
      <span className="font-semibold text-foreground">{label}:</span>{" "}
      <span className="font-mono text-[10px]">{example}</span>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[10px] font-semibold text-[#004489] bg-[#e8f1fa]/60 px-1.5 py-0.5 rounded">
      {children}
    </span>
  );
}

function ParamRow({
  name,
  value,
  desc,
  scoreTooltip,
}: {
  name: string;
  value: string;
  desc: string;
  scoreTooltip?: string;
}) {
  const valueEl = (
    <span className={`inline-flex items-center gap-1 ${scoreTooltip ? "cursor-help" : ""}`}>
      {value}
      {scoreTooltip && <Info className="h-2.5 w-2.5 text-[#004489]/40" />}
    </span>
  );
  return (
    <tr className="border-b border-white/10">
      <td className="py-2 pr-4 font-semibold text-foreground whitespace-nowrap">
        {name}
      </td>
      <td className="py-2 pr-4 font-mono text-[#004489] font-bold whitespace-nowrap">
        {scoreTooltip ? (
          <ScoreTooltip content={scoreTooltip}>{valueEl}</ScoreTooltip>
        ) : (
          valueEl
        )}
      </td>
      <td className="py-2">{desc}</td>
    </tr>
  );
}

function DictEntry({ concept, article }: { concept: string; article: string }) {
  return (
    <div className="flex items-center gap-2 text-xs bg-white/40 border border-white/50 rounded-lg px-3 py-2">
      <span className="font-semibold text-foreground whitespace-nowrap">
        &quot;{concept}&quot;
      </span>
      <ArrowRight className="h-3 w-3 text-[#004489]/40 shrink-0" />
      <span className="font-mono text-[#004489]">{article}</span>
    </div>
  );
}
