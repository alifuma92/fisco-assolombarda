#!/usr/bin/env node

import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { TEST_CASES } from "./test-cases";
import { queryAndParseSSE } from "./sse-parser";
import { evaluateRetrieval } from "./evaluators/retrieval";
import { evaluateResponse } from "./evaluators/response";
import { runLLMJudge } from "./evaluators/llm-judge";
import { generateMarkdownReport, buildReport } from "./report/generator";
import { generateRecommendations } from "./report/recommendations";
import { EVAL_CONFIG } from "./config";
import type {
  TestCase,
  TestCaseResult,
  TestCategory,
  LLMJudgeScores,
} from "./types";
import type { SourceMetadata } from "../src/lib/types";

// ── Argument Parsing ──────────────────────────────────────

const args = process.argv.slice(2);

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

function getArgValue(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

const flags = {
  all: hasFlag("--all"),
  skipLLMJudge: hasFlag("--skip-llm-judge"),
  category: getArgValue("--category") as TestCategory | undefined,
  caseId: getArgValue("--case-id"),
  baseUrl: getArgValue("--base-url") || EVAL_CONFIG.baseUrl,
  outputDir: getArgValue("--output-dir") || resolve(process.cwd(), "eval", "results"),
};

// ── Pass/Fail Logic ───────────────────────────────────────

function determinePassFail(r: TestCaseResult): {
  passed: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  const { retrieval_metrics: rm, response_metrics: resp } = r;
  const gt = r.test_case.ground_truth;
  const th = EVAL_CONFIG.thresholds;

  if (gt.expected_articles.length > 0 && rm.article_recall < th.min_article_recall) {
    reasons.push(
      `Article recall ${rm.article_recall.toFixed(2)} < ${th.min_article_recall}`
    );
  }

  if (gt.expected_interpelli.length > 0 && rm.interpello_recall < th.min_interpello_recall) {
    reasons.push(
      `Interpello recall ${rm.interpello_recall.toFixed(2)} < ${th.min_interpello_recall}`
    );
  }

  if (resp.citation_accuracy < th.min_citation_accuracy) {
    reasons.push(
      `Citation accuracy ${resp.citation_accuracy.toFixed(2)} < ${th.min_citation_accuracy}`
    );
  }

  if (!resp.no_must_not_mention_violations) {
    reasons.push("Risposta contiene termini proibiti (possibile allucinazione)");
  }

  const sectionCount = [
    resp.has_risposta_section,
    resp.has_normativa_section,
    resp.has_prassi_section,
    resp.has_note_section,
  ].filter(Boolean).length;

  if (sectionCount < th.min_format_sections) {
    reasons.push(
      `Solo ${sectionCount}/4 sezioni presenti (min: ${th.min_format_sections})`
    );
  }

  return { passed: reasons.length === 0, reasons };
}

// ── Error Result Helper ───────────────────────────────────

function createErrorResult(tc: TestCase, errorMsg: string): TestCaseResult {
  const emptyMetadata: SourceMetadata = {
    queryAnalysis: {
      tipo_query: "generica",
      temi_probabili: [],
      riferimenti_normativi: {
        vecchio_codice: [],
        tu_iva: [],
        interpelli: [],
      },
      query_riformulata: "",
      filtri_suggeriti: {},
    },
    sources: { articles: [], interpelli: [] },
    timing: { analysis_ms: 0, retrieval_ms: 0 },
  };

  return {
    test_case: tc,
    timestamp: new Date().toISOString(),
    timing: { total_ms: 0, analysis_ms: 0, retrieval_ms: 0, streaming_ms: 0 },
    raw_response: { metadata: emptyMetadata, full_text: "" },
    retrieval_metrics: {
      article_precision: 0,
      article_recall: 0,
      interpello_precision: 0,
      interpello_recall: 0,
      article_mrr: 0,
      interpello_mrr: 0,
      article_f1: 0,
      interpello_f1: 0,
      query_classification_correct: false,
      temi_overlap_ratio: 0,
    },
    response_metrics: {
      has_risposta_section: false,
      has_normativa_section: false,
      has_prassi_section: false,
      has_note_section: false,
      uses_markdown_formatting: false,
      citation_accuracy: 0,
      mentions_vecchio_codice: false,
      all_must_mention_present: false,
      no_must_not_mention_violations: true,
      response_length_chars: 0,
    },
    passed: false,
    failure_reasons: [`ERROR: ${errorMsg}`],
  };
}

// ── Main ──────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║    RAG Evaluation Framework - Fisco IVA      ║");
  console.log("╚══════════════════════════════════════════════╝\n");
  console.log(`Base URL: ${flags.baseUrl}`);
  console.log(`LLM Judge: ${flags.skipLLMJudge ? "DISATTIVATO" : "ATTIVO"}`);
  console.log(`Output: ${flags.outputDir}\n`);

  // Select test cases
  let cases: TestCase[] = TEST_CASES;
  if (flags.caseId) {
    cases = cases.filter((c) => c.id === flags.caseId);
    if (cases.length === 0) {
      console.error(`Nessun test case con id "${flags.caseId}"`);
      console.error(
        `ID disponibili: ${TEST_CASES.map((c) => c.id).join(", ")}`
      );
      process.exit(1);
    }
  } else if (flags.category) {
    cases = cases.filter((c) => c.category === flags.category);
    if (cases.length === 0) {
      console.error(`Nessun test case per la categoria "${flags.category}"`);
      process.exit(1);
    }
  } else if (!flags.all) {
    console.error(
      "Specifica --all, --category <cat>, oppure --case-id <id>\n"
    );
    console.error("Esempi:");
    console.error("  npx tsx eval/runner.ts --all");
    console.error("  npx tsx eval/runner.ts --category normativa");
    console.error("  npx tsx eval/runner.ts --case-id norm_01");
    console.error("  npx tsx eval/runner.ts --all --skip-llm-judge");
    process.exit(1);
  }

  console.log(`Esecuzione di ${cases.length} test case...\n`);

  const results: TestCaseResult[] = [];
  let passCount = 0;

  for (let i = 0; i < cases.length; i++) {
    const tc = cases[i];
    const progress = `[${String(i + 1).padStart(2)}/${cases.length}]`;
    const queryPreview =
      tc.query.length > 55 ? tc.query.substring(0, 55) + "..." : tc.query;
    process.stdout.write(`${progress} ${tc.id.padEnd(10)} "${queryPreview}" `);

    try {
      const parsed = await queryAndParseSSE(
        flags.baseUrl,
        tc.query,
        EVAL_CONFIG.timeoutMs
      );

      const retrievalMetrics = evaluateRetrieval(
        parsed.metadata,
        tc.ground_truth
      );
      const responseMetrics = evaluateResponse(
        parsed.fullText,
        parsed.metadata,
        tc.ground_truth,
        tc.query
      );

      let llmJudge: LLMJudgeScores | undefined;
      if (!flags.skipLLMJudge) {
        try {
          llmJudge = await runLLMJudge(tc, parsed.metadata, parsed.fullText);
        } catch (e) {
          console.warn(
            `\n  ⚠ LLM Judge error: ${(e as Error).message.substring(0, 80)}`
          );
        }
      }

      const result: TestCaseResult = {
        test_case: tc,
        timestamp: new Date().toISOString(),
        timing: {
          total_ms: parsed.timing.total_ms,
          analysis_ms: parsed.metadata.timing.analysis_ms,
          retrieval_ms: parsed.metadata.timing.retrieval_ms,
          streaming_ms: parsed.timing.streaming_ms,
        },
        raw_response: {
          metadata: parsed.metadata,
          full_text: parsed.fullText,
        },
        retrieval_metrics: retrievalMetrics,
        response_metrics: responseMetrics,
        llm_judge: llmJudge,
        passed: false,
        failure_reasons: [],
      };

      const { passed, reasons } = determinePassFail(result);
      result.passed = passed;
      result.failure_reasons = reasons;
      results.push(result);

      if (passed) {
        passCount++;
        console.log(
          `\x1b[32mPASS\x1b[0m (${parsed.timing.total_ms}ms)`
        );
      } else {
        console.log(
          `\x1b[31mFAIL\x1b[0m ${reasons[0]}`
        );
      }
    } catch (error) {
      console.log(
        `\x1b[31mERROR\x1b[0m ${(error as Error).message.substring(0, 80)}`
      );
      results.push(createErrorResult(tc, (error as Error).message));
    }

    // Rate limiting
    if (i < cases.length - 1) {
      await sleep(EVAL_CONFIG.rateLimitDelayMs);
    }
  }

  // Generate report
  const { recommendations, weaknesses } = generateRecommendations(results);

  const report = buildReport(results, recommendations, weaknesses, {
    baseUrl: flags.baseUrl,
    skipLLMJudge: flags.skipLLMJudge,
  });

  // Write outputs
  mkdirSync(flags.outputDir, { recursive: true });
  const ts = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .substring(0, 19);
  const mdPath = resolve(flags.outputDir, `report-${ts}.md`);
  const jsonPath = resolve(flags.outputDir, `report-${ts}.json`);

  writeFileSync(mdPath, generateMarkdownReport(report));
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  // Print summary
  console.log(`\n${"═".repeat(50)}`);
  console.log(
    `RISULTATI: ${passCount}/${results.length} passati (${((passCount / results.length) * 100).toFixed(1)}%)`
  );
  console.log(`Report MD:   ${mdPath}`);
  console.log(`Report JSON: ${jsonPath}`);

  if (weaknesses.length > 0) {
    console.log(`\nDebolezze trovate: ${weaknesses.length}`);
    for (const w of weaknesses.filter((w) => w.severity === "high")) {
      console.log(`  \x1b[31mHIGH\x1b[0m: ${w.description}`);
    }
    for (const w of weaknesses.filter((w) => w.severity === "medium")) {
      console.log(`  \x1b[33mMEDIUM\x1b[0m: ${w.description}`);
    }
  }

  if (recommendations.length > 0) {
    console.log(`\nRaccomandazioni (${recommendations.length}):`);
    for (const rec of recommendations.slice(0, 5)) {
      console.log(`  → ${rec.substring(0, 120)}`);
    }
  }

  console.log("");
  process.exit(report.summary.failed > 0 ? 1 : 0);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
