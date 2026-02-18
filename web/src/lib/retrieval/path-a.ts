import type { QueryAnalysis, RetrievalResult } from "../types";
import { mapOldToNew } from "../data/mappatura";
import { getArticleByNumber, getArticleById, getLinkedInterpelli } from "../data/articles";
import { getInterpelloByNumeroAnno, getInterpelloById } from "../data/interpelli";

const CROSS_REF_SCORE = 0.8;

export function executeLookup(analysis: QueryAnalysis): RetrievalResult[] {
  const results: RetrievalResult[] = [];
  const seenArticleIds = new Set<string>();
  const seenInterpelloIds = new Set<string>();

  // ── Primary lookups ──

  // 1. Map old code references to new TU articles
  for (const oldRef of analysis.riferimenti_normativi.vecchio_codice) {
    const articles = mapOldToNew(oldRef);
    for (const art of articles) {
      if (!seenArticleIds.has(art.id)) {
        seenArticleIds.add(art.id);
        results.push({
          id: art.id,
          type: "tu_article",
          score: 1.0,
          source: "lookup",
          article: art,
        });
      }
    }
  }

  // 2. Direct TU IVA references
  for (const tuRef of analysis.riferimenti_normativi.tu_iva) {
    const numMatch = tuRef.match(/(\d+)/);
    if (!numMatch) continue;
    const art = getArticleByNumber(numMatch[1]);
    if (art && !seenArticleIds.has(art.id)) {
      seenArticleIds.add(art.id);
      results.push({
        id: art.id,
        type: "tu_article",
        score: 1.0,
        source: "lookup",
        article: art,
      });
    }
  }

  // 3. Direct interpello references
  for (const ipRef of analysis.riferimenti_normativi.interpelli) {
    const ip = getInterpelloByNumeroAnno(ipRef.numero, ipRef.anno);
    if (ip && !seenInterpelloIds.has(ip.id)) {
      seenInterpelloIds.add(ip.id);
      results.push({
        id: ip.id,
        type: "interpello",
        score: 1.0,
        source: "lookup",
        interpello: ip,
      });
    }
  }

  // ── Cross-reference enrichment ──

  // 4. For each found article → fetch linked interpelli
  for (const artId of [...seenArticleIds]) {
    const linked = getLinkedInterpelli(artId);
    for (const link of linked) {
      if (!seenInterpelloIds.has(link.id)) {
        seenInterpelloIds.add(link.id);
        const ip = getInterpelloById(link.id);
        if (ip) {
          results.push({
            id: ip.id,
            type: "interpello",
            score: CROSS_REF_SCORE,
            source: "lookup",
            interpello: ip,
          });
        }
      }
    }
  }

  // 5. For each found interpello → fetch linked TU articles
  for (const result of results) {
    if (result.type !== "interpello" || !result.interpello) continue;
    for (const artRef of result.interpello.articoli_tu_iva_collegati) {
      if (!seenArticleIds.has(artRef)) {
        seenArticleIds.add(artRef);
        const art = getArticleById(artRef);
        if (art) {
          results.push({
            id: art.id,
            type: "tu_article",
            score: CROSS_REF_SCORE,
            source: "lookup",
            article: art,
          });
        }
      }
    }
  }

  return results;
}
