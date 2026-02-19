import type { QueryAnalysis, RetrievalResult } from "../types";
import { getArticlesByTema } from "../data/articles";
import { getInterpelliByTemi } from "../data/interpelli";

export function executeMetadataFilter(analysis: QueryAnalysis): {
  tuResults: RetrievalResult[];
  ipResults: RetrievalResult[];
} {
  if (analysis.temi_probabili.length === 0) {
    return { tuResults: [], ipResults: [] };
  }

  // Articles matching identified temi
  const matchingArticles = new Map<string, RetrievalResult>();
  for (const tema of analysis.temi_probabili) {
    const articles = getArticlesByTema(tema);
    for (const art of articles) {
      if (!matchingArticles.has(art.id)) {
        const temiOverlap = art.temi.filter((t) =>
          analysis.temi_probabili.includes(t)
        ).length;
        const score =
          temiOverlap / Math.max(analysis.temi_probabili.length, 1);

        matchingArticles.set(art.id, {
          id: art.id,
          type: "tu_article",
          score,
          source: "metadata_filter",
          article: art,
        });
      }
    }
  }

  // Interpelli matching temi, filtered by anno and tag
  let matchingInterpelli = getInterpelliByTemi(analysis.temi_probabili);

  if (analysis.filtri_suggeriti.anno_min) {
    matchingInterpelli = matchingInterpelli.filter(
      (ip) => ip.anno >= analysis.filtri_suggeriti.anno_min!
    );
  }
  if (
    analysis.filtri_suggeriti.tag &&
    analysis.filtri_suggeriti.tag.length > 0
  ) {
    const tagSet = new Set(analysis.filtri_suggeriti.tag);
    matchingInterpelli = matchingInterpelli.filter((ip) =>
      tagSet.has(ip.tag)
    );
  }

  const ipResults: RetrievalResult[] = matchingInterpelli.map((ip) => {
    const temiOverlap = ip.temi.filter((t) =>
      analysis.temi_probabili.includes(t)
    ).length;
    return {
      id: ip.id,
      type: "interpello" as const,
      score:
        (temiOverlap / Math.max(analysis.temi_probabili.length, 1)) * 0.7,
      source: "metadata_filter" as const,
      interpello: ip,
    };
  });

  // Limit Path C interpelli to top 5 by score to avoid flooding fusion with noise
  const sortedIpResults = ipResults
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    tuResults: Array.from(matchingArticles.values()),
    ipResults: sortedIpResults,
  };
}
