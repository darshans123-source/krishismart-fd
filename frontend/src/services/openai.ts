/**
 * Frontend client for the ONE centralized AI endpoint: POST /api/ai/generate
 *
 * The OpenAI key is never here, never in a VITE_ variable, and never
 * in any request from the browser. The browser only sends the feature,
 * prompt, language and farm context; the server calls OpenAI.
 *
 * Text in, text out ONLY. No image, voice or audio payloads are sent.
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

export interface AskOpenAiParams {
  feature: AiFeature;
  prompt: string;
  language: AiLanguage;
  context?: Record<string, unknown>;
}

export interface AskOpenAiResult {
  text: string;
  feature: AiFeature;
  language: AiLanguage;
  model: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function askOpenAi(params: AskOpenAiParams): Promise<AskOpenAiResult> {
  const token = localStorage.getItem('krishi_auth_token');
  const response = await fetch(`${API_BASE}/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(params),
  });
  let data: any = {};
  try {
    data = await response.json();
  } catch {
    // keep the HTTP status error below
  }
  if (!response.ok || !data.success) {
    throw new Error(data.message || `AI request failed (HTTP ${response.status}). Please try again.`);
  }
  if (!data.data?.text) {
    throw new Error('AI returned an empty response. Please try again.');
  }
  return data.data as AskOpenAiResult;
}
