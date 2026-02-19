import OpenAI from "openai";
import type { TestCase, LLMJudgeScores } from "../types";
import type { SourceMetadata } from "../../src/lib/types";
import { EVAL_CONFIG } from "../config";

const JUDGE_SYSTEM_PROMPT = `Sei un valutatore esperto di risposte in materia fiscale italiana (IVA).
Ti verrà fornita una domanda dell'utente, le fonti fornite al sistema RAG, e la risposta generata.
Devi valutare la qualità della risposta su una scala da 1 a 5 per ciascun criterio.

CRITERI DI VALUTAZIONE:

1. RILEVANZA (1-5): La risposta affronta direttamente la domanda posta?
   - 1: Completamente fuori tema
   - 3: Parzialmente rilevante, manca il punto centrale
   - 5: Perfettamente centrata sulla domanda

2. ACCURATEZZA (1-5): Le affermazioni sono supportate dalle fonti fornite?
   - 1: Contiene informazioni inventate o contraddice le fonti
   - 3: Alcune affermazioni non verificabili dalle fonti
   - 5: Ogni affermazione è tracciabile a una fonte specifica

3. COMPLETEZZA (1-5): Copre tutti gli aspetti della domanda?
   - 1: Molto superficiale, omette aspetti cruciali
   - 3: Copre i punti principali ma manca dettagli importanti
   - 5: Esaustiva, copre tutti gli aspetti rilevanti

4. QUALITA_CITAZIONI (1-5): Le citazioni normative sono precise e ben formattate?
   - 1: Nessuna citazione o citazioni errate
   - 3: Citazioni presenti ma imprecise (mancano comma/lettera)
   - 5: Citazioni precise con articolo, comma, lettera e riferimento vecchio codice

5. PROFESSIONALITA (1-5): Il tono e il linguaggio sono adatti a commercialisti?
   - 1: Linguaggio generico o inappropriato
   - 3: Adeguato ma con imprecisioni terminologiche
   - 5: Perfettamente professionale, terminologia fiscale corretta

FORMATO DI RISPOSTA (JSON puro, senza markdown):
{
  "relevance": <1-5>,
  "accuracy": <1-5>,
  "completeness": <1-5>,
  "citation_quality": <1-5>,
  "professionalism": <1-5>,
  "overall": <1-5>,
  "reasoning": "<spiegazione in 2-3 frasi dei punti di forza e debolezza>"
}`;

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY non configurata. Usa --skip-llm-judge oppure imposta la variabile d'ambiente."
      );
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export async function runLLMJudge(
  testCase: TestCase,
  metadata: SourceMetadata,
  fullText: string
): Promise<LLMJudgeScores> {
  const client = getOpenAI();

  const sourceSummary = [
    `Articoli TU IVA forniti: ${
      metadata.sources.articles
        .map((a) => `art. ${a.articolo} (${a.titolo})`)
        .join(", ") || "nessuno"
    }`,
    `Interpelli forniti: ${
      metadata.sources.interpelli
        .map((i) => `n. ${i.numero}/${i.anno} (${i.oggetto})`)
        .join(", ") || "nessuno"
    }`,
  ].join("\n");

  const userPrompt = `DOMANDA DELL'UTENTE:
${testCase.query}

DESCRIZIONE DEL TEST:
${testCase.description}

FONTI FORNITE AL SISTEMA:
${sourceSummary}

RISPOSTA GENERATA:
${fullText}

Valuta la risposta secondo i 6 criteri. Rispondi SOLO con JSON valido.`;

  const response = await client.chat.completions.create({
    model: EVAL_CONFIG.judge.model,
    max_tokens: EVAL_CONFIG.judge.maxTokens,
    temperature: EVAL_CONFIG.judge.temperature,
    messages: [
      { role: "system", content: JUDGE_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = response.choices[0]?.message?.content || "";
  try {
    const cleaned = raw
      .replace(/```json\n?/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    return {
      relevance: clamp(parsed.relevance, 1, 5),
      accuracy: clamp(parsed.accuracy, 1, 5),
      completeness: clamp(parsed.completeness, 1, 5),
      citation_quality: clamp(parsed.citation_quality, 1, 5),
      professionalism: clamp(parsed.professionalism, 1, 5),
      overall: clamp(parsed.overall, 1, 5),
      reasoning: parsed.reasoning || "",
    };
  } catch {
    return {
      relevance: 0,
      accuracy: 0,
      completeness: 0,
      citation_quality: 0,
      professionalism: 0,
      overall: 0,
      reasoning: `LLM judge parse error. Raw: ${raw.substring(0, 200)}`,
    };
  }
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
