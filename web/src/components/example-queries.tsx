"use client";

import { EXAMPLE_QUERIES } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";

interface ExampleQueriesProps {
  onSelect: (query: string) => void;
}

export function ExampleQueries({ onSelect }: ExampleQueriesProps) {
  return (
    <div className="mt-12 max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Come posso aiutarti?
        </h2>
        <p className="text-sm text-muted-foreground">
          Seleziona una domanda o scrivi la tua nella barra di ricerca
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXAMPLE_QUERIES.map((query) => (
          <button
            key={query}
            onClick={() => onSelect(query)}
            className="card-hover group flex items-start gap-3 text-left p-4 rounded-xl bg-white border border-border/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#4B92DB]/30 transition-all"
          >
            <div className="shrink-0 mt-0.5 h-7 w-7 rounded-lg bg-[#e8f1fa] flex items-center justify-center group-hover:bg-[#004489] transition-colors">
              <ArrowUpRight className="h-3.5 w-3.5 text-[#004489] group-hover:text-white transition-colors" />
            </div>
            <span className="text-[13px] leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors font-medium">
              {query}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
