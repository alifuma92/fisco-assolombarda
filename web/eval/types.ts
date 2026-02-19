import type { SourceMetadata } from "../src/lib/types";

// ══════════════════════════════════════════════════════════
// TEST CASE TYPES
// ══════════════════════════════════════════════════════════

export type TestCategory =
  | "normativa"
  | "specifica"
  | "generica"
  | "edge_case";

export interface GroundTruth {
  /** TU IVA article IDs that MUST appear (e.g., ["art_37"]) */
  expected_articles: string[];
  /** Interpello IDs that MUST appear (e.g., ["interpello_2024_19"]) */
  expected_interpelli: string[];
  /** Articles that are acceptable but not required */
  acceptable_articles?: string[];
  /** Interpelli that are acceptable but not required */
  acceptable_interpelli?: string[];
  /** Expected tipo_query classification */
  expected_tipo_query?: "normativa" | "specifica" | "generica";
  /** Expected temi that should be identified */
  expected_temi?: string[];
  /** Key terms that MUST appear in the response text */
  must_mention?: string[];
  /** Terms that must NOT appear (hallucination traps) */
  must_not_mention?: string[];
}

export interface TestCase {
  id: string;
  category: TestCategory;
  query: string;
  description: string;
  ground_truth: GroundTruth;
  difficulty: "easy" | "medium" | "hard";
}

// ══════════════════════════════════════════════════════════
// EVALUATION RESULT TYPES
// ══════════════════════════════════════════════════════════

export interface RetrievalMetrics {
  article_precision: number;
  article_recall: number;
  interpello_precision: number;
  interpello_recall: number;
  article_mrr: number;
  interpello_mrr: number;
  article_f1: number;
  interpello_f1: number;
  query_classification_correct: boolean;
  temi_overlap_ratio: number;
}

export interface ResponseMetrics {
  has_risposta_section: boolean;
  has_normativa_section: boolean;
  has_prassi_section: boolean;
  has_note_section: boolean;
  uses_markdown_formatting: boolean;
  citation_accuracy: number;
  mentions_vecchio_codice: boolean;
  all_must_mention_present: boolean;
  no_must_not_mention_violations: boolean;
  response_length_chars: number;
}

export interface LLMJudgeScores {
  relevance: number;
  accuracy: number;
  completeness: number;
  citation_quality: number;
  professionalism: number;
  overall: number;
  reasoning: string;
}

export interface TestCaseResult {
  test_case: TestCase;
  timestamp: string;
  timing: {
    total_ms: number;
    analysis_ms: number;
    retrieval_ms: number;
    streaming_ms: number;
  };
  raw_response: {
    metadata: SourceMetadata;
    full_text: string;
  };
  retrieval_metrics: RetrievalMetrics;
  response_metrics: ResponseMetrics;
  llm_judge?: LLMJudgeScores;
  passed: boolean;
  failure_reasons: string[];
}

// ══════════════════════════════════════════════════════════
// REPORT TYPES
// ══════════════════════════════════════════════════════════

export interface Weakness {
  area: string;
  severity: "high" | "medium" | "low";
  description: string;
  affected_cases: string[];
}

export interface EvalReport {
  run_id: string;
  timestamp: string;
  config: {
    base_url: string;
    skip_llm_judge: boolean;
    categories_run: TestCategory[];
  };
  summary: {
    total_cases: number;
    passed: number;
    failed: number;
    pass_rate: number;
    avg_retrieval: {
      article_precision: number;
      article_recall: number;
      interpello_precision: number;
      interpello_recall: number;
      article_mrr: number;
      interpello_mrr: number;
    };
    avg_response: {
      format_compliance: number;
      citation_accuracy: number;
    };
    avg_llm_judge?: {
      relevance: number;
      accuracy: number;
      completeness: number;
      citation_quality: number;
      professionalism: number;
      overall: number;
    };
    avg_timing: {
      total_ms: number;
      analysis_ms: number;
      retrieval_ms: number;
    };
    by_category: Record<
      string,
      {
        total: number;
        passed: number;
        pass_rate: number;
        avg_article_recall: number;
        avg_interpello_recall: number;
      }
    >;
    by_difficulty: Record<
      string,
      { total: number; passed: number; pass_rate: number }
    >;
  };
  results: TestCaseResult[];
  recommendations: string[];
  weaknesses: Weakness[];
}
