"use client";

import { useState } from "react";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ExternalLink,
  CalendarDays,
  Link2,
  MessageSquare,
  Gavel,
  User,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SourceInterpello } from "@/lib/types";

const TAG_COLORS: Record<string, string> = {
  IVA: "bg-[#e8f1fa] text-[#004489]",
  "ALIQ. IVA": "bg-emerald-50 text-emerald-700",
  "DETR. EDILIZIE": "bg-orange-50 text-orange-700",
  RI: "bg-purple-50 text-purple-700",
  RLD: "bg-yellow-50 text-yellow-800",
  INDIRETTE: "bg-pink-50 text-pink-700",
  "AG.": "bg-teal-50 text-teal-700",
  IRPEF: "bg-red-50 text-red-700",
  "OP. STR.": "bg-indigo-50 text-indigo-700",
  "RL AUT.": "bg-cyan-50 text-cyan-700",
  DS: "bg-slate-100 text-slate-700",
  RISCOSSIONE: "bg-amber-50 text-amber-700",
  SOSTITUTIVE: "bg-lime-50 text-lime-700",
  "AG. COVID": "bg-rose-50 text-rose-700",
  LOCALI: "bg-violet-50 text-violet-700",
};

function getTagColor(tag: string): string {
  return TAG_COLORS[tag] ?? "bg-gray-100 text-gray-700";
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Info className="h-3.5 w-3.5 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-[280px] text-xs leading-relaxed"
      >
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface InterpelloCardProps {
  interpello: SourceInterpello;
}

export function InterpelloCard({ interpello }: InterpelloCardProps) {
  const [massimaOpen, setMassimaOpen] = useState(false);
  const massimaIsLong = interpello.massima.length > 150;

  return (
    <div className="card-hover group bg-white rounded-xl border border-border/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="p-5 space-y-3">
        {/* Header: badge + tag + detail */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center text-xs font-bold font-mono text-[#ED7203] bg-[#fef3e6] px-2.5 py-1 rounded-lg">
              n. {interpello.numero}/{interpello.anno}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getTagColor(interpello.tag)}`}
            >
              {interpello.tag}
            </span>
            <InfoTip text="Numero progressivo e anno dell'interpello. Il tag indica l'area fiscale (es. IVA, IRPEF, Detrazioni edilzie)." />
          </div>
          <InterpelloDetailDialog interpello={interpello} />
        </div>

        {/* Oggetto */}
        <h4 className="text-sm font-semibold text-foreground leading-snug">
          {interpello.oggetto}
        </h4>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 text-[#EB8D38]" />
          <span>{formatDate(interpello.data)}</span>
          {!interpello.ha_testo_completo && (
            <span className="text-[#ED7203] ml-1 font-medium">
              (solo massima)
            </span>
          )}
          <InfoTip text="Data di pubblicazione dell'interpello da parte dell'Agenzia delle Entrate. Se indicato 'solo massima', il testo completo non è disponibile." />
        </div>

        {/* Massima with collapsible */}
        <Collapsible open={massimaOpen} onOpenChange={setMassimaOpen}>
          <div className="flex items-start gap-1.5">
            <p
              className={`text-xs text-muted-foreground leading-relaxed flex-1 ${!massimaOpen && massimaIsLong ? "line-clamp-2" : ""}`}
            >
              {interpello.massima}
            </p>
            <InfoTip text="La massima è il principio giuridico estratto dalla risposta dell'AdE, ovvero la sintesi del parere ufficiale." />
          </div>
          {massimaIsLong && (
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-1 text-xs font-medium text-[#ED7203] hover:text-[#004489] transition-colors mt-1">
                {massimaOpen ? (
                  <>
                    Chiudi <ChevronUp className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    Leggi tutto <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </CollapsibleTrigger>
          )}
          <CollapsibleContent />
        </Collapsible>

        {/* Temi badges */}
        {interpello.temi.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {interpello.temi.slice(0, 3).map((tema) => (
              <span
                key={tema}
                className="text-xs font-medium text-[#ED7203]/70 bg-[#fef3e6]/70 px-2.5 py-0.5 rounded-full"
              >
                {tema.replace(/_/g, " ")}
              </span>
            ))}
            {interpello.temi.length > 3 && (
              <span className="text-xs text-muted-foreground/60 px-1 py-0.5">
                +{interpello.temi.length - 3}
              </span>
            )}
            <InfoTip text="Aree tematiche trattate dall'interpello, utili per collegarlo ad articoli TU IVA e altri interpelli." />
          </div>
        )}

        {/* Footer: Articoli collegati + PDF */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {interpello.articoli_tu_iva_collegati.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <Link2 className="h-3 w-3 shrink-0" />
              <span>
                {interpello.articoli_tu_iva_collegati
                  .map((id) => `Art. ${id.replace("art_", "")}`)
                  .slice(0, 4)
                  .join(", ")}
                {interpello.articoli_tu_iva_collegati.length > 4 &&
                  ` (+${interpello.articoli_tu_iva_collegati.length - 4})`}
              </span>
              <InfoTip text="Articoli del Testo Unico IVA direttamente collegati a questo interpello." />
            </div>
          )}
          {interpello.link_pdf && (
            <a
              href={interpello.link_pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-[#4B92DB] hover:text-[#004489] transition-colors shrink-0"
            >
              <FileText className="h-3.5 w-3.5" />
              PDF
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function InterpelloDetailDialog({
  interpello,
}: {
  interpello: SourceInterpello;
}) {
  const hasSections =
    interpello.sezioni.quesito ||
    interpello.sezioni.parere_ade ||
    interpello.sezioni.soluzione_contribuente;

  const availableTabs: Array<{
    value: string;
    label: string;
    icon: React.ReactNode;
    content: string | null;
  }> = [];

  if (interpello.sezioni.quesito) {
    availableTabs.push({
      value: "quesito",
      label: "Quesito",
      icon: <MessageSquare className="h-3.5 w-3.5" />,
      content: interpello.sezioni.quesito,
    });
  }
  if (interpello.sezioni.soluzione_contribuente) {
    availableTabs.push({
      value: "contribuente",
      label: "Contribuente",
      icon: <User className="h-3.5 w-3.5" />,
      content: interpello.sezioni.soluzione_contribuente,
    });
  }
  if (interpello.sezioni.parere_ade) {
    availableTabs.push({
      value: "parere",
      label: "Parere AdE",
      icon: <Gavel className="h-3.5 w-3.5" />,
      content: interpello.sezioni.parere_ade,
    });
  }

  const defaultTab =
    availableTabs.find((t) => t.value === "parere")?.value ??
    availableTabs[0]?.value ??
    "parere";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-xs font-medium text-[#ED7203] bg-[#fef3e6]/50 hover:bg-[#fef3e6] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shrink-0">
          Dettaglio
          <ChevronRight className="h-3 w-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-5 bg-gradient-to-b from-[#fef3e6]/50 to-transparent border-b border-border/20">
          <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
            <span className="inline-flex items-center text-xs font-bold font-mono text-[#ED7203] bg-[#fef3e6] px-3 py-1.5 rounded-lg">
              Interpello n. {interpello.numero}/{interpello.anno}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getTagColor(interpello.tag)}`}
            >
              {interpello.tag}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(interpello.data)}
            </span>
            <InfoTip text="Gli interpelli sono risposte ufficiali dell'Agenzia delle Entrate a quesiti di contribuenti su specifiche fattispecie fiscali." />
          </div>
          <DialogTitle className="text-xl font-bold leading-tight">
            {interpello.oggetto}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6 mt-5" style={{ maxHeight: "58vh" }}>
          {/* Massima highlighted */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Massima
              </h4>
              <InfoTip text="Principio giuridico estratto dalla risposta: la sintesi ufficiale del parere dell'Agenzia delle Entrate su questo caso." />
            </div>
            <div className="bg-gradient-to-br from-[#fef3e6]/60 to-[#fef3e6]/20 border border-[#ED7203]/10 rounded-xl p-5">
              <p className="text-[13px] leading-[1.8] text-foreground/90">
                {interpello.massima}
              </p>
            </div>
          </div>

          {/* Sections with tabs */}
          {hasSections && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Sezioni del documento
                </h4>
                <InfoTip text="L'interpello si compone di tre parti: il Quesito del contribuente, la Soluzione proposta dal contribuente, e il Parere ufficiale dell'Agenzia delle Entrate." />
              </div>
              <Tabs defaultValue={defaultTab}>
                <TabsList
                  className="w-full h-10 bg-muted/50 rounded-xl p-1"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)`,
                  }}
                >
                  {availableTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-xs gap-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                    >
                      {tab.icon}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {availableTabs.map((tab) => (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="mt-4"
                  >
                    <p className="text-[13px] leading-[1.8] whitespace-pre-wrap text-foreground/90">
                      {tab.content}
                    </p>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}

          {/* Temi */}
          {interpello.temi.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Temi
                </h4>
                <InfoTip text="Aree tematiche fiscali trattate in questo interpello." />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {interpello.temi.map((tema) => (
                  <span
                    key={tema}
                    className="text-xs font-medium text-[#ED7203]/80 bg-[#fef3e6]/70 px-2.5 py-1 rounded-full"
                  >
                    {tema.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Articoli TU IVA collegati */}
          {interpello.articoli_tu_iva_collegati.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Articoli TU IVA collegati
                </h4>
                <InfoTip text="Articoli del Testo Unico IVA (D.Lgs. 10/2026) direttamente rilevanti per il caso trattato in questo interpello." />
              </div>
              <div className="flex flex-wrap gap-2">
                {interpello.articoli_tu_iva_collegati.map((id) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="font-mono text-xs bg-[#e8f1fa] text-[#004489] hover:bg-[#d0e3f5] px-2.5 py-1"
                  >
                    Art. {id.replace("art_", "")}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Footer: PDF + citazione */}
          <div className="mt-8 pt-5 border-t border-border/30 space-y-3">
            {interpello.link_pdf && (
              <div className="flex items-center gap-2">
                <a
                  href={interpello.link_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#004489] hover:text-[#4B92DB] transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Scarica PDF originale
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <InfoTip text="Documento PDF originale pubblicato dall'Agenzia delle Entrate." />
              </div>
            )}
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground/70 italic leading-relaxed">
                {interpello.citazione}
              </p>
              <InfoTip text="Riferimento bibliografico ufficiale per citare questo interpello." />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
