import type { QueryAnalysis, QueryType } from "../types";
import { TEMI } from "../constants";

const VALID_QUERY_TYPES: QueryType[] = ["generica", "specifica", "normativa"];
const TEMI_SET = new Set<string>(TEMI);

export function parseQueryAnalysis(raw: string): QueryAnalysis {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return createFallback(raw);
  }

  const tipo_query = VALID_QUERY_TYPES.includes(
    parsed.tipo_query as QueryType
  )
    ? (parsed.tipo_query as QueryType)
    : "generica";

  const temi_probabili = Array.isArray(parsed.temi_probabili)
    ? (parsed.temi_probabili as string[]).filter((t) => TEMI_SET.has(t))
    : [];

  const rif =
    (parsed.riferimenti_normativi as Record<string, unknown>) || {};

  const vecchio_codice = Array.isArray(rif.vecchio_codice)
    ? (rif.vecchio_codice as string[])
    : [];

  const tu_iva = Array.isArray(rif.tu_iva)
    ? (rif.tu_iva as string[])
    : [];

  const interpelli = Array.isArray(rif.interpelli)
    ? (rif.interpelli as Array<Record<string, unknown>>)
        .filter(
          (ip) =>
            typeof ip.numero === "number" && typeof ip.anno === "number"
        )
        .map((ip) => ({
          numero: ip.numero as number,
          anno: ip.anno as number,
        }))
    : [];

  const query_riformulata =
    typeof parsed.query_riformulata === "string"
      ? parsed.query_riformulata
      : raw;

  const filtri =
    (parsed.filtri_suggeriti as Record<string, unknown>) || {};
  const filtri_suggeriti: QueryAnalysis["filtri_suggeriti"] = {};
  if (Array.isArray(filtri.tag)) {
    filtri_suggeriti.tag = filtri.tag as string[];
  }
  if (typeof filtri.anno_min === "number") {
    filtri_suggeriti.anno_min = filtri.anno_min;
  }

  return {
    tipo_query,
    temi_probabili,
    riferimenti_normativi: { vecchio_codice, tu_iva, interpelli },
    query_riformulata,
    filtri_suggeriti,
  };
}

function createFallback(originalQuery: string): QueryAnalysis {
  return {
    tipo_query: "generica",
    temi_probabili: [],
    riferimenti_normativi: {
      vecchio_codice: [],
      tu_iva: [],
      interpelli: [],
    },
    query_riformulata: originalQuery,
    filtri_suggeriti: {},
  };
}
