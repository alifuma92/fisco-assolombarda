import type { SourceMetadata } from "../../src/lib/types";
import type { GroundTruth, ResponseMetrics } from "../types";

export function evaluateResponse(
  fullText: string,
  metadata: SourceMetadata,
  groundTruth: GroundTruth,
  query?: string
): ResponseMetrics {
  const text = fullText.toLowerCase();

  // Section detection (from RESPONSE_GENERATOR_SYSTEM_PROMPT format)
  const has_risposta = /^##\s+risposta/im.test(fullText);
  const has_normativa = /^##\s+normativa di riferimento/im.test(fullText);
  const has_prassi = /^##\s+prassi/im.test(fullText);
  const has_note = /^##\s+note/im.test(fullText);

  // Markdown formatting
  const uses_markdown =
    fullText.includes("**") ||
    fullText.includes("- ") ||
    /^\d+\.\s/m.test(fullText);

  // Citation accuracy: check that cited TU IVA articles and interpelli exist in provided sources.
  // Exclude "## Note" section from citation checking because rule 9 in the prompt explicitly
  // allows the LLM to mention extra articles there ("potrebbe essere rilevante anche l'art. X").
  const textForCitations = stripNoteSection(fullText);
  const citedTUIVAArticles = extractTUIVAArticleNumbers(textForCitations);
  const citedInterpelli = extractCitedInterpelli(textForCitations, query);

  const providedArticleNumbers = new Set(
    metadata.sources.articles.map((a) => a.articolo)
  );
  // Also include old code article numbers as valid (the system mentions them legitimately)
  // Must capture full suffixes like -bis, -ter, -quater, -quinquies
  for (const a of metadata.sources.articles) {
    if (a.vecchio_codice) {
      for (const vc of a.vecchio_codice) {
        const num = vc.match(
          /art\.\s*(\d+(?:-(?:bis|ter|quater|quinquies|sexies|septies|octies|novies|decies))?)/i
        )?.[1];
        if (num) providedArticleNumbers.add(num);
      }
    }
  }

  const providedInterpelliKeys = new Set(
    metadata.sources.interpelli.map((i) => `${i.numero}/${i.anno}`)
  );

  const totalCited = citedTUIVAArticles.length + citedInterpelli.length;
  const validArticleCitations = citedTUIVAArticles.filter((num) =>
    providedArticleNumbers.has(num)
  ).length;
  const validInterpelloCitations = citedInterpelli.filter((key) =>
    providedInterpelliKeys.has(key)
  ).length;
  const validCited = validArticleCitations + validInterpelloCitations;

  const citationAccuracy = totalCited > 0 ? validCited / totalCited : 1.0;

  // Vecchio codice mention
  const mentionsVecchioCodice =
    /DPR\s+633/i.test(fullText) || /vecchio codice/i.test(fullText);

  // must_mention / must_not_mention checks
  const allMustPresent = (groundTruth.must_mention || []).every((term) =>
    text.includes(term.toLowerCase())
  );
  const noViolations = (groundTruth.must_not_mention || []).every(
    (term) => !text.includes(term.toLowerCase())
  );

  return {
    has_risposta_section: has_risposta,
    has_normativa_section: has_normativa,
    has_prassi_section: has_prassi,
    has_note_section: has_note,
    uses_markdown_formatting: uses_markdown,
    citation_accuracy: citationAccuracy,
    mentions_vecchio_codice: mentionsVecchioCodice,
    all_must_mention_present: allMustPresent,
    no_must_not_mention_violations: noViolations,
    response_length_chars: fullText.length,
  };
}

/** Strip the "## Note" section from the response (everything after "## Note" heading). */
function stripNoteSection(text: string): string {
  return text.split(/^##\s+Note\b/im)[0] || text;
}

const SUFFIX_PATTERN = "(?:-(?:bis|ter|quater|quinquies|sexies|septies|octies|novies|decies))?"

/**
 * Extract article numbers cited in the response that should be checked against provided sources.
 * Skips references that are clearly NOT TU IVA citations:
 * - "art. N DPR 633" / "art. N D.P.R. 633" — old code references
 * - "art. N Reg. UE" / "art. N Regolamento" — EU regulation references
 * - "art. N D.L." / "art. N D.Lgs." — decree references (not TU IVA)
 * - "ex art. N" patterns followed by DPR/DL — explicit old code cross-references
 */
function extractTUIVAArticleNumbers(text: string): string[] {
  const regex = new RegExp(
    `art(?:icolo)?\\.?\\s*(\\d+${SUFFIX_PATTERN})(.{0,60})`,
    "gi"
  );
  const numbers: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const num = match[1];
    const trailing = match[2] || "";
    // Skip if trailing context clearly identifies this as a non-TU-IVA reference
    if (/(?:DPR|D\.?P\.?R\.?)\s*(?:633|441|n\.\s*\d)/i.test(trailing)) continue;
    if (/Reg(?:olamento)?\.?\s*(?:UE|CE|CEE)/i.test(trailing)) continue;
    if (/D\.?\s*L(?:gs)?\.?\s*\d/i.test(trailing)) continue;
    numbers.push(num);
  }
  return Array.from(new Set(numbers.filter(Boolean)));
}

/**
 * Extract interpello references cited in the response (e.g., "interpello n. 19/2024").
 * Excludes interpello numbers that appear in the original query, since mentioning them
 * is expected (e.g., "Interpello 999/2024 - cosa dice?" → the response must reference it).
 */
function extractCitedInterpelli(text: string, query?: string): string[] {
  const matches =
    text.match(/interpello\s+(?:n\.?\s*)?(\d+)\/(\d{4})/gi) || [];
  const keys = matches.map((m) => {
    const parts = m.match(/(\d+)\/(\d{4})/);
    return parts ? `${parts[1]}/${parts[2]}` : "";
  });

  // Interpelli referenced in the query are always valid to mention
  const queryInterpelli = new Set<string>();
  if (query) {
    const qMatches = query.match(/(\d+)\/(\d{4})/g) || [];
    for (const qm of qMatches) {
      queryInterpelli.add(qm);
    }
  }

  return Array.from(
    new Set(keys.filter((k) => k && !queryInterpelli.has(k)))
  );
}
