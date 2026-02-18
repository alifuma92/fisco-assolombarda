import OpenAI from "openai";
import { RESPONSE_GENERATOR_SYSTEM_PROMPT } from "./prompts";
import { buildContext } from "./context-builder";
import type { FusedResults } from "../types";

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export async function generateResponse(
  query: string,
  results: FusedResults
): Promise<ReadableStream<Uint8Array>> {
  const context = buildContext(results);
  const client = getOpenAI();

  const stream = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 2048,
    stream: true,
    messages: [
      { role: "system", content: RESPONSE_GENERATOR_SYSTEM_PROMPT },
      {
        role: "user",
        content: `CONTESTO:\n\n${context}\n\nDOMANDA DELL'UTENTE:\n${query}`,
      },
    ],
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

export async function generateResponseSync(
  query: string,
  results: FusedResults
): Promise<string> {
  const context = buildContext(results);
  const client = getOpenAI();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 2048,
    messages: [
      { role: "system", content: RESPONSE_GENERATOR_SYSTEM_PROMPT },
      {
        role: "user",
        content: `CONTESTO:\n\n${context}\n\nDOMANDA DELL'UTENTE:\n${query}`,
      },
    ],
  });

  return response.choices[0]?.message?.content || "";
}
