import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Gavel,
  Search,
  Brain,
  Zap,
  Shield,
  ArrowRight,
  Database,
  FileText,
  Scale,
  Layers,
  GitCompareArrows,
  MessageSquareText,
  Filter,
  Sparkles,
  CheckCircle2,
  Code2,
} from "lucide-react";

export const metadata = {
  title: "Come Funziona — Fisco AI",
  description:
    "Scopri come funziona il sistema di ricerca intelligente per il Testo Unico IVA e gli interpelli dell'Agenzia delle Entrate.",
};

export default function ComeFunzionaPage() {
  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh">
        <div className="gradient-mesh-inner" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        {/* ── Back link ── */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#004489] hover:text-[#003366] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna alla ricerca
        </Link>

        {/* ── Hero ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#004489]/50 bg-[#e8f1fa]/60 px-3.5 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            <Sparkles className="h-3 w-3" />
            Dietro le quinte
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient mb-4 leading-[1.1]">
            Come Funziona
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Un sistema di intelligenza artificiale costruito su misura per il
            diritto tributario italiano, alimentato da fonti normative ufficiali
            e prassi interpretativa aggiornata.
          </p>
        </div>

        {/* ══════════════════════════════════════════════ */}
        {/* SEZIONE 1: Il Database                        */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-10">
          <SectionHeader
            icon={<Database className="h-5 w-5" />}
            title="Il Database"
            subtitle="Le fonti alla base di ogni risposta"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Testo Unico IVA */}
            <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#e8f1fa] flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-[#004489]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Testo Unico IVA
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    D.Lgs. 19 gennaio 2026, n. 10
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Il nuovo Testo Unico riordina e sostituisce il{" "}
                <strong className="text-foreground">DPR 633/1972</strong>, la
                legge IVA italiana in vigore da oltre 50 anni. Tutti i{" "}
                <strong className="text-foreground">171 articoli</strong> del
                nuovo codice sono stati analizzati, strutturati e indicizzati
                nel nostro sistema.
              </p>

              <div className="space-y-2.5">
                <InfoRow
                  icon={<FileText className="h-3.5 w-3.5" />}
                  label="171 articoli"
                  detail="con testo integrale, suddiviso per commi"
                />
                <InfoRow
                  icon={<Layers className="h-3.5 w-3.5" />}
                  label="18 Titoli, 49 Capi"
                  detail="struttura gerarchica completa"
                />
                <InfoRow
                  icon={<GitCompareArrows className="h-3.5 w-3.5" />}
                  label="Mappatura vecchio → nuovo"
                  detail="ogni articolo è collegato al corrispondente del DPR 633/72"
                />
                <InfoRow
                  icon={<Filter className="h-3.5 w-3.5" />}
                  label="34 temi classificati"
                  detail="esenzioni, reverse charge, territorialità, edilizia..."
                />
              </div>

              <div className="rounded-lg bg-[#e8f1fa]/40 border border-[#004489]/5 p-3.5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-[#004489]">
                    Perché è importante:
                  </strong>{" "}
                  Il Testo Unico entrerà in vigore il 1 gennaio 2027 e
                  sostituirà integralmente il DPR 633/72. Chi lavora con
                  l&apos;IVA deve conoscere sia il vecchio sia il nuovo codice.
                  Il nostro sistema collega automaticamente i due: chiedi
                  dell&apos;art. 10 DPR 633 e ottieni la risposta aggiornata
                  con il corrispondente art. 37 del TU IVA.
                </p>
              </div>
            </div>

            {/* Interpelli */}
            <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#fef3e6] flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-[#ED7203]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Interpelli AdE
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Agenzia delle Entrate, 2024-2025
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Gli interpelli sono le risposte ufficiali dell&apos;Agenzia
                delle Entrate alle domande dei contribuenti.{" "}
                <strong className="text-foreground">544 interpelli</strong>{" "}
                degli anni 2024 e 2025 sono stati scaricati, analizzati e
                strutturati nel sistema.
              </p>

              <div className="space-y-2.5">
                <InfoRow
                  icon={<FileText className="h-3.5 w-3.5" />}
                  label="544 interpelli"
                  detail="270 del 2024 + 274 del 2025"
                  orange
                />
                <InfoRow
                  icon={<MessageSquareText className="h-3.5 w-3.5" />}
                  label="Testo completo al 96%"
                  detail="quesito, soluzione contribuente, parere AdE"
                  orange
                />
                <InfoRow
                  icon={<Scale className="h-3.5 w-3.5" />}
                  label="Massima ufficiale"
                  detail="il principio di diritto estratto da ogni risposta"
                  orange
                />
                <InfoRow
                  icon={<GitCompareArrows className="h-3.5 w-3.5" />}
                  label="Collegati al TU IVA"
                  detail="ogni interpello è linkato agli articoli citati"
                  orange
                />
              </div>

              <div className="rounded-lg bg-[#fef3e6]/40 border border-[#ED7203]/5 p-3.5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-[#ED7203]">
                    Perché è importante:
                  </strong>{" "}
                  Gli interpelli mostrano come l&apos;Agenzia delle Entrate
                  interpreta la norma nella pratica. Un articolo di legge dice{" "}
                  <em>cosa</em> prevede la norma; un interpello mostra{" "}
                  <em>come</em> viene applicata a casi reali. Insieme offrono un
                  quadro completo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* SEZIONE 2: La Ricerca Intelligente            */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-10">
          <SectionHeader
            icon={<Search className="h-5 w-5" />}
            title="La Ricerca Intelligente"
            subtitle="Tre strategie combinate per trovare le fonti giuste"
          />

          <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Quando poni una domanda, il sistema non si limita a cercare parole
              chiave nel testo. Ogni domanda viene prima{" "}
              <strong className="text-foreground">analizzata</strong> da un
              primo modello AI che identifica il tipo di domanda, i temi trattati
              e gli eventuali riferimenti normativi espliciti. Poi vengono
              attivate{" "}
              <strong className="text-foreground">
                tre strategie di ricerca in parallelo
              </strong>
              , ciascuna specializzata in un tipo diverso di informazione. Infine,
              i risultati vengono combinati e classificati per qualità e
              rilevanza.
            </p>

            {/* Path 1 */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#e8f1fa] flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="h-4 w-4 text-[#004489]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    1. Ricerca diretta
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Se nella domanda citi un articolo specifico — ad esempio{" "}
                    <em>&quot;Art. 10 DPR 633/72&quot;</em> oppure{" "}
                    <em>&quot;Interpello 19/2024&quot;</em> — il sistema lo
                    riconosce e lo recupera istantaneamente dal database. È il
                    percorso più veloce e più preciso.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
                    In più, se citi un articolo del{" "}
                    <strong className="text-foreground">
                      vecchio DPR 633/1972
                    </strong>
                    , il sistema{" "}
                    <strong className="text-foreground">
                      trova automaticamente il corrispondente
                    </strong>{" "}
                    nel nuovo Testo Unico IVA grazie alla mappatura interna.
                    Arricchisce anche la ricerca recuperando gli interpelli che
                    citano quegli stessi articoli.
                  </p>
                </div>
              </div>
            </div>

            {/* Path 2 */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#e8f1fa] flex items-center justify-center shrink-0 mt-0.5">
                  <Brain className="h-4 w-4 text-[#004489]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    2. Ricerca semantica
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Per le domande formulate in linguaggio naturale — ad esempio{" "}
                    <em>
                      &quot;Come funziona il reverse charge per i servizi
                      edili?&quot;
                    </em>{" "}
                    — il sistema va oltre le parole usate e cerca di{" "}
                    <strong className="text-foreground">
                      capire il significato
                    </strong>{" "}
                    della domanda.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
                    Funziona così: la domanda viene convertita in una
                    rappresentazione numerica (un &quot;vettore&quot;) che
                    cattura il suo significato concettuale. Lo stesso è stato
                    fatto per ogni articolo e interpello nel database. Il
                    sistema confronta la domanda con tutte le fonti e seleziona
                    quelle{" "}
                    <strong className="text-foreground">
                      concettualmente più vicine
                    </strong>{" "}
                    — anche se non contengono le stesse identiche parole.
                  </p>
                </div>
              </div>
            </div>

            {/* Path 3 */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#e8f1fa] flex items-center justify-center shrink-0 mt-0.5">
                  <Filter className="h-4 w-4 text-[#004489]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    3. Filtro tematico
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Il sistema identifica automaticamente i{" "}
                    <strong className="text-foreground">temi</strong> della tua
                    domanda — ad esempio: esenzioni, edilizia, cessioni di beni,
                    reverse charge — e cerca tutti gli articoli e interpelli
                    che sono stati classificati con quegli stessi argomenti.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
                    Questo è un livello di sicurezza in più: garantisce che fonti
                    pertinenti ma formulate in modo molto diverso dalla domanda
                    — e che la ricerca semantica potrebbe non cogliere — vengano
                    comunque trovate e considerate.
                  </p>
                </div>
              </div>
            </div>

            {/* Fusion */}
            <div className="rounded-lg bg-[#e8f1fa]/30 border border-[#004489]/5 p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#004489]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="h-4 w-4 text-[#004489]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    Combinazione e classificazione
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    I risultati delle tre strategie vengono{" "}
                    <strong className="text-foreground">
                      combinati e classificati
                    </strong>{" "}
                    con un algoritmo che assegna un punteggio di qualità a ogni
                    fonte. L&apos;algoritmo premia le fonti trovate da più
                    strategie contemporaneamente (segno di alta rilevanza), quelle
                    più recenti, e quelle che coprono meglio tutti i temi
                    identificati nella domanda. A fine processo, solo le{" "}
                    <strong className="text-foreground">
                      5 fonti normative e i 2 interpelli migliori
                    </strong>{" "}
                    vengono selezionati per costruire la risposta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* SEZIONE 3: La Risposta                        */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-10">
          <SectionHeader
            icon={<MessageSquareText className="h-5 w-5" />}
            title="La Risposta"
            subtitle="Come l'AI genera risposte accurate e verificabili"
          />

          <div className="glass-subtle rounded-xl border border-white/30 p-6 space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Una volta trovate le fonti più rilevanti, un modello di
              intelligenza artificiale avanzato analizza gli articoli e gli
              interpelli selezionati e genera una{" "}
              <strong className="text-foreground">
                risposta strutturata e professionale
              </strong>
              , pensata per fiscalisti e commercialisti.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureCard
                icon={<FileText className="h-4 w-4 text-[#004489]" />}
                title="Struttura professionale"
                description="Ogni risposta segue uno schema preciso: risposta diretta, normativa di riferimento con commi e lettere, prassi interpretativa dagli interpelli, e note di approfondimento."
              />
              <FeatureCard
                icon={<Scale className="h-4 w-4 text-[#004489]" />}
                title="Citazioni verificabili"
                description="Ogni affermazione è corredata dalla fonte precisa: articolo, comma e lettera del TU IVA, con il corrispondente del vecchio DPR 633/1972 per facilitare il confronto."
              />
              <FeatureCard
                icon={<Shield className="h-4 w-4 text-[#004489]" />}
                title="Anti-allucinazione"
                description="Il sistema è progettato per citare esclusivamente le fonti effettivamente consultate. Se un articolo rilevante non è nel contesto, lo dichiara esplicitamente anziché inventare."
              />
              <FeatureCard
                icon={<GitCompareArrows className="h-4 w-4 text-[#004489]" />}
                title="Ponte vecchio → nuovo codice"
                description="Ogni riferimento al TU IVA riporta anche il corrispondente articolo del DPR 633/72 (e viceversa), facilitando la transizione tra i due ordinamenti."
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════ */}
        {/* SEZIONE 4: I Numeri                           */}
        {/* ══════════════════════════════════════════════ */}
        <section className="mb-12">
          <SectionHeader
            icon={<Zap className="h-5 w-5" />}
            title="Il Progetto in Numeri"
            subtitle="Il lavoro svolto per costruire il sistema"
          />

          <div className="glass-subtle rounded-xl border border-white/30 p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <StatBlock
                value="171"
                label="Articoli del TU IVA"
                sublabel="analizzati e indicizzati"
              />
              <StatBlock
                value="544"
                label="Interpelli AdE"
                sublabel="2024-2025, con testo completo"
              />
              <StatBlock
                value="34"
                label="Temi classificati"
                sublabel="da esenzioni a edilizia"
              />
              <StatBlock
                value="50+"
                label="Anni di normativa"
                sublabel="dal DPR 633/72 al TU IVA 2026"
              />
              <StatBlock
                value="3"
                label="Strategie di ricerca"
                sublabel="diretta, semantica, tematica"
              />
              <StatBlock
                value="~15s"
                label="Tempo di risposta"
                sublabel="analisi, ricerca e generazione"
              />
            </div>
          </div>
        </section>

        {/* ── Workflow riassuntivo ── */}
        <section className="mb-12">
          <div className="glass-subtle rounded-xl border border-white/30 p-6">
            <h3 className="text-base font-bold text-foreground mb-5 text-center">
              Il percorso di ogni domanda
            </h3>
            <div className="space-y-3 max-w-xl mx-auto">
              <WorkflowStep
                step="1"
                icon={<Search className="h-3.5 w-3.5" />}
                label="Analisi della domanda"
                description="L'AI identifica il tipo di domanda, i temi trattati e i riferimenti normativi citati"
              />
              <div className="flex justify-center">
                <div className="h-3 w-px bg-[#004489]/15" />
              </div>
              <WorkflowStep
                step="2"
                icon={<Database className="h-3.5 w-3.5" />}
                label="Ricerca su 3 canali paralleli"
                description="Ricerca diretta, semantica e tematica interrogano il database simultaneamente"
              />
              <div className="flex justify-center">
                <div className="h-3 w-px bg-[#004489]/15" />
              </div>
              <WorkflowStep
                step="3"
                icon={<Layers className="h-3.5 w-3.5" />}
                label="Combinazione e classificazione"
                description="I risultati vengono fusi, classificati per rilevanza e selezionati i migliori"
              />
              <div className="flex justify-center">
                <div className="h-3 w-px bg-[#004489]/15" />
              </div>
              <WorkflowStep
                step="4"
                icon={<Brain className="h-3.5 w-3.5" />}
                label="Generazione della risposta"
                description="L'AI analizza le fonti selezionate e compone una risposta strutturata con citazioni precise"
              />
              <div className="flex justify-center">
                <div className="h-3 w-px bg-[#004489]/15" />
              </div>
              <WorkflowStep
                step="5"
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                label="Risposta verificabile"
                description="Ogni affermazione è collegata alla fonte, così puoi verificare direttamente il testo originale"
              />
            </div>
          </div>
        </section>

        {/* ── Technical deep-dive link ── */}
        <div className="glass-subtle rounded-xl border border-white/30 p-5 mb-10">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#e8f1fa] flex items-center justify-center shrink-0">
              <Code2 className="h-5 w-5 text-[#004489]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground mb-1">
                Vuoi sapere di più?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Abbiamo preparato un approfondimento tecnico completo che spiega
                ogni passaggio con un esempio reale: dall&apos;analisi della
                domanda, al funzionamento dei 3 percorsi di ricerca,
                all&apos;algoritmo di scoring, fino alla generazione della
                risposta.
              </p>
              <Link
                href="/come-funziona/architettura"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#004489] hover:text-[#003366] transition-colors"
              >
                Leggi l&apos;architettura tecnica
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center">
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
      <footer className="pb-6 text-center">
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

/* ── Helper components ── */

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
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
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  detail,
  orange = false,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  orange?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
          orange
            ? "bg-[#fef3e6] text-[#ED7203]"
            : "bg-[#e8f1fa] text-[#004489]"
        }`}
      >
        {icon}
      </div>
      <div>
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground"> — {detail}</span>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-white/40 border border-white/50 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-[#e8f1fa] flex items-center justify-center">
          {icon}
        </div>
        <h4 className="text-sm font-bold text-foreground">{title}</h4>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function StatBlock({
  value,
  label,
  sublabel,
}: {
  value: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-extrabold text-gradient tabular-nums">
        {value}
      </div>
      <div className="text-sm font-semibold text-foreground mt-1">{label}</div>
      <div className="text-xs text-muted-foreground">{sublabel}</div>
    </div>
  );
}

function WorkflowStep({
  step,
  icon,
  label,
  description,
}: {
  step: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-white/50 border border-white/60 rounded-lg px-4 py-3">
      <div className="h-6 w-6 rounded-full bg-[#004489] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
        {step}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <div className="text-[#004489]">{icon}</div>
          <span className="text-sm font-semibold text-foreground">
            {label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}
