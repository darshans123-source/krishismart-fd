import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Plus,
  Search,
  Edit3,
  Trash2,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';
import { AdminConfirmModal } from '../components/AdminConfirmModal';

export const AdminMarketManager: React.FC = () => {
  const [mandis, setMandis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMandi, setEditingMandi] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchMandis = async () => {
    try {
      const res = await adminApi.market.getAll();
      if (res.success && res.data) {
        setMandis(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMandis();
  }, []);

  const handleOpenCreate = () => {
    setEditingMandi({
      commodity: '',
      marketName: '',
      district: 'Mandya',
      state: 'Karnataka',
      currentPrice: 2500,
      minPrice: 2200,
      maxPrice: 2800,
      demandLevel: 'High',
      supplyLevel: 'Adequate',
      arrivalTons: 150,
      distanceKm: 25,
      transportCostPerQtl: 50
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mandi: any) => {
    setEditingMandi({ ...mandi });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMandi.commodity || !editingMandi.marketName) return;

    try {
      if (editingMandi.id) {
        await adminApi.market.update(editingMandi.id, editingMandi);
      } else {
        await adminApi.market.create(editingMandi);
      }
      setIsModalOpen(false);
      setEditingMandi(null);
      fetchMandis();
    } catch (err: any) {
      alert(err.message || 'Failed to save market entry');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await adminApi.market.delete(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchMandis();
    } catch (err: any) {
      alert(err.message || 'Failed to delete market');
    }
  };

  const filteredMandis = mandis.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.commodity.toLowerCase().includes(q) ||
      m.marketName.toLowerCase().includes(q) ||
      m.district.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/75 backdrop-blur-xl rounded-2xl border border-[#E5EDE7] p-5 sm:p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#172B24] font-heading">Market & Mandi Price Controller</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
              {mandis.length} APMC Markets
            </span>
          </div>
          <p className="text-xs text-[#718078] mt-1">
            Update live wholesale rates, daily modal prices, and supply/demand alerts.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-[#064E3B] hover:bg-[#064E3B] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Mandi Entry</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search commodity, APMC market, district..."
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/75 backdrop-blur-xl border border-[#E5EDE7] text-xs focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]"
        />
      </div>

      {/* Mandi Table */}
      <div className="bg-white/75 backdrop-blur-xl rounded-2xl border border-[#E5EDE7] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7FAF7]/70 border-b border-[#E5EDE7] text-[#718078] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Commodity</th>
                <th className="py-3.5 px-4">Market / Mandi</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Current Price</th>
                <th className="py-3.5 px-4">Min - Max Price</th>
                <th className="py-3.5 px-4">Demand / Supply</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFF4EF]">
              {filteredMandis.map((m) => (
                <tr key={m.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-extrabold text-[#172B24] text-sm font-heading">{m.commodity}</div>
                    <div className="text-[10px] text-[#8A9A90]">Updated: {m.updatedAt}</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-[#243A32]">{m.marketName}</div>
                    <div className="text-[11px] text-[#718078]">{m.distanceKm} km away</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-xs text-[#3E5248] font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8A9A90]" />
                      <span>{m.district}, {m.state}</span>
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-sm font-black text-[#064E3B]">₹{m.currentPrice} <span className="text-[10px] text-[#718078] font-normal">/ Qtl</span></div>
                    {m.priceChange ? (
                      <div className={`text-[10px] font-bold flex items-center gap-0.5 ${m.priceChange > 0 ? 'text-[#064E3B]' : 'text-rose-600'}`}>
                        {m.priceChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{m.priceChange > 0 ? `+${m.priceChange}%` : `${m.priceChange}%`}</span>
                      </div>
                    ) : null}
                  </td>

                  <td className="py-4 px-4 font-medium text-[#5A6E64]">
                    ₹{m.minPrice} - ₹{m.maxPrice}
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-[11px] font-semibold text-[#243A32]">Demand: {m.demandLevel}</div>
                    <div className="text-[10px] text-[#718078]">Supply: {m.supplyLevel}</div>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 transition-colors cursor-pointer"
                        title="Edit Mandi Price"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(m.id)}
                        className="p-2 rounded-xl hover:bg-rose-50 text-[#8A9A90] hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Market Entry"
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

      {/* Add / Edit Modal */}
      {isModalOpen && editingMandi && (
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingMandi.id ? 'Edit APMC Market Rate' : 'Add New Mandi Price'}
          subtitle="Updates the live mandi rates and price ticker on the farmer frontend"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3E5248]">Commodity</label>
                <input
                  type="text"
                  value={editingMandi.commodity}
                  onChange={(e) => setEditingMandi({ ...editingMandi, commodity: e.target.value })}
                  placeholder="e.g. Tomato (Hybrid)"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5EDE7] text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3E5248]">APMC Market Name</label>
                <input
                  type="text"
                  value={editingMandi.marketName}
                  onChange={(e) => setEditingMandi({ ...editingMandi, marketName: e.target.value })}
                  placeholder="e.g. Kolar APMC Yard"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5EDE7] text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3E5248]">District</label>
                <input
                  type="text"
                  value={editingMandi.district}
                  onChange={(e) => setEditingMandi({ ...editingMandi, district: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5EDE7] text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3E5248]">State</label>
                <input
                  type="text"
                  value={editingMandi.state}
                  onChange={(e) => setEditingMandi({ ...editingMandi, state: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5EDE7] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3E5248]">Current Price (₹/Qtl)</label>
                <input
                  type="number"
                  value={editingMandi.currentPrice}
                  onChange={(e) => setEditingMandi({ ...editingMandi, currentPrice: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5EDE7] text-xs font-bold text-[#064E3B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3E5248]">Min Price (₹)</label>
                <input
                  type="number"
                  value={editingMandi.minPrice}
                  onChange={(e) => setEditingMandi({ ...editingMandi, minPrice: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5EDE7] text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3E5248]">Max Price (₹)</label>
                <input
                  type="number"
                  value={editingMandi.maxPrice}
                  onChange={(e) => setEditingMandi({ ...editingMandi, maxPrice: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5EDE7] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3E5248]">Demand Level</label>
                <select
                  value={editingMandi.demandLevel}
                  onChange={(e) => setEditingMandi({ ...editingMandi, demandLevel: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5EDE7] text-xs bg-white/75 backdrop-blur-xl"
                >
                  <option value="High">High Demand</option>
                  <option value="Moderate">Moderate Demand</option>
                  <option value="Low">Low Demand</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3E5248]">Supply Level</label>
                <select
                  value={editingMandi.supplyLevel}
                  onChange={(e) => setEditingMandi({ ...editingMandi, supplyLevel: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5EDE7] text-xs bg-white/75 backdrop-blur-xl"
                >
                  <option value="Deficit">Deficit (Shortage)</option>
                  <option value="Adequate">Adequate Balance</option>
                  <option value="Surplus">Surplus (Oversupply)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-[#E5EDE7]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#CBD8D0] text-[#3E5248] text-xs font-semibold hover:bg-[#EFF4EF]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#064E3B] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Mandi Rate
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
        title="Delete Market Entry"
        message="Are you sure you want to remove this APMC market from the rate sheet?"
        confirmLabel="Delete Market"
        isDestructive={true}
      />
    </div>
  );
};
