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
} from "lucide-react";
import type { SourceMetadata } from "@/lib/types";

interface ResultsDisplayProps {
  streamingText: string;
  metadata: SourceMetadata | null;
}

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  normativa: {
    label: "Ricerca normativa",
    icon: <FileText className="h-3 w-3" />,
    color: "text-[#004489]",
  },
  specifica: {
    label: "Domanda specifica",
    icon: <Search className="h-3 w-3" />,
    color: "text-[#ED7203]",
  },
  generica: {
    label: "Ricerca generica",
    icon: <Zap className="h-3 w-3" />,
    color: "text-[#4B92DB]",
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
      {/* Analysis summary pill */}
      {metadata && (
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          {/* Type pill */}
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-border/40 shadow-[0_1px_2px_rgba(0,0,0,0.04)] rounded-full px-3 py-1.5 ${typeConf.color}`}
          >
            {typeConf.icon}
            {typeConf.label}
          </span>

          {/* Count pills */}
          {totalArticles > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#004489] bg-[#e8f1fa] rounded-full px-2.5 py-1.5">
              <BookOpen className="h-3 w-3" />
              {totalArticles} articol{totalArticles === 1 ? "o" : "i"}
            </span>
          )}
          {totalInterpelli > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#ED7203] bg-[#fef3e6] rounded-full px-2.5 py-1.5">
              <Gavel className="h-3 w-3" />
              {totalInterpelli} interpell{totalInterpelli === 1 ? "o" : "i"}
            </span>
          )}

          {/* Temi pills */}
          {temi.slice(0, 3).map((tema) => (
            <span
              key={tema}
              className="text-xs font-medium text-muted-foreground bg-muted/80 rounded-full px-2.5 py-1.5"
            >
              {tema.replace(/_/g, " ")}
            </span>
          ))}
          {temi.length > 3 && (
            <span className="text-xs text-muted-foreground/50 py-1.5">
              +{temi.length - 3}
            </span>
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

          {/* Timing info */}
          {metadata?.timing && streamingText && (
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground/50 px-2">
              <Clock className="h-3 w-3" />
              <span>
                Analisi {metadata.timing.analysis_ms}ms &middot; Retrieval{" "}
                {metadata.timing.retrieval_ms}ms
              </span>
            </div>
          )}
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
