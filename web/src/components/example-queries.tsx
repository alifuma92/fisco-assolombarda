"use client";

import { EXAMPLE_QUERIES } from "@/lib/constants";

interface ExampleQueriesProps {
  onSelect: (query: string) => void;
}

export function ExampleQueries({ onSelect }: ExampleQueriesProps) {
  return (
    <div>
      <p className="text-center text-[10px] font-bold text-muted-foreground/35 uppercase tracking-[0.15em] mb-3">
        Domande di esempio
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLE_QUERIES.map((query) => (
          <button
            key={query}
            onClick={() => onSelect(query)}
            className="text-[12px] font-medium text-muted-foreground/60 hover:text-[#004489] bg-white/50 hover:bg-[#e8f1fa]/50 border border-[#e2e8f0]/60 hover:border-[#4B92DB]/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}
