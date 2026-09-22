import React, { useEffect, useState } from 'react';
import {
  Sliders,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Sprout,
  Sun,
  TrendingUp,
  Coins,
  Plane,
  Droplets,
  Radio,
  MapPin,
  Wheat,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';

interface AdminDashboardEditorProps {
  onNavigateFarmer: () => void;
}

export const AdminDashboardEditor: React.FC<AdminDashboardEditorProps> = ({ onNavigateFarmer }) => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick Action modal state
  const [quickActionModalOpen, setQuickActionModalOpen] = useState(false);
  const [editingQuickAction, setEditingQuickAction] = useState<any | null>(null);

  const fetchConfig = async () => {
    try {
      const res = await adminApi.dashboard.get();
      if (res.success && res.data) {
        setConfig(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSaveAndPublish = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await adminApi.dashboard.update(config);
      if (res.success) {
        setConfig(res.data);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save dashboard');
    } finally {
      setSaving(false);
    }
  };

  // Quick action helpers
  const handleOpenAddQuickAction = () => {
    setEditingQuickAction({
      id: `qa-${Date.now()}`,
      label: 'New Action',
      icon: '🌱',
      route: 'crops',
      bg: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200',
      description: 'Quick shortcut',
      visible: true,
      order: (config.quickActions?.length || 0) + 1
    });
    setQuickActionModalOpen(true);
  };

  const handleOpenEditQuickAction = (qa: any) => {
    setEditingQuickAction({ ...qa });
    setQuickActionModalOpen(true);
  };

  const handleSaveQuickActionModal = () => {
    if (!editingQuickAction || !config) return;
    const exists = config.quickActions?.some((q: any) => q.id === editingQuickAction.id);
    let updated;
    if (exists) {
      updated = config.quickActions.map((q: any) =>
        q.id === editingQuickAction.id ? editingQuickAction : q
      );
    } else {
      updated = [...(config.quickActions || []), editingQuickAction];
    }
    setConfig({ ...config, quickActions: updated });
    setQuickActionModalOpen(false);
    setEditingQuickAction(null);
  };

  const handleDeleteQuickAction = (id: string) => {
    if (!config) return;
    const updated = config.quickActions.filter((q: any) => q.id !== id);
    setConfig({ ...config, quickActions: updated });
  };

  const handleMoveQuickAction = (index: number, direction: 'up' | 'down') => {
    if (!config || !config.quickActions) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config.quickActions.length) return;

    const updated = [...config.quickActions];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updated.forEach((q, idx) => (q.order = idx + 1));
    setConfig({ ...config, quickActions: updated });
  };

  if (loading || !config) {
    return <div className="p-8 text-center text-stone-500 font-medium">Loading Dashboard Config...</div>;
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-150">
      {/* Top Header & Save Control */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-stone-900 font-heading">Dashboard Hero & Widgets Editor</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              Real-time Sync
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Edit farmer greeting, farm health metrics, status cards, and quick action shortcuts without code changes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateFarmer}
            className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Farmer View</span>
          </button>

          <button
            onClick={handleSaveAndPublish}
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-emerald-700/20 active:scale-98 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-800 text-white text-xs font-bold text-center shadow-lg animate-in slide-in-from-top duration-200 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Dashboard updated and published! Changes are now live on the farmer dashboard.</span>
        </div>
      )}

      {/* ================================================== */}
      {/* 1. HERO SECTION EDITOR */}
      {/* ================================================== */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 font-heading">
              1. Hero Overview & Greeting Banner
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Controls the top 5-second overview visible to farmers</p>
          </div>
          <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={config.hero?.visible !== false}
              onChange={(e) =>
                setConfig({
                  ...config,
                  hero: { ...config.hero, visible: e.target.checked }
                })
              }
              className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Hero Visible</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">
              Greeting Text (e.g. "GOOD MORNING, FARMER" / "GOOD AFTERNOON, FARMER")
            </label>
            <input
              type="text"
              value={config.hero?.greeting || ''}
              onChange={(e) =>
                setConfig({
                  ...config,
                  hero: {
                    ...config.hero,
                    greeting: e.target.value,
                    mainHeading: `${e.target.value} 🌱`
                  }
                })
              }
              placeholder="GOOD AFTERNOON, FARMER"
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <p className="text-[11px] text-emerald-700">
              Editing this directly alters the top greeting on the farmer dashboard!
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Subtitle / Agricultural Telemetry Message</label>
            <input
              type="text"
              value={config.hero?.subtitle || ''}
              onChange={(e) =>
                setConfig({
                  ...config,
                  hero: { ...config.hero, subtitle: e.target.value }
                })
              }
              placeholder="Real-time farm status for Mandya, Karnataka. Precision AI active."
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-xs text-stone-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Farm Health Score (0 - 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={config.hero?.farmHealthScore || 94}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    hero: { ...config.hero, farmHealthScore: Number(e.target.value) }
                  })
                }
                className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-xs font-extrabold text-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Health Badge Button Text</label>
              <input
                type="text"
                value={config.hero?.buttonText || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    hero: { ...config.hero, buttonText: e.target.value }
                  })
                }
                placeholder="Farm Health: 94/100"
                className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Hero Gradient Theme</label>
            <select
              value={config.hero?.heroBg || 'from-emerald-800 to-emerald-900'}
              onChange={(e) =>
                setConfig({
                  ...config,
                  hero: { ...config.hero, heroBg: e.target.value }
                })
              }
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-xs bg-white font-semibold"
            >
              <option value="from-emerald-800 to-emerald-900">Classic Emerald Forest (Default)</option>
              <option value="from-emerald-900 to-teal-950">Deep Pine & Teal Night</option>
              <option value="from-stone-900 to-emerald-950">Sleek Obsidian Charcoal</option>
              <option value="from-teal-800 to-emerald-800">Aqua River Basin</option>
            </select>
          </div>
        </div>

        {/* Live Hero Banner Preview Box */}
        <div className="pt-2">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 font-heading">
            Live Banner Visual Preview
          </div>
          <div
            className={`rounded-3xl bg-gradient-to-r ${
              config.hero?.heroBg || 'from-emerald-800 to-emerald-900'
            } text-white p-6 shadow-sm border border-emerald-700/80 space-y-3`}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold">
              <Sprout className="w-3.5 h-3.5 text-emerald-300" />
              <span>Smart Farming Platform</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white font-heading">
              {config.hero?.greeting || 'GOOD AFTERNOON, FARMER'} 🌱
            </h1>
            <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
              {config.hero?.subtitle || 'Real-time farm status for Pandavapura, Mandya.'}
            </p>
            <div className="pt-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{config.hero?.buttonText || `Farm Health: ${config.hero?.farmHealthScore || 94}/100`}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 2. CURRENT FARM STATUS CARDS */}
      {/* ================================================== */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="text-base font-extrabold text-stone-900 font-heading">
            2. Current Farm Status Cards
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Edit title, value, description, visibility, and display order</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {config.statusCards?.map((card: any, idx: number) => (
            <div
              key={card.id || idx}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                card.visible ? 'bg-stone-50/80 border-stone-200' : 'bg-stone-100 border-stone-300 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Card {idx + 1}</span>
                </span>
                <button
                  onClick={() => {
                    const updated = config.statusCards.map((c: any) =>
                      c.id === card.id ? { ...c, visible: !c.visible } : c
                    );
                    setConfig({ ...config, statusCards: updated });
                  }}
                  className="text-stone-500 hover:text-stone-800 p-1 cursor-pointer"
                  title={card.visible ? 'Hide card' : 'Show card'}
                >
                  {card.visible ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500">Title</label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => {
                    const updated = config.statusCards.map((c: any) =>
                      c.id === card.id ? { ...c, title: e.target.value } : c
                    );
                    setConfig({ ...config, statusCards: updated });
                  }}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500">Value Text</label>
                <input
                  type="text"
                  value={card.value || ''}
                  onChange={(e) => {
                    const updated = config.statusCards.map((c: any) =>
                      c.id === card.id ? { ...c, value: e.target.value } : c
                    );
                    setConfig({ ...config, statusCards: updated });
                  }}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-800 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500">Subtitle / Note</label>
                <input
                  type="text"
                  value={card.description || ''}
                  onChange={(e) => {
                    const updated = config.statusCards.map((c: any) =>
                      c.id === card.id ? { ...c, description: e.target.value } : c
                    );
                    setConfig({ ...config, statusCards: updated });
                  }}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-600 bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. QUICK ACTIONS EDITOR */}
      {/* ================================================== */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 font-heading">
              3. Quick Actions Toolbar ({config.quickActions?.length || 0} Actions)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Add, edit, reorder, or customize route and icon for one-tap farmer shortcuts
            </p>
          </div>

          <button
            onClick={handleOpenAddQuickAction}
            className="px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Quick Action</span>
          </button>
        </div>

        {/* Quick Actions Grid / Reorder List */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {config.quickActions?.map((act: any, idx: number) => (
            <div
              key={act.id || idx}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-between text-center relative group ${
                act.bg || 'bg-stone-50 border-stone-200 text-stone-900'
              } ${!act.visible ? 'opacity-50' : ''}`}
            >
              {/* Top controls */}
              <div className="w-full flex items-center justify-between mb-1">
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => handleMoveQuickAction(idx, 'up')}
                    disabled={idx === 0}
                    className="p-0.5 rounded hover:bg-black/10 disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleMoveQuickAction(idx, 'down')}
                    disabled={idx === config.quickActions.length - 1}
                    className="p-0.5 rounded hover:bg-black/10 disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => handleOpenEditQuickAction(act)}
                    className="p-1 rounded hover:bg-black/10 text-stone-700 cursor-pointer text-[10px] font-bold"
                    title="Edit action"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteQuickAction(act.id)}
                    className="p-1 rounded hover:bg-rose-100 text-stone-500 hover:text-rose-600 cursor-pointer"
                    title="Remove action"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Icon & Label */}
              <span className="text-2xl my-1">{act.icon || '🌱'}</span>
              <span className="text-xs font-extrabold truncate w-full">{act.label}</span>
              <span className="text-[10px] opacity-70 font-mono mt-0.5 truncate w-full">/{act.route}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Add/Edit Modal */}
      {quickActionModalOpen && editingQuickAction && (
        <AdminModal
          isOpen={quickActionModalOpen}
          onClose={() => setQuickActionModalOpen(false)}
          title="Configure Quick Action"
          subtitle="Customize button title, icon, color scheme, and route target"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Action Title</label>
                <input
                  type="text"
                  value={editingQuickAction.label || ''}
                  onChange={(e) => setEditingQuickAction({ ...editingQuickAction, label: e.target.value })}
                  placeholder="e.g. Crop Scan"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Icon / Emoji</label>
                <input
                  type="text"
                  value={editingQuickAction.icon || ''}
                  onChange={(e) => setEditingQuickAction({ ...editingQuickAction, icon: e.target.value })}
                  placeholder="🌱, 🌦️, 📈, 💧, 🚁, 📡"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-center text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Route / Tab Target</label>
                <select
                  value={editingQuickAction.route}
                  onChange={(e) => setEditingQuickAction({ ...editingQuickAction, route: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white"
                >
                  <option value="aiHub">aiHub (Crop Scan / Diagnostics)</option>
                  <option value="weather">weather (Weather Center)</option>
                  <option value="market">market (Market & Mandis)</option>
                  <option value="finance">finance (KrishiNidhi Finance)</option>
                  <option value="drone">drone (DroneSpray AI)</option>
                  <option value="pump">pump (Smart Pump)</option>
                  <option value="iot">iot (IoT Hub)</option>
                  <option value="myFarms">myFarms (My Farm & Crops)</option>
                  <option value="govtSchemes">govtSchemes (Schemes)</option>
                  <option value="store">store (Krishi Store)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Color Palette Style</label>
                <select
                  value={editingQuickAction.bg}
                  onChange={(e) => setEditingQuickAction({ ...editingQuickAction, bg: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white"
                >
                  <option value="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200">Emerald Green</option>
                  <option value="bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200">Amber Sunshine</option>
                  <option value="bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200">Sky Blue</option>
                  <option value="bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200">Teal Mint</option>
                  <option value="bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200">Purple Royal</option>
                  <option value="bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border-cyan-200">Cyan Aqua</option>
                  <option value="bg-stone-100 hover:bg-stone-200 text-stone-900 border-stone-300">Stone Gray</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Description</label>
              <input
                type="text"
                value={editingQuickAction.description || ''}
                onChange={(e) => setEditingQuickAction({ ...editingQuickAction, description: e.target.value })}
                placeholder="Brief helper description"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingQuickAction.visible !== false}
                  onChange={(e) => setEditingQuickAction({ ...editingQuickAction, visible: e.target.checked })}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Enabled and Visible on Dashboard</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setQuickActionModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickActionModal}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Action
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};
