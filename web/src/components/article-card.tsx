"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Link2,
  Layers,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SourceArticle } from "@/lib/types";

// --- Testo integrale parser ---

interface TextBlock {
  type: "intro" | "comma";
  number?: string;
  content: string;
}

function parseTestoIntegrale(text: string): TextBlock[] {
  // Remove trailing structural noise (TITOLO / Capo sections after the article body)
  const cleaned = text
    .replace(/\nTITOLO\s+[IVXLCDM]+[\s\S]*$/m, "")
    .trim();

  const blocks: TextBlock[] = [];
  const lines = cleaned.split("\n");
  let currentType: "intro" | "comma" = "intro";
  let currentNumber = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    // Match comma start: digits + period NOT followed by another digit (avoids "10.000")
    const commaMatch = line.match(/^(\d+)\.(?!\d)\s*(.*)/);
    if (commaMatch && parseInt(commaMatch[1]) <= 50) {
      // Save previous block
      if (currentLines.length > 0) {
        const content = currentLines.join("\n").trim();
        if (content) {
          blocks.push({
            type: currentType,
            ...(currentType === "comma" ? { number: currentNumber } : {}),
            content,
          });
        }
      }
      currentType = "comma";
      currentNumber = commaMatch[1];
      currentLines = [commaMatch[2]];
    } else {
      currentLines.push(line);
    }
  }

  // Last block
  if (currentLines.length > 0) {
    const content = currentLines.join("\n").trim();
    if (content) {
      blocks.push({
        type: currentType,
        ...(currentType === "comma" ? { number: currentNumber } : {}),
        content,
      });
    }
  }

  return blocks;
}

function FormattedArticleText({ text }: { text: string }) {
  const blocks = parseTestoIntegrale(text);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === "intro") {
          return (
            <div
              key={i}
              className="text-xs text-muted-foreground italic bg-muted/30 rounded-lg px-4 py-3 leading-relaxed"
            >
              {block.content}
            </div>
          );
        }

        return (
          <div key={i} className="flex items-start gap-3">
            <span className="text-xs font-mono font-bold text-[#004489] bg-[#e8f1fa] rounded-lg px-2.5 py-1.5 shrink-0 mt-0.5">
              c.{block.number}
            </span>
            <p className="text-[13px] leading-[1.8] text-foreground/90 whitespace-pre-wrap flex-1">
              {block.content}
            </p>
          </div>
        );
      })}
    </div>
  );
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

interface ArticleCardProps {
  article: SourceArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [commiOpen, setCommiOpen] = useState(false);

  return (
    <div className="card-hover group bg-white rounded-xl border border-border/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="p-5 space-y-3">
        {/* Header: badge + detail trigger */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-[#004489] bg-[#e8f1fa] px-2.5 py-1 rounded-lg">
              Art. {article.articolo}
            </span>
            <InfoTip text="Numero dell'articolo nel Testo Unico IVA (D.Lgs. 19 gennaio 2026, n. 10), la nuova codificazione della disciplina IVA italiana." />
          </div>
          <ArticleDetailDialog article={article} />
        </div>

        {/* Titolo */}
        <h4 className="text-sm font-semibold text-foreground leading-snug">
          {article.titolo}
        </h4>

        {/* Struttura */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Layers className="h-3.5 w-3.5 shrink-0 text-[#4B92DB]" />
          <span>
            Titolo {article.struttura.titolo.numero} &rsaquo; Capo{" "}
            {article.struttura.capo.numero}
          </span>
          <InfoTip text="Posizione dell'articolo nella struttura del Testo Unico: il TU IVA è organizzato in Titoli e Capi tematici." />
        </div>

        {/* Vecchio codice */}
        {article.vecchio_codice && article.vecchio_codice.length > 0 && (
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-muted-foreground/70 italic">
              ex {article.vecchio_codice.join(", ")}
            </p>
            <InfoTip text="Corrispondenza con gli articoli del precedente DPR 633/1972, ora sostituito dal Testo Unico IVA." />
          </div>
        )}

        {/* Temi */}
        {article.temi.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {article.temi.slice(0, 3).map((tema) => (
              <span
                key={tema}
                className="text-xs font-medium text-[#004489]/70 bg-[#e8f1fa]/60 px-2.5 py-0.5 rounded-full"
              >
                {tema.replace(/_/g, " ")}
              </span>
            ))}
            {article.temi.length > 3 && (
              <span className="text-xs text-muted-foreground/60 px-1 py-0.5">
                +{article.temi.length - 3}
              </span>
            )}
            <InfoTip text="Aree tematiche principali trattate dall'articolo, utili per collegarlo ad altri articoli e interpelli sullo stesso argomento." />
          </div>
        )}

        {/* Commi collapsible */}
        {article.numero_commi > 0 && (
          <Collapsible open={commiOpen} onOpenChange={setCommiOpen}>
            <div className="flex items-center gap-1.5">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-1.5 text-xs font-medium text-[#4B92DB] hover:text-[#004489] transition-colors">
                  <BookOpen className="h-3.5 w-3.5" />
                  {article.numero_commi} comm
                  {article.numero_commi === 1 ? "a" : "i"}
                  {commiOpen ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </CollapsibleTrigger>
              <InfoTip text="I commi sono le suddivisioni numerate del testo normativo. Qui vedi un'anteprima; clicca 'Dettaglio' per leggere il testo integrale completo." />
            </div>
            <CollapsibleContent>
              <div className="mt-2.5 space-y-2 ml-1 pl-3.5 border-l-2 border-[#e8f1fa]">
                {article.commi.slice(0, 3).map((comma) => (
                  <div key={comma.numero} className="text-xs leading-relaxed">
                    <span className="font-mono font-semibold text-[#004489]/60">
                      c.{comma.numero}
                    </span>
                    <span className="text-muted-foreground ml-1.5 line-clamp-2">
                      {comma.testo}
                    </span>
                  </div>
                ))}
                {article.commi.length > 3 && (
                  <p className="text-xs text-muted-foreground/60 italic">
                    altri {article.commi.length - 3} commi nel dettaglio
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Riferimenti interni */}
        {article.riferimenti_interni.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <Link2 className="h-3 w-3 shrink-0" />
            <span>
              Vedi anche artt.{" "}
              {article.riferimenti_interni.slice(0, 5).join(", ")}
              {article.riferimenti_interni.length > 5 &&
                ` (+${article.riferimenti_interni.length - 5})`}
            </span>
            <InfoTip text="Altri articoli del Testo Unico IVA citati o collegati a questo articolo." />
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleDetailDialog({ article }: { article: SourceArticle }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-xs font-medium text-[#004489] bg-[#e8f1fa]/50 hover:bg-[#e8f1fa] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shrink-0">
          Dettaglio
          <ChevronRight className="h-3 w-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-5 bg-gradient-to-b from-[#e8f1fa]/40 to-transparent border-b border-border/20">
          <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
            <span className="inline-flex items-center text-xs font-bold font-mono text-[#004489] bg-[#e8f1fa] px-3 py-1.5 rounded-lg">
              Art. {article.articolo} TU IVA
            </span>
            {article.vecchio_codice && article.vecchio_codice.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground italic">
                  ex {article.vecchio_codice.join(", ")}
                </span>
                <InfoTip text="Corrispondenza con gli articoli del precedente DPR 633/1972." />
              </div>
            )}
          </div>
          <DialogTitle className="text-xl font-bold leading-tight">
            {article.titolo}
          </DialogTitle>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
            <Layers className="h-3.5 w-3.5 text-[#4B92DB]" />
            Titolo {article.struttura.titolo.numero} (
            {article.struttura.titolo.nome}) &rsaquo; Capo{" "}
            {article.struttura.capo.numero} ({article.struttura.capo.nome})
            <InfoTip text="Collocazione sistematica dell'articolo nella struttura del Testo Unico IVA." />
          </div>
          {article.temi.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              {article.temi.map((tema) => (
                <span
                  key={tema}
                  className="text-xs font-medium text-[#004489]/70 bg-[#e8f1fa]/70 px-2.5 py-1 rounded-full"
                >
                  {tema.replace(/_/g, " ")}
                </span>
              ))}
              <InfoTip text="Aree tematiche principali trattate dall'articolo." />
            </div>
          )}
        </DialogHeader>

        <ScrollArea className="px-6 pb-6 mt-5" style={{ maxHeight: "58vh" }}>
          {/* Testo integrale */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Testo integrale
              </h4>
              <InfoTip text="Testo ufficiale completo dell'articolo come pubblicato in Gazzetta Ufficiale (D.Lgs. 19 gennaio 2026, n. 10)." />
              {article.numero_commi > 0 && (
                <span className="text-xs text-muted-foreground/50 ml-auto">
                  {article.numero_commi} commi
                </span>
              )}
            </div>
            <FormattedArticleText text={article.testo_integrale} />
          </div>

          {/* Riferimenti interni */}
          {article.riferimenti_interni.length > 0 && (
            <div className="mt-8 pt-5 border-t border-border/30">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Riferimenti interni
                </h4>
                <InfoTip text="Altri articoli del Testo Unico IVA citati nel testo di questo articolo. Utili per approfondire i collegamenti normativi." />
              </div>
              <div className="flex flex-wrap gap-2">
                {article.riferimenti_interni.map((ref) => (
                  <Badge
                    key={ref}
                    variant="secondary"
                    className="font-mono text-xs bg-[#e8f1fa] text-[#004489] hover:bg-[#d0e3f5] px-2.5 py-1"
                  >
                    Art. {ref}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Citazione */}
          <div className="mt-8 pt-5 border-t border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Citazione
              </h4>
              <InfoTip text="Riferimento bibliografico ufficiale per citare questo articolo in documenti e pareri." />
            </div>
            <p className="text-xs text-muted-foreground/70 italic leading-relaxed">
              {article.citazione}
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
