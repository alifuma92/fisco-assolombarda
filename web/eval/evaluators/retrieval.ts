import type { SourceMetadata } from "../../src/lib/types";
import type { GroundTruth, RetrievalMetrics } from "../types";

export function evaluateRetrieval(
  metadata: SourceMetadata,
  groundTruth: GroundTruth
): RetrievalMetrics {
  const returnedArticleIds = metadata.sources.articles.map((a) => a.id);
  const returnedInterpelliIds = metadata.sources.interpelli.map((i) => i.id);

  // "Relevant" = required + acceptable (for precision)
  const relevantArticles = new Set([
    ...groundTruth.expected_articles,
    ...(groundTruth.acceptable_articles || []),
  ]);
  const relevantInterpelli = new Set([
    ...groundTruth.expected_interpelli,
    ...(groundTruth.acceptable_interpelli || []),
  ]);

  // Precision: fraction of returned results that are relevant
  const artPrecision =
    returnedArticleIds.length > 0
      ? returnedArticleIds.filter((id) => relevantArticles.has(id)).length /
        returnedArticleIds.length
      : groundTruth.expected_articles.length === 0
        ? 1.0
        : 0.0;

  // Recall: fraction of REQUIRED results that were returned
  const artRecall =
    groundTruth.expected_articles.length > 0
      ? groundTruth.expected_articles.filter((id) =>
          returnedArticleIds.includes(id)
        ).length / groundTruth.expected_articles.length
      : 1.0;

  const ipPrecision =
    returnedInterpelliIds.length > 0
      ? returnedInterpelliIds.filter((id) => relevantInterpelli.has(id))
          .length / returnedInterpelliIds.length
      : groundTruth.expected_interpelli.length === 0
        ? 1.0
        : 0.0;

  const ipRecall =
    groundTruth.expected_interpelli.length > 0
      ? groundTruth.expected_interpelli.filter((id) =>
          returnedInterpelliIds.includes(id)
        ).length / groundTruth.expected_interpelli.length
      : 1.0;

  // MRR: 1/rank of first relevant result
  const artMRR = computeMRR(returnedArticleIds, groundTruth.expected_articles);
  const ipMRR = computeMRR(
    returnedInterpelliIds,
    groundTruth.expected_interpelli
  );

  const artF1 = computeF1(artPrecision, artRecall);
  const ipF1 = computeF1(ipPrecision, ipRecall);

  // Query classification check
  const classificationCorrect = groundTruth.expected_tipo_query
    ? metadata.queryAnalysis.tipo_query === groundTruth.expected_tipo_query
    : true;

  // Temi overlap
  const temiOverlap =
    groundTruth.expected_temi && groundTruth.expected_temi.length > 0
      ? groundTruth.expected_temi.filter((t) =>
          metadata.queryAnalysis.temi_probabili.includes(t)
        ).length / groundTruth.expected_temi.length
      : 1.0;

  return {
    article_precision: artPrecision,
    article_recall: artRecall,
    interpello_precision: ipPrecision,
    interpello_recall: ipRecall,
    article_mrr: artMRR,
    interpello_mrr: ipMRR,
    article_f1: artF1,
    interpello_f1: ipF1,
    query_classification_correct: classificationCorrect,
    temi_overlap_ratio: temiOverlap,
  };
}

function computeMRR(returned: string[], expected: string[]): number {
  if (expected.length === 0) return 1.0;
  const expectedSet = new Set(expected);
  for (let i = 0; i < returned.length; i++) {
    if (expectedSet.has(returned[i])) return 1 / (i + 1);
  }
  return 0;
}

function computeF1(precision: number, recall: number): number {
  if (precision + recall === 0) return 0;
  return (2 * precision * recall) / (precision + recall);
}
