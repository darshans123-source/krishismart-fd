import React, { useState } from 'react';
import {
  Droplets,
  Power,
  Clock,
  Sliders,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';

export const SmartPumpPage: React.FC = () => {
  const { smartPump, togglePumpStatus, setPumpMode, updatePumpThreshold, weather } = useFarmData();
  const { t } = useLanguage();

  const isPumpRunning = smartPump.status === 'ON';

  // Water usage historical data for chart
  const waterUsageData = [
    { day: 'Mon', litres: 4200 },
    { day: 'Tue', litres: 3800 },
    { day: 'Wed', litres: 5100 },
    { day: 'Thu', litres: 4600 },
    { day: 'Fri', litres: 4100 },
    { day: 'Sat', litres: 5400 },
    { day: 'Sun (Today)', litres: smartPump.dailyWaterLitres || 4800 },
  ];

  return (
    <div className="w-full min-w-0 space-y-8 pb-16 animate-in fade-in">
      {/* ================================================== */}
      {/* 1. HEADER WITH REALISTIC IRRIGATION/FARM IMAGE */}
      {/* ================================================== */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E5EDE7]">
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#172B24]">
          <img
            src="https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=1200&auto=format&fit=crop&q=80"
            alt="Farm drip irrigation system"
            className="w-full h-full object-cover opacity-90 hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/90 via-[#172B24]/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight flex items-center gap-2">
              <span>💧</span> Smart Irrigation
            </h1>
            <p className="text-xs sm:text-base text-[#E5EDE7] mt-1 max-w-2xl leading-relaxed">
              Control and monitor your farm water system.
            </p>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 2. LARGE PUMP STATUS CARD */}
      {/* ================================================== */}
      <div className="bg-white/75 backdrop-blur-xl rounded-2xl border border-[#E5EDE7] p-6 sm:p-8 shadow-2xs space-y-6">
        {/* Top Status Indicators: PUMP ON/OFF, Soil Moisture, Water Tank */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-[#EFF4EF]">
          {/* Pump Status Display */}
          <div className="p-5 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] flex flex-col justify-between space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-[#718078]">
              PUMP STATUS
            </div>
            <div className="flex items-center gap-2.5">
              <span
                className={`w-3.5 h-3.5 rounded-full ${
                  isPumpRunning ? 'bg-[#10B981] animate-pulse' : 'bg-[#8A9A90]'
                }`}
              />
              <span
                className={`text-3xl font-black font-heading ${
                  isPumpRunning ? 'text-[#064E3B]' : 'text-[#3E5248]'
                }`}
              >
                ● {smartPump.status}
              </span>
            </div>
            <div className="text-xs text-[#718078]">
              {smartPump.name} • {smartPump.hp} HP Submersible
            </div>
          </div>

          {/* Soil Moisture */}
          <div className="p-5 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] flex flex-col justify-between space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-[#718078]">
              SOIL MOISTURE
            </div>
            <div className="text-3xl font-black text-[#172B24] font-heading">
              {weather.soilMoisture}%
            </div>
            <div className="text-xs text-[#064E3B] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Optimal level for crops</span>
            </div>
          </div>

          {/* Water Tank */}
          <div className="p-5 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] flex flex-col justify-between space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-[#718078]">
              WATER TANK
            </div>
            <div className="text-3xl font-black text-cyan-800 font-heading">
              74%
            </div>
            <div className="text-xs text-cyan-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>37,000 Litres Available</span>
            </div>
          </div>
        </div>

        {/* Controls: [ ON ] [ OFF ] and Mode: [ AUTO ] [ MANUAL ] */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Pump Power Controls */}
          <div className="w-full min-w-0 space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-[#5A6E64]">
              Controls
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (!isPumpRunning) togglePumpStatus();
                }}
                className={`py-4 px-4 rounded-2xl font-black text-base transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                  isPumpRunning
                    ? 'bg-[#064E3B] text-white shadow-md'
                    : 'bg-[#EFF4EF] hover:bg-[#ECFDF5] text-[#3E5248] border border-[#CBD8D0]'
                }`}
              >
                <Power className="w-5 h-5" />
                <span>ON</span>
              </button>

              <button
                onClick={() => {
                  if (isPumpRunning) togglePumpStatus();
                }}
                className={`py-4 px-4 rounded-2xl font-black text-base transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                  !isPumpRunning
                    ? 'bg-[#243A32] text-white shadow-md'
                    : 'bg-[#EFF4EF] hover:bg-[#E5EDE7] text-[#3E5248] border border-[#CBD8D0]'
                }`}
              >
                <Power className="w-5 h-5" />
                <span>OFF</span>
              </button>
            </div>
            <p className="text-xs text-[#718078]">
              {isPumpRunning ? 'Motor is actively delivering water to drip lines.' : 'Motor is off. Drip lines depressurized.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="w-full min-w-0 space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-[#5A6E64]">
              Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPumpMode('AUTO')}
                className={`py-4 px-4 rounded-2xl font-black text-base transition-all duration-150 cursor-pointer ${
                  smartPump.mode === 'AUTO'
                    ? 'bg-[#064E3B] text-white shadow-md'
                    : 'bg-[#EFF4EF] hover:bg-[#E5EDE7] text-[#3E5248] border border-[#CBD8D0]'
                }`}
              >
                AUTO
              </button>

              <button
                onClick={() => setPumpMode('MANUAL')}
                className={`py-4 px-4 rounded-2xl font-black text-base transition-all duration-150 cursor-pointer ${
                  smartPump.mode === 'MANUAL'
                    ? 'bg-[#243A32] text-white shadow-md'
                    : 'bg-[#EFF4EF] hover:bg-[#E5EDE7] text-[#3E5248] border border-[#CBD8D0]'
                }`}
              >
                MANUAL
              </button>
            </div>
            <p className="text-xs text-[#718078]">
              {smartPump.mode === 'AUTO'
                ? 'Pump turns on/off automatically based on soil moisture and schedule.'
                : 'Manual control overrides sensors and timers.'}
            </p>
          </div>
        </div>

        {/* Schedule Banner */}
        <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D1FAE5] text-[#064E3B] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-[#064E3B]">
                Schedule
              </div>
              <div className="text-sm font-bold text-[#022C22]">
                Next irrigation: <span className="text-[#064E3B]">Tomorrow • 6:00 AM</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#064E3B]">
            Duration: 45 Minutes (Drip Line #1 & #2)
          </span>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. WATER USAGE CHART */}
      {/* ================================================== */}
      <div className="bg-white/75 backdrop-blur-xl rounded-2xl border border-[#E5EDE7] p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFF4EF] pb-3">
          <div>
            <h3 className="font-extrabold text-base text-[#172B24] font-heading">
              Water Consumption This Week
            </h3>
            <p className="text-xs text-[#718078]">
              Daily farm water usage measured in Litres. Micro-drip saves 60% compared to traditional flood irrigation.
            </p>
          </div>
          <div className="text-sm font-black text-[#064E3B]">
            Avg: 4,500 L/day
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterUsageData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#78716c' }} />
              <YAxis tick={{ fontSize: 11, fill: '#78716c' }} tickFormatter={(v) => `${v} L`} />
              <Tooltip
                formatter={(val: any) => [`${val.toLocaleString()} Litres`, 'Water Used']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4' }}
              />
              <Bar dataKey="litres" fill="#15803d" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================================================== */}
      {/* 4. SOIL MOISTURE THRESHOLD & TIMERS */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auto Threshold */}
        <div className="bg-white/75 backdrop-blur-xl rounded-2xl border border-[#E5EDE7] p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-[#172B24] font-heading">
                Auto-Start Soil Moisture Trigger
              </h3>
              <p className="text-xs text-[#718078]">
                Pump starts automatically when soil moisture drops below this value.
              </p>
            </div>
            <span className="text-xl font-black text-[#064E3B] font-heading">
              {smartPump.soilMoistureThreshold}%
            </span>
          </div>

          <input
            type="range"
            min="20"
            max="60"
            value={smartPump.soilMoistureThreshold}
            onChange={(e) => updatePumpThreshold(parseInt(e.target.value))}
            className="w-full accent-[#064E3B] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#718078] font-semibold">
            <span>Dry (20%)</span>
            <span>Recommended (40%)</span>
            <span>Moist (60%)</span>
          </div>
        </div>

        {/* Irrigation Schedules List */}
        <div className="bg-white/75 backdrop-blur-xl rounded-2xl border border-[#E5EDE7] p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-2">
            <h3 className="font-extrabold text-sm text-[#172B24] font-heading">
              Automated Irrigation Schedules
            </h3>
            <span className="text-xs text-[#064E3B] font-bold">2 Active Timers</span>
          </div>

          <div className="w-full min-w-0 space-y-2 text-xs">
            {smartPump.schedules.map((sch) => (
              <div
                key={sch.id}
                className="p-3 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#243A32]">
                    {sch.startTime} ({sch.durationMins} Mins Duration)
                  </div>
                  <div className="text-[11px] text-[#718078] mt-0.5">
                    Days: {sch.days.join(', ')}
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#064E3B] text-[10px] font-bold">
                  Enabled
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>

  );
};
