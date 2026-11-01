/**
 * Centralized OpenAI text service for KrishiSmart AI.
 *
 * Text in, text out ONLY. No image generation, no image analysis,
 * no voice or audio. The API key is read only from the server
 * environment (OPENAI_API_KEY) and is never sent to the frontend.
 *
 * This file is the single source of truth for the backend route.
 * The Vercel function in frontend/api/ai/generate.ts mirrors the
 * same feature prompts and validation, so the frontend sees one
 * contract whichever deployment serves /api/ai/generate.
 */

export type AiFeature =
  | 'ask-krishi'
  | 'ai-advisor'
  | 'qa'
  | 'crop-recommendation'
  | 'fertilizer'
  | 'irrigation'
  | 'natural-farming'
  | 'daily-briefing';

export type AiLanguage = 'en' | 'kn' | 'hi';

export const AI_FEATURES: AiFeature[] = [
  'ask-krishi',
  'ai-advisor',
  'qa',
  'crop-recommendation',
  'fertilizer',
  'irrigation',
  'natural-farming',
  'daily-briefing',
];

const LANGUAGE_NAMES: Record<AiLanguage, string> = {
  en: 'English',
  kn: 'Kannada (write in Kannada script)',
  hi: 'Hindi (write in Devanagari script)',
};

const BASE_INSTRUCTIONS = [
  'You are KrishiSmart AI, a practical farming advisor for smallholder farmers in Karnataka, India.',
  'Answer in text only. Do not request, describe, generate or analyse images, audio or video.',
  'Answer ONLY in the requested language.',
  'Use only the farm context supplied in the user message. Do not invent mandi prices, weather forecasts, dates, yields, subsidies or eligibility.',
  'If the supplied context does not support a specific number, say so and give a general, safe practice instead of a made-up number.',
  'Keep the answer concise and structured with short headings and bullet points. Prefer locally available, low-cost options first.',
  'Add a one-line caution where a chemical dose is mentioned: follow the product label and local agricultural officer advice.',
].join(' ');

const FEATURE_INSTRUCTIONS: Record<AiFeature, string> = {
  'ask-krishi':
    'Answer the farmer question directly, using the farm context when it is relevant.',
  'ai-advisor':
    'Act as a general farm advisor. Give a practical, step-by-step answer, and list what to check on the farm first.',
  qa: 'Answer the farming question clearly and directly. If the question is not about farming, say so briefly and ask for a farming question.',
  'crop-recommendation':
    'Recommend crops suited to the supplied location, season, soil and water context. Explain why each crop fits, and what would make it a poor fit. Do not guarantee yields or prices.',
  fertilizer:
    'Give fertilizer guidance based on the supplied crop, area and soil context. State amounts per acre where the context supports it, otherwise give a range to confirm with a soil test. Prefer balanced and organic options where suitable.',
  irrigation:
    'Give irrigation guidance based on the supplied soil moisture, weather and pump context. State when to irrigate, how long, and which method (drip, furrow, sprinkler), and when to hold off.',
  'natural-farming':
    'Give natural farming suggestions only: compost, green manure, bio-inputs, mulching, crop rotation and intercropping. Do not recommend synthetic chemicals as the first option.',
  'daily-briefing':
    'Write a short daily farming briefing for today based ONLY on the supplied farm context: weather, soil moisture, crops and farm health. Use headings: Today at a glance, Do today, Watch out for, and Hold off on. No invented prices or forecasts.',
};

export interface OpenAiRequest {
  feature: AiFeature;
  prompt: string;
  language: AiLanguage;
  context?: Record<string, unknown>;
}

export interface OpenAiResult {
  text: string;
  feature: AiFeature;
  language: AiLanguage;
  model: string;
  usage?: unknown;
}

export class OpenAiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 502, code = 'OPENAI_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function sanitizeContext(context: unknown): Record<string, unknown> | undefined {
  if (!context || typeof context !== 'object') return undefined;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context as Record<string, unknown>)) {
    const lower = key.toLowerCase();
    // Never forward images, audio, keys or tokens to the model.
    if (lower.includes('image') || lower.includes('audio') || lower.includes('voice') || lower.includes('key') || lower.includes('token') || lower.includes('password')) continue;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') out[key] = value;
    if (Array.isArray(value)) out[key] = value.filter((v) => typeof v === 'string' || typeof v === 'number').slice(0, 20);
  }
  const text = JSON.stringify(out);
  if (text.length > 2000) return { summary: text.slice(0, 2000) };
  return out;
}

export function validateOpenAiRequest(body: unknown): OpenAiRequest {
  const b = (body ?? {}) as Record<string, unknown>;
  const feature = b.feature as AiFeature;
  const language = (b.language as AiLanguage) || 'en';
  const prompt = typeof b.prompt === 'string' ? b.prompt.trim() : '';
  if (!AI_FEATURES.includes(feature)) {
    throw new OpenAiError(`Invalid feature. Expected one of: ${AI_FEATURES.join(', ')}`, 400, 'INVALID_FEATURE');
  }
  if (!['en', 'kn', 'hi'].includes(language)) {
    throw new OpenAiError('Invalid language. Expected en, kn or hi.', 400, 'INVALID_LANGUAGE');
  }
  if (!prompt || prompt.length > 4000) {
    throw new OpenAiError('Prompt is required and must be under 4000 characters.', 400, 'INVALID_PROMPT');
  }
  return { feature, language, prompt, context: sanitizeContext(b.context) };
}

export async function generateOpenAiText(req: OpenAiRequest): Promise<OpenAiResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new OpenAiError(
      'OpenAI is not configured on the server. Add OPENAI_API_KEY to the server / Vercel environment variables and redeploy.',
      503,
      'OPENAI_KEY_NOT_CONFIGURED'
    );
  }
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const system = `${BASE_INSTRUCTIONS} ${FEATURE_INSTRUCTIONS[req.feature]}`;
  const userText = [
    `Language: ${LANGUAGE_NAMES[req.language]}`,
    req.context ? `Farm context (use only this, do not invent more): ${JSON.stringify(req.context)}` : 'Farm context: none supplied.',
    `Farmer question / task: ${req.prompt}`,
  ].join('\n');

  let res: Response;
  try {
    res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: system }] },
          { role: 'user', content: [{ type: 'input_text', text: userText }] },
        ],
        max_output_tokens: 1200,
        temperature: 0.3,
        store: false,
      }),
    });
  } catch {
    throw new OpenAiError('Could not reach OpenAI. Please try again.', 502, 'OPENAI_UNREACHABLE');
  }

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    if (res.status === 401) throw new OpenAiError('OpenAI rejected the server API key. Check OPENAI_API_KEY on the server.', 502, 'OPENAI_AUTH');
    if (res.status === 429) throw new OpenAiError('OpenAI is rate-limited right now. Please try again in a minute.', 429, 'OPENAI_RATE_LIMIT');
    const msg = typeof data.error === 'object' && data.error !== null ? (data.error as Record<string, unknown>).message : undefined;
    throw new OpenAiError(typeof msg === 'string' ? msg : `OpenAI returned status ${res.status}.`, 502, 'OPENAI_UPSTREAM');
  }

  let text = '';
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    text = data.output_text.trim();
  } else if (Array.isArray(data.output)) {
    const parts: string[] = [];
    for (const item of data.output as Array<Record<string, unknown>>) {
      if (Array.isArray(item.content)) {
        for (const c of item.content as Array<Record<string, unknown>>) {
          if (typeof c.text === 'string') parts.push(c.text);
        }
      }
    }
    text = parts.join('').trim();
  }
  if (!text) throw new OpenAiError('OpenAI returned an empty response. Please try again.', 502, 'OPENAI_EMPTY');

  return { text, feature: req.feature, language: req.language, model, usage: data.usage };
}
