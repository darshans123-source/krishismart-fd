import React, { useState } from 'react';
import {
  Store,
  TrendingUp,
  TrendingDown,
  Navigation,
  Truck,
  Calculator,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';
import { MandiItem } from '../types';

export const MarketIntelligencePage: React.FC = () => {
  const { mandis, locationState, setIsLocationModalOpen } = useFarmData();
  const { t } = useLanguage();

  const [selectedCommodity, setSelectedCommodity] = useState('All');
  const [calcQuantity, setCalcQuantity] = useState<number>(50); // quintals
  const [calcCrop, setCalcCrop] = useState('Tomato (Hybrid)');

  const commodities = ['All', 'Tomato (Hybrid)', 'Paddy (Rice)', 'Onion (Red Nashik Quality)', 'Cotton (Medium Staple)'];

  const filteredMandis = mandis.filter((m) =>
    selectedCommodity === 'All' ? true : m.commodity === selectedCommodity
  );

  // Best Market to Sell Arbitrage calculation
  const relevantMandisForCalc = mandis.filter((m) => m.commodity.includes(calcCrop.split(' ')[0]));
  const rankedMarkets = relevantMandisForCalc.map((m) => {
    const grossRevenue = m.currentPrice * calcQuantity;
    const transportTotal = m.transportCostPerQtl * calcQuantity;
    const apmcCess = grossRevenue * 0.015; // 1.5% market fee
    const netRevenue = grossRevenue - transportTotal - apmcCess;
    return {
      mandi: m,
      grossRevenue,
      transportTotal,
      apmcCess,
      netRevenue
    };
  }).sort((a, b) => b.netRevenue - a.netRevenue);

  return (
    <div className="w-full min-w-0 space-y-8 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D1FAE5] text-[#064E3B] text-xs font-bold mb-1 border border-[#A7F3D0]">
            <Store className="w-3.5 h-3.5" />
            <span>Real-time APMC Mandi Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] font-heading">
            {t('marketIntelligence')}
          </h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            Distances and freight calculated dynamically from <strong>{locationState.address.formatted}</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F7FAF7] border border-[#E5EDE7] text-[#3E5248] font-bold text-xs shadow-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>📍 {locationState.address.district}</span>
          <span className="text-[#8A9A90] font-normal">Change</span>
        </button>
      </div>

      {/* 1. "BEST MARKET TO SELL" SMART CALCULATOR SPOTLIGHT */}
      <div className="bg-gradient-to-br from-[#172B24] to-[#243A32] text-white rounded-2xl p-6 shadow-xl border border-[#3E5248] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3E5248] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-heading text-white">
                {t('bestMarketToSell')} (Transport & Net Profit Optimizer)
              </h2>
              <p className="text-xs text-[#CBD8D0]">
                Calculates: Gross Mandi Rate - Transport Cost per km - APMC Cess = Net Bankable Profit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#8A9A90] block mb-1">Crop</label>
              <select
                value={calcCrop}
                onChange={(e) => setCalcCrop(e.target.value)}
                className="bg-[#243A32] text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-[#5A6E64] focus:outline-hidden"
              >
                <option value="Tomato (Hybrid)">Tomato</option>
                <option value="Paddy (Sona Masoori / BPT)">Paddy (Rice)</option>
                <option value="Onion (Red Nashik Quality)">Onion</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#8A9A90] block mb-1">Quantity (Qtl)</label>
              <input
                type="number"
                value={calcQuantity}
                onChange={(e) => setCalcQuantity(parseInt(e.target.value) || 1)}
                className="w-20 bg-[#243A32] text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-[#5A6E64] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Ranked Market Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rankedMarkets.map((res, rankIdx) => {
            const isWinner = rankIdx === 0;
            return (
              <div
                key={res.mandi.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isWinner
                    ? 'bg-[#022C22]/70 border-[#10B981]/80 shadow-lg ring-1 ring-[#34D399]/30'
                    : 'bg-[#243A32]/80 border-[#3E5248]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isWinner
                        ? 'bg-[#10B981] text-[#022C22]'
                        : 'bg-[#3E5248] text-[#CBD8D0]'
                    }`}
                  >
                    {isWinner ? '👑 #1 Highest Net Profit' : `#${rankIdx + 1} Alternative`}
                  </span>
                  <span className="text-[11px] text-[#8A9A90]">{res.mandi.distanceKm} km away</span>
                </div>

                <div className="font-extrabold text-sm text-white font-heading truncate">
                  {res.mandi.marketName}
                </div>
                <div className="text-xs text-[#8A9A90] mb-3">{res.mandi.district}, {res.mandi.state}</div>

                <div className="w-full min-w-0 space-y-1.5 text-xs pt-3 border-t border-[#3E5248]/80">
                  <div className="flex justify-between text-[#CBD8D0]">
                    <span>Mandi Price:</span>
                    <strong className="text-white">₹{res.mandi.currentPrice}/qtl</strong>
                  </div>
                  <div className="flex justify-between text-[#8A9A90]">
                    <span>Transport Cost:</span>
                    <span className="text-rose-300">-₹{res.transportTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#8A9A90]">
                    <span>Market Cess (1.5%):</span>
                    <span className="text-rose-300">-₹{res.apmcCess.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-[#3E5248] font-bold">
                    <span className="text-[#6EE7B7]">Net Estimated Profit:</span>
                    <span className={`text-base font-black ${isWinner ? 'text-amber-400' : 'text-white'}`}>
                      ₹{res.netRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. COMMODITY TICKER FILTER */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {commodities.map((comm) => (
          <button
            key={comm}
            onClick={() => setSelectedCommodity(comm)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              selectedCommodity === comm
                ? 'bg-[#059669] text-white shadow-xs'
                : 'bg-white text-[#5A6E64] hover:bg-[#EFF4EF] border border-[#E5EDE7]'
            }`}
          >
            {comm}
          </button>
        ))}
      </div>

      {/* 3. LIVE APMC MANDI RATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMandis.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-[#E5EDE7] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#34D399] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#EFF4EF] text-[#3E5248]">
                  {m.distanceKm} km
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                    m.priceChange >= 0
                      ? 'bg-[#D1FAE5] text-[#064E3B]'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {m.priceChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{m.priceChange >= 0 ? `+${m.priceChange}%` : `${m.priceChange}%`}</span>
                </span>
              </div>

              <div className="text-[10px] font-bold text-[#8A9A90] uppercase tracking-wider">
                {m.commodity}
              </div>
              <h3 className="font-extrabold text-base text-[#172B24] font-heading leading-tight mt-0.5">
                {m.marketName}
              </h3>
              <p className="text-xs text-[#718078] font-medium">
                {m.district}, {m.state}
              </p>

              <div className="mt-4 pt-3 border-t border-[#EFF4EF]">
                <div className="text-[10px] uppercase font-bold text-[#8A9A90]">Modal Price</div>
                <div className="text-2xl font-black text-[#172B24] font-heading">
                  ₹{m.currentPrice} <span className="text-xs font-semibold text-[#8A9A90]">/ qtl</span>
                </div>
                <div className="text-[10px] text-[#8A9A90] mt-0.5">
                  Min: ₹{m.minPrice} | Max: ₹{m.maxPrice}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EFF4EF] flex items-center justify-between text-[11px] text-[#718078]">
              <span>Arrivals: <strong>{m.arrivalTons} Tons</strong></span>
              <span className={`font-bold ${m.demandLevel === 'High' ? 'text-[#064E3B]' : 'text-amber-700'}`}>
                {m.demandLevel} Demand
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
