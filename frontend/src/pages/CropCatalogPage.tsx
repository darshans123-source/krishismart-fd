import React, { useMemo, useState } from 'react';
import { Search, Plus, Eye, X } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';
import { CROP_CATALOG, CROP_CATEGORIES, CROP_STATES, CROP_SOILS, CatalogCrop } from '../constants/cropCatalog';
import { cropImageUrl } from '../constants/cropImages';

interface CropCatalogPageProps {
  onViewMyFarm?: () => void;
}

const CATEGORY_BADGE: Record<string, string> = {
  'Food Grains': 'bg-[#FEF3C7] text-[#92400E]',
  'Pulses': 'bg-[#FCE7F3] text-[#9D174D]',
  'Oilseeds': 'bg-[#FEF9C3] text-[#854D0E]',
  'Cash Crops': 'bg-[#DCFCE7] text-[#166534]',
  'Vegetables': 'bg-[#ECFDF5] text-[#065F46]',
  'Fruits': 'bg-[#FFEDD5] text-[#9A3412]',
  'Spices & Plantation': 'bg-[#FEE2E2] text-[#991B1B]',
  'Flowers': 'bg-[#F5D0FE] text-[#86198F]'
};

function CropCardImage({ crop, alt, className }: { crop: CatalogCrop; alt: string; className: string }) {
  const [failed, setFailed] = useState(false);
  const url = cropImageUrl(crop.name);
  if (!url || failed) {
    return (
      <div className={`${className} flex flex-col items-center justify-center gap-1 bg-[#ECFDF5] text-[#065F46]`} role="img" aria-label={alt}>
        <span className="text-3xl font-extrabold font-heading">{alt.charAt(0)}</span>
        <span className="text-[10px] font-bold px-2 text-center leading-tight">{alt}</span>
        <span className="text-[10px] text-[#718078]">Photo coming soon</span>
      </div>
    );
  }
  return (
    <div className={`${className} overflow-hidden`}>
      <img src={url} alt={alt} loading="lazy" onError={() => setFailed(true)} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
    </div>
  );
}

export const CropCatalogPage: React.FC<CropCatalogPageProps> = ({ onViewMyFarm }) => {
  const { farms, addCrop } = useFarmData();
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [season, setSeason] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [soilFilter, setSoilFilter] = useState('All');
  const [waterFilter, setWaterFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'duration' | 'price'>('name');
  const [selected, setSelected] = useState<CatalogCrop | null>(null);
  const [adding, setAdding] = useState<CatalogCrop | null>(null);
  const [addedCropName, setAddedCropName] = useState<string | null>(null);

  // Add form state
  const [addFarmId, setAddFarmId] = useState(farms[0]?.id || '');
  const [addArea, setAddArea] = useState(1);
  const [addVariety, setAddVariety] = useState('');
  const [addSowing, setAddSowing] = useState(new Date().toISOString().slice(0, 10));
  const [addIrrigation, setAddIrrigation] = useState('Drip irrigation');

  const displayName = (crop: CatalogCrop) =>
    language === 'kn' ? crop.nameKn : language === 'hi' ? crop.nameHi : crop.name;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = CROP_CATALOG.filter((crop) => {
      if (category !== 'All' && crop.category !== category) return false;
      if (season !== 'All' && crop.season !== season) return false;
      if (stateFilter !== 'All' && !crop.states.includes(stateFilter)) return false;
      if (soilFilter !== 'All' && !crop.soilTypes.includes(soilFilter)) return false;
      if (waterFilter !== 'All' && crop.water !== waterFilter) return false;
      if (q && !`${crop.name} ${crop.nameKn} ${crop.nameHi} ${crop.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === 'duration') return a.durationDays - b.durationDays;
      if (sortBy === 'price') return (b.pricePerQuintal ?? -1) - (a.pricePerQuintal ?? -1);
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [query, category, season, stateFilter, soilFilter, waterFilter, sortBy]);

  const openAdd = (crop: CatalogCrop) => {
    setAdding(crop);
    setAddVariety('');
    setAddArea(1);
    setAddFarmId(farms[0]?.id || '');
    setAddedCropName(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adding || !addFarmId) return;
    const yieldKg = Math.round(adding.yieldKgPerAcre * addArea);
    const pricePerKg = adding.pricePerQuintal ? adding.pricePerQuintal / 100 : 25;
    const harvest = new Date(addSowing);
    harvest.setDate(harvest.getDate() + adding.durationDays);
    addCrop({
      farmId: addFarmId,
      name: adding.name,
      variety: addVariety.trim() || 'Improved variety',
      area: addArea,
      sowingDate: addSowing,
      expectedHarvestDate: harvest.toISOString().slice(0, 10),
      currentStage: 'seed',
      healthScore: 90,
      status: 'Healthy',
      irrigationSchedule: addIrrigation,
      fertilizerSchedule: 'Basal NPK at sowing, split nitrogen as per soil test',
      projectedYieldKg: yieldKg,
      expectedRevenue: Math.round(yieldKg * pricePerKg)
    });
    setAddedCropName(adding.name);
  };

  const selectClass = 'w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs bg-white focus:ring-2 focus:ring-[#10B981] outline-none';

  return (
    <div className="w-full min-w-0 space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="rounded-3xl overflow-hidden bg-[#065F46] text-white p-6 sm:p-8 shadow-lg shadow-[#065F46]/20 relative">
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">Crop Management</h1>
          <p className="text-sm text-[#D1FAE5] mt-1 max-w-2xl">
            A searchable Indian crop catalog. Find a crop, read its full profile, and add it to one of your farm parcels — it appears in My Farm straight away.
          </p>
          <p className="text-xs text-[#A7F3D0] mt-3 font-semibold">
            {CROP_CATALOG.length} crops · Prices shown are indicative guides, not live mandi rates. Check Mandi Prices for live rates.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#E5EDE7] shadow-sm p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#718078]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search crop by name…"
            className="w-full pl-9 p-2.5 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#10B981] outline-none"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass} aria-label="Filter by category">
            <option value="All">All categories</option>
            {CROP_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={season} onChange={(e) => setSeason(e.target.value)} className={selectClass} aria-label="Filter by season">
            <option value="All">All seasons</option>
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
            <option value="Zaid">Zaid</option>
          </select>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className={selectClass} aria-label="Filter by state">
            <option value="All">All states</option>
            {CROP_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={soilFilter} onChange={(e) => setSoilFilter(e.target.value)} className={selectClass} aria-label="Filter by soil type">
            <option value="All">All soils</option>
            {CROP_SOILS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={waterFilter} onChange={(e) => setWaterFilter(e.target.value)} className={selectClass} aria-label="Filter by water requirement">
            <option value="All">Any water need</option>
            <option value="Low">Low water</option>
            <option value="Medium">Medium water</option>
            <option value="High">High water</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className={selectClass} aria-label="Sort crops">
            <option value="name">Sort: Name</option>
            <option value="duration">Sort: Duration</option>
            <option value="price">Sort: Market price</option>
          </select>
        </div>
        <p className="text-xs text-[#718078]">{filtered.length} crop{filtered.length === 1 ? '' : 's'} found</p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#CBD8D0]">
          <p className="font-bold text-[#3E5248]">No crops match those filters</p>
          <p className="text-xs text-[#718078] mt-1">Clear the search or choose a different category, season or state.</p>
          <button onClick={() => { setQuery(''); setCategory('All'); setSeason('All'); setStateFilter('All'); setSoilFilter('All'); setWaterFilter('All'); }} className="mt-4 px-4 py-2 rounded-xl bg-[#059669] text-white text-xs font-bold">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filtered.map((crop) => (
            <article key={crop.id} className="group bg-white rounded-2xl border border-[#E5EDE7] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
              <CropCardImage crop={crop} alt={displayName(crop)} className="w-full h-36" />
              <div className="p-3.5 flex-1 flex flex-col gap-1.5">
                <span className={`self-start text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_BADGE[crop.category] || 'bg-[#ECFDF5] text-[#065F46]'}`}>{crop.category}</span>
                <h3 className="font-bold text-sm text-[#172B24] leading-tight">{displayName(crop)}</h3>
                {language !== 'en' && <p className="text-[11px] text-[#718078]">{crop.name}</p>}
                <p className="text-[11px] text-[#718078]">{crop.season} · {crop.durationDays} days · {crop.water} water</p>
                <p className="text-xs font-bold text-[#065F46]">
                  {crop.pricePerQuintal ? `₹${crop.pricePerQuintal.toLocaleString('en-IN')} / quintal (indicative)` : 'Price: check Mandi Prices'}
                </p>
                <div className="flex gap-2 mt-auto pt-2">
                  <button onClick={() => setSelected(crop)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-[#F3F6F4] hover:bg-[#ECFDF5] text-[#065F46] text-xs font-bold transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>
                  <button onClick={() => openAdd(crop)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-[#059669] hover:bg-[#065F46] text-white text-xs font-bold transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add to My Farm
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Details modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <CropCardImage crop={selected} alt={displayName(selected)} className="w-full h-48" />
            <div className="p-6 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-[#172B24] font-heading">{displayName(selected)}</h2>
                  <p className="text-xs text-[#718078]">{selected.name} · {selected.nameKn} · {selected.nameHi} · {selected.category}</p>
                </div>
                <button onClick={() => setSelected(null)} aria-label="Close details" className="p-2 rounded-xl bg-[#F3F6F4] text-[#718078] hover:text-[#172B24]"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-[#3E5248]">{selected.description}</p>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div><dt className="font-bold text-[#718078]">Season</dt><dd>{selected.season}</dd></div>
                <div><dt className="font-bold text-[#718078]">Duration</dt><dd>{selected.durationDays} days</dd></div>
                <div><dt className="font-bold text-[#718078]">Suitable soil</dt><dd>{selected.soilTypes.join(', ')}</dd></div>
                <div><dt className="font-bold text-[#718078]">Water need</dt><dd>{selected.water}</dd></div>
                <div><dt className="font-bold text-[#718078]">Main states</dt><dd>{selected.states.join(', ')}</dd></div>
                <div><dt className="font-bold text-[#718078]">Expected yield / acre</dt><dd>{selected.yieldKgPerAcre.toLocaleString('en-IN')} kg (indicative)</dd></div>
                <div><dt className="font-bold text-[#718078]">Estimated cost / acre</dt><dd>₹{selected.costPerAcre.toLocaleString('en-IN')} (indicative)</dd></div>
                <div><dt className="font-bold text-[#718078]">Price</dt><dd>{selected.pricePerQuintal ? `₹${selected.pricePerQuintal.toLocaleString('en-IN')} / quintal (indicative)` : 'Check Mandi Prices for live rates'}</dd></div>
              </dl>
              <div className="space-y-2 text-xs text-[#3E5248]">
                <p><strong className="text-[#172B24]">Sowing:</strong> {selected.sowing}</p>
                <p><strong className="text-[#172B24]">Seed:</strong> {selected.seedRate}</p>
                <p><strong className="text-[#172B24]">Fertilizer schedule:</strong> {selected.fertilizer}</p>
                <p><strong className="text-[#172B24]">Irrigation:</strong> {selected.irrigation}</p>
                <p><strong className="text-[#172B24]">Pests & diseases:</strong> {selected.pests}</p>
                <p><strong className="text-[#172B24]">Government support:</strong> {selected.support}</p>
              </div>
              <button onClick={() => { setSelected(null); openAdd(selected); }} className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#065F46] text-white font-bold text-sm transition-colors">Add to My Farm</button>
            </div>
          </div>
        </div>
      )}

      {/* Add to My Farm modal */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-lg text-[#172B24] font-heading">Add {adding.name} to My Farm</h2>
                <p className="text-xs text-[#718078]">This crop will appear in My Farm overview immediately after saving.</p>
              </div>
              <button onClick={() => setAdding(null)} aria-label="Close add form" className="p-2 rounded-xl bg-[#F3F6F4] text-[#718078] hover:text-[#172B24]"><X className="w-4 h-4" /></button>
            </div>
            {addedCropName ? (
              <div className="space-y-3 text-center py-2">
                <p className="font-bold text-[#065F46]">✓ {addedCropName} added to your farm!</p>
                <p className="text-xs text-[#718078]">Open My Farm to see it in your farm overview, or add another crop.</p>
                <div className="flex gap-2">
                  {onViewMyFarm && <button onClick={() => { setAdding(null); onViewMyFarm(); }} className="flex-1 py-3 rounded-xl bg-[#059669] text-white font-bold text-sm">View in My Farm</button>}
                  <button onClick={() => setAddedCropName(null)} className="flex-1 py-3 rounded-xl bg-[#F3F6F4] text-[#065F46] font-bold text-sm">Add another</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#3E5248] mb-1">Farm parcel</label>
                  <select value={addFarmId} onChange={(e) => setAddFarmId(e.target.value)} required className={selectClass}>
                    {farms.map((f) => <option key={f.id} value={f.id}>{f.name} — {f.totalArea} acres, {f.location}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#3E5248] mb-1">Crop name</label>
                  <input value={adding.name} readOnly className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs bg-[#F3F6F4]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#3E5248] mb-1">Cultivated acreage</label>
                    <input type="number" step="0.5" min="0.5" value={addArea} onChange={(e) => setAddArea(parseFloat(e.target.value) || 1)} required className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#3E5248] mb-1">Variety</label>
                    <input value={addVariety} onChange={(e) => setAddVariety(e.target.value)} placeholder="e.g. Improved variety" className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#3E5248] mb-1">Sowing date</label>
                    <input type="date" value={addSowing} onChange={(e) => setAddSowing(e.target.value)} required className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#3E5248] mb-1">Irrigation method</label>
                    <select value={addIrrigation} onChange={(e) => setAddIrrigation(e.target.value)} className={selectClass}>
                      <option>Drip irrigation</option>
                      <option>Sprinkler irrigation</option>
                      <option>Canal irrigation</option>
                      <option>Borewell irrigation</option>
                      <option>Rainfed</option>
                    </select>
                  </div>
                </div>
                <p className="text-[11px] text-[#718078] bg-[#ECFDF5] rounded-xl p-2.5">
                  Estimated: {Math.round(adding.yieldKgPerAcre * addArea).toLocaleString('en-IN')} kg yield · ₹{Math.round(adding.yieldKgPerAcre * addArea * (adding.pricePerQuintal ? adding.pricePerQuintal / 100 : 25)).toLocaleString('en-IN')} revenue (indicative, using {adding.pricePerQuintal ? 'the indicative price' : '₹25/kg where no price is listed'}).
                </p>
                <button type="submit" className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#065F46] text-white font-bold text-sm transition-colors">Save Crop to My Farm</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
