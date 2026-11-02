import React, { useMemo, useState } from 'react';
import { Plus, MapPin, Droplets, TrendingUp, Pencil } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';
import { Farm } from '../types';

/*
  MY FARM — Farm Overview only.
  This page manages farm parcels and the crops already planted on them.
  It is deliberately different from Crop Management (CropCatalogPage):
  no catalog, no catalog search/filters, no crop-profile modal here.
  Adding a new crop type happens from Crop Management; here you add/edit
  farm parcels and see planted crops, performance and seasonal summaries.
*/
interface MyFarmsPageProps {
  onBrowseCrops?: () => void;
}

const FARM_IMAGES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500937386664?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80'
];
const FALLBACK_FARM_IMAGE = FARM_IMAGES[0];

export const MyFarmsPage: React.FC<MyFarmsPageProps> = ({ onBrowseCrops }) => {
  const { farms, addFarm, updateFarm, crops, advanceCropStage, deleteCrop } = useFarmData();
  const { t } = useLanguage();
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || '');
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmTotalArea, setFarmTotalArea] = useState(3);
  const [farmSoilType, setFarmSoilType] = useState('Red Sandy Loam');
  const [farmWaterSource, setFarmWaterSource] = useState<Farm['waterSource']>('Borewell');

  const totalLand = farms.reduce((s, f) => s + f.totalArea, 0);
  const totalProductionKg = crops.reduce((s, c) => s + c.projectedYieldKg, 0);
  const totalRevenue = crops.reduce((s, c) => s + c.expectedRevenue, 0);
  const selectedFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  const selectedCrops = selectedFarm ? crops.filter((c) => c.farmId === selectedFarm.id) : [];

  const seasonOf = (sowingDate: string) => {
    const month = new Date(sowingDate).getMonth() + 1;
    if (month >= 6 && month <= 10) return 'Kharif';
    if (month >= 11 || month <= 3) return 'Rabi';
    return 'Zaid';
  };
  const seasonal = useMemo(() => {
    const counts: Record<string, number> = { Kharif: 0, Rabi: 0, Zaid: 0 };
    crops.forEach((c) => { counts[seasonOf(c.sowingDate)] += 1; });
    return counts;
  }, [crops]);

  const maxFarmRevenue = Math.max(1, ...farms.map((f) => crops.filter((c) => c.farmId === f.id).reduce((s, c) => s + c.expectedRevenue, 0)));

  const openEdit = (farm: Farm) => {
    setEditingFarm(farm);
    setFarmName(farm.name);
    setFarmLocation(farm.location);
    setFarmTotalArea(farm.totalArea);
    setFarmSoilType(farm.soilType);
    setFarmWaterSource(farm.waterSource);
  };
  const closeFarmModal = () => { setShowAddFarmModal(false); setEditingFarm(null); };
  const handleFarmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim()) return;
    if (editingFarm) {
      updateFarm(editingFarm.id, { name: farmName, location: farmLocation || 'Mandya, Karnataka', totalArea: farmTotalArea, soilType: farmSoilType, waterSource: farmWaterSource });
    } else {
      addFarm({ name: farmName, location: farmLocation || 'Mandya, Karnataka', totalArea: farmTotalArea, soilType: farmSoilType, waterSource: farmWaterSource, fieldsCount: 2 });
    }
    closeFarmModal();
  };

  const STAGES = ['seed','germination','growth','flowering','harvest'] as const;
  const nextStage = (current: string) => {
    const idx = STAGES.indexOf(current as typeof STAGES[number]);
    return STAGES[Math.min(4, idx + 1)];
  };

  const stats = [
    { label: 'Total land area', value: `${totalLand.toFixed(1)} acres`, tint: 'bg-[#ECFDF5] text-[#065F46]' },
    { label: 'Number of farms', value: `${farms.length}`, tint: 'bg-[#FEF3C7] text-[#92400E]' },
    { label: 'Active crops', value: `${crops.length}`, tint: 'bg-[#DCFCE7] text-[#166534]' },
    { label: 'Total production', value: `${(totalProductionKg / 1000).toFixed(1)} tonnes`, tint: 'bg-[#FFEDD5] text-[#9A3412]' },
    { label: 'Estimated revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, tint: 'bg-[#FCE7F3] text-[#9D174D]' }
  ];

  return (
    <div className="w-full min-w-0 space-y-8 pb-12 animate-in fade-in">
      {/* Hero — aerial farm illustration */}
      <div className="rounded-3xl overflow-hidden relative shadow-lg shadow-[#065F46]/20">
        <img src={FARM_IMAGES[0]} alt="Aerial view of green farm fields" className="w-full h-56 sm:h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#022C22]/85 via-[#065F46]/60 to-transparent flex flex-col justify-center p-6 sm:p-8 text-white">
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading">My Farm</h1>
          <p className="text-sm text-[#D1FAE5] mt-2 max-w-xl">
            Your farm overview — parcels, planted crops, performance and seasonal summaries, all in one place.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={() => { setEditingFarm(null); setFarmName(''); setFarmLocation(''); setFarmTotalArea(3); setFarmSoilType('Red Sandy Loam'); setFarmWaterSource('Borewell'); setShowAddFarmModal(true); }} className="px-4 py-2.5 rounded-xl bg-[#FACC15] text-[#172B24] text-xs font-bold hover:bg-[#EAB308] transition-colors flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Farm
            </button>
            {onBrowseCrops && (
              <button onClick={onBrowseCrops} className="px-4 py-2.5 rounded-xl bg-white/90 text-[#065F46] text-xs font-bold hover:bg-white transition-colors">
                Browse Crop Catalog →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E5EDE7] shadow-sm p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#718078]">{s.label}</p>
            <p className={`text-lg sm:text-xl font-extrabold font-heading mt-1 ${s.tint.split(' ')[1]}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Farm parcel cards */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#172B24] font-heading">Farm parcels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {farms.map((farm, idx) => {
            const farmCrops = crops.filter((c) => c.farmId === farm.id);
            const revenue = farmCrops.reduce((s, c) => s + c.expectedRevenue, 0);
            return (
              <article key={farm.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg transition-all ${selectedFarm?.id === farm.id ? 'border-[#059669] ring-2 ring-[#059669]/30' : 'border-[#E5EDE7]'}`}>
                <img src={FARM_IMAGES[idx % FARM_IMAGES.length]} alt={farm.name} loading="lazy" onError={(e) => { const img = e.currentTarget; if (img.src !== FALLBACK_FARM_IMAGE) img.src = FALLBACK_FARM_IMAGE; }} className="w-full h-36 object-cover" />
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-[#172B24]">{farm.name}</h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] shrink-0">{farm.totalArea} acres</span>
                  </div>
                  <p className="text-xs text-[#718078] flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {farm.location}</p>
                  <p className="text-xs text-[#3E5248]">Soil: <strong>{farm.soilType}</strong> · Irrigation: <strong>{farm.waterSource}</strong> · {farm.fieldsCount} fields</p>
                  <div>
                    <p className="text-[11px] font-bold text-[#718078] uppercase tracking-wide mb-1.5">Crops planted ({farmCrops.length})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {farmCrops.length === 0 && <span className="text-xs text-[#718078]">No crops yet — add one from the Crop Catalog.</span>}
                      {farmCrops.map((c) => <span key={c.id} className="text-[11px] font-semibold px-2 py-1 rounded-full bg-[#F3F6F4] text-[#065F46]">{c.name} · {c.area} ac</span>)}
                    </div>
                  </div>
                  <p className="text-xs text-[#3E5248]">Estimated revenue: <strong className="text-[#065F46]">₹{revenue.toLocaleString('en-IN')}</strong></p>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setSelectedFarmId(farm.id)} className="flex-1 py-2 rounded-xl bg-[#065F46] text-white text-xs font-bold hover:bg-[#064E3B]">View Details</button>
                    <button onClick={() => openEdit(farm)} className="flex-1 py-2 rounded-xl bg-[#F3F6F4] text-[#065F46] text-xs font-bold hover:bg-[#ECFDF5] flex items-center justify-center gap-1"><Pencil className="w-3.5 h-3.5" /> Edit Farm</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Selected farm detail + performance */}
      {selectedFarm && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#E5EDE7] shadow-sm p-5 space-y-3">
            <h2 className="font-extrabold text-[#172B24] font-heading">Crops on {selectedFarm.name}</h2>
            {selectedCrops.length === 0 ? (
              <p className="text-sm text-[#718078]">No crops planted on this parcel yet. Use Crop Management → Add to My Farm to plant one here.</p>
            ) : selectedCrops.map((crop) => (
              <div key={crop.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#F3F6F4]">
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[#172B24] truncate">{crop.name} <span className="font-medium text-[#718078]">· {crop.variety}</span></p>
                  <p className="text-xs text-[#718078]">{crop.area} acres · {crop.status} · {crop.healthScore}% health · Stage: {crop.currentStage}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-[#065F46]">₹{crop.expectedRevenue.toLocaleString('en-IN')}</p>
                  <button onClick={() => advanceCropStage(crop.id, nextStage(crop.currentStage))} className="text-[11px] font-bold text-[#059669] hover:underline">Advance stage →</button>
                  <button onClick={() => deleteCrop(crop.id)} className="block ml-auto text-[11px] font-bold text-rose-600 hover:underline mt-0.5">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5EDE7] shadow-sm p-5 space-y-3">
              <h2 className="font-extrabold text-[#172B24] font-heading flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#059669]" /> Farm performance — revenue by parcel</h2>
              {farms.map((farm) => {
                const revenue = crops.filter((c) => c.farmId === farm.id).reduce((s, c) => s + c.expectedRevenue, 0);
                return (
                  <div key={farm.id}>
                    <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-[#3E5248]">{farm.name}</span><span className="font-bold text-[#065F46]">₹{revenue.toLocaleString('en-IN')}</span></div>
                    <div className="h-2.5 bg-[#F3F6F4] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#84CC16] to-[#059669] rounded-full" style={{ width: `${Math.max(4, (revenue / maxFarmRevenue) * 100)}%` }} /></div>
                  </div>
                );
              })}
            </div>
            <div className="bg-white rounded-2xl border border-[#E5EDE7] shadow-sm p-5 space-y-3">
              <h2 className="font-extrabold text-[#172B24] font-heading">Seasonal summary</h2>
              <div className="grid grid-cols-3 gap-2 text-center">
                {(['Kharif','Rabi','Zaid'] as const).map((s) => (
                  <div key={s} className="rounded-2xl bg-[#ECFDF5] p-3">
                    <p className="text-[11px] font-bold text-[#718078] uppercase">{s}</p>
                    <p className="text-xl font-extrabold text-[#065F46]">{seasonal[s]}</p>
                    <p className="text-[11px] text-[#718078]">crops planted</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#718078] flex items-center gap-1"><Droplets className="w-3.5 h-3.5" /> Season is derived from each planted crop's sowing date. {t('addCrop')} is available from Crop Management.</p>
            </div>
          </div>
        </section>
      )}

      {/* Add / Edit Farm modal */}
      {(showAddFarmModal || editingFarm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#172B24] font-heading">{editingFarm ? 'Edit Farm Parcel' : 'Add New Farm Parcel'}</h3>
              <button onClick={closeFarmModal} className="text-[#8A9A90] hover:text-[#3E5248]">✕</button>
            </div>
            <form onSubmit={handleFarmSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#3E5248] mb-1">Farm Parcel Name</label>
                <input value={farmName} onChange={(e) => setFarmName(e.target.value)} placeholder="e.g. North Cauvery Parcel" required className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs focus:ring-2 focus:ring-[#10B981] outline-none" />
              </div>
              <div>
                <label className="block font-bold text-[#3E5248] mb-1">Location / Village</label>
                <input value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} placeholder="e.g. Pandavapura, Mandya" className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#3E5248] mb-1">Total Land (Acres)</label>
                  <input type="number" step="0.5" value={farmTotalArea} onChange={(e) => setFarmTotalArea(parseFloat(e.target.value) || 0)} required className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs" />
                </div>
                <div>
                  <label className="block font-bold text-[#3E5248] mb-1">Primary Water Source</label>
                  <select value={farmWaterSource} onChange={(e) => setFarmWaterSource(e.target.value as Farm['waterSource'])} className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs bg-white">
                    <option value="Borewell">Borewell</option>
                    <option value="Canal">Canal</option>
                    <option value="Drip/Sprinkler">Drip / Sprinkler</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-[#3E5248] mb-1">Soil Type</label>
                <input value={farmSoilType} onChange={(e) => setFarmSoilType(e.target.value)} placeholder="e.g. Red Loamy / Black Cotton" className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#065F46] text-white font-bold text-sm transition-colors">
                {editingFarm ? 'Save Farm Changes' : 'Register Farm Parcel'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
