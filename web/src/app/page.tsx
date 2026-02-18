"use client";

import { SearchInput } from "@/components/search-input";
import { ResultsDisplay } from "@/components/results-display";
import { ExampleQueries } from "@/components/example-queries";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useQuery } from "@/hooks/use-query";
import { RotateCcw, BookOpen, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { submit, isLoading, streamingText, metadata, error, reset } =
    useQuery();

  const hasResults = streamingText || metadata;

  return (
    <main className="min-h-screen bg-background">
      {/* Header with gradient */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#004489] via-[#003366] to-[#004489]" />
        <div className="absolute inset-0 bg-pattern" />
        <div className="relative px-4 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo mark */}
              <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                  RAG Fiscale
                </h1>
                <p className="text-xs text-white/60 leading-tight font-medium tracking-wide">
                  TESTO UNICO IVA &middot; INTERPELLI AdE 2024-2025
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-xs">
              <span className="flex items-center gap-1.5 text-white/70">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="font-semibold text-white">171</span> articoli
              </span>
              <span className="flex items-center gap-1.5 text-white/70">
                <Gavel className="h-3.5 w-3.5" />
                <span className="font-semibold text-white">544</span>{" "}
                interpelli
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content area */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Search bar - elevated above content */}
        <div className="-mt-0 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SearchInput onSubmit={submit} isLoading={isLoading} />
            </div>
            {hasResults && !isLoading && (
              <Button
                variant="outline"
                size="icon"
                onClick={reset}
                className="h-[52px] w-[52px] shrink-0 rounded-xl bg-white shadow-sm border-border/60 hover:bg-accent"
                title="Nuova ricerca"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Example queries - centered, inviting */}
        {!hasResults && !isLoading && !error && (
          <ExampleQueries onSelect={submit} />
        )}

        {/* Loading state */}
        {isLoading && !streamingText && <LoadingSkeleton />}

        {/* Results */}
        {hasResults && (
          <ResultsDisplay streamingText={streamingText} metadata={metadata} />
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 pb-6 text-center text-xs text-muted-foreground/50">
        D.Lgs. 19 gennaio 2026, n. 10 &middot; Powered by RAG
      </footer>
    </main>
  );
}
