import React, { useEffect, useState } from 'react';
import { FlaskConical, Upload, Save } from 'lucide-react';

/*
  SOIL HEALTH — its own dashboard, separate from Crop Health.
  NO soil readings are invented: if you have not entered values, the
  dashboard is empty and says so. The "Load demo values" button fills
  clearly labelled DEMO values only, so a demo is never mistaken for
  your soil test. Fertilizer guidance is a rule-based estimate from
  YOUR entered values against medium benchmarks (N 280, P 45, K 280),
  not a lab report. Follow product labels and local officer advice.
*/
interface SoilValues { ph: string; nitrogen: string; phosphorus: string; potassium: string; organicCarbon: string; moisture: string; }
const EMPTY: SoilValues = { ph: '', nitrogen: '', phosphorus: '', potassium: '', organicCarbon: '', moisture: '' };
const DEMO: SoilValues = { ph: '6.8', nitrogen: '240', phosphorus: '38', potassium: '280', organicCarbon: '0.68', moisture: '22' };
const KEY = 'krishi_soil_values';
const REPORT_KEY = 'krishi_soil_reports';

function statusFor(value: number, low: number, high: number): string {
  if (value < low) return 'Low';
  if (value > high) return 'High';
  return 'Optimal';
}

export const SoilHealthPage: React.FC = () => {
  const [values, setValues] = useState<SoilValues>(() => {
    try { return { ...EMPTY, ...(JSON.parse(localStorage.getItem(KEY) || '{}')) }; } catch { return EMPTY; }
  });
  const [isDemo, setIsDemo] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reports, setReports] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(REPORT_KEY) || '[]'); } catch { return []; }
  });

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(values)); } catch { /* ignore */ } }, [values]);
  useEffect(() => { try { localStorage.setItem(REPORT_KEY, JSON.stringify(reports)); } catch { /* ignore */ } }, [reports]);

  const num = (s: string) => { const n = parseFloat(s); return Number.isFinite(n) ? n : null; };
  const ph = num(values.ph); const n = num(values.nitrogen); const p = num(values.phosphorus); const k = num(values.potassium); const oc = num(values.organicCarbon); const moisture = num(values.moisture);
  const entered = ph !== null || n !== null || p !== null || k !== null;

  const suitability = [
    { crop: 'Paddy', ok: ph !== null && ph >= 5.5 && ph <= 7.5, note: 'Prefers near-neutral to slightly acidic soil with good water retention.' },
    { crop: 'Wheat', ok: ph !== null && ph >= 6.0 && ph <= 7.5, note: 'Prefers neutral loam; avoid very acidic or saline soil.' },
    { crop: 'Cotton', ok: ph !== null && ph >= 6.0 && ph <= 8.0, note: 'Tolerates black cotton soil; needs good drainage.' },
    { crop: 'Tomato', ok: ph !== null && ph >= 6.0 && ph <= 7.0, note: 'Prefers slightly acidic, well-drained loam.' },
    { crop: 'Groundnut', ok: ph !== null && ph >= 5.5 && ph <= 7.0, note: 'Prefers light sandy loam; avoid waterlogging.' },
  ];

  const fert: string[] = [];
  if (n !== null && n < 280) fert.push(`Nitrogen is below the medium benchmark (280 kg/ha): consider urea as per your local recommendation — roughly ${(Math.round((280 - n) * 0.22))} kg urea per acre as a planning estimate, split into 2–3 doses. Follow the product label.`);
  if (p !== null && p < 45) fert.push(`Phosphorus is below the medium benchmark (45 kg/ha): consider DAP at sowing as per your local recommendation.`);
  if (k !== null && k < 280) fert.push(`Potassium is below the medium benchmark (280 kg/ha): consider MOP, split at tillering and flowering, as per your local recommendation.`);
  if (n !== null && n >= 280 && p !== null && p >= 45 && k !== null && k >= 280) fert.push('NPK are at or above medium benchmarks — do not add extra NPK blindly; confirm with a soil test before the next season.');

  const improvements: string[] = [];
  if (oc !== null && oc < 0.75) improvements.push('Organic carbon is low: add farmyard manure or compost (5–10 tonnes/acre where available) and practise crop rotation with legumes.');
  if (ph !== null && ph < 6.0) improvements.push('Soil is acidic: consider agricultural lime as advised by your local soil testing lab — do not lime without a lab recommendation.');
  if (ph !== null && ph > 8.0) improvements.push('Soil is alkaline: add gypsum and organic matter as advised by your local soil testing lab.');
  if (moisture !== null && moisture < 15) improvements.push('Soil moisture is low: mulch and irrigate at critical growth stages; consider drip where water is scarce.');

  const field = (label: string, key: keyof SoilValues, unit: string, step = 'any') => (
    <div>
      <label className="block font-bold text-xs text-[#3E5248] mb-1">{label} ({unit})</label>
      <input type="number" step={step} value={values[key]} onChange={(e) => { setValues((v) => ({ ...v, [key]: e.target.value })); setSaved(false); }} placeholder="Leave blank if not tested" className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#10B981] outline-none" />
    </div>
  );

  return (
    <div className="w-full min-w-0 space-y-8 pb-12 animate-in fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] font-heading">Soil Health</h1>
        <p className="text-xs sm:text-sm text-[#718078]">Enter your soil test values, or upload your soil test report. Nothing here is a lab reading unless you entered it or uploaded it.</p>
      </div>

      {isDemo && <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-sm font-bold text-amber-900">DEMO MODE — these values are an example only, not your soil test. Enter your own values to replace them.</div>}

      <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 space-y-4">
        <h2 className="font-extrabold text-[#172B24] font-heading flex items-center gap-2"><FlaskConical className="w-4 h-4 text-[#059669]" /> Soil test data entry</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {field('Soil pH', 'ph', 'pH scale')}
          {field('Nitrogen (N)', 'nitrogen', 'kg/ha')}
          {field('Phosphorus (P)', 'phosphorus', 'kg/ha')}
          {field('Potassium (K)', 'potassium', 'kg/ha')}
          {field('Organic carbon', 'organicCarbon', '%')}
          {field('Soil moisture', 'moisture', '% (if available)')}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSaved(true)} className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#065F46] text-white font-bold text-xs flex items-center gap-1.5"><Save className="w-4 h-4" /> Save soil values</button>
          <button onClick={() => { setValues(DEMO); setIsDemo(true); setSaved(false); }} className="px-4 py-2.5 rounded-xl bg-[#F3F6F4] text-[#065F46] font-bold text-xs">Load demo values (clearly labelled)</button>
          <button onClick={() => { setValues(EMPTY); setIsDemo(false); setSaved(false); }} className="px-4 py-2.5 rounded-xl bg-[#F3F6F4] text-[#065F46] font-bold text-xs">Clear all</button>
          {saved && <span className="text-xs font-bold text-[#065F46] self-center">✓ Saved on this device. Values remain after refresh.</span>}
        </div>

        <div>
          <label className="block font-bold text-xs text-[#3E5248] mb-1 flex items-center gap-1.5"><Upload className="w-4 h-4" /> Soil test report upload (PDF / image)</label>
          <input type="file" accept=".pdf,image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setReports((prev) => [`${f.name} — ${new Date().toLocaleDateString('en-IN')}`, ...prev].slice(0, 10)); }} className="text-xs" />
          <p className="text-[11px] text-[#718078] mt-1">Uploading records the report name and date on this device. The file content is not parsed into readings and is not sent to a government lab — enter the readings above from the report yourself.</p>
          {reports.length > 0 && <ul className="mt-2 space-y-1 text-xs text-[#3E5248]">{reports.map((r, i) => <li key={i}>• {r}</li>)}</ul>}
        </div>
      </div>

      {!entered ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#CBD8D0] p-8 text-center">
          <p className="font-bold text-[#3E5248]">No soil values entered yet</p>
          <p className="text-xs text-[#718078] mt-1">Enter pH, N, P, K and organic carbon above to see suitability, fertilizer guidance and improvement suggestions. No readings have been invented for you.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'pH', value: ph !== null ? String(ph) : '—', status: ph !== null ? statusFor(ph, 6.0, 7.5) : '' },
              { label: 'Nitrogen', value: n !== null ? `${n} kg/ha` : '—', status: n !== null ? statusFor(n, 280, 400) : '' },
              { label: 'Phosphorus', value: p !== null ? `${p} kg/ha` : '—', status: p !== null ? statusFor(p, 25, 50) : '' },
              { label: 'Potassium', value: k !== null ? `${k} kg/ha` : '—', status: k !== null ? statusFor(k, 280, 400) : '' },
              { label: 'Organic carbon', value: oc !== null ? `${oc}%` : '—', status: oc !== null ? statusFor(oc, 0.75, 1.5) : '' },
              { label: 'Moisture', value: moisture !== null ? `${moisture}%` : '—', status: '' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#E5EDE7] p-4">
                <p className="text-[11px] font-bold uppercase text-[#718078]">{s.label}</p>
                <p className="text-lg font-extrabold text-[#065F46] mt-1">{s.value}</p>
                {s.status && <p className="text-[11px] font-bold text-[#718078]">{s.status}</p>}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#E5EDE7] p-5 space-y-3">
            <h2 className="font-extrabold text-[#172B24] font-heading">Soil suitability for crops (guide, based on your pH)</h2>
            {suitability.map((s) => <div key={s.crop} className="flex flex-wrap justify-between gap-2 p-3 rounded-2xl bg-[#F3F6F4] text-xs"><span><strong>{s.crop}</strong> — {s.note}</span><span className={`font-bold ${s.ok ? 'text-[#065F46]' : 'text-amber-700'}`}>{s.ok ? 'Suitable' : 'Less suitable'}</span></div>)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#E5EDE7] p-5 space-y-2">
              <h2 className="font-extrabold text-[#172B24] font-heading">Fertilizer recommendations (estimates)</h2>
              {fert.length ? fert.map((f, i) => <p key={i} className="text-xs text-[#3E5248] leading-relaxed">• {f}</p>) : <p className="text-xs text-[#718078]">Enter N, P and K to see guidance.</p>}
            </div>
            <div className="bg-white rounded-2xl border border-[#E5EDE7] p-5 space-y-2">
              <h2 className="font-extrabold text-[#172B24] font-heading">Soil improvement suggestions</h2>
              {improvements.length ? improvements.map((f, i) => <p key={i} className="text-xs text-[#3E5248] leading-relaxed">• {f}</p>) : <p className="text-xs text-[#718078]">No improvement flags from the values entered so far.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
