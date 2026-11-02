/**
 * Vercel Serverless Function: POST /api/ai/vision — IMAGE ANALYSIS ONLY.
 * Used by Crop Health (disease), Pest Detection (pest) and AI Crop Doctor
 * (photo question). It is NOT used by the text-only chatbot (/api/ai/chat).
 *
 * The Gemini key is read only from the server environment (GEMINI_API_KEY).
 * It is never in frontend code, never in a VITE_ variable, and never
 * returned to the client. The image is sent to Google only in this
 * server-side request, never as a browser URL.
 *
 * No hardcoded diagnosis, no sample result, no fake confidence score:
 * if Gemini does not return a parseable result, this endpoint returns
 * an error and the frontend shows "retry" — it never invents a result.
 * If GEMINI_API_KEY is not set, it returns 503 with the setup step.
 */

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

function jsonInstruction(kind: string): string {
  if (kind === 'pest') {
    return [
      'Analyse this photo for INSECTS / PESTS only, not plant diseases.',
      'Return JSON ONLY, no markdown, no extra text, with exactly these fields:',
      '{ "crop": string, "pestName": string, "confidence": number (0-100),',
      '  "severity": "Mild" | "Moderate" | "Severe", "symptoms": string,',
      '  "organicControl": string[], "chemicalControl": string[],',
      '  "safetyPrecautions": string[], "ipm": string[], "prevention": string[] }',
      'If no pest is visible, set pestName to "No pest visible", confidence to 0,',
      'and explain that in symptoms. Never invent a pest that is not visible.',
      'Chemical control entries must include following the product label and',
      'wearing protective equipment. Do not give a dose you are unsure of.',
    ].join(' ');
  }
  if (kind === 'consult') {
    return [
      'Answer the farmer question about the photo in plain text only.',
      'Return JSON ONLY: { "answer": string, "confidence": number (0-100) }.',
      'If the photo does not show what the question asks about, say so.',
      'Never invent a disease, pest, price, yield or subsidy that is not visible or known.',
    ].join(' ');
  }
  return [
    'Analyse this photo for CROP DISEASE only.',
    'Return JSON ONLY, no markdown, no extra text, with exactly these fields:',
    '{ "crop": string, "diseaseName": string, "scientificName": string,',
    '  "confidence": number (0-100), "severity": "Mild" | "Moderate" | "Severe",',
    '  "symptoms": string, "organicTreatment": string[], "chemicalTreatment": string[],',
    '  "safetyPrecautions": string[], "prevention": string[] }',
    'If no disease is visible, set diseaseName to "No disease visible", confidence to 0,',
    'and explain that in symptoms. Never invent a disease that is not visible.',
    'Chemical treatment entries must include following the product label and',
    'wearing protective equipment. Do not give a dose you are unsure of.',
  ].join(' ');
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed. Use POST.' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const kind = body.kind === 'pest' || body.kind === 'consult' ? body.kind : 'disease';
    const mimeType = typeof body.mimeType === 'string' ? body.mimeType : '';
    const image = typeof body.image === 'string' ? body.image : '';
    const question = typeof body.question === 'string' ? body.question.trim().slice(0, 1000) : '';
    if (!ALLOWED_MIME.includes(mimeType)) {
      return res.status(400).json({ success: false, message: 'Only JPG, JPEG, PNG and WEBP images are supported.' });
    }
    if (!image || image.length > 6_000_000) {
      return res.status(400).json({ success: false, message: 'Image is required and must be under about 4 MB after resizing.' });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        message: 'AI vision is not configured on the server. Add GEMINI_API_KEY to the Vercel environment variables and redeploy. No analysis was run.',
      });
    }
    const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const parts: any[] = [{ text: jsonInstruction(kind) }];
    if (question) parts.push({ text: `Farmer question: ${question}` });
    parts.push({ inlineData: { mimeType, data: image } });
    let response: any = null;
    let data: any = {};
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 1500));
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1200 },
        }),
      });
      data = await response.json().catch(() => ({}));
      if (response.status !== 503) break;
    }
    if (!response.ok) {
      const upstreamMsg = typeof data?.error?.message === 'string' ? data.error.message : '';
      if (response.status === 401 || response.status === 403) return res.status(502).json({ success: false, message: upstreamMsg || 'Gemini rejected the server API key. Check GEMINI_API_KEY on the server.' });
      if (response.status === 429) return res.status(429).json({ success: false, message: upstreamMsg || 'Gemini is rate-limited right now. Please try again in a minute.' });
      if (response.status === 503) return res.status(503).json({ success: false, message: 'AI is busy right now. Please try again in a moment.' });
      return res.status(502).json({ success: false, message: upstreamMsg || `Gemini returned status ${response.status}.` });
    }
    const textParts: string[] = [];
    for (const cand of Array.isArray(data.candidates) ? data.candidates : []) {
      for (const part of cand?.content?.parts || []) if (typeof part.text === 'string') textParts.push(part.text);
    }
    const rawText = textParts.join('').trim();
    if (!rawText) return res.status(502).json({ success: false, message: 'Gemini returned an empty response. Please try again.' });
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) return res.status(502).json({ success: false, message: 'AI returned a response that could not be parsed as a result. Please try again — no diagnosis was saved.' });
    let parsed: any;
    try { parsed = JSON.parse(match[0]); } catch {
      return res.status(502).json({ success: false, message: 'AI returned a response that could not be parsed as a result. Please try again — no diagnosis was saved.' });
    }
    return res.status(200).json({ success: true, data: { ...parsed, kind, model } });
  } catch (e: any) {
    return res.status(502).json({ success: false, message: e?.message || 'AI vision request failed. Please try again.' });
  }
}
