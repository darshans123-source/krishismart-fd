/**
 * Vercel Serverless Function: POST /api/ai/chat — CHATBOT ONLY.
 *
 * This is the ONLY AI endpoint after the OpenAI removal. It powers the
 * floating KRISHI AI COPILOT chatbot and nothing else: no AIHub panels,
 * no Dashboard briefing, no SmartPump AI panel use this endpoint.
 *
 * The Gemini key is read only from the server environment
 * (GEMINI_API_KEY). It is never in frontend code, never in a VITE_
 * variable, and never returned to the client. The key is sent to Google
 * only in a server-side header, never in a browser request or URL.
 *
 * Text in, text out ONLY. No image, voice or audio handling.
 */

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  kn: 'Kannada (write in Kannada script)',
  hi: 'Hindi (write in Devanagari script)',
};

const SYSTEM_INSTRUCTIONS = [
  'You are Krishi AI Copilot, a practical farming advisor for smallholder farmers in Karnataka, India.',
  'Answer in text only. Do not request, describe, generate or analyse images, audio or video.',
  'Answer ONLY in the requested language.',
  'Use only the farm context supplied in the user message. Do not invent mandi prices, weather forecasts, dates, yields, subsidies or eligibility.',
  'If the supplied context does not support a specific number, say so and give a general, safe practice instead of a made-up number.',
  'Keep the answer concise and structured with short headings and bullet points. Prefer locally available, low-cost options first.',
  'Add a one-line caution where a chemical dose is mentioned: follow the product label and local agricultural officer advice.',
].join(' ');

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
    const language = body.language || 'en';
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!['en', 'kn', 'hi'].includes(language)) {
      return res.status(400).json({ success: false, message: 'Invalid language. Expected en, kn or hi.' });
    }
    if (!prompt || prompt.length > 4000) {
      return res.status(400).json({ success: false, message: 'Prompt is required and must be under 4000 characters.' });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        message: 'Gemini is not configured on the server. Add GEMINI_API_KEY to the Vercel environment variables and redeploy.',
      });
    }
    // gemini-2.0-flash was retired by Google (chatbot returned 'model no longer available').
    // Default is now gemini-3.8-flash. If GEMINI_MODEL is set in Vercel to the old name, it will override this — update or remove it there.
    const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const context = sanitizeContext(body.context);
    const userText = [
      `Language: ${LANGUAGE_NAMES[language]}`,
      context ? `Farm context (use only this, do not invent more): ${JSON.stringify(context)}` : 'Farm context: none supplied.',
      `Farmer question: ${prompt}`,
    ].join('\n');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTIONS }] },
        contents: [{ role: 'user', parts: [{ text: userText }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1200 },
      }),
    });
    const data: any = await response.json().catch(() => ({}));
    if (!response.ok) {
      const upstreamMsg = typeof data?.error?.message === 'string' ? data.error.message : '';
      if (response.status === 401 || response.status === 403) {
        return res.status(502).json({ success: false, message: upstreamMsg || 'Gemini rejected the server API key. Check GEMINI_API_KEY on the server.' });
      }
      if (response.status === 429) {
        return res.status(429).json({ success: false, message: upstreamMsg || 'Gemini is rate-limited right now. Please try again in a minute.' });
      }
      return res.status(502).json({ success: false, message: upstreamMsg || `Gemini returned status ${response.status}.` });
    }
    const parts: string[] = [];
    const candidates = Array.isArray(data.candidates) ? data.candidates : [];
    for (const cand of candidates) {
      const contentParts = cand?.content?.parts;
      if (Array.isArray(contentParts)) {
        for (const part of contentParts) if (typeof part.text === 'string') parts.push(part.text);
      }
    }
    const text = parts.join('').trim();
    if (!text) return res.status(502).json({ success: false, message: 'Gemini returned an empty response. Please try again.' });
    return res.status(200).json({ success: true, data: { text, language, model } });
  } catch (e: any) {
    return res.status(502).json({ success: false, message: e?.message || 'AI request failed. Please try again.' });
  }
}
