/**
 * Frontend client for the CHATBOT-ONLY Gemini endpoint: POST /api/ai/chat
 *
 * The Gemini key is never here, never in a VITE_ variable, and never
 * in any request from the browser. The browser only sends the prompt,
 * language and farm context; the server calls Gemini.
 *
 * Text in, text out ONLY. This service is used only by the floating
 * KRISHI AI COPILOT chatbot — no other AI feature uses it.
 */

export type ChatLanguage = 'en' | 'kn' | 'hi';

export interface AskGeminiChatParams {
  prompt: string;
  language: ChatLanguage;
  context?: Record<string, unknown>;
}

export interface AskGeminiChatResult {
  text: string;
  language: ChatLanguage;
  model: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function askGeminiChat(params: AskGeminiChatParams): Promise<AskGeminiChatResult> {
  const token = localStorage.getItem('krishi_auth_token');
  const response = await fetch(`${API_BASE}/ai/chat`, {
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
  return data.data as AskGeminiChatResult;
}
