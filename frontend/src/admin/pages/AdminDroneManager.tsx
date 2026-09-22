import React, { useState, useEffect } from 'react';
import { 
  Plane, Search, Plus, Edit2, Trash2, CheckCircle2, 
  AlertCircle, BatteryCharging, Radio, Navigation, 
  MapPin, ShieldCheck, RefreshCw, Power 
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';
import { AdminConfirmModal } from '../components/AdminConfirmModal';

interface DroneService {
  id: string;
  name: string;
  description: string;
  pricePerAcre: number;
  status: 'Active' | 'Standby' | 'Maintenance' | 'Disabled';
  coverageType: string;
  image: string;
  availableLocations: string[];
}

export const AdminDroneManager: React.FC = () => {
  const [services, setServices] = useState<DroneService[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<DroneService | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DroneService | null>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [formData, setFormData] = useState<Partial<DroneService>>({
    name: '',
    description: '',
    pricePerAcre: 450,
    status: 'Active',
    coverageType: 'Liquid Spray',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    availableLocations: ['Mandya', 'Mysuru', 'Hassan']
  });
  const [locationsInput, setLocationsInput] = useState('Mandya, Mysuru, Hassan');

  const fetchDrones = async () => {
    try {
      setLoading(true);
      const res = await adminApi.drone.getAll();
      if (res && res.data) {
        setServices(res.data.services || []);
        setPlans(res.data.plans || []);
      }
    } catch (error) {
      console.error('Failed to load drone data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrones();
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      pricePerAcre: 450,
      status: 'Active',
      coverageType: 'Liquid Spray',
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
      availableLocations: ['Mandya', 'Mysuru']
    });
    setLocationsInput('Mandya, Mysuru');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: DroneService) => {
    setEditingService(srv);
    setFormData({ ...srv });
    setLocationsInput(srv.availableLocations?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setSaving(true);
      const payload = {
        ...formData,
        availableLocations: locationsInput.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingService) {
        await adminApi.drone.updateService(editingService.id, payload);
      } else {
        await adminApi.drone.createService(payload);
      }
      setIsModalOpen(false);
      await fetchDrones();
    } catch (error) {
      console.error('Failed to save drone service:', error);
      alert('Failed to save drone service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.drone.deleteService(deleteTarget.id);
      setDeleteTarget(null);
      await fetchDrones();
    } catch (error) {
      console.error('Failed to delete drone service:', error);
      alert('Failed to delete drone service.');
    }
  };

  const handleToggleStatus = async (srv: DroneService) => {
    try {
      const newStatus = srv.status === 'Active' ? 'Standby' : 'Active';
      await adminApi.drone.updateService(srv.id, { status: newStatus });
      await fetchDrones();
    } catch (e) {
      console.error('Failed to toggle status:', e);
    }
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.coverageType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Plane className="w-3.5 h-3.5 text-emerald-600" />
            Autonomous Drone Fleet & Mission Control
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight font-heading">
            Drone Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Configure autonomous crop spray missions, multispectral NDVI scans, pricing, and regional pilot availability.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDrones}
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
            Add Drone Service
          </button>
        </div>
      </div>

      {/* Fleet Live Telemetry Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Active Drone Fleet</div>
            <div className="text-2xl font-black text-stone-900 mt-1">4 Quadcopters</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">DGCA Type Certified</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
            <Plane className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Acreage Sprayed</div>
            <div className="text-2xl font-black text-stone-900 mt-1">1,240 Acres</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">This Season</div>
          </div>
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
            <Navigation className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Avg. Spray Cost</div>
            <div className="text-2xl font-black text-stone-900 mt-1">₹450 / Acre</div>
            <div className="text-[11px] text-stone-500 font-semibold mt-0.5">60% cheaper than manual</div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">RTK GPS Precision</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">± 2.5 cm</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Centimeter accuracy</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl">
            <Radio className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search drone services by mission type, coverage, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
          />
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Loading drone mission fleet...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <Plane className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No drone services found</h3>
          <p className="text-xs text-stone-500 mt-1">Add a drone service package or modify your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map(srv => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full overflow-hidden bg-stone-100 relative">
                  <img src={srv.image} alt={srv.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      srv.status === 'Active' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-stone-500 text-white'
                    }`}>
                      {srv.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
                      {srv.coverageType}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-stone-900 leading-snug">
                      {srv.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-emerald-800 font-heading">
                        ₹{srv.pricePerAcre}
                      </div>
                      <div className="text-[10px] text-stone-400 font-medium">per acre</div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {srv.description}
                  </p>

                  <div>
                    <div className="text-[11px] font-semibold text-stone-500 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" /> Operational Hubs:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {srv.availableLocations?.map((loc, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleStatus(srv)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    srv.status === 'Active'
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  {srv.status === 'Active' ? 'Set Standby' : 'Activate'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="p-1.5 rounded-lg text-stone-600 hover:text-emerald-700 hover:bg-white transition"
                    title="Edit Service"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(srv)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-white transition"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Drone Mission Service' : 'Add Drone Mission Service'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Service / Mission Name *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Precision Foliar Bio-Spray Mission"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Price Per Acre (₹) *</label>
              <input
                type="number"
                required
                min="50"
                value={formData.pricePerAcre || 450}
                onChange={(e) => setFormData({ ...formData, pricePerAcre: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Coverage / Payload Type</label>
              <select
                value={formData.coverageType}
                onChange={(e) => setFormData({ ...formData, coverageType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30"
              >
                <option value="Liquid Spray">Liquid Spray (Fungicide/Pesticide)</option>
                <option value="Granular Fertilizer">Granular Fertilizer Broadcasting</option>
                <option value="NDVI Multispectral Scan">NDVI Multispectral Crop Health Scan</option>
                <option value="Thermal Moisture Mapping">Thermal Moisture & Stress Mapping</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30"
              >
                <option value="Active">Active (Bookings Open)</option>
                <option value="Standby">Standby</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Available Locations (comma separated)
            </label>
            <input
              type="text"
              value={locationsInput}
              onChange={(e) => setLocationsInput(e.target.value)}
              placeholder="Mandya, Mysuru, Hassan, Ramanagara"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description & Specifications</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ultra-low volume spraying with micron droplet size, zero crop trampling, 10 liters/acre..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
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
              {saving ? 'Saving...' : editingService ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Drone Service"
        message={`Are you sure you want to remove "${deleteTarget?.name}"? Existing bookings will need to be re-assigned.`}
      />
    </div>
  );
};
