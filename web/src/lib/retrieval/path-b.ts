import type { QueryAnalysis, RetrievalResult } from "../types";
import { generateEmbedding } from "../pinecone/embeddings";
import {
  searchTuIva,
  searchInterpelli,
  buildFilter,
} from "../pinecone/search";
import { getArticleByNumber, getArticleById } from "../data/articles";
import { getInterpelloByNumeroAnno } from "../data/interpelli";
import type { PineconeMatch } from "../pinecone/search";

export async function executeSemanticSearch(
  analysis: QueryAnalysis,
  options?: { reduced?: boolean }
): Promise<{ tuResults: RetrievalResult[]; ipResults: RetrievalResult[] }> {
  // For pure normativa queries (lookup-only), reduce topK to minimize noise
  const reducedTopK = options?.reduced ? 3 : undefined;

  const embedding = await generateEmbedding(analysis.query_riformulata);

  // Path B: NO temi/tag filters on semantic search — let embedding similarity do the work.
  // Filters are used only in Path C (metadata filtering).
  const [tuMatches, ipMatches] = await Promise.all([
    searchTuIva(embedding, undefined, reducedTopK),
    searchInterpelli(embedding, undefined, reducedTopK),
  ]);

  const tuResults = tuMatches
    .map((match) => pineconeMatchToTuResult(match))
    .filter((r): r is RetrievalResult => r !== null);

  const ipResults = ipMatches
    .map((match) => pineconeMatchToIpResult(match))
    .filter((r): r is RetrievalResult => r !== null);

  return { tuResults, ipResults };
}

function pineconeMatchToTuResult(
  match: PineconeMatch
): RetrievalResult | null {
  const meta = match.metadata;
  const articolo = meta.articolo as string;

  const parentId = meta.parent_id as string | undefined;
  const articleId = parentId ? parentId.replace("tu_", "") : `art_${articolo}`;

  const article = getArticleById(articleId) || getArticleByNumber(articolo);
  if (!article) return null;

  return {
    id: article.id,
    type: "tu_article",
    score: match.score,
    source: "semantic",
    article,
    chunkType: meta.chunk_type as string,
  };
}

function pineconeMatchToIpResult(
  match: PineconeMatch
): RetrievalResult | null {
  const meta = match.metadata;
  const numero = meta.numero as number;
  const anno = meta.anno as number;

  const interpello = getInterpelloByNumeroAnno(numero, anno);
  if (!interpello) return null;

  return {
    id: interpello.id,
    type: "interpello",
    score: match.score,
    source: "semantic",
    interpello,
    chunkType: meta.chunk_type as string,
  };
}
