"use client";

import { useState, useCallback } from "react";
import { SearchInput } from "@/components/search-input";
import { ResultsDisplay } from "@/components/results-display";
import { ExampleQueries } from "@/components/example-queries";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useQuery } from "@/hooks/use-query";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookOpen, Gavel, Sparkles, Zap, HelpCircle } from "lucide-react";
import Link from "next/link";

const QUERY_TYPE_CONFIG: Record<
  string,
  { label: string; style: string; tooltip: string }
> = {
  normativa: {
    label: "Domanda normativa",
    style: "bg-[#e8f1fa] text-[#004489]/60",
    tooltip: "Il sistema ha identificato riferimenti normativi espliciti. La ricerca privilegia il lookup diretto.",
  },
  specifica: {
    label: "Domanda specifica",
    style: "bg-[#fef3e6] text-[#ED7203]/70",
    tooltip: "Domanda su un caso specifico. La risposta combina normativa e prassi interpretativa.",
  },
  generica: {
    label: "Domanda generica",
    style: "bg-[#e8f1fa]/60 text-[#4B92DB]/60",
    tooltip: "Ricerca ampia su tematiche IVA. Il sistema ha cercato articoli e interpelli correlati.",
  },
};

export default function HomePage() {
  const { submit, isLoading, streamingText, metadata, error, reset, streamingDone } =
    useQuery();

  const [currentQuery, setCurrentQuery] = useState("");

  const hasResults = streamingText || metadata;
  const showResultsLayout =
    hasResults || isLoading || (error != null && currentQuery !== "");

  const handleSubmit = useCallback(
    (query: string) => {
      setCurrentQuery(query);
      submit(query);
    },
    [submit]
  );

  const handleReset = useCallback(() => {
    setCurrentQuery("");
    reset();
  }, [reset]);

  /* ─── Hero / landing state ─── */
  if (!showResultsLayout) {
    return (
      <main className="min-h-screen relative flex flex-col">
        <div className="gradient-mesh">
          <div className="gradient-mesh-inner" />
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 py-12">
          <div className="w-full max-w-3xl mx-auto">
            {/* ── Branding ── */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#004489]/50 bg-[#e8f1fa]/60 px-3.5 py-1.5 rounded-full mb-6 tracking-wide uppercase">
                <Sparkles className="h-3 w-3" />
                Assistente AI per il fisco italiano
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gradient mb-4 leading-[1.1]">
                Fisco AI
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed whitespace-nowrap">
                Interroga il <strong className="text-foreground">Testo Unico IVA</strong> e gli <strong className="text-foreground">Interpelli dell&apos;Agenzia delle Entrate</strong>
              </p>
            </div>

            {/* ── Search CTA ── */}
            <div className="mb-6">
              <SearchInput onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* ── Example queries ── */}
            <ExampleQueries onSelect={handleSubmit} />

            {/* ── Stats strip ── */}
            <div className="flex items-center justify-center gap-6 mt-10">
              <div className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-[#004489]/40" />
                <span className="text-xs text-muted-foreground/50">
                  <span className="font-bold text-foreground/40 tabular-nums">171</span> articoli TU IVA
                </span>
              </div>
              <div className="h-3 w-px bg-border/30" />
              <div className="flex items-center gap-2">
                <Gavel className="h-3.5 w-3.5 text-[#ED7203]/40" />
                <span className="text-xs text-muted-foreground/50">
                  <span className="font-bold text-foreground/40 tabular-nums">544</span> interpelli AdE
                </span>
              </div>
              <div className="h-3 w-px bg-border/30" />
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-[#4B92DB]/40" />
                <span className="text-xs text-muted-foreground/50">Ricerca semantica</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="pb-6 text-center space-y-2">
          <Link
            href="/come-funziona"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground/50 hover:text-[#004489] transition-colors"
          >
            <HelpCircle className="h-3 w-3" />
            Come funziona
          </Link>
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

  /* ─── Results state ─── */
  return (
    <main className="min-h-screen relative">
      <div className="gradient-mesh">
        <div className="gradient-mesh-inner" />
      </div>

      {/* Sticky query header */}
      <div className="sticky top-0 z-30 query-header-frost">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          {/* Row 1: label + badge (left) — action (right) */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                Hai chiesto
              </span>
              {metadata && (() => {
                const qt = metadata.queryAnalysis?.tipo_query ?? "generica";
                const conf = QUERY_TYPE_CONFIG[qt] ?? QUERY_TYPE_CONFIG.generica;
                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-default ${conf.style}`}>
                        {conf.label}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[260px] text-xs leading-relaxed">
                      <p>{conf.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })()}
            </div>
            {!isLoading && (
              <button
                onClick={handleReset}
                className="text-[13px] font-semibold text-[#004489] hover:text-[#003366] transition-colors"
              >
                Nuova ricerca
              </button>
            )}
          </div>
          {/* Row 2: query text, full width */}
          <p className="text-sm sm:text-[15px] font-semibold text-foreground leading-snug truncate">
            {currentQuery}
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Content */}
        {isLoading && !streamingText && <LoadingSkeleton />}
        {hasResults && (
          <ResultsDisplay streamingText={streamingText} metadata={metadata} streamingDone={streamingDone} />
        )}
        {error && (
          <div className="mt-6 p-4 glass rounded-xl border border-red-200/50 text-sm text-red-700 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}
      </div>

      <footer className="mt-16 pb-6 text-center space-y-2">
        <Link
          href="/come-funziona"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground/50 hover:text-[#004489] transition-colors"
        >
          <HelpCircle className="h-3 w-3" />
          Come funziona
        </Link>
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
