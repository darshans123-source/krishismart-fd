import React, { useEffect, useState } from 'react';
import {
  CloudSun,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  Sun,
  Droplets,
  Wind,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';
import { AdminConfirmModal } from '../components/AdminConfirmModal';

export const AdminWeatherManager: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvisory, setEditingAdvisory] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      const res = await adminApi.weather.get();
      if (res.success && res.data) {
        setWeatherData(res.data.weather);
        setAdvisories(res.data.advisories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleOpenCreate = () => {
    setEditingAdvisory({
      title: '',
      message: '',
      type: 'Warning',
      priority: 'High',
      validUntil: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      visible: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (adv: any) => {
    setEditingAdvisory({ ...adv });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdvisory.title || !editingAdvisory.message) return;

    try {
      if (editingAdvisory.id) {
        await adminApi.weather.updateAdvisory(editingAdvisory.id, editingAdvisory);
      } else {
        await adminApi.weather.createAdvisory(editingAdvisory);
      }
      setIsModalOpen(false);
      setEditingAdvisory(null);
      fetchWeather();
    } catch (err: any) {
      alert(err.message || 'Failed to save advisory');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await adminApi.weather.deleteAdvisory(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchWeather();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleVisibility = async (adv: any) => {
    try {
      await adminApi.weather.updateAdvisory(adv.id, { ...adv, visible: !adv.visible });
      fetchWeather();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-stone-900 font-heading">Weather Advisory & Alerts Console</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
              Real API Preserved
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Publish agricultural weather warnings, spraying windows, and seasonal crop climate advice.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Weather Alert</span>
        </button>
      </div>

      {/* Live Weather Telemetry Snapshot */}
      {weatherData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Ambient Temperature</span>
            </span>
            <div className="text-2xl font-black text-stone-900 font-heading">{weatherData.temp}°C</div>
            <div className="text-[11px] text-stone-500">{weatherData.condition}</div>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-500" />
              <span>Rain Probability</span>
            </span>
            <div className="text-2xl font-black text-stone-900 font-heading">{weatherData.rainProbability}%</div>
            <div className="text-[11px] text-cyan-700 font-semibold">Relative Humidity: {weatherData.humidity}%</div>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-emerald-500" />
              <span>Soil Moisture Probe</span>
            </span>
            <div className="text-2xl font-black text-stone-900 font-heading">{weatherData.soilMoisture}%</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Optimal root hydration</div>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-purple-500" />
              <span>Wind Velocity</span>
            </span>
            <div className="text-2xl font-black text-stone-900 font-heading">{weatherData.windSpeed} km/h</div>
            <div className="text-[11px] text-stone-500">Air Quality: {weatherData.airQuality}</div>
          </div>
        </div>
      )}

      {/* Advisory Warnings List */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-base font-extrabold text-stone-900 font-heading">
            Active Warning Banners & Climate Advisories ({advisories.length})
          </h3>
        </div>

        <div className="space-y-3">
          {advisories.map((adv) => (
            <div
              key={adv.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                adv.type === 'Warning'
                  ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                  : adv.type === 'Alert'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
              } ${!adv.visible ? 'opacity-50' : ''}`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      adv.type === 'Warning'
                        ? 'bg-rose-600 text-white'
                        : adv.type === 'Alert'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {adv.type}
                  </span>
                  <span className="text-sm font-extrabold font-heading">{adv.title}</span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">{adv.message}</p>
                <div className="text-[10px] opacity-70 mt-1">Valid Until: {adv.validUntil} • Priority: {adv.priority}</div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => handleToggleVisibility(adv)}
                  className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                  title={adv.visible ? 'Hide Advisory' : 'Show Advisory'}
                >
                  {adv.visible ? <Eye className="w-4 h-4 text-emerald-700" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleOpenEdit(adv)}
                  className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                  title="Edit Advisory"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(adv.id)}
                  className="p-2 rounded-xl hover:bg-rose-100 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Advisory Modal */}
      {isModalOpen && editingAdvisory && (
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingAdvisory.id ? 'Edit Weather Advisory' : 'Publish Weather Warning / Advisory'}
          subtitle="Displayed immediately to farmers in the Weather Center and Alert Drawer"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Advisory Title</label>
              <input
                type="text"
                value={editingAdvisory.title}
                onChange={(e) => setEditingAdvisory({ ...editingAdvisory, title: e.target.value })}
                placeholder="e.g. Monsoon Heavy Rainfall Warning"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Detailed Message & Agronomy Advice</label>
              <textarea
                rows={3}
                value={editingAdvisory.message}
                onChange={(e) => setEditingAdvisory({ ...editingAdvisory, message: e.target.value })}
                placeholder="Explain rain risk, hold off chemical sprays, drainage advice..."
                required
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Advisory Type</label>
                <select
                  value={editingAdvisory.type}
                  onChange={(e) => setEditingAdvisory({ ...editingAdvisory, type: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  <option value="Warning">Warning (Red Critical)</option>
                  <option value="Alert">Alert (Amber Caution)</option>
                  <option value="Advisory">Advisory (Blue Informational)</option>
                  <option value="Seasonal">Seasonal Recommendation (Green)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Priority</label>
                <select
                  value={editingAdvisory.priority}
                  onChange={(e) => setEditingAdvisory({ ...editingAdvisory, priority: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Valid Until</label>
                <input
                  type="date"
                  value={editingAdvisory.validUntil}
                  onChange={(e) => setEditingAdvisory({ ...editingAdvisory, validUntil: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAdvisory.visible !== false}
                    onChange={(e) => setEditingAdvisory({ ...editingAdvisory, visible: e.target.checked })}
                    className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Active & Visible to Farmers</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Advisory
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Delete Confirmation */}
      <AdminConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Advisory"
        message="Are you sure you want to delete this weather advisory?"
        confirmLabel="Delete Advisory"
        isDestructive={true}
      />
    </div>
  );
};
