import React from 'react';
import {
  ShieldCheck,
  X,
  Sparkles,
  Sprout,
  Droplets,
  CloudSun,
  Activity,
  Store,
  ArrowUpRight,
  BrainCircuit,
  Info
} from 'lucide-react';
import { useFarmData } from '../../context/FarmDataContext';

interface AIFarmHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const AIFarmHealthModal: React.FC<AIFarmHealthModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { aiFarmHealth, locationState, weather } = useFarmData();

  if (!isOpen) return null;

  const pillars = [
    {
      title: 'Crop Foliar Health',
      score: aiFarmHealth.cropHealth,
      weight: '30%',
      icon: Sprout,
      color: 'text-[#064E3B] bg-[#D1FAE5]',
      barColor: 'bg-[#10B981]',
      reason: 'Active vegetative tillering with healthy chlorophyll reflection. Minor fungal risk on lower tomato leaves.'
    },
    {
      title: 'Soil Condition & Moisture',
      score: aiFarmHealth.soilCondition,
      weight: '25%',
      icon: Activity,
      color: 'text-amber-700 bg-amber-100',
      barColor: 'bg-amber-500',
      reason: 'Soil volumetric water content is 58% (optimum range: 50–65%). Soil temperature is stable at 24.2°C.'
    },
    {
      title: 'Weather & Micro-Climate Risk',
      score: aiFarmHealth.weatherRisk,
      weight: '20%',
      icon: CloudSun,
      color: 'text-blue-700 bg-blue-100',
      barColor: 'bg-blue-500',
      reason: `Calm wind speed (${weather.windSpeed} km/h) with ${weather.rainProbability}% precipitation probability.`
    },
    {
      title: 'Irrigation & Pump Efficiency',
      score: aiFarmHealth.irrigation,
      weight: '15%',
      icon: Droplets,
      color: 'text-cyan-700 bg-cyan-100',
      barColor: 'bg-cyan-500',
      reason: 'Automated pressure cycle saved 3,400 liters of water this week with zero over-watering detected.'
    },
    {
      title: 'Market Timing & Price Opportunity',
      score: aiFarmHealth.marketOpportunity,
      weight: '10%',
      icon: Store,
      color: 'text-purple-700 bg-purple-100',
      barColor: 'bg-purple-500',
      reason: 'Nearby APMC mandis show strong demand with +7.1% upward price momentum.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-6 max-w-xl w-full shadow-2xl border border-[#E5EDE7] space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] text-[#064E3B] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-[#172B24] font-heading">
                  AI Farm Health Diagnostic
                </h2>
                <span className="px-2 py-0.5 bg-[#D1FAE5] text-[#064E3B] text-[10px] font-bold rounded-full">
                  Explainable AI
                </span>
              </div>
              <p className="text-xs text-[#718078]">
                Multi-factor neural synthesis for {locationState.address.formatted}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#EFF4EF] flex items-center justify-center text-[#8A9A90] hover:text-[#3E5248] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Main Score Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#022C22] via-[#172B24] to-[#172B24] text-white flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#6EE7B7] tracking-wider">
                Overall Index Rating
              </span>
              <div className="text-3xl font-black text-white font-heading mt-0.5">
                {aiFarmHealth.overall} <span className="text-[#34D399] text-xl font-normal">/ 100</span>
              </div>
              <p className="text-xs text-[#D1FAE5]/80 mt-1 max-w-sm">
                Ranked in the <strong>top 5%</strong> of precision farms in {locationState.address.district}.
              </p>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-[#10B981]/20 border border-[#34D399]/40 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-[#6EE7B7] font-bold uppercase">Status</span>
              <span className="text-[#34D399] font-extrabold text-sm">Optimal</span>
            </div>
          </div>

          {/* Sub-Score Breakdown Pillars */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[#3E5248] uppercase tracking-wider">
              5 Core Agricultural Pillars
            </h3>

            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="p-3 rounded-2xl border border-[#E5EDE7]/90 bg-white/75 backdrop-blur-xl hover:border-[#6EE7B7] transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${p.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#243A32]">{p.title}</span>
                      <span className="text-[10px] text-[#8A9A90] font-medium">(Weight: {p.weight})</span>
                    </div>
                    <span className="text-xs font-black text-[#172B24] font-heading">{p.score}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#EFF4EF] h-2 rounded-full overflow-hidden">
                    <div
                      className={`${p.barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${p.score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-[#718078] leading-normal">{p.reason}</p>
                </div>
              );
            })}
          </div>

          {/* AI Recommendation to boost to 98% */}
          <div className="p-3.5 rounded-2xl bg-[#ECFDF5]/80 border border-[#A7F3D0] text-[#064E3B] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#059669]" />
              <span>How to elevate score to 98/100:</span>
            </div>
            <p className="text-[11px] text-[#064E3B] leading-relaxed">
              1. Complete preventive bio-fungicide foliar spray on Tomato Field 2 before Thursday rain.
              <br />
              2. Keep smart pump on AUTO mode to prevent nutrient leaching during precipitation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#EFF4EF] flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onClose();
              onNavigate('cropHealth');
            }}
            className="text-xs font-bold text-[#064E3B] hover:text-[#064E3B] flex items-center gap-1"
          >
            <span>Open AI Diagnostics Hub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#172B24] hover:bg-[#243A32] text-white font-bold text-xs transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
