"use client";

import { useState } from "react";
import { Search, Loader2, ArrowRight } from "lucide-react";

interface SearchInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function SearchInput({ onSubmit, isLoading }: SearchInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`flex items-center gap-3 bg-white rounded-2xl px-5 h-[52px] shadow-sm border transition-all duration-200 ${
          focused
            ? "border-[#4B92DB] shadow-[0_0_0_3px_rgba(75,146,219,0.12)]"
            : "border-border/60 hover:border-border"
        }`}
      >
        <Search
          className={`h-[18px] w-[18px] shrink-0 transition-colors ${focused ? "text-[#004489]" : "text-muted-foreground/50"}`}
        />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Cerca normativa IVA, interpelli, o fai una domanda..."
          className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-medium"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="flex items-center gap-1.5 bg-[#004489] hover:bg-[#003366] disabled:opacity-40 disabled:hover:bg-[#004489] text-white text-sm font-semibold px-5 h-9 rounded-xl transition-all duration-150 shrink-0"
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
