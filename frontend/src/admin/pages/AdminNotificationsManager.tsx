import React, { useState, useEffect } from 'react';
import { 
  Bell, Plus, Trash2, Search, Filter, AlertTriangle, 
  Info, Sparkles, CheckCircle2, RefreshCw, Calendar, Users 
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';
import { AdminConfirmModal } from '../components/AdminConfirmModal';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'weather_alert' | 'crop_alert' | 'market_alert' | 'scheme' | 'promotion';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetUsers: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'scheduled' | 'expired';
  createdAt?: string;
}

const TYPE_BADGES: Record<string, { label: string; color: string }> = {
  weather_alert: { label: 'Weather Alert', color: 'bg-amber-100 text-amber-800' },
  crop_alert: { label: 'Crop Advisory', color: 'bg-emerald-100 text-emerald-800' },
  market_alert: { label: 'Mandi Price Surge', color: 'bg-teal-100 text-teal-800' },
  scheme: { label: 'Government Scheme', color: 'bg-blue-100 text-blue-800' },
  promotion: { label: 'Agri Store Promo', color: 'bg-purple-100 text-purple-800' },
  system: { label: 'System Notice', color: 'bg-stone-100 text-stone-800' }
};

export const AdminNotificationsManager: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NotificationItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [formData, setFormData] = useState<Partial<NotificationItem>>({
    title: '',
    message: '',
    type: 'weather_alert',
    priority: 'high',
    targetUsers: 'All Registered Farmers',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'active'
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await adminApi.notifications.getAll();
      if (res && res.data) {
        setNotifications(res.data);
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      message: '',
      type: 'weather_alert',
      priority: 'high',
      targetUsers: 'All Registered Farmers',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;

    try {
      setSaving(true);
      await adminApi.notifications.create(formData);
      setIsModalOpen(false);
      await fetchNotifications();
    } catch (e) {
      console.error('Failed to broadcast notification:', e);
      alert('Failed to create alert.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.notifications.delete(deleteTarget.id);
      setDeleteTarget(null);
      await fetchNotifications();
    } catch (e) {
      console.error('Failed to remove alert:', e);
      alert('Failed to remove alert.');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.targetUsers?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || n.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5 text-emerald-600" />
            Push Broadcast Center
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight font-heading">
            Notifications & Broadcast Alerts
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Dispatch high-priority weather warnings, pest outbreak alerts, and APMC market rallies to farmer devices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchNotifications}
            className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Dispatch New Alert
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search active alerts by title, content, or targeted recipients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 bg-stone-50 focus:ring-2 focus:ring-emerald-600/30"
          >
            <option value="all">All Alert Types</option>
            {Object.entries(TYPE_BADGES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Retrieving notification dispatch logs...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <Bell className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No active notifications</h3>
          <p className="text-xs text-stone-500 mt-1">Broadcast an emergency weather warning or crop pest bulletin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotifications.map(n => {
            const badge = TYPE_BADGES[n.type] || { label: n.type, color: 'bg-stone-100 text-stone-700' };
            return (
              <div
                key={n.id}
                className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      n.priority === 'urgent' || n.priority === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : n.priority === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {n.priority} Priority
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 leading-snug">
                    {n.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span>Target: <strong className="text-stone-800">{n.targetUsers}</strong></span>
                    </div>

                    {n.endDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Valid until: <strong className="text-stone-800">{n.endDate}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-400">
                    ID: {n.id}
                  </span>
                  <button
                    onClick={() => setDeleteTarget(n)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dispatch Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast Notification / Warning Banner"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Alert Headline / Title *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Thunderstorm Alert: Heavy Rainfall in Mandya"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Broadcast Category</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30"
              >
                {Object.entries(TYPE_BADGES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30"
              >
                <option value="urgent">Urgent (Red Toast & Sound)</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium</option>
                <option value="low">Low (Informational)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Target Audience</label>
            <input
              type="text"
              value={formData.targetUsers || ''}
              onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value })}
              placeholder="All Registered Farmers or Tomato Growers"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Notification Message / Advisory *</label>
            <textarea
              required
              rows={4}
              value={formData.message || ''}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Detailed instructions for farmers, protective measures, emergency helplines..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
            >
              {saving ? 'Broadcasting...' : 'Send Alert Now'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete confirmation */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Revoke Notification"
        message={`Are you sure you want to revoke "${deleteTarget?.title}"? Farmers will no longer see this advisory.`}
      />
    </div>
  );
};
