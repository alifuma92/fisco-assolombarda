"use client";

import { StreamingText } from "./streaming-text";
import { ArticleCard } from "./article-card";
import { InterpelloCard } from "./interpello-card";
import { BookOpen, Gavel, Sparkles } from "lucide-react";
import type { SourceMetadata } from "@/lib/types";

interface ResultsDisplayProps {
  streamingText: string;
  metadata: SourceMetadata | null;
  streamingDone: boolean;
}

export function ResultsDisplay({
  streamingText,
  metadata,
  streamingDone,
}: ResultsDisplayProps) {
  const totalArticles = metadata?.sources.articles.length ?? 0;
  const totalInterpelli = metadata?.sources.interpelli.length ?? 0;
  const hasSources = totalArticles > 0 || totalInterpelli > 0;

  return (
    <div>
      {/* ── AI Response ── */}
      <div className={streamingDone && hasSources ? "mb-10" : ""}>
        <div className="glass-strong rounded-2xl border border-white/30 p-6 sm:p-8">
          <div className="flex items-center gap-1.5 mb-4">
            <Sparkles className="h-3 w-3 text-[#4B92DB]/40" />
            <span className="text-[11px] font-semibold text-muted-foreground/35 uppercase tracking-widest">
              Da Fisco AI
            </span>
          </div>
          <StreamingText text={streamingText} />
        </div>
      </div>

      {/* ── Sources — two-column dashboard ── */}
      {streamingDone && metadata && hasSources && (
        <div>
          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border/30" />
            <h2 className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest shrink-0">
              Fonti consultate
            </h2>
            <div className="h-px flex-1 bg-border/30" />
          </div>

          {/* Two-column layout: Articles | Interpelli */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Articles column */}
            {totalArticles > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 rounded-lg bg-[#e8f1fa] flex items-center justify-center">
                    <BookOpen className="h-3.5 w-3.5 text-[#004489]" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground tracking-tight">
                    Articoli TU IVA
                  </h3>
                  <span className="text-xs font-semibold text-[#004489]/50 bg-[#e8f1fa]/60 px-2 py-0.5 rounded-md tabular-nums">
                    {totalArticles}
                  </span>
                </div>
                <div className="space-y-3">
                  {metadata.sources.articles.map((art) => (
                    <ArticleCard key={art.id} article={art} />
                  ))}
                </div>
              </div>
            )}

            {/* Interpelli column */}
            {totalInterpelli > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 rounded-lg bg-[#fef3e6] flex items-center justify-center">
                    <Gavel className="h-3.5 w-3.5 text-[#ED7203]" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground tracking-tight">
                    Interpelli AdE
                  </h3>
                  <span className="text-xs font-semibold text-[#ED7203]/50 bg-[#fef3e6]/60 px-2 py-0.5 rounded-md tabular-nums">
                    {totalInterpelli}
                  </span>
                </div>
                <div className="space-y-3">
                  {metadata.sources.interpelli.map((ip) => (
                    <InterpelloCard key={ip.id} interpello={ip} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
