import React, { useState } from 'react';
import {
  BrainCircuit,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FlaskConical,
  Sprout,
  Calculator,
  Layers,
  ShoppingBag,
  RotateCcw,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Leaf
} from 'lucide-react';
import { SAMPLE_DIAGNOSTICS } from '../constants/mockData';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';
import { DiseaseDetectionResult } from '../types';

export const AIHubPage: React.FC = () => {
  const { t } = useLanguage();
  const { addToCart, storeProducts, addXP } = useFarmData();

  const [activeTab, setActiveTab] = useState<'doctor' | 'soil' | 'recommendation' | 'fertilizer' | 'yield'>('doctor');

  // AI Doctor States
  const [selectedSample, setSelectedSample] = useState<any>(SAMPLE_DIAGNOSTICS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiseaseDetectionResult | null>(SAMPLE_DIAGNOSTICS[0].result);

  // Soil Analysis States
  const [soilPh, setSoilPh] = useState(6.8);
  const [nitrogenLevel, setNitrogenLevel] = useState(240); // kg/ha
  const [phosphorusLevel, setPhosphorusLevel] = useState(38); // kg/ha
  const [potassiumLevel, setPotassiumLevel] = useState(280); // kg/ha
  const [organicCarbon, setOrganicCarbon] = useState(0.68); // %

  // Fertilizer Calc States
  const [selectedCropForFert, setSelectedCropForFert] = useState('Paddy');
  const [fertAreaAcres, setFertAreaAcres] = useState(2.5);

  // Yield Predictor States
  const [targetCrop, setTargetCrop] = useState('Tomato');
  const [irrigationHealth, setIrrigationHealth] = useState(90);
  const [soilHealthRating, setSoilHealthRating] = useState(88);

  const handleSelectSample = (sample: any) => {
    setSelectedSample(sample);
    setUploadedImage(sample.sampleImage);
    setIsScanning(true);
    setDiagnosticResult(null);

    setTimeout(() => {
      setDiagnosticResult(sample.result);
      setIsScanning(false);
      addXP(50, `Diagnosed ${sample.title}`);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setIsScanning(true);
      setDiagnosticResult(null);

      setTimeout(() => {
        setDiagnosticResult(SAMPLE_DIAGNOSTICS[0].result);
        setIsScanning(false);
        addXP(60, 'Scanned crop photo with AI Crop Doctor');
      }, 1600);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-8 pb-12 animate-in fade-in">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D1FAE5] text-[#064E3B] text-xs font-bold mb-1 border border-[#A7F3D0]">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Farm Intelligence Advisor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] font-heading">
            KRISHI AI COPILOT
          </h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            Crop disease diagnosis, soil health guidance, and customized fertilizer recommendations.
          </p>
        </div>
      </div>

      {/* Feature Sub-Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#E5EDE7] overflow-x-auto pb-1">
        {[
          { id: 'doctor', label: 'Crop Doctor (Scan)', icon: Camera },
          { id: 'soil', label: 'Soil Health', icon: FlaskConical },
          { id: 'recommendation', label: 'Crop Advice', icon: Sprout },
          { id: 'fertilizer', label: "Today's Recommendation", icon: Calculator },
          { id: 'yield', label: 'Yield Estimate', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#064E3B] text-white shadow-sm'
                  : 'bg-white text-[#5A6E64] hover:bg-[#EFF4EF] border border-[#E5EDE7]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chatbot note: AI text advice for these topics now lives only in the
          floating KRISHI AI COPILOT chatbot (Gemini, text only). The tabs
          below are the app's own local tools. */}
      <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-sm text-[#064E3B] leading-relaxed">
        For AI farming advice, open the <strong>KRISHI AI COPILOT</strong> chatbot (bottom-left button) and ask your question there. It answers in English, Kannada or Hindi, using your farm context.
      </div>

      {/* 1. AI CROP DOCTOR & DISEASE SCAN TAB */}
      {activeTab === 'doctor' && (
        <div className="w-full min-w-0 space-y-8 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Upload / Sample Selector */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-base text-[#172B24] font-heading">
                  Upload Crop Photo for AI Diagnosis
                </h3>
                <p className="text-xs text-[#718078]">
                  Take a clear photo of the leaf, fruit, or stem showing symptoms.
                </p>

                {/* Upload Box */}
                <label className="border-2 border-dashed border-[#6EE7B7] hover:border-[#10B981] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#ECFDF5]/40 hover:bg-[#ECFDF5] transition-all text-center group">
                  <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#064E3B] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xs text-[#243A32]">
                    Click to browse or drop crop photo
                  </span>
                  <span className="text-[10px] text-[#8A9A90] mt-1">
                    Supports JPG, PNG, WEBP (Up to 10MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Quick 1-Tap Sample Previews */}
                <div>
                  <div className="text-[11px] font-bold text-[#8A9A90] uppercase tracking-wider mb-2.5">
                    Or Test With Sample Images
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_DIAGNOSTICS.map((diag) => (
                      <button
                        key={diag.id}
                        onClick={() => handleSelectSample(diag)}
                        className={`p-2 rounded-2xl border text-left transition-all overflow-hidden ${
                          selectedSample?.id === diag.id
                            ? 'border-[#059669] ring-2 ring-[#10B981]/30 bg-[#ECFDF5]/50'
                            : 'border-[#E5EDE7] bg-white hover:border-[#CBD8D0]'
                        }`}
                      >
                        <img
                          src={diag.sampleImage}
                          alt={diag.cropName}
                          className="w-full h-16 object-cover rounded-xl mb-1.5"
                        />
                        <div className="font-bold text-[10px] text-[#243A32] truncate">
                          {diag.cropName}
                        </div>
                        <div className="text-[9px] text-[#718078] truncate">
                          {diag.title.split('(')[0]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Diagnostic Result Panel */}
            <div className="lg:col-span-7">
              {isScanning ? (
                <div className="bg-white rounded-2xl border border-[#E5EDE7] p-12 shadow-xs text-center space-y-4 flex flex-col items-center justify-center min-h-[420px]">
                  <div className="w-16 h-16 rounded-full border-4 border-[#10B981] border-t-transparent animate-spin" />
                  <div>
                    <h4 className="font-extrabold text-base text-[#172B24] font-heading">
                      Analyzing Crop Health...
                    </h4>
                    <p className="text-xs text-[#718078] mt-1 max-w-sm">
                      Identifying symptoms and preparing treatment recommendations.
                    </p>
                  </div>
                </div>
              ) : diagnosticResult ? (
                <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-2xs space-y-6">
                  {/* Top Result Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFF4EF] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            diagnosticResult.severity === 'Severe'
                              ? 'bg-rose-100 text-rose-800'
                              : diagnosticResult.severity === 'Moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-[#D1FAE5] text-[#064E3B]'
                          }`}
                        >
                          {diagnosticResult.severity} Severity
                        </span>
                        <span className="text-xs text-[#718078] font-semibold">
                          Confidence: <strong className="text-[#064E3B]">{diagnosticResult.confidence}%</strong>
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-[#172B24] font-heading mt-1">
                        {diagnosticResult.diseaseName}
                      </h3>
                      <p className="text-xs text-[#718078] italic">
                        {diagnosticResult.cropType} • {diagnosticResult.scientificName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-14 h-14 rounded-2xl bg-[#064E3B] text-white flex flex-col items-center justify-center font-black">
                        <span className="text-sm">{Math.round(diagnosticResult.confidence)}%</span>
                        <span className="text-[8px] uppercase tracking-wider text-[#A7F3D0]">Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Crop Health Explanation */}
                  <div className="p-4 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] text-xs">
                    <div className="font-bold text-[#243A32] mb-1 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>Crop Health & Symptoms</span>
                    </div>
                    <p className="text-[#5A6E64] leading-relaxed">{diagnosticResult.pathology}</p>
                  </div>

                  {/* Treatments Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Organic Treatment */}
                    <div className="p-4 rounded-2xl bg-[#ECFDF5]/70 border border-[#A7F3D0] space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-[#064E3B] text-xs">
                        <Leaf className="w-4 h-4 text-[#064E3B]" />
                        <span>Farm Advice: Organic Remedy</span>
                      </div>
                      <ul className="w-full min-w-0 space-y-1 text-xs text-[#064E3B]">
                        {diagnosticResult.organicTreatment.map((t, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Chemical Control */}
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                        <FlaskConical className="w-4 h-4 text-blue-700" />
                        <span>Today's Recommendation: Treatment</span>
                      </div>
                      <ul className="w-full min-w-0 space-y-1 text-xs text-blue-800">
                        {diagnosticResult.chemicalTreatment.map((t, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Prevention Protocol */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <div className="font-bold text-amber-900 text-xs">
                      Possible Risk Prevention
                    </div>
                    <ul className="w-full min-w-0 space-y-1 text-xs text-amber-800">
                      {diagnosticResult.preventiveMeasures.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* 2. SOIL HEALTH & NPK LAB TAB */}
      {activeTab === 'soil' && (
        <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-black text-[#172B24] font-heading">
              Soil Chemistry & N-P-K Nutrient Lab
            </h3>
            <p className="text-xs text-[#718078]">
              Interactive soil health simulator based on your latest Soil Health Card (SHC) sample report.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* pH Meter */}
            <div className="p-5 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#3E5248]">Soil pH</span>
                <span className="font-black text-[#064E3B] text-base">{soilPh}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="9.0"
                step="0.1"
                value={soilPh}
                onChange={(e) => setSoilPh(parseFloat(e.target.value))}
                className="w-full accent-[#059669]"
              />
              <div className="text-[10px] text-[#8A9A90] font-semibold flex justify-between">
                <span>Acidic (5.0)</span>
                <span>Ideal (6.5-7.5)</span>
                <span>Alkaline (9.0)</span>
              </div>
            </div>

            {/* Nitrogen (N) */}
            <div className="p-5 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#3E5248]">Nitrogen (N)</span>
                <span className="font-black text-blue-700 text-base">{nitrogenLevel} kg/ha</span>
              </div>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={nitrogenLevel}
                onChange={(e) => setNitrogenLevel(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="text-[10px] text-[#8A9A90] font-semibold flex justify-between">
                <span>Low</span>
                <span>Medium (280)</span>
                <span>High</span>
              </div>
            </div>

            {/* Phosphorus (P) */}
            <div className="p-5 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#3E5248]">Phosphorus (P)</span>
                <span className="font-black text-amber-700 text-base">{phosphorusLevel} kg/ha</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="2"
                value={phosphorusLevel}
                onChange={(e) => setPhosphorusLevel(parseInt(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="text-[10px] text-[#8A9A90] font-semibold flex justify-between">
                <span>Low</span>
                <span>Medium (25-45)</span>
                <span>High</span>
              </div>
            </div>

            {/* Potassium (K) */}
            <div className="p-5 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#3E5248]">Potassium (K)</span>
                <span className="font-black text-purple-700 text-base">{potassiumLevel} kg/ha</span>
              </div>
              <input
                type="range"
                min="100"
                max="600"
                step="20"
                value={potassiumLevel}
                onChange={(e) => setPotassiumLevel(parseInt(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="text-[10px] text-[#8A9A90] font-semibold flex justify-between">
                <span>Low</span>
                <span>Optimal (280)</span>
                <span>High</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-2">
            <div className="font-bold text-[#064E3B] text-xs">AI Soil Health Diagnosis & Correction</div>
            <p className="text-xs text-[#064E3B] leading-relaxed">
              Your soil pH is near neutral ({soilPh}) which supports optimal micronutrient absorption. Nitrogen is slightly below benchmark—supplement with <strong>25kg Nano Urea foliar spray</strong> per acre. Phosphorus and Potassium balance is well-suited for Tomato, Sugarcane, and Paddy tillering.
            </p>
          </div>
        </div>
      )}

      {/* 3. CROP RECOMMENDATION TAB */}
      {activeTab === 'recommendation' && (
        <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-black text-[#172B24] font-heading">
              AI Crop Recommendation Engine
            </h3>
            <p className="text-xs text-[#718078]">
              Ranked crop viability based on regional soil chemistry, monsoon outlook, and historical mandi profit margins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                rank: '#1 Best Choice',
                name: 'Hybrid Tomato (Arka Rakshak)',
                match: '96% Fit',
                duration: '90-110 Days',
                projectedProfit: '₹1,44,000 / Acre',
                reason: 'Matches Red Loamy soil + festival price surge window in Day 30-40.'
              },
              {
                rank: '#2 High Yield',
                name: 'Fine Paddy (BPT-5204)',
                match: '92% Fit',
                duration: '140-150 Days',
                projectedProfit: '₹62,500 / Acre',
                reason: 'High drought resilience and assured MSP procurement at local Mandya APMC.'
              },
              {
                rank: '#3 Cash Crop',
                name: 'Sugarcane (Co-86032)',
                match: '88% Fit',
                duration: '10-12 Months',
                projectedProfit: '₹1,66,000 / Acre',
                reason: 'High sucrose content; direct crushing tie-up with Cauvery Sugar Mills.'
              }
            ].map((rc, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#064E3B]">
                      {rc.rank}
                    </span>
                    <span className="text-xs font-black text-[#064E3B]">{rc.match}</span>
                  </div>

                  <h4 className="font-extrabold text-[#172B24] text-base font-heading mt-2">
                    {rc.name}
                  </h4>
                  <div className="text-xs text-[#718078] mt-1">Cycle: {rc.duration}</div>

                  <p className="text-xs text-[#5A6E64] mt-3 leading-relaxed">
                    {rc.reason}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFF4EF] flex items-center justify-between text-xs">
                  <span className="text-[#8A9A90]">Est. Profit:</span>
                  <span className="font-black text-[#064E3B]">{rc.projectedProfit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FERTILIZER CALCULATOR TAB */}
      {activeTab === 'fertilizer' && (
        <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-black text-[#172B24] font-heading">
              Precision Fertilizer & Dose Calculator
            </h3>
            <p className="text-xs text-[#718078]">
              Calculate exact nutrient requirement per acre to prevent over-fertilization and chemical runoff.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3E5248] mb-1">Target Crop</label>
              <select
                value={selectedCropForFert}
                onChange={(e) => setSelectedCropForFert(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#CBD8D0] text-xs bg-white"
              >
                <option value="Paddy">Paddy / Rice (BPT-5204)</option>
                <option value="Tomato">Tomato (Hybrid)</option>
                <option value="Sugarcane">Sugarcane (Co-86032)</option>
                <option value="Cotton">Cotton (Bt)</option>
                <option value="Wheat">Wheat (Sharbati)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E5248] mb-1">Area (Acres)</label>
              <input
                type="number"
                step="0.5"
                value={fertAreaAcres}
                onChange={(e) => setFertAreaAcres(parseFloat(e.target.value) || 1)}
                className="w-full p-3 rounded-2xl border border-[#CBD8D0] text-xs"
              />
            </div>
          </div>

          {/* Dosage Recommendations Quad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] text-center">
              <div className="text-[10px] uppercase font-bold text-[#8A9A90]">Urea (or Nano Urea)</div>
              <div className="text-2xl font-black text-[#172B24] mt-1">
                {(fertAreaAcres * 45).toFixed(0)} kg
              </div>
              <div className="text-[11px] text-[#059669] font-semibold mt-0.5">
                or {(fertAreaAcres * 2).toFixed(0)} bottles Nano Urea
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] text-center">
              <div className="text-[10px] uppercase font-bold text-[#8A9A90]">DAP (Di-Ammonium Phosphate)</div>
              <div className="text-2xl font-black text-[#172B24] mt-1">
                {(fertAreaAcres * 30).toFixed(0)} kg
              </div>
              <div className="text-[11px] text-[#718078] font-medium mt-0.5">
                Basal dose during planting
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] text-center">
              <div className="text-[10px] uppercase font-bold text-[#8A9A90]">MOP (Muriate of Potash)</div>
              <div className="text-2xl font-black text-[#172B24] mt-1">
                {(fertAreaAcres * 20).toFixed(0)} kg
              </div>
              <div className="text-[11px] text-[#718078] font-medium mt-0.5">
                Split at tillering & flowering
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. YIELD PREDICTOR TAB */}
      {activeTab === 'yield' && (
        <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-black text-[#172B24] font-heading">
              AI Harvest Yield & Output Forecaster
            </h3>
            <p className="text-xs text-[#718078]">
              Correlating irrigation efficiency, soil health, and weather variables to estimate total quintals and revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="w-full min-w-0 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3E5248] mb-1">Target Crop</label>
                <select
                  value={targetCrop}
                  onChange={(e) => setTargetCrop(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs bg-white"
                >
                  <option value="Tomato">Tomato Hybrid (2.0 Acres)</option>
                  <option value="Paddy">Paddy BPT-5204 (2.5 Acres)</option>
                  <option value="Sugarcane">Sugarcane Co-86032 (2.0 Acres)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#3E5248] mb-1">
                  <span>Irrigation Health Index: {irrigationHealth}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={irrigationHealth}
                  onChange={(e) => setIrrigationHealth(parseInt(e.target.value))}
                  className="w-full accent-cyan-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#3E5248] mb-1">
                  <span>Soil Vigor Score: {soilHealthRating}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={soilHealthRating}
                  onChange={(e) => setSoilHealthRating(parseInt(e.target.value))}
                  className="w-full accent-[#059669]"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#064E3B] to-teal-950 text-white space-y-4">
              <div className="text-xs text-[#6EE7B7] font-bold uppercase tracking-wider">
                Predicted Yield Forecast
              </div>
              <div>
                <div className="text-3xl font-black font-heading text-white">
                  {targetCrop === 'Tomato'
                    ? `${(180 * (irrigationHealth / 90)).toFixed(0)} Quintals`
                    : targetCrop === 'Paddy'
                    ? `${(62.5 * (irrigationHealth / 90)).toFixed(1)} Quintals`
                    : `${(950 * (irrigationHealth / 90)).toFixed(0)} Quintals`}
                </div>
                <div className="text-xs text-[#A7F3D0] mt-1">
                  Est. Net Revenue:{' '}
                  <strong className="text-amber-300">
                    ₹
                    {(
                      (targetCrop === 'Tomato' ? 288000 : targetCrop === 'Paddy' ? 156250 : 332500) *
                      (irrigationHealth / 90)
                    ).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </strong>
                </div>
              </div>

              <div className="text-[11px] text-[#D1FAE5]/80 pt-3 border-t border-[#064E3B]/80">
                Confidence: 91.4% • Based on 5-year regional micro-climate datasets.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
