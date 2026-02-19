import type { SourceMetadata } from "../src/lib/types";

export interface ParsedSSEResponse {
  metadata: SourceMetadata;
  fullText: string;
  timing: {
    first_byte_ms: number;
    metadata_ms: number;
    streaming_ms: number;
    total_ms: number;
  };
}

export async function queryAndParseSSE(
  baseUrl: string,
  query: string,
  timeoutMs: number = 60000
): Promise<ParsedSSEResponse> {
  const startTime = Date.now();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/api/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}: ${errBody}`);
    }

    const firstByteTime = Date.now();
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let metadata: SourceMetadata | null = null;
    let metadataTime = 0;
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        const lines = part.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);

          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.queryAnalysis) {
              metadata = parsed as SourceMetadata;
              metadataTime = Date.now();
            } else if (parsed.text) {
              fullText += parsed.text;
            }
          } catch {
            // Skip malformed SSE chunks
          }
        }
      }
    }

    const endTime = Date.now();

    if (!metadata) throw new Error("No metadata received in SSE stream");

    return {
      metadata,
      fullText,
      timing: {
        first_byte_ms: firstByteTime - startTime,
        metadata_ms: metadataTime - startTime,
        streaming_ms: endTime - (metadataTime || firstByteTime),
        total_ms: endTime - startTime,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}
