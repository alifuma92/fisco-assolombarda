import type {
  EvalReport,
  TestCaseResult,
  LLMJudgeScores,
} from "../types";

export function generateMarkdownReport(report: EvalReport): string {
  const lines: string[] = [];

  lines.push("# RAG Evaluation Report");
  lines.push(`**Run ID:** ${report.run_id}`);
  lines.push(`**Data:** ${report.timestamp}`);
  lines.push(
    `**Casi:** ${report.summary.total_cases} | **Passati:** ${report.summary.passed} | **Falliti:** ${report.summary.failed} | **Pass Rate:** ${(report.summary.pass_rate * 100).toFixed(1)}%`
  );
  lines.push("");

  // Summary Metrics
  lines.push("## Metriche Retrieval");
  lines.push("");
  lines.push("| Metrica | Articoli | Interpelli |");
  lines.push("|---------|----------|------------|");
  lines.push(
    `| Precision | ${fmt(report.summary.avg_retrieval.article_precision)} | ${fmt(report.summary.avg_retrieval.interpello_precision)} |`
  );
  lines.push(
    `| Recall | ${fmt(report.summary.avg_retrieval.article_recall)} | ${fmt(report.summary.avg_retrieval.interpello_recall)} |`
  );
  lines.push(
    `| MRR | ${fmt(report.summary.avg_retrieval.article_mrr)} | ${fmt(report.summary.avg_retrieval.interpello_mrr)} |`
  );
  lines.push("");

  // Response Quality
  lines.push("## Qualita Risposta");
  lines.push("");
  lines.push(
    `- **Format compliance:** ${(report.summary.avg_response.format_compliance * 100).toFixed(1)}%`
  );
  lines.push(
    `- **Citation accuracy:** ${fmt(report.summary.avg_response.citation_accuracy)}`
  );
  lines.push("");

  // LLM Judge
  if (report.summary.avg_llm_judge) {
    const j = report.summary.avg_llm_judge;
    lines.push("## LLM Judge (medie)");
    lines.push("");
    lines.push("| Criterio | Punteggio |");
    lines.push("|----------|-----------|");
    lines.push(`| Rilevanza | ${j.relevance.toFixed(1)} |`);
    lines.push(`| Accuratezza | ${j.accuracy.toFixed(1)} |`);
    lines.push(`| Completezza | ${j.completeness.toFixed(1)} |`);
    lines.push(`| Qualita Citazioni | ${j.citation_quality.toFixed(1)} |`);
    lines.push(`| Professionalita | ${j.professionalism.toFixed(1)} |`);
    lines.push(`| **Overall** | **${j.overall.toFixed(1)}** |`);
    lines.push("");
  }

  // Timing
  lines.push("## Tempi di Risposta");
  lines.push("");
  lines.push("| Fase | Media (ms) |");
  lines.push("|------|------------|");
  lines.push(`| Analisi | ${report.summary.avg_timing.analysis_ms.toFixed(0)} |`);
  lines.push(`| Retrieval | ${report.summary.avg_timing.retrieval_ms.toFixed(0)} |`);
  lines.push(`| Totale | ${report.summary.avg_timing.total_ms.toFixed(0)} |`);
  lines.push("");

  // By Category
  lines.push("## Per Categoria");
  lines.push("");
  lines.push(
    "| Categoria | Casi | Passati | Rate | Avg Art Recall | Avg IP Recall |"
  );
  lines.push(
    "|-----------|------|---------|------|----------------|---------------|"
  );
  for (const [cat, data] of Object.entries(report.summary.by_category)) {
    lines.push(
      `| ${cat} | ${data.total} | ${data.passed} | ${(data.pass_rate * 100).toFixed(0)}% | ${fmt(data.avg_article_recall)} | ${fmt(data.avg_interpello_recall)} |`
    );
  }
  lines.push("");

  // By Difficulty
  lines.push("## Per Difficolta");
  lines.push("");
  lines.push("| Difficolta | Casi | Passati | Rate |");
  lines.push("|------------|------|---------|------|");
  for (const [diff, data] of Object.entries(report.summary.by_difficulty)) {
    lines.push(
      `| ${diff} | ${data.total} | ${data.passed} | ${(data.pass_rate * 100).toFixed(0)}% |`
    );
  }
  lines.push("");

  // Failed Cases Detail
  const failed = report.results.filter((r) => !r.passed);
  if (failed.length > 0) {
    lines.push("## Dettaglio Casi Falliti");
    lines.push("");
    for (const r of failed) {
      lines.push(`### ${r.test_case.id} - ${r.test_case.description.substring(0, 80)}`);
      lines.push(`- **Query:** ${r.test_case.query}`);
      lines.push(
        `- **Article Recall:** ${fmt(r.retrieval_metrics.article_recall)} | **IP Recall:** ${fmt(r.retrieval_metrics.interpello_recall)}`
      );
      lines.push(
        `- **Citation Accuracy:** ${fmt(r.response_metrics.citation_accuracy)}`
      );
      lines.push(`- **Motivi fallimento:** ${r.failure_reasons.join("; ")}`);

      // Show what was returned vs expected
      const returnedArts = r.raw_response.metadata.sources.articles.map(
        (a) => a.id
      );
      const returnedIps = r.raw_response.metadata.sources.interpelli.map(
        (i) => i.id
      );
      if (r.test_case.ground_truth.expected_articles.length > 0) {
        lines.push(
          `- **Articoli attesi:** ${r.test_case.ground_truth.expected_articles.join(", ")} → **Trovati:** ${returnedArts.join(", ") || "nessuno"}`
        );
      }
      if (r.test_case.ground_truth.expected_interpelli.length > 0) {
        lines.push(
          `- **Interpelli attesi:** ${r.test_case.ground_truth.expected_interpelli.join(", ")} → **Trovati:** ${returnedIps.join(", ") || "nessuno"}`
        );
      }

      if (r.llm_judge) {
        lines.push(
          `- **LLM Judge:** Overall ${r.llm_judge.overall}/5 - "${r.llm_judge.reasoning}"`
        );
      }
      lines.push("");
    }
  }

  // Weaknesses
  if (report.weaknesses.length > 0) {
    lines.push("## Debolezze Identificate");
    lines.push("");
    for (let i = 0; i < report.weaknesses.length; i++) {
      const w = report.weaknesses[i];
      lines.push(
        `${i + 1}. **${w.severity.toUpperCase()}** - ${w.area}: ${w.description} (casi: ${w.affected_cases.join(", ")})`
      );
    }
    lines.push("");
  }

  // Recommendations
  if (report.recommendations.length > 0) {
    lines.push("## Raccomandazioni");
    lines.push("");
    for (let i = 0; i < report.recommendations.length; i++) {
      lines.push(`${i + 1}. ${report.recommendations[i]}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function buildReport(
  results: TestCaseResult[],
  recommendations: string[],
  weaknesses: EvalReport["weaknesses"],
  config: { baseUrl: string; skipLLMJudge: boolean }
): EvalReport {
  const timestamp = new Date().toISOString();
  const runId = `eval_${timestamp.replace(/[:.T-]/g, "").substring(0, 14)}`;

  const categories = Array.from(new Set(results.map((r) => r.test_case.category)));

  // Aggregate retrieval metrics
  const avgRetrieval = {
    article_precision: avg(results.map((r) => r.retrieval_metrics.article_precision)),
    article_recall: avg(results.map((r) => r.retrieval_metrics.article_recall)),
    interpello_precision: avg(results.map((r) => r.retrieval_metrics.interpello_precision)),
    interpello_recall: avg(results.map((r) => r.retrieval_metrics.interpello_recall)),
    article_mrr: avg(results.map((r) => r.retrieval_metrics.article_mrr)),
    interpello_mrr: avg(results.map((r) => r.retrieval_metrics.interpello_mrr)),
  };

  // Aggregate response metrics
  const formatCompliance = avg(
    results.map((r) => {
      const sections = [
        r.response_metrics.has_risposta_section,
        r.response_metrics.has_normativa_section,
        r.response_metrics.has_prassi_section,
        r.response_metrics.has_note_section,
      ].filter(Boolean).length;
      return sections / 4;
    })
  );

  // LLM judge aggregation
  const judgeResults = results.filter((r) => r.llm_judge && r.llm_judge.overall > 0);
  const avgLLMJudge =
    judgeResults.length > 0
      ? {
          relevance: avg(judgeResults.map((r) => r.llm_judge!.relevance)),
          accuracy: avg(judgeResults.map((r) => r.llm_judge!.accuracy)),
          completeness: avg(judgeResults.map((r) => r.llm_judge!.completeness)),
          citation_quality: avg(judgeResults.map((r) => r.llm_judge!.citation_quality)),
          professionalism: avg(judgeResults.map((r) => r.llm_judge!.professionalism)),
          overall: avg(judgeResults.map((r) => r.llm_judge!.overall)),
        }
      : undefined;

  // By category
  const byCategory: EvalReport["summary"]["by_category"] = {};
  for (const cat of categories) {
    const catResults = results.filter((r) => r.test_case.category === cat);
    const passed = catResults.filter((r) => r.passed).length;
    byCategory[cat] = {
      total: catResults.length,
      passed,
      pass_rate: catResults.length > 0 ? passed / catResults.length : 0,
      avg_article_recall: avg(catResults.map((r) => r.retrieval_metrics.article_recall)),
      avg_interpello_recall: avg(catResults.map((r) => r.retrieval_metrics.interpello_recall)),
    };
  }

  // By difficulty
  const byDifficulty: EvalReport["summary"]["by_difficulty"] = {};
  for (const diff of ["easy", "medium", "hard"]) {
    const diffResults = results.filter((r) => r.test_case.difficulty === diff);
    if (diffResults.length === 0) continue;
    const passed = diffResults.filter((r) => r.passed).length;
    byDifficulty[diff] = {
      total: diffResults.length,
      passed,
      pass_rate: passed / diffResults.length,
    };
  }

  const passed = results.filter((r) => r.passed).length;

  return {
    run_id: runId,
    timestamp,
    config: {
      base_url: config.baseUrl,
      skip_llm_judge: config.skipLLMJudge,
      categories_run: categories,
    },
    summary: {
      total_cases: results.length,
      passed,
      failed: results.length - passed,
      pass_rate: results.length > 0 ? passed / results.length : 0,
      avg_retrieval: avgRetrieval,
      avg_response: {
        format_compliance: formatCompliance,
        citation_accuracy: avg(results.map((r) => r.response_metrics.citation_accuracy)),
      },
      avg_llm_judge: avgLLMJudge,
      avg_timing: {
        total_ms: avg(results.map((r) => r.timing.total_ms)),
        analysis_ms: avg(results.map((r) => r.timing.analysis_ms)),
        retrieval_ms: avg(results.map((r) => r.timing.retrieval_ms)),
      },
      by_category: byCategory,
      by_difficulty: byDifficulty,
    },
    results,
    recommendations,
    weaknesses,
  };
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function fmt(n: number): string {
  return n.toFixed(2);
}
