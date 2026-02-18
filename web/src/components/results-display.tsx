"use client";

import { StreamingText } from "./streaming-text";
import { ArticleCard } from "./article-card";
import { InterpelloCard } from "./interpello-card";
import {
  Clock,
  BookOpen,
  Gavel,
  Zap,
  Search,
  FileText,
  Tag,
} from "lucide-react";
import type { SourceMetadata } from "@/lib/types";

interface ResultsDisplayProps {
  streamingText: string;
  metadata: SourceMetadata | null;
}

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  normativa: {
    label: "Ricerca normativa",
    icon: <FileText className="h-4 w-4" />,
    color: "text-[#004489]",
    bg: "bg-[#e8f1fa]",
  },
  specifica: {
    label: "Domanda specifica",
    icon: <Search className="h-4 w-4" />,
    color: "text-[#ED7203]",
    bg: "bg-[#fef3e6]",
  },
  generica: {
    label: "Ricerca generica",
    icon: <Zap className="h-4 w-4" />,
    color: "text-[#4B92DB]",
    bg: "bg-[#e8f1fa]",
  },
};

export function ResultsDisplay({
  streamingText,
  metadata,
}: ResultsDisplayProps) {
  const queryType = metadata?.queryAnalysis?.tipo_query ?? "generica";
  const typeConf = TYPE_CONFIG[queryType] ?? TYPE_CONFIG.generica;
  const totalArticles = metadata?.sources.articles.length ?? 0;
  const totalInterpelli = metadata?.sources.interpelli.length ?? 0;
  const temi = metadata?.queryAnalysis?.temi_probabili ?? [];

  return (
    <div className="mt-6">
      {/* Analysis summary card */}
      {metadata && (
        <div className="mb-6 bg-white rounded-2xl border border-border/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Main row: type + stats + timing */}
          <div className="px-5 py-4 flex items-center gap-5 flex-wrap">
            {/* Query type badge */}
            <div
              className={`inline-flex items-center gap-2 text-sm font-bold ${typeConf.color} ${typeConf.bg} px-4 py-2 rounded-xl`}
            >
              {typeConf.icon}
              {typeConf.label}
            </div>

            {/* Vertical divider */}
            {(totalArticles > 0 || totalInterpelli > 0) && (
              <div className="h-8 w-px bg-border/40 hidden sm:block" />
            )}

            {/* Stats */}
            <div className="flex items-center gap-5">
              {totalArticles > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#e8f1fa] flex items-center justify-center">
                    <BookOpen className="h-3.5 w-3.5 text-[#004489]" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-[#004489] tabular-nums">
                      {totalArticles}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      articol{totalArticles === 1 ? "o" : "i"}
                    </span>
                  </div>
                </div>
              )}
              {totalInterpelli > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#fef3e6] flex items-center justify-center">
                    <Gavel className="h-3.5 w-3.5 text-[#ED7203]" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-[#ED7203] tabular-nums">
                      {totalInterpelli}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      interpell{totalInterpelli === 1 ? "o" : "i"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Timing - pushed right */}
            {metadata.timing && (
              <div className="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground/50">
                <Clock className="h-3 w-3" />
                <span className="tabular-nums">
                  {metadata.timing.analysis_ms + metadata.timing.retrieval_ms}ms
                </span>
              </div>
            )}
          </div>

          {/* Temi strip */}
          {temi.length > 0 && (
            <div className="px-5 py-2.5 bg-muted/30 border-t border-border/20 flex items-center gap-2 flex-wrap">
              <Tag className="h-3 w-3 text-muted-foreground/40 shrink-0" />
              {temi.slice(0, 5).map((tema) => (
                <span
                  key={tema}
                  className="text-xs font-medium text-muted-foreground bg-white border border-border/30 rounded-full px-2.5 py-0.5 shadow-[0_0.5px_1px_rgba(0,0,0,0.03)]"
                >
                  {tema.replace(/_/g, " ")}
                </span>
              ))}
              {temi.length > 5 && (
                <span className="text-xs text-muted-foreground/40">
                  +{temi.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main layout: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Left: streaming markdown response */}
        <div className="min-w-0">
          <div className="bg-white rounded-2xl border border-border/30 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 lg:p-8">
            <StreamingText text={streamingText} />
          </div>
        </div>

        {/* Right: sources sidebar */}
        {metadata && (totalArticles > 0 || totalInterpelli > 0) && (
          <aside className="space-y-6">
            {/* TU IVA Articles */}
            {totalArticles > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="h-5 w-5 rounded-md bg-[#e8f1fa] flex items-center justify-center">
                    <BookOpen className="h-3 w-3 text-[#004489]" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground tracking-tight">
                    Articoli TU IVA
                  </h3>
                </div>
                <div className="space-y-3">
                  {metadata.sources.articles.map((art) => (
                    <ArticleCard key={art.id} article={art} />
                  ))}
                </div>
              </div>
            )}

            {/* Interpelli */}
            {totalInterpelli > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="h-5 w-5 rounded-md bg-[#fef3e6] flex items-center justify-center">
                    <Gavel className="h-3 w-3 text-[#ED7203]" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground tracking-tight">
                    Interpelli AdE
                  </h3>
                </div>
                <div className="space-y-3">
                  {metadata.sources.interpelli.map((ip) => (
                    <InterpelloCard key={ip.id} interpello={ip} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
