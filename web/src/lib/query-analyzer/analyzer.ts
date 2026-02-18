import OpenAI from "openai";
import { QUERY_ANALYZER_SYSTEM_PROMPT } from "./prompts";
import { parseQueryAnalysis } from "./parser";
import { extractOldCodeRefs } from "../data/mappatura";
import type { QueryAnalysis } from "../types";

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export async function analyzeQuery(query: string): Promise<QueryAnalysis> {
  try {
    const client = getOpenAI();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 512,
      temperature: 0,
      messages: [
        { role: "system", content: QUERY_ANALYZER_SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
    });

    const text = response.choices[0]?.message?.content || "";
    return parseQueryAnalysis(text);
  } catch (error) {
    console.error("Query analyzer error, using fallback:", error);
    return fallbackAnalysis(query);
  }
}

function fallbackAnalysis(query: string): QueryAnalysis {
  const oldRefs = extractOldCodeRefs(query);

  const tuMatches =
    query.match(
      /art(?:icolo)?\.?\s*(\d+)\s+(?:TU|Testo Unico)/gi
    ) || [];
  const tuRefs = tuMatches
    .map((m) => {
      const num = m.match(/(\d+)/);
      return num ? `art. ${num[1]}` : "";
    })
    .filter(Boolean);

  const ipMatches =
    query.match(/interpello\s+(?:n\.?\s*)?(\d+)\/(\d{4})/gi) || [];
  const ipRefs = ipMatches
    .map((m) => {
      const parts = m.match(/(\d+)\/(\d{4})/);
      return parts
        ? { numero: parseInt(parts[1]), anno: parseInt(parts[2]) }
        : null;
    })
    .filter(
      (ip): ip is { numero: number; anno: number } => ip !== null
    );

  const hasSpecificRefs =
    oldRefs.length > 0 || tuRefs.length > 0 || ipRefs.length > 0;

  return {
    tipo_query: hasSpecificRefs ? "normativa" : "generica",
    temi_probabili: [],
    riferimenti_normativi: {
      vecchio_codice: oldRefs,
      tu_iva: tuRefs,
      interpelli: ipRefs,
    },
    query_riformulata: query,
    filtri_suggeriti: {},
  };
}
