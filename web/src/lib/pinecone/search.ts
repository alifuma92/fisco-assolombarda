import { getPineconeIndex } from "./client";
import { PINECONE_CONFIG } from "../constants";

export interface PineconeMatch {
  id: string;
  score: number;
  metadata: Record<string, unknown>;
}

export type PineconeFilter = Record<string, unknown>;

export function buildFilter(options: {
  temi?: string[];
  tag?: string[];
  anno_min?: number;
  chunk_type?: string;
}): PineconeFilter | undefined {
  const conditions: Record<string, unknown>[] = [];

  if (options.temi && options.temi.length > 0) {
    conditions.push({ temi: { $in: options.temi } });
  }

  if (options.tag && options.tag.length > 0) {
    conditions.push({ tag: { $in: options.tag } });
  }

  if (options.anno_min) {
    conditions.push({ anno: { $gte: options.anno_min } });
  }

  if (options.chunk_type) {
    conditions.push({ chunk_type: { $eq: options.chunk_type } });
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return { $and: conditions };
}

export async function searchTuIva(
  queryEmbedding: number[],
  filter?: PineconeFilter,
  topK: number = PINECONE_CONFIG.topK.tuIva
): Promise<PineconeMatch[]> {
  const index = getPineconeIndex();
  const ns = index.namespace(PINECONE_CONFIG.namespaces.tuIva);

  const results = await ns.query({
    vector: queryEmbedding,
    topK,
    filter,
    includeMetadata: true,
  });

  return (results.matches || []).map((m) => ({
    id: m.id,
    score: m.score ?? 0,
    metadata: (m.metadata as Record<string, unknown>) || {},
  }));
}

export async function searchInterpelli(
  queryEmbedding: number[],
  filter?: PineconeFilter,
  topK: number = PINECONE_CONFIG.topK.interpelli
): Promise<PineconeMatch[]> {
  const index = getPineconeIndex();
  const ns = index.namespace(PINECONE_CONFIG.namespaces.interpelli);

  const summaryFilter = buildFilter({ chunk_type: "summary" });
  const combinedFilter =
    filter && summaryFilter
      ? { $and: [filter, summaryFilter] }
      : filter || summaryFilter;

  const results = await ns.query({
    vector: queryEmbedding,
    topK,
    filter: combinedFilter,
    includeMetadata: true,
  });

  return (results.matches || []).map((m) => ({
    id: m.id,
    score: m.score ?? 0,
    metadata: (m.metadata as Record<string, unknown>) || {},
  }));
}
