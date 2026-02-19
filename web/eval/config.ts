export const EVAL_CONFIG = {
  baseUrl: process.env.EVAL_BASE_URL || "http://localhost:3000",
  timeoutMs: 60_000,
  rateLimitDelayMs: 500,

  thresholds: {
    min_article_recall: 0.5,
    min_interpello_recall: 0.5,
    min_citation_accuracy: 0.65,
    min_format_sections: 2,
  },

  judge: {
    model: "gpt-4o-mini" as const,
    maxTokens: 512,
    temperature: 0,
  },
};
