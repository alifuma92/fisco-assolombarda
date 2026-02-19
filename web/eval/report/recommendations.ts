import type { TestCaseResult, Weakness } from "../types";
import { EVAL_CONFIG } from "../config";

export function generateRecommendations(results: TestCaseResult[]): {
  recommendations: string[];
  weaknesses: Weakness[];
} {
  const weaknesses: Weakness[] = [];
  const recommendations: string[] = [];

  // 1. Retrieval recall failures (articles)
  const lowArticleRecall = results.filter(
    (r) =>
      r.retrieval_metrics.article_recall < 0.5 &&
      r.test_case.ground_truth.expected_articles.length > 0
  );
  if (lowArticleRecall.length > 0) {
    weaknesses.push({
      area: "Article Retrieval Recall",
      severity: lowArticleRecall.length > 3 ? "high" : "medium",
      description: `${lowArticleRecall.length} casi hanno article recall <50%. Articoli attesi non trovati.`,
      affected_cases: lowArticleRecall.map((r) => r.test_case.id),
    });
    recommendations.push(
      `Article recall sotto il 50% per ${lowArticleRecall.length} casi. ` +
        `Valutare: abbassare minScoreArticles o aumentare topK.tuIva.`
    );
  }

  // 2. Retrieval recall failures (interpelli)
  const lowIPRecall = results.filter(
    (r) =>
      r.retrieval_metrics.interpello_recall < 0.5 &&
      r.test_case.ground_truth.expected_interpelli.length > 0
  );
  if (lowIPRecall.length > 0) {
    weaknesses.push({
      area: "Interpello Retrieval Recall",
      severity: lowIPRecall.length > 3 ? "high" : "medium",
      description: `${lowIPRecall.length} casi hanno interpello recall <50%. Interpelli attesi non trovati.`,
      affected_cases: lowIPRecall.map((r) => r.test_case.id),
    });
    recommendations.push(
      `Interpello recall sotto il 50% per ${lowIPRecall.length} casi. ` +
        `Valutare: abbassare minScoreInterpelli o aumentare topK.interpelli.`
    );
  }

  // 3. Interpello precision (noise)
  const lowIPPrecision = results.filter(
    (r) =>
      r.retrieval_metrics.interpello_precision < 0.3 &&
      r.raw_response.metadata.sources.interpelli.length > 0
  );
  if (lowIPPrecision.length > 0) {
    weaknesses.push({
      area: "Interpello Precision (rumore)",
      severity: "medium",
      description: `${lowIPPrecision.length} casi restituiscono interpelli per lo più irrilevanti.`,
      affected_cases: lowIPPrecision.map((r) => r.test_case.id),
    });
    recommendations.push(
      `Interpello precision bassa: ${lowIPPrecision.length} casi con precision <30%. ` +
        `Valutare: aumentare minScoreInterpelli, ridurre topK.interpelli, o migliorare Path C filtering.`
    );
  }

  // 4. Query classification errors
  const misclassified = results.filter(
    (r) => !r.retrieval_metrics.query_classification_correct
  );
  if (misclassified.length > 0) {
    const patterns = misclassified.map(
      (r) =>
        `"${r.test_case.query.substring(0, 50)}" atteso=${r.test_case.ground_truth.expected_tipo_query} ottenuto=${r.raw_response.metadata.queryAnalysis.tipo_query}`
    );
    weaknesses.push({
      area: "Classificazione Query",
      severity: misclassified.length > 5 ? "high" : "low",
      description: `${misclassified.length} query classificate male: ${patterns.slice(0, 3).join("; ")}`,
      affected_cases: misclassified.map((r) => r.test_case.id),
    });
    recommendations.push(
      `Aggiungere più esempi al prompt del query analyzer per i pattern mal classificati.`
    );
  }

  // 5. Citation hallucination
  const lowCitationAcc = results.filter(
    (r) => r.response_metrics.citation_accuracy < 0.8
  );
  if (lowCitationAcc.length > 0) {
    weaknesses.push({
      area: "Accuratezza Citazioni",
      severity: "high",
      description: `${lowCitationAcc.length} risposte citano fonti non presenti nel contesto fornito.`,
      affected_cases: lowCitationAcc.map((r) => r.test_case.id),
    });
    recommendations.push(
      `Il generatore di risposte sta allucinando citazioni. ` +
        `Rafforzare il vincolo nel system prompt: ` +
        `"Cita ESCLUSIVAMENTE gli articoli e interpelli forniti nel CONTESTO".`
    );
  }

  // 6. Format compliance
  const missingFormat = results.filter(
    (r) =>
      !r.response_metrics.has_risposta_section ||
      !r.response_metrics.has_normativa_section
  );
  if (missingFormat.length > 0) {
    weaknesses.push({
      area: "Formato Risposta",
      severity: "low",
      description: `${missingFormat.length} risposte mancano delle sezioni obbligatorie (## Risposta, ## Normativa).`,
      affected_cases: missingFormat.map((r) => r.test_case.id),
    });
    recommendations.push(
      `Aggiungere validazione post-generazione per garantire la presenza di tutte le sezioni.`
    );
  }

  // 7. Theme identification
  const lowTemiOverlap = results.filter(
    (r) =>
      r.retrieval_metrics.temi_overlap_ratio < 0.5 &&
      (r.test_case.ground_truth.expected_temi?.length || 0) > 0
  );
  if (lowTemiOverlap.length > 0) {
    weaknesses.push({
      area: "Identificazione Temi",
      severity: "medium",
      description: `Query analyzer non identifica i temi attesi per ${lowTemiOverlap.length} casi.`,
      affected_cases: lowTemiOverlap.map((r) => r.test_case.id),
    });
    recommendations.push(
      `L'identificazione dei temi è debole. Aggiungere few-shot examples al prompt del query analyzer ` +
        `per le combinazioni di temi mancanti. Questo impatta la qualità di Path C (metadata filtering).`
    );
  }

  // 8. must_mention failures
  const mustMentionFails = results.filter(
    (r) => !r.response_metrics.all_must_mention_present
  );
  if (mustMentionFails.length > 0) {
    weaknesses.push({
      area: "Contenuto Risposta",
      severity: mustMentionFails.length > 5 ? "high" : "medium",
      description: `${mustMentionFails.length} risposte non contengono termini chiave attesi.`,
      affected_cases: mustMentionFails.map((r) => r.test_case.id),
    });
    recommendations.push(
      `Le risposte non contengono concetti chiave attesi per ${mustMentionFails.length} casi. ` +
        `Verificare che il context-builder includa abbastanza testo degli articoli/interpelli.`
    );
  }

  // 9. Performance
  const slowCases = results.filter((r) => r.timing.total_ms > 15000);
  if (slowCases.length > 0) {
    weaknesses.push({
      area: "Performance",
      severity: "low",
      description: `${slowCases.length} casi impiegano più di 15 secondi.`,
      affected_cases: slowCases.map((r) => r.test_case.id),
    });
  }

  // 10. Category-level failure rate
  const byCategory = new Map<string, TestCaseResult[]>();
  for (const r of results) {
    const cat = r.test_case.category;
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(r);
  }

  for (const [cat, catResults] of Array.from(byCategory)) {
    const failRate =
      catResults.filter((r) => !r.passed).length / catResults.length;
    if (failRate > 0.3) {
      recommendations.push(
        `La categoria "${cat}" ha un tasso di fallimento del ${(failRate * 100).toFixed(0)}%. ` +
          `Concentrare gli sforzi di miglioramento su questa categoria.`
      );
    }
  }

  return { recommendations, weaknesses };
}
