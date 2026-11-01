/**
 * Vercel Serverless Function: POST /api/ai/generate
 *
 * This is the same centralized contract as the Express backend
 * (backend/src/services/ai/openai.service.ts). It exists so the
 * Vercel-hosted frontend works even when the Express backend is
 * not deployed: the frontend calls /api/ai/generate, and whichever
 * deployment serves it uses the same validation, prompts and
 * response shape.
 *
 * OPENAI_API_KEY is read only from the server environment.
 * It is never in frontend code, never in a VITE_ variable, and
 * never returned to the client.
 *
 * Text in, text out ONLY. No image, voice or audio handling.
 */

type AiFeature =
  | 'ask-krishi'
  | 'ai-advisor'
  | 'qa'
  | 'crop-recommendation'
  | 'fertilizer'
  | 'irrigation'
  | 'natural-farming'
  | 'daily-briefing';

const AI_FEATURES: AiFeature[] = [
  'ask-krishi',
  'ai-advisor',
  'qa',
  'crop-recommendation',
  'fertilizer',
  'irrigation',
  'natural-farming',
  'daily-briefing',
];

const LANGUAGE_NAMES: Record<string, string> = {
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
  'ask-krishi': 'Answer the farmer question directly, using the farm context when it is relevant.',
  'ai-advisor': 'Act as a general farm advisor. Give a practical, step-by-step answer, and list what to check on the farm first.',
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

function sanitizeContext(context: unknown): Record<string, unknown> | undefined {
  if (!context || typeof context !== 'object') return undefined;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context as Record<string, unknown>)) {
    const lower = key.toLowerCase();
    if (lower.includes('image') || lower.includes('audio') || lower.includes('voice') || lower.includes('key') || lower.includes('token') || lower.includes('password')) continue;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') out[key] = value;
    if (Array.isArray(value)) out[key] = value.filter((v) => typeof v === 'string' || typeof v === 'number').slice(0, 20);
  }
  const text = JSON.stringify(out);
  if (text.length > 2000) return { summary: text.slice(0, 2000) };
  return out;
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed. Use POST.' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const feature = body.feature as AiFeature;
    const language = body.language || 'en';
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!AI_FEATURES.includes(feature)) {
      return res.status(400).json({ success: false, message: `Invalid feature. Expected one of: ${AI_FEATURES.join(', ')}` });
    }
    if (!['en', 'kn', 'hi'].includes(language)) {
      return res.status(400).json({ success: false, message: 'Invalid language. Expected en, kn or hi.' });
    }
    if (!prompt || prompt.length > 4000) {
      return res.status(400).json({ success: false, message: 'Prompt is required and must be under 4000 characters.' });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        message: 'OpenAI is not configured on the server. Add OPENAI_API_KEY to the Vercel environment variables and redeploy.',
      });
    }
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const system = `${BASE_INSTRUCTIONS} ${FEATURE_INSTRUCTIONS[feature]}`;
    const context = sanitizeContext(body.context);
    const userText = [
      `Language: ${LANGUAGE_NAMES[language]}`,
      context ? `Farm context (use only this, do not invent more): ${JSON.stringify(context)}` : 'Farm context: none supplied.',
      `Farmer question / task: ${prompt}`,
    ].join('\n');

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
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
    const data: any = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) return res.status(502).json({ success: false, message: 'OpenAI rejected the server API key. Check OPENAI_API_KEY on the server.' });
      if (response.status === 429) return res.status(429).json({ success: false, message: 'OpenAI is rate-limited right now. Please try again in a minute.' });
      const msg = data?.error?.message;
      return res.status(502).json({ success: false, message: typeof msg === 'string' ? msg : `OpenAI returned status ${response.status}.` });
    }
    let text = '';
    if (typeof data.output_text === 'string' && data.output_text.trim()) text = data.output_text.trim();
    else if (Array.isArray(data.output)) {
      const parts: string[] = [];
      for (const item of data.output) {
        if (Array.isArray(item.content)) for (const c of item.content) if (typeof c.text === 'string') parts.push(c.text);
      }
      text = parts.join('').trim();
    }
    if (!text) return res.status(502).json({ success: false, message: 'OpenAI returned an empty response. Please try again.' });
    return res.status(200).json({ success: true, data: { text, feature, language, model, usage: data.usage } });
  } catch (e: any) {
    return res.status(502).json({ success: false, message: e?.message || 'AI request failed. Please try again.' });
  }
}
