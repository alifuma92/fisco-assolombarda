"use client";

import { useState } from "react";
import { Search, Loader2, ArrowRight } from "lucide-react";

interface SearchInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function SearchInput({ onSubmit, isLoading }: SearchInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-3 bg-white rounded-2xl px-5 h-14 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow duration-200">
        <Search className="h-[18px] w-[18px] shrink-0 text-[#004489]/40" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Fai una domanda su IVA, normativa, interpelli..."
          className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus-visible:outline-none font-medium"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="flex items-center gap-1.5 bg-[#004489] hover:bg-[#003366] disabled:opacity-30 disabled:hover:bg-[#004489] text-white text-sm font-semibold px-5 h-9 rounded-xl transition-all duration-150 shrink-0 cursor-pointer disabled:cursor-default"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Cerca
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
