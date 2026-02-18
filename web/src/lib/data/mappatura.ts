import { getTUDatabase } from "./loader";
import type { TUArticle } from "../types";
import { getArticleById } from "./articles";

interface MappedArticle {
  nuovo_articolo: string;
  nuovo_titolo: string;
  id: string;
}

let mappaCache: Map<string, MappedArticle[]> | null = null;

function ensureMap() {
  if (mappaCache) return;
  const db = getTUDatabase();
  mappaCache = new Map();

  for (const [key, values] of Object.entries(
    db.mappatura_vecchio_nuovo_codice
  )) {
    mappaCache.set(key.toLowerCase(), values);

    const match = key.match(/^(.+?)\s+art\.\s*(\d+.*)$/i);
    if (match) {
      const norma = match[1].trim();
      const articolo = match[2].trim();
      mappaCache.set(`art. ${articolo} ${norma}`.toLowerCase(), values);
      mappaCache.set(`articolo ${articolo} ${norma}`.toLowerCase(), values);
    }
  }
}

export function mapOldToNew(oldRef: string): TUArticle[] {
  ensureMap();
  const normalized = oldRef.toLowerCase().trim();
  const mapped = mappaCache!.get(normalized);
  if (!mapped) return [];

  return mapped
    .map((m) => getArticleById(m.id))
    .filter((a): a is TUArticle => a !== undefined);
}

export function extractOldCodeRefs(text: string): string[] {
  const patterns = [
    /art(?:icolo)?\.?\s*(\d+)\s+(?:del\s+)?DPR\s+633(?:\/(?:19)?72)?/gi,
    /DPR\s+633(?:\/(?:19)?72)?\s*,?\s*art(?:icolo)?\.?\s*(\d+)/gi,
    /D\.?P\.?R\.?\s+633(?:\/(?:19)?72)?\s*,?\s*art(?:icolo)?\.?\s*(\d+)/gi,
  ];

  const refs: string[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const artNum = match[1];
      refs.push(`DPR 633/1972 art. ${artNum}`);
    }
  }

  return [...new Set(refs)];
}
