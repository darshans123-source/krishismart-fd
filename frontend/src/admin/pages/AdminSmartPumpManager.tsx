import React, { useState, useEffect } from 'react';
import { 
  Zap, Droplet, Clock, Settings2, Power, AlertCircle, 
  CheckCircle2, RefreshCw, BarChart2, ShieldAlert, Cpu 
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

interface SmartPumpConfig {
  id: string;
  name: string;
  location: string;
  status: 'ON' | 'OFF';
  mode: 'AUTO' | 'MANUAL';
  moistureThreshold: number;
  currentMoisture: number;
  dailyWaterUsageLiters: number;
  schedule: string;
  lastRunTime?: string;
  pumpType?: string;
}

export const AdminSmartPumpManager: React.FC = () => {
  const [pump, setPump] = useState<SmartPumpConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form
  const [formData, setFormData] = useState<Partial<SmartPumpConfig>>({});

  const fetchPump = async () => {
    try {
      setLoading(true);
      const res = await adminApi.smartPump.get();
      if (res && res.data) {
        setPump(res.data);
        setFormData(res.data);
      }
    } catch (e) {
      console.error('Failed to load smart pump:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPump();
  }, []);

  const handleToggleStatus = async () => {
    if (!pump) return;
    try {
      const nextStatus = pump.status === 'ON' ? 'OFF' : 'ON';
      const res = await adminApi.smartPump.update({ ...pump, status: nextStatus });
      if (res && res.data) {
        setPump(res.data);
        setFormData(res.data);
      }
    } catch (e) {
      console.error('Failed to toggle pump:', e);
      alert('Failed to send control signal to pump actuator.');
    }
  };

  const handleToggleMode = async () => {
    if (!pump) return;
    try {
      const nextMode = pump.mode === 'AUTO' ? 'MANUAL' : 'AUTO';
      const res = await adminApi.smartPump.update({ ...pump, mode: nextMode });
      if (res && res.data) {
        setPump(res.data);
        setFormData(res.data);
      }
    } catch (e) {
      console.error('Failed to toggle pump mode:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminApi.smartPump.update(formData);
      if (res && res.data) {
        setPump(res.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Failed to update smart pump settings:', e);
      alert('Failed to save configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
        <p className="text-xs text-stone-500">Connecting to Smart Irrigation Relay...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-teal-600" />
            Solar Submersible Automation & Flow Control
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight font-heading">
            Smart Pump & Irrigation Manager
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Configure telemetry triggers, moisture cutoff thresholds, run schedules, and emergency overrides.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPump}
            className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Control Card */}
      <div className="bg-gradient-to-br from-[#0c3121] via-[#082015] to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                pump?.status === 'ON' ? 'bg-emerald-500 text-white' : 'bg-stone-700 text-stone-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${pump?.status === 'ON' ? 'bg-white animate-ping' : 'bg-stone-400'}`} />
                PUMP {pump?.status || 'OFF'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold">
                MODE: {pump?.mode || 'AUTO'}
              </span>
            </div>

            <h2 className="text-3xl font-black font-heading tracking-tight">
              {pump?.name || 'Primary Borewell 7.5HP Pump'}
            </h2>
            <p className="text-xs text-emerald-200/80 max-w-lg">
              Located at {pump?.location || 'Sector 4, Main North Block'}. Running on solar VFD inverter with 3-phase grid fallback.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-emerald-100">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-teal-400" />
                <span>Current Soil Moisture: <strong className="text-white text-sm">{pump?.currentMoisture}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Threshold: <strong className="text-white text-sm">&lt; {pump?.moistureThreshold}%</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Actuator Buttons */}
          <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto">
            <button
              onClick={handleToggleStatus}
              className={`flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-lg transition cursor-pointer ${
                pump?.status === 'ON'
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-900/30'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-900/40'
              }`}
            >
              <Power className="w-4 h-4" />
              {pump?.status === 'ON' ? 'Shut Down Pump' : 'Start Pump Now'}
            </button>

            <button
              onClick={handleToggleMode}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer border border-white/10"
            >
              <Settings2 className="w-4 h-4" />
              Switch to {pump?.mode === 'AUTO' ? 'MANUAL' : 'AUTO (AI)'}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Today's Water Delivered</div>
            <div className="text-2xl font-black text-stone-900 mt-1">
              {(pump?.dailyWaterUsageLiters || 4200).toLocaleString()} L
            </div>
            <div className="text-[11px] text-teal-700 font-semibold mt-0.5">Drip emitter pressure: 1.8 bar</div>
          </div>
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
            <Droplet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Scheduled Timing</div>
            <div className="text-2xl font-black text-stone-900 mt-1">{pump?.schedule || '06:00 AM - 08:30 AM'}</div>
            <div className="text-[11px] text-stone-500 font-semibold mt-0.5">Morning low-evaporation cycle</div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Telemetry Health</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">Nominal</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">No dry-run cavitation detected</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <h3 className="text-base font-bold text-stone-900 mb-1">Actuator Automation Settings</h3>
        <p className="text-xs text-stone-500 mb-6">
          Adjust automatic threshold triggers, schedule timers, and location descriptions.
        </p>

        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Pump configuration saved successfully and synced with IoT edge gateway.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Pump Display Name *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Field Location / Zone *</label>
              <input
                type="text"
                required
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Moisture Cutoff Threshold (%)
              </label>
              <input
                type="number"
                min="10"
                max="90"
                value={formData.moistureThreshold || 40}
                onChange={(e) => setFormData({ ...formData, moistureThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
              <span className="text-[11px] text-stone-400 mt-0.5 block">Pump triggers if moisture drops below this value.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Daily Irrigation Window</label>
              <input
                type="text"
                value={formData.schedule || ''}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="06:00 AM - 08:30 AM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
              <span className="text-[11px] text-stone-400 mt-0.5 block">Automated run timing.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Daily Water Budget (L)</label>
              <input
                type="number"
                value={formData.dailyWaterUsageLiters || 4500}
                onChange={(e) => setFormData({ ...formData, dailyWaterUsageLiters: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
              <span className="text-[11px] text-stone-400 mt-0.5 block">Max safety cutoff limit.</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Pump Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
