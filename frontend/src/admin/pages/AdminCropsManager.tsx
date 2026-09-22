import React, { useEffect, useState } from 'react';
import {
  Wheat,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Droplets,
  Calendar,
  Layers
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';
import { AdminConfirmModal } from '../components/AdminConfirmModal';

export const AdminCropsManager: React.FC = () => {
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [viewCrop, setViewCrop] = useState<any | null>(null);

  const fetchCrops = async () => {
    try {
      const res = await adminApi.crops.getAll();
      if (res.success && res.data) {
        setCrops(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleOpenCreate = () => {
    setEditingCrop({
      name: '',
      localName: '',
      hindiName: '',
      variety: '',
      area: 2.0,
      acreage: 2.0,
      sowingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: '2026-11-30',
      currentStage: 'growth',
      healthScore: 92,
      status: 'Healthy',
      irrigationSchedule: 'Every 3 days',
      fertilizerSchedule: 'NPK 19:19:19 water soluble',
      projectedYieldKg: 6000,
      expectedRevenue: 180000,
      imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80',
      category: 'Cereals & Grains',
      description: '',
      growingSeason: 'Kharif',
      soilType: 'Red Loamy',
      waterRequirement: 'Moderate',
      temperatureRange: '20°C - 32°C'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (crop: any) => {
    setEditingCrop({ ...crop });
    setIsModalOpen(true);
  };

  const handleSaveCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCrop.name) return;

    try {
      if (editingCrop.id) {
        await adminApi.crops.update(editingCrop.id, editingCrop);
      } else {
        await adminApi.crops.create(editingCrop);
      }
      setIsModalOpen(false);
      setEditingCrop(null);
      fetchCrops();
    } catch (err: any) {
      alert(err.message || 'Failed to save crop');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await adminApi.crops.delete(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchCrops();
    } catch (err: any) {
      alert(err.message || 'Failed to delete crop');
    }
  };

  const filteredCrops = crops.filter((crop) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      crop.name.toLowerCase().includes(q) ||
      (crop.localName && crop.localName.toLowerCase().includes(q)) ||
      (crop.hindiName && crop.hindiName.toLowerCase().includes(q)) ||
      (crop.variety && crop.variety.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'all' || crop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-stone-900 font-heading">Crop Portfolios & Fields</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              {crops.length} Active Crops
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage field plantings, health scores, fertilizer protocols, and Kannada/Hindi localization.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Crop</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops, Kannada, Hindi, variety..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200 self-stretch sm:self-auto justify-center">
          {['all', 'Healthy', 'Needs Attention', 'Critical'].map((st) => (
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

      {/* Crops Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/70 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Crop Name & Photo</th>
                <th className="py-3.5 px-4">Local / Hindi Name</th>
                <th className="py-3.5 px-4">Area</th>
                <th className="py-3.5 px-4">Current Stage</th>
                <th className="py-3.5 px-4">Health Status</th>
                <th className="py-3.5 px-4">Expected Yield</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCrops.map((crop) => (
                <tr key={crop.id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={crop.imageUrl || 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=100'}
                        alt={crop.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-stone-200"
                      />
                      <div>
                        <div className="font-extrabold text-stone-900 text-sm font-heading">{crop.name}</div>
                        <div className="text-[11px] text-stone-500">{crop.variety}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-stone-800 font-medium">ಕನ್ನಡ: {crop.localName || '—'}</div>
                    <div className="text-stone-500 text-[11px] mt-0.5">हिंदी: {crop.hindiName || '—'}</div>
                  </td>

                  <td className="py-4 px-4 font-bold text-stone-800">
                    {crop.area || crop.acreage || 1} Acres
                  </td>

                  <td className="py-4 px-4">
                    <span className="capitalize font-semibold text-stone-700 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                      {crop.currentStage}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        crop.status === 'Healthy'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}
                    >
                      <span>{crop.status}</span>
                      <span className="text-[10px] opacity-80">({crop.healthScore}%)</span>
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-stone-800">{crop.projectedYieldKg?.toLocaleString()} kg</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">₹{crop.expectedRevenue?.toLocaleString()}</div>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setViewCrop(crop)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(crop)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer"
                        title="Edit Crop"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(crop.id)}
                        className="p-2 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Crop"
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

      {/* Add / Edit Crop Modal */}
      {isModalOpen && editingCrop && (
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCrop.id ? 'Edit Crop Details' : 'Add New Crop Portfolio'}
          subtitle="Synchronizes directly with the farmer dashboard and My Farm screens"
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSaveCrop} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Crop Name (English)</label>
                <input
                  type="text"
                  value={editingCrop.name}
                  onChange={(e) => setEditingCrop({ ...editingCrop, name: e.target.value })}
                  placeholder="e.g. Tomato"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Kannada Local Name</label>
                <input
                  type="text"
                  value={editingCrop.localName || ''}
                  onChange={(e) => setEditingCrop({ ...editingCrop, localName: e.target.value })}
                  placeholder="ಟೊಮ್ಯಾಟೊ"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Hindi Name</label>
                <input
                  type="text"
                  value={editingCrop.hindiName || ''}
                  onChange={(e) => setEditingCrop({ ...editingCrop, hindiName: e.target.value })}
                  placeholder="टमाटर"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Variety / Cultivar</label>
                <input
                  type="text"
                  value={editingCrop.variety || ''}
                  onChange={(e) => setEditingCrop({ ...editingCrop, variety: e.target.value })}
                  placeholder="Arka Rakshak F1"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Acreage (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingCrop.area || editingCrop.acreage || 1}
                  onChange={(e) => setEditingCrop({ ...editingCrop, area: Number(e.target.value), acreage: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Current Stage</label>
                <select
                  value={editingCrop.currentStage}
                  onChange={(e) => setEditingCrop({ ...editingCrop, currentStage: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  <option value="seed">Seed Treatment / Nursery</option>
                  <option value="germination">Germination & Transplant</option>
                  <option value="growth">Vegetative Growth</option>
                  <option value="flowering">Flowering & Fruit Set</option>
                  <option value="harvest">Maturity & Harvest</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Health Status</label>
                <select
                  value={editingCrop.status}
                  onChange={(e) => setEditingCrop({ ...editingCrop, status: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  <option value="Healthy">Healthy</option>
                  <option value="Needs Attention">Needs Attention</option>
                  <option value="Critical">Critical</option>
                  <option value="Harvest Ready">Harvest Ready</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Health Score (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingCrop.healthScore || 90}
                  onChange={(e) => setEditingCrop({ ...editingCrop, healthScore: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Growing Season</label>
                <select
                  value={editingCrop.growingSeason || 'Kharif'}
                  onChange={(e) => setEditingCrop({ ...editingCrop, growingSeason: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Zaid">Zaid (Summer)</option>
                  <option value="Year-round">Year-round</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Crop Image URL</label>
              <input
                type="text"
                value={editingCrop.imageUrl || ''}
                onChange={(e) => setEditingCrop({ ...editingCrop, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Irrigation Protocol</label>
                <input
                  type="text"
                  value={editingCrop.irrigationSchedule || ''}
                  onChange={(e) => setEditingCrop({ ...editingCrop, irrigationSchedule: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Fertilizer Protocol</label>
                <input
                  type="text"
                  value={editingCrop.fertilizerSchedule || ''}
                  onChange={(e) => setEditingCrop({ ...editingCrop, fertilizerSchedule: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
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
                Save Crop
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
        title="Delete Crop"
        message="Are you sure you want to remove this crop from the platform? It will immediately disappear from the farmer dashboard."
        confirmLabel="Delete Crop"
        isDestructive={true}
      />

      {/* View Crop Modal */}
      {viewCrop && (
        <AdminModal
          isOpen={!!viewCrop}
          onClose={() => setViewCrop(null)}
          title={`Crop Portfolio: ${viewCrop.name}`}
          subtitle={`Variety: ${viewCrop.variety} • Health: ${viewCrop.healthScore}%`}
        >
          <div className="space-y-4">
            <img src={viewCrop.imageUrl} alt={viewCrop.name} className="w-full h-48 object-cover rounded-2xl" />
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50">
                <span className="text-stone-500 font-bold block">Local (Kannada):</span>
                <span className="font-semibold text-stone-900">{viewCrop.localName || '—'}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50">
                <span className="text-stone-500 font-bold block">Hindi:</span>
                <span className="font-semibold text-stone-900">{viewCrop.hindiName || '—'}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50">
                <span className="text-stone-500 font-bold block">Area / Acreage:</span>
                <span className="font-semibold text-stone-900">{viewCrop.area} Acres</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50">
                <span className="text-stone-500 font-bold block">Season & Stage:</span>
                <span className="font-semibold text-stone-900">{viewCrop.growingSeason} • {viewCrop.currentStage}</span>
              </div>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};
