import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Edit3,
  Trash2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';
import { AdminConfirmModal } from '../components/AdminConfirmModal';

export const AdminSchemesManager: React.FC = () => {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchSchemes = async () => {
    try {
      const res = await adminApi.schemes.getAll();
      if (res.success && res.data) {
        setSchemes(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleOpenCreate = () => {
    setEditingScheme({
      name: '',
      shortName: '',
      department: 'Ministry of Agriculture & Farmers Welfare',
      financialBenefit: 'Direct financial subsidy',
      eligibility: ['All landholding farmers'],
      documentsRequired: ['Aadhaar Card', 'Land RTC Record', 'Bank Passbook'],
      deadline: 'Ongoing',
      applicationMode: 'Online',
      status: 'Open',
      officialUrl: 'https://myscheme.gov.in',
      category: 'Direct Income'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (scheme: any) => {
    setEditingScheme({ ...scheme });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheme.name) return;

    try {
      if (editingScheme.id) {
        await adminApi.schemes.update(editingScheme.id, editingScheme);
      } else {
        await adminApi.schemes.create(editingScheme);
      }
      setIsModalOpen(false);
      setEditingScheme(null);
      fetchSchemes();
    } catch (err: any) {
      alert(err.message || 'Failed to save scheme');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await adminApi.schemes.delete(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchSchemes();
    } catch (err: any) {
      alert(err.message || 'Failed to delete scheme');
    }
  };

  const filteredSchemes = schemes.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      (s.shortName && s.shortName.toLowerCase().includes(q)) ||
      s.department.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-stone-900 font-heading">Government Schemes & Subsidies</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold">
              {schemes.length} Schemes
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Publish central & state financial welfare programs, subsidies, and eligibility guidelines.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Scheme</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes, departments..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200 self-stretch sm:self-auto justify-center">
          {['all', 'Open', 'Expiring Soon', 'Year-round'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/70 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Scheme Name</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Financial Benefit</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status / Deadline</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredSchemes.map((s) => (
                <tr key={s.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-extrabold text-stone-900 text-sm font-heading">{s.name}</div>
                    <div className="text-[11px] text-purple-700 font-semibold">{s.shortName}</div>
                  </td>

                  <td className="py-4 px-4 text-stone-600 max-w-xs">
                    <div className="truncate">{s.department}</div>
                  </td>

                  <td className="py-4 px-4 font-bold text-stone-800 max-w-xs">
                    <div className="truncate">{s.financialBenefit}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 font-medium text-stone-700">
                      {s.category}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        s.status === 'Open'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : s.status === 'Expiring Soon'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-blue-50 text-blue-800 border-blue-300'
                      }`}
                    >
                      {s.status}
                    </span>
                    <div className="text-[10px] text-stone-400 mt-0.5">{s.deadline}</div>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      {s.officialUrl && (
                        <a
                          href={s.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          title="Official Portal"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 transition-colors cursor-pointer"
                        title="Edit Scheme"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(s.id)}
                        className="p-2 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Scheme"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Scheme Modal */}
      {isModalOpen && editingScheme && (
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingScheme.id ? 'Edit Welfare Scheme' : 'Publish Government Scheme'}
          subtitle="Empowers farmers with verified central & state financial subsidies"
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Scheme Full Official Name</label>
              <input
                type="text"
                value={editingScheme.name}
                onChange={(e) => setEditingScheme({ ...editingScheme, name: e.target.value })}
                placeholder="e.g. Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Short Display Title</label>
                <input
                  type="text"
                  value={editingScheme.shortName || ''}
                  onChange={(e) => setEditingScheme({ ...editingScheme, shortName: e.target.value })}
                  placeholder="PM-KISAN DBT"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Category</label>
                <select
                  value={editingScheme.category}
                  onChange={(e) => setEditingScheme({ ...editingScheme, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  <option value="Direct Income">Direct Income (DBT)</option>
                  <option value="Equipment & Solar">Equipment & Solar (PM-KUSUM / PMKSY)</option>
                  <option value="Credit & Loan">Credit & Loan (KCC 4%)</option>
                  <option value="Insurance">Crop Insurance (PMFBY)</option>
                  <option value="Organic & Seeds">Organic & Seed Subsidies</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Government Ministry / Department</label>
              <input
                type="text"
                value={editingScheme.department}
                onChange={(e) => setEditingScheme({ ...editingScheme, department: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Financial Benefit Amount / Terms</label>
              <input
                type="text"
                value={editingScheme.financialBenefit}
                onChange={(e) => setEditingScheme({ ...editingScheme, financialBenefit: e.target.value })}
                placeholder="e.g. ₹6,000 / year in 3 direct bank transfers"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-emerald-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Status</label>
                <select
                  value={editingScheme.status}
                  onChange={(e) => setEditingScheme({ ...editingScheme, status: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  <option value="Open">Open</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Year-round">Year-round</option>
                  <option value="Draft">Draft</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Deadline Notice</label>
                <input
                  type="text"
                  value={editingScheme.deadline}
                  onChange={(e) => setEditingScheme({ ...editingScheme, deadline: e.target.value })}
                  placeholder="e.g. Sep 30, 2026 or Ongoing"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Official Portal Link</label>
              <input
                type="text"
                value={editingScheme.officialUrl || ''}
                onChange={(e) => setEditingScheme({ ...editingScheme, officialUrl: e.target.value })}
                placeholder="https://pmkisan.gov.in"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-mono"
              />
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
                Save Scheme
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
        title="Delete Scheme"
        message="Are you sure you want to remove this welfare scheme from the portal?"
        confirmLabel="Delete Scheme"
        isDestructive={true}
      />
    </div>
  );
};
