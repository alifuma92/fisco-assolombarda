import { getTUDatabase } from "./loader";
import type { TUArticle } from "../types";

let byIdIndex: Map<string, TUArticle> | null = null;
let byArticoloIndex: Map<string, TUArticle> | null = null;

function ensureIndexes() {
  if (byIdIndex) return;
  const db = getTUDatabase();
  byIdIndex = new Map();
  byArticoloIndex = new Map();
  for (const art of db.articoli) {
    byIdIndex.set(art.id, art);
    byArticoloIndex.set(art.articolo, art);
  }
}

export function getArticleById(id: string): TUArticle | undefined {
  ensureIndexes();
  return byIdIndex!.get(id);
}

export function getArticleByNumber(articolo: string): TUArticle | undefined {
  ensureIndexes();
  return byArticoloIndex!.get(articolo);
}

export function getArticlesByTema(tema: string): TUArticle[] {
  const db = getTUDatabase();
  const temaIndex = db.indice_tematico[tema];
  if (!temaIndex) return [];
  return temaIndex
    .map((entry) => getArticleById(entry.id))
    .filter((a): a is TUArticle => a !== undefined);
}

export function getLinkedInterpelli(
  articleId: string
): Array<{ id: string; numero: number; anno: number; oggetto: string }> {
  const db = getTUDatabase();
  return db.interpelli_collegati[articleId] || [];
}
