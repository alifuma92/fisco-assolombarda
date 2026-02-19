import type {
  RetrievalResult,
  FusedResults,
  QueryAnalysis,
} from "../types";
import { getLinkedInterpelli } from "../data/articles";
import { FINAL_LIMITS } from "../constants";

export function fuseAndRerank(
  pathAResults: RetrievalResult[],
  pathBTu: RetrievalResult[],
  pathBIp: RetrievalResult[],
  pathCTu: RetrievalResult[],
  pathCIp: RetrievalResult[],
  analysis: QueryAnalysis
): FusedResults {
  const allArticles = new Map<string, RetrievalResult>();
  const allInterpelli = new Map<string, RetrievalResult>();

  // When a result appears in multiple paths, COMBINE scores instead of keeping max.
  // This rewards results found by both semantic search AND metadata filtering.
  function addResult(result: RetrievalResult) {
    const pool =
      result.type === "tu_article" ? allArticles : allInterpelli;
    const existing = pool.get(result.id);
    if (!existing) {
      pool.set(result.id, { ...result });
    } else {
      // Combine: keep the higher base score + add a multi-path bonus
      existing.score = Math.max(existing.score, result.score) + 0.1;
      // Keep the source label from the highest-scoring path
      if (result.score > existing.score - 0.1) {
        existing.source = result.source;
      }
    }
  }

  // Path A first (lookup = highest confidence)
  pathAResults.forEach(addResult);
  // Path B (semantic search)
  pathBTu.forEach(addResult);
  pathBIp.forEach(addResult);
  // Path C (metadata filter) — scale down scores to not overpower semantic results.
  // Articles get a higher weight (0.65) because metadata-matched articles are generally
  // more relevant than metadata-matched interpelli; this helps surface key articles
  // that semantic search may rank lower (e.g., broad articles like Art. 37 "operazioni esenti").
  for (const r of pathCTu) {
    addResult({ ...r, score: r.score * 0.65 });
  }
  for (const r of pathCIp) {
    addResult({ ...r, score: r.score * 0.5 });
  }

  // Bonus 1: Path A exact matches get +0.5
  for (const result of allArticles.values()) {
    if (result.source === "lookup") result.score += 0.5;
  }
  for (const result of allInterpelli.values()) {
    if (result.source === "lookup") result.score += 0.5;
  }

  // Bonus 2: Recent interpelli (2025) get +0.05
  for (const result of allInterpelli.values()) {
    if (result.interpello?.anno === 2025) result.score += 0.05;
  }

  // Bonus 3: Cross-reference bonus (interpello linked to a found article): +0.1
  const foundArticleIds = new Set(allArticles.keys());
  const linkedInterpelloIds = new Set<string>();

  for (const artId of foundArticleIds) {
    const linked = getLinkedInterpelli(artId);
    for (const link of linked) {
      linkedInterpelloIds.add(link.id);
    }
  }

  for (const result of allInterpelli.values()) {
    if (linkedInterpelloIds.has(result.id)) result.score += 0.1;
  }

  // Bonus 4: Tema overlap bonus for interpelli: +0.02 per matching tema
  if (analysis.temi_probabili.length > 0) {
    const queryTemi = new Set(analysis.temi_probabili);
    for (const result of allInterpelli.values()) {
      if (result.interpello) {
        const overlap = result.interpello.temi.filter((t) =>
          queryTemi.has(t)
        ).length;
        if (overlap > 0) result.score += 0.02 * overlap;
      }
    }
  }

  // Bonus 5: Article temi relevance — reward articles matching query temi,
  // penalize semantic-only results with zero temi overlap (likely noise).
  // This ensures topically relevant articles (e.g., Art. 37 "operazioni esenti"
  // for a query about esenzioni) beat generic articles that happen to score
  // high on embedding similarity (e.g., Art. 5 "cessioni di beni").
  if (analysis.temi_probabili.length >= 2) {
    const queryTemi = new Set(analysis.temi_probabili);
    for (const result of allArticles.values()) {
      if (result.article) {
        const overlap = result.article.temi.filter((t: string) =>
          queryTemi.has(t)
        ).length;
        const ratio = overlap / queryTemi.size;
        if (ratio >= 1.0) {
          // Full match: article covers all identified themes — very likely the key article
          result.score += 0.3;
        } else if (ratio >= 0.5) {
          // Partial match: some thematic relevance
          result.score += 0.1;
        } else if (overlap === 0 && result.source !== "lookup") {
          // Zero overlap with no direct reference: likely noise from semantic search
          result.score *= 0.7;
        }
      }
    }
  }

  // For generica queries (broad topics), prioritize articles over interpelli.
  // Generica queries need broader normativa coverage, while interpelli add noise.
  const isGenerica = analysis.tipo_query === "generica";
  const maxArticles = isGenerica ? FINAL_LIMITS.articles + 1 : FINAL_LIMITS.articles;
  const maxInterpelli = isGenerica ? Math.max(1, FINAL_LIMITS.interpelli - 1) : FINAL_LIMITS.interpelli;

  const sortedArticles = Array.from(allArticles.values())
    .filter((r) => r.score >= FINAL_LIMITS.minScoreArticles)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxArticles);

  const sortedInterpelli = Array.from(allInterpelli.values())
    .filter((r) => r.score >= FINAL_LIMITS.minScoreInterpelli)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxInterpelli);

  return {
    articles: sortedArticles,
    interpelli: sortedInterpelli,
    totalCandidates: allArticles.size + allInterpelli.size,
  };
}
