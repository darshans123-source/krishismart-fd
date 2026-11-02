import React, { useEffect, useState } from 'react';
import { Upload, Camera, ShieldAlert, Leaf, FlaskConical, CheckCircle2, RotateCcw } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { prepareImageFile, callVisionApi, PreparedImage } from '../utils/imageUpload';

/*
  CROP HEALTH — its own page, separate from AI Crop Doctor, Soil Health
  and Pest Detection. Overview numbers come from the farmer's real
  planted crops in context. NO diagnosis is shown on page open: a result
  appears only after the user uploads a photo and clicks Analyze, and
  only from a successful /api/ai/vision response. No sample result is
  ever displayed as a real analysis.
*/
interface HealthEntry {
  id: string; date: string; crop: string; diseaseName: string; severity: string; confidence: number;
  symptoms: string; organicTreatment: string[]; chemicalTreatment: string[]; safetyPrecautions: string[]; prevention: string[];
}

const HISTORY_KEY = 'krishi_crop_health_history';

export const CropHealthPage: React.FC = () => {
  const { crops } = useFarmData();
  const [image, setImage] = useState<PreparedImage | null>(null);
  const [fileError, setFileError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [apiError, setApiError] = useState('');
  const [result, setResult] = useState<HealthEntry | null>(null);
  const [history, setHistory] = useState<HealthEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch { /* storage full: history stays in memory */ }
  }, [history]);

  const avgHealth = crops.length ? Math.round(crops.reduce((s, c) => s + c.healthScore, 0) / crops.length) : 0;
  const healthyCount = crops.filter((c) => c.status === 'Healthy').length;
  const attentionCount = crops.length - healthyCount;
  const stageCounts: Record<string, number> = {};
  crops.forEach((c) => { stageCounts[c.currentStage] = (stageCounts[c.currentStage] || 0) + 1; });

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setFileError(''); setApiError(''); setResult(null);
    try { setImage(await prepareImageFile(file)); } catch (e: any) { setFileError(e?.message || 'Could not process this image.'); }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true); setApiError(''); setResult(null);
    try {
      const data = await callVisionApi({ kind: 'disease', mimeType: image.mimeType, image: image.base64 });
      const entry: HealthEntry = {
        id: `health-${Date.now()}`, date: new Date().toISOString(),
        crop: String(data.crop || 'Unknown crop'), diseaseName: String(data.diseaseName || 'No disease visible'),
        severity: String(data.severity || 'Mild'), confidence: Number(data.confidence || 0),
        symptoms: String(data.symptoms || ''),
        organicTreatment: Array.isArray(data.organicTreatment) ? data.organicTreatment : [],
        chemicalTreatment: Array.isArray(data.chemicalTreatment) ? data.chemicalTreatment : [],
        safetyPrecautions: Array.isArray(data.safetyPrecautions) ? data.safetyPrecautions : [],
        prevention: Array.isArray(data.prevention) ? data.prevention : [],
      };
      setResult(entry);
      setHistory((prev) => [entry, ...prev].slice(0, 20));
    } catch (e: any) {
      setApiError(e?.message || 'Analysis failed. Please try again.');
    } finally { setAnalyzing(false); }
  };

  const list = (title: string, items: string[]) => items.length ? (
    <div className="p-4 rounded-2xl bg-white border border-[#E5EDE7] space-y-2">
      <h4 className="font-bold text-xs text-[#172B24]">{title}</h4>
      <ul className="space-y-1 text-xs text-[#3E5248]">{items.map((t, i) => <li key={i} className="flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" /><span>{t}</span></li>)}</ul>
    </div>
  ) : null;

  return (
    <div className="w-full min-w-0 space-y-8 pb-12 animate-in fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] font-heading">Crop Health</h1>
        <p className="text-xs sm:text-sm text-[#718078]">Monitor the health of your planted crops, and analyse a leaf or crop photo with AI — only after you ask for it.</p>
      </div>

      {/* Overview from real planted crops */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-[#E5EDE7] p-4"><p className="text-[11px] font-bold uppercase text-[#718078]">Crops tracked</p><p className="text-xl font-extrabold text-[#065F46]">{crops.length}</p></div>
        <div className="bg-white rounded-2xl border border-[#E5EDE7] p-4"><p className="text-[11px] font-bold uppercase text-[#718078]">Average health score</p><p className="text-xl font-extrabold text-[#065F46]">{crops.length ? `${avgHealth}%` : '—'}</p></div>
        <div className="bg-white rounded-2xl border border-[#E5EDE7] p-4"><p className="text-[11px] font-bold uppercase text-[#718078]">Healthy</p><p className="text-xl font-extrabold text-[#065F46]">{healthyCount}</p></div>
        <div className="bg-white rounded-2xl border border-[#E5EDE7] p-4"><p className="text-[11px] font-bold uppercase text-[#718078]">Needs attention</p><p className="text-xl font-extrabold text-[#065F46]">{attentionCount}</p></div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5EDE7] p-5 space-y-2">
        <h2 className="font-extrabold text-[#172B24] font-heading">Crop growth stages (your planted crops)</h2>
        {crops.length === 0 ? <p className="text-sm text-[#718078]">No crops planted yet. Add a crop from Crop Management to see growth stages here.</p> : (
          <div className="flex flex-wrap gap-2">{Object.entries(stageCounts).map(([stage, n]) => <span key={stage} className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#065F46]">{stage}: {n}</span>)}</div>
        )}
      </div>

      {/* Photo upload + analyze */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5EDE7] p-6 space-y-4">
          <h3 className="font-extrabold text-base text-[#172B24] font-heading">Upload crop photo for AI diagnosis</h3>
          <p className="text-xs text-[#718078]">Take a clear photo of the leaf, fruit or stem showing symptoms. Supports JPG, JPEG, PNG, WEBP, up to 10 MB.</p>
          <label className="border-2 border-dashed border-[#6EE7B7] hover:border-[#10B981] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#ECFDF5]/40 text-center">
            <Upload className="w-8 h-8 text-[#065F46] mb-2" />
            <span className="font-bold text-xs text-[#243A32]">Click to browse or take a photo</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
          </label>
          {image && (
            <div>
              <p className="text-xs font-bold text-[#3E5248] mb-2">Selected image preview</p>
              <img src={image.previewUrl} alt="Selected crop photo preview" className="w-full h-56 object-cover rounded-2xl" />
            </div>
          )}
          {fileError && <p className="text-xs font-bold text-rose-600">{fileError}</p>}
          <button onClick={handleAnalyze} disabled={!image || analyzing} className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#065F46] disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center gap-2">
            <Camera className="w-4 h-4" /> {analyzing ? 'Analyzing…' : 'Analyze Crop Image'}
          </button>
          {analyzing && <p className="text-xs text-[#718078] text-center">Sending your photo to the AI vision service… please wait.</p>}
          {apiError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
              <p className="font-bold">Analysis could not be completed</p>
              <p>{apiError}</p>
              <p>If this says the AI key is not configured, the owner must add GEMINI_API_KEY in Vercel environment variables and redeploy. No key is stored in this app.</p>
              <button onClick={handleAnalyze} disabled={!image} className="px-3 py-2 rounded-xl bg-rose-600 text-white font-bold flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Retry analysis</button>
            </div>
          )}
          {!image && !result && <p className="text-xs text-[#718078]">No diagnosis is shown until you upload a photo and click Analyze Crop Image.</p>}
        </div>

        <div className="lg:col-span-7">
          {analyzing ? (
            <div className="bg-white rounded-2xl border border-[#E5EDE7] p-12 text-center space-y-4 min-h-[300px] flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full border-4 border-[#10B981] border-t-transparent animate-spin" />
              <p className="font-extrabold text-[#172B24]">Analyzing crop health…</p>
              <p className="text-xs text-[#718078]">Your uploaded photo is being processed by the AI vision service.</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">{result.severity} severity</span>
                  <span className="text-xs font-bold text-[#065F46]">AI confidence: {result.confidence}%</span>
                </div>
                <h3 className="text-xl font-black text-[#172B24] font-heading">{result.diseaseName}</h3>
                <p className="text-xs text-[#718078]">Crop identified by AI: {result.crop}</p>
                <div className="p-4 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] text-xs">
                  <p className="font-bold text-[#243A32] mb-1 flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-amber-600" /> Symptoms</p>
                  <p className="text-[#5A6E64] leading-relaxed">{result.symptoms || 'No symptoms returned.'}</p>
                </div>
                <p className="text-[11px] text-[#718078]">This result came from the AI vision response for the photo you uploaded. It is not a sample result, and it does not replace advice from a local agricultural officer for chemical use.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list('Organic treatment', result.organicTreatment)}
                {list('Chemical treatment — follow the product label', result.chemicalTreatment)}
                {list('Safety precautions', result.safetyPrecautions)}
                {list('Prevention', result.prevention)}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-[#CBD8D0] p-8 text-center">
              <Leaf className="w-10 h-10 text-[#CBD8D0] mx-auto mb-2" />
              <p className="font-bold text-[#3E5248]">No analysis yet</p>
              <p className="text-xs text-[#718078] mt-1">Upload a crop photo and click Analyze Crop Image to get a real AI diagnosis here.</p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl border border-[#E5EDE7] p-5 space-y-3">
        <h2 className="font-extrabold text-[#172B24] font-heading flex items-center gap-2"><FlaskConical className="w-4 h-4 text-[#059669]" /> Disease analysis & treatment history</h2>
        {history.length === 0 ? <p className="text-sm text-[#718078]">No analyses yet. Completed analyses from this device will be listed here.</p> : history.map((h) => (
          <div key={h.id} className="flex flex-wrap justify-between gap-2 p-3 rounded-2xl bg-[#F3F6F4] text-xs">
            <span><strong>{h.diseaseName}</strong> · {h.crop} · {h.severity}</span>
            <span className="text-[#718078]">{new Date(h.date).toLocaleString('en-IN')} · AI confidence {h.confidence}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
