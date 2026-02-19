import { NextRequest, NextResponse } from "next/server";
import { analyzeQuery } from "@/lib/query-analyzer/analyzer";
import { executeRetrieval } from "@/lib/retrieval/pipeline";
import { generateResponse } from "@/lib/response-generator/generator";
import type { QueryRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

/* ── Simple in-memory rate limiter ── */
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max requests per window per IP

const requestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestCounts) {
    if (now > entry.resetAt) requestCounts.delete(ip);
  }
}, 5 * 60_000);

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova tra qualche secondo." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as QueryRequest;
    const { query } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Il campo "query" è obbligatorio.' },
        { status: 400 }
      );
    }

    if (query.length > 1000) {
      return NextResponse.json(
        { error: "La query non può superare i 1000 caratteri." },
        { status: 400 }
      );
    }

    // Step 1: Analyze the query
    const analysisStart = Date.now();
    const analysis = await analyzeQuery(query.trim());
    const analysisTime = Date.now() - analysisStart;

    // Step 2: Execute retrieval pipeline
    const retrievalStart = Date.now();
    const results = await executeRetrieval(analysis);
    const retrievalTime = Date.now() - retrievalStart;

    // Step 3: Generate streaming response
    const llmStream = await generateResponse(query.trim(), results);

    // Build metadata to send as first SSE message
    const metadata = JSON.stringify({
      queryAnalysis: analysis,
      sources: {
        articles: results.articles.map((r) => ({
          id: r.article?.id,
          articolo: r.article?.articolo,
          titolo: r.article?.titolo,
          citazione: r.article?.metadati_rag.citazione_formale,
          vecchio_codice:
            r.article?.riferimenti_vecchio_codice.riferimenti_strutturati.map(
              (v) => `${v.norma} art. ${v.articolo}`
            ),
          struttura: r.article?.struttura,
          temi: r.article?.temi ?? [],
          commi: r.article?.commi ?? [],
          numero_commi: r.article?.numero_commi ?? 0,
          riferimenti_interni: r.article?.riferimenti_interni ?? [],
          testo_integrale: r.article?.testo_integrale ?? "",
        })),
        interpelli: results.interpelli.map((r) => ({
          id: r.interpello?.id,
          numero: r.interpello?.numero,
          anno: r.interpello?.anno,
          data: r.interpello?.data,
          tag: r.interpello?.tag,
          oggetto: r.interpello?.oggetto,
          massima: r.interpello?.massima,
          link_pdf: r.interpello?.link_pdf,
          citazione: r.interpello?.metadati_rag.citazione,
          temi: r.interpello?.temi ?? [],
          articoli_tu_iva_collegati:
            r.interpello?.articoli_tu_iva_collegati ?? [],
          ha_testo_completo:
            r.interpello?.metadati_rag.ha_testo_completo ?? false,
          sezioni: {
            quesito: r.interpello?.sezioni?.quesito ?? null,
            soluzione_contribuente:
              r.interpello?.sezioni?.soluzione_contribuente ?? null,
            parere_ade: r.interpello?.sezioni?.parere_ade ?? null,
          },
        })),
      },
      timing: {
        analysis_ms: analysisTime,
        retrieval_ms: retrievalTime,
      },
    });

    const encoder = new TextEncoder();

    const sseStream = new ReadableStream({
      async start(controller) {
        // Send metadata as first SSE event
        controller.enqueue(
          encoder.encode(`data: ${metadata}\n\n`)
        );

        // Stream the LLM response
        const reader = llmStream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = new TextDecoder().decode(value);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ text })}\n\n`
              )
            );
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(sseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Query API error:", error);
    return NextResponse.json(
      { error: "Errore interno del server. Riprova tra qualche secondo." },
      { status: 500 }
    );
  }
}
