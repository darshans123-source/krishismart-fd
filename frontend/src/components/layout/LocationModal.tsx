import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Search,
  X,
  Sparkles,
  RefreshCw,
  Globe2,
  Radio
} from 'lucide-react';
import { useFarmData } from '../../context/FarmDataContext';
import { INDIAN_STATES_CITIES, INDIAN_STATES } from '../../constants/indianRegions';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const {
    locationState,
    requestGPSLocation,
    setManualLocation,
    weatherLastUpdated
  } = useFarmData();

  const [selectedState, setSelectedState] = useState(locationState.address.state || 'Karnataka');
  const [selectedDistrict, setSelectedDistrict] = useState(locationState.address.district || 'Raichur');
  const [districtSearch, setDistrictSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep the manual picker in sync when the modal is reopened after a
  // GPS fix, instead of showing the district from the first mount.
  useEffect(() => {
    if (isOpen) {
      setSelectedState(locationState.address.state || 'Karnataka');
      setSelectedDistrict(locationState.address.district || 'Raichur');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const currentDistricts = INDIAN_STATES_CITIES[selectedState] || [];
  const filteredDistricts = currentDistricts.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase().trim())
  );

  const handleUseGPS = async () => {
    setIsSubmitting(true);
    await requestGPSLocation();
    setIsSubmitting(false);
  };

  const handleApplyManual = async (district: string) => {
    setSelectedDistrict(district);
    setIsSubmitting(true);
    await setManualLocation(district, selectedState);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-[#E5EDE7] space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D1FAE5] text-[#064E3B] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-[#172B24] font-heading">
                Farm Location & Geolocation
              </h2>
              <p className="text-xs text-[#718078]">
                Powers real-time weather, nearby mandis & farm intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#EFF4EF] flex items-center justify-center text-[#8A9A90] hover:text-[#3E5248] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Current Active Location Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#172B24] to-[#243A32] text-white shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#34D399] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping"></span>
                Active Farm Location
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-[#CBD8D0] font-medium">
                {locationState.source === 'gps' ? '🛰️ Browser GPS' : '📍 Manual Region'}
              </span>
            </div>

            <div className="text-lg font-black text-white font-heading">
              {locationState.address.formatted}
            </div>

            {locationState.coordinates && (
              <div className="text-[11px] text-[#8A9A90] flex items-center gap-3">
                <span>Lat: {locationState.coordinates.lat.toFixed(4)}° N</span>
                <span>•</span>
                <span>Lng: {locationState.coordinates.lng.toFixed(4)}° E</span>
                <span>•</span>
                <span className="text-[#6EE7B7]">Telemetry: {weatherLastUpdated}</span>
              </div>
            )}
          </div>

          {/* GPS Trigger Button */}
          <div className="space-y-2">
            <button
              onClick={handleUseGPS}
              disabled={isSubmitting || locationState.status === 'loading'}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#059669] hover:bg-[#064E3B] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 ${locationState.status === 'loading' ? 'animate-spin' : ''}`} />
              <span>
                {locationState.status === 'loading'
                  ? 'Acquiring GPS Satellite Coordinates...'
                  : 'Detect My Real GPS Location'}
              </span>
            </button>

            {locationState.status === 'denied' && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Location Permission Denied</div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Your browser has location permissions blocked. Allow location for this site in your browser settings, then try again — or pick your agricultural district manually below.
                  </p>
                </div>
              </div>
            )}

            {(locationState.status === 'timeout' ||
              locationState.status === 'unavailable' ||
              locationState.status === 'error') && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Could not detect your live location</div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {locationState.errorMessage ||
                      'GPS detection failed. Try again outdoors with device location turned on, or pick your district manually below.'}
                  </p>
                </div>
              </div>
            )}

            {locationState.status === 'granted' && locationState.source === 'gps' && (
              <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>Real-time browser geolocation verified & calibrated with Open-Meteo.</span>
              </div>
            )}
          </div>

          {/* Manual Agricultural Region Selector */}
          <div className="pt-2 border-t border-[#EFF4EF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#243A32] uppercase tracking-wider">
                Or Select Farm Region Manually
              </span>
              <span className="text-[11px] text-[#8A9A90]">All 28 States & UTs</span>
            </div>

            {/* State Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#5A6E64] mb-1">State / Province</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setDistrictSearch('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EDE7] text-xs bg-white text-[#243A32] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* District Search & Selection Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#5A6E64]">Select Agricultural District</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A9A90]" />
                <input
                  type="text"
                  value={districtSearch}
                  onChange={(e) => setDistrictSearch(e.target.value)}
                  placeholder={`Search ${selectedState} districts...`}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5EDE7] focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 border border-[#EFF4EF] rounded-xl bg-[#F7FAF7]/50">
                {filteredDistricts.map((district) => {
                  const isSelected = locationState.address.district === district;
                  return (
                    <button
                      key={district}
                      onClick={() => handleApplyManual(district)}
                      className={`p-2 rounded-lg text-left text-xs font-semibold truncate transition-colors ${
                        isSelected
                          ? 'bg-[#059669] text-white shadow-xs'
                          : 'bg-white text-[#3E5248] hover:bg-[#ECFDF5] hover:text-[#064E3B] border border-[#E5EDE7]/80'
                      }`}
                    >
                      {district}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#EFF4EF] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#8A9A90]">
            Coordinates stored securely in local session
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#EFF4EF] hover:bg-[#E5EDE7] text-[#3E5248] font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
