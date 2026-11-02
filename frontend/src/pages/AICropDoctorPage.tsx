import React, { useEffect, useRef, useState } from 'react';
import { Send, Upload, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { prepareImageFile, callVisionApi, PreparedImage } from '../utils/imageUpload';

/*
  AI CROP DOCTOR — an independent consultation chat, NOT the Crop Health
  dashboard. No health scores, no growth stages, no disease result panel
  here. Text questions go to the existing text chatbot endpoint
  (/api/ai/chat). Photo questions go to the vision endpoint
  (/api/ai/vision, kind=consult) with the actual uploaded photo.
  Conversation history is saved on this device only.
*/
interface ChatMsg { id: string; role: 'user' | 'assistant'; text: string; photo?: string; time: string; }
const HISTORY_KEY = 'krishi_ai_doctor_history';
const SUGGESTED = [
  'Why are my tomato leaves turning yellow?',
  'How much fertilizer does paddy need per acre?',
  'When should I irrigate cotton in summer?',
  'How do I control aphids on brinjal without chemicals?',
  'Which crop suits red soil in Karnataka this season?',
];

export const AICropDoctorPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [image, setImage] = useState<PreparedImage | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-50))); } catch { /* ignore */ } }, [messages]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, sending]);

  const send = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if ((!text && !image) || sending) return;
    setError(''); setInput('');
    const userMsg: ChatMsg = { id: `m-${Date.now()}`, role: 'user', text: text || 'Please look at this photo and answer my farming question.', photo: image?.previewUrl, time: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    const photo = image; setImage(null);
    setSending(true);
    try {
      let answer = '';
      if (photo) {
        const data = await callVisionApi({ kind: 'consult', mimeType: photo.mimeType, image: photo.base64, question: text || 'What does this photo show, and what should the farmer do?' });
        answer = String(data.answer || '');
      } else {
        const res = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: text, language }) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.success) throw new Error(typeof data?.message === 'string' && data.message ? data.message : `Chat failed (status ${res.status}).`);
        answer = String(data.data?.text || '');
      }
      if (!answer) throw new Error('AI returned an empty response. Please try again.');
      setMessages((prev) => [...prev, { id: `m-${Date.now()}-a`, role: 'assistant', text: answer, time: new Date().toISOString() }]);
    } catch (e: any) {
      setError(e?.message || 'Could not get an answer. Please try again.');
    } finally { setSending(false); }
  };

  return (
    <div className="w-full min-w-0 space-y-6 pb-12 animate-in fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] font-heading">AI Crop Doctor</h1>
        <p className="text-xs sm:text-sm text-[#718078]">Ask farming questions in text, or attach a photo and ask about it. Answers come from the AI service in {language === 'kn' ? 'Kannada' : language === 'hi' ? 'Hindi' : 'English'} — change the language in the header and ask again. This is a consultation chat, not a crop health dashboard.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5EDE7] shadow-sm flex flex-col min-h-[480px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[520px]">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-3">
              <MessageCircle className="w-10 h-10 text-[#CBD8D0] mx-auto" />
              <p className="font-bold text-[#3E5248]">Ask your first farming question</p>
              <p className="text-xs text-[#718078] max-w-md mx-auto">Diseases, fertilizers, crop growth, irrigation and farming problems — in text, or with a photo attached.</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {SUGGESTED.map((q) => <button key={q} onClick={() => send(q)} className="text-xs font-semibold px-3 py-2 rounded-full bg-[#ECFDF5] text-[#065F46] hover:bg-[#D1FAE5]">{q}</button>)}
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#065F46] text-white' : 'bg-[#F3F6F4] text-[#172B24]'}`}>
                {m.photo && <img src={m.photo} alt="Photo attached to your question" className="w-full max-w-[260px] h-36 object-cover rounded-xl mb-2" />}
                <p className="whitespace-pre-wrap">{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.role === 'user' ? 'text-[#A7F3D0]' : 'text-[#718078]'}`}>{new Date(m.time).toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
          {sending && <p className="text-xs text-[#718078]">AI Crop Doctor is thinking…</p>}
          <div ref={bottomRef} />
        </div>

        {error && <div className="mx-4 mb-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800"><p className="font-bold">Could not get an answer</p><p>{error}</p><p>If this says the AI key is not configured, the owner must add GEMINI_API_KEY in Vercel environment variables and redeploy.</p></div>}

        <div className="p-3 border-t border-[#E5EDE7] space-y-2">
          {image && (
            <div className="flex items-center gap-2 text-xs">
              <img src={image.previewUrl} alt="Photo attached to your question" className="w-16 h-16 object-cover rounded-xl" />
              <span className="font-semibold text-[#3E5248]">Photo attached — it will be sent to the vision service with your question.</span>
              <button onClick={() => setImage(null)} className="text-rose-600 font-bold">Remove</button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="p-2.5 rounded-xl bg-[#F3F6F4] text-[#065F46] cursor-pointer hover:bg-[#ECFDF5]" title="Attach a photo">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { try { setImage(await prepareImageFile(f)); setError(''); } catch (err: any) { setError(err?.message || 'Could not process this image.'); } } }} className="hidden" />
            </label>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Ask about diseases, fertilizers, growth, irrigation…" className="flex-1 p-2.5 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#10B981] outline-none" />
            <button onClick={() => send()} disabled={sending || (!input.trim() && !image)} className="p-2.5 rounded-xl bg-[#059669] hover:bg-[#065F46] disabled:opacity-40 text-white"><Send className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[#718078]">Suggested questions are above. Photo questions are analysed by the vision service; text questions by the text chatbot.</p>
            <button onClick={() => { setMessages([]); try { localStorage.removeItem(HISTORY_KEY); } catch { /* ignore */ } }} className="text-[11px] font-bold text-rose-600">Clear history</button>
          </div>
        </div>
      </div>
    </div>
  );
};
