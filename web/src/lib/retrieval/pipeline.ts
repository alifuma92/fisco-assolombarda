import type { QueryAnalysis, FusedResults } from "../types";
import { executeLookup } from "./path-a";
import { executeSemanticSearch } from "./path-b";
import { executeMetadataFilter } from "./path-c";
import { fuseAndRerank } from "./fusion";

/**
 * Check if the query is a pure normativa lookup (specific references,
 * no broader conceptual question). In this case, Path A provides the
 * signal and Path B should be reduced to avoid noise.
 */
function isPureLookupQuery(analysis: QueryAnalysis): boolean {
  const refs = analysis.riferimenti_normativi;
  const hasReferences =
    refs.vecchio_codice.length > 0 ||
    refs.tu_iva.length > 0 ||
    refs.interpelli.length > 0;

  return analysis.tipo_query === "normativa" && hasReferences;
}

export async function executeRetrieval(
  analysis: QueryAnalysis
): Promise<FusedResults> {
  // Path A: direct lookup + cross-reference enrichment (synchronous, fast)
  const pathAResults = executeLookup(analysis);

  // For pure lookup queries, reduce Path B to minimize noise
  const reducedPathB = isPureLookupQuery(analysis);

  // Path B (async) and Path C (sync) in parallel
  const [pathBResults, pathCResults] = await Promise.all([
    executeSemanticSearch(analysis, { reduced: reducedPathB }),
    Promise.resolve(executeMetadataFilter(analysis)),
  ]);

  return fuseAndRerank(
    pathAResults,
    pathBResults.tuResults,
    pathBResults.ipResults,
    pathCResults.tuResults,
    pathCResults.ipResults,
    analysis
  );
}
