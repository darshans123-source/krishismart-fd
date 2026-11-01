import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFarmData } from '../../context/FarmDataContext';
import { askOpenAi, AiFeature } from '../../services/openai';

interface OpenAIAskPanelProps {
  feature: AiFeature;
  title: string;
  description: string;
  defaultPrompt: string;
}

/**
 * Reusable text-only OpenAI panel: question in, text answer out.
 * Shows a loading state while waiting and a clear error (with retry)
 * instead of any fabricated answer when OpenAI is unavailable or
 * the server key is not configured.
 */
export const OpenAIAskPanel: React.FC<OpenAIAskPanelProps> = ({
  feature,
  title,
  description,
  defaultPrompt,
}) => {
  const { language } = useLanguage();
  const { locationState, crops, weather, smartPump, aiFarmHealth } = useFarmData();
  const [input, setInput] = useState(defaultPrompt);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const result = await askOpenAi({
        feature,
        prompt,
        language,
        context: {
          district: locationState.address.district,
          state: locationState.address.state,
          crops: crops.map((c) => c.name),
          temperature: weather.temp,
          condition: weather.condition,
          humidity: weather.humidity,
          soilMoisture: weather.soilMoisture,
          rainProbability: weather.rainProbability,
          pumpStatus: smartPump.status,
          farmHealth: aiFarmHealth.overall,
        },
      });
      setOutput(result.text);
    } catch (e: any) {
      setError(e?.message || 'AI request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5EDE7] p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#D1FAE5] text-[#064E3B] flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-[#172B24] font-heading">{title}</h3>
          <p className="text-xs text-[#718078]">{description}</p>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        placeholder="Type your farming question here (text only)"
        className="w-full p-3 rounded-2xl border border-[#E5EDE7] bg-[#F7FAF7] text-sm text-[#243A32] focus:outline-none focus:ring-2 focus:ring-[#059669]"
      />

      <button
        onClick={handleAsk}
        disabled={loading || !input.trim()}
        className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#064E3B] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all"
      >
        {loading ? 'Thinking… please wait' : 'Ask OpenAI'}
      </button>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-[#718078]">
          <span className="w-4 h-4 rounded-full border-2 border-[#10B981] border-t-transparent animate-spin" />
          Contacting OpenAI…
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs leading-relaxed">
          <div className="font-bold mb-1">AI is unavailable right now</div>
          <div>{error}</div>
          <button onClick={handleAsk} className="mt-2 font-bold underline">
            Try again
          </button>
        </div>
      )}

      {output && (
        <div className="p-4 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] text-sm text-[#243A32] leading-relaxed whitespace-pre-line">
          {output}
        </div>
      )}
    </div>
  );
};
