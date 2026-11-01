import React, { useState } from 'react';
import {
  Plane,
  Play,
  CheckCircle2,
  AlertTriangle,
  Battery,
  Clock,
  Wind,
  Layers,
  MapPin,
  Calendar,
  Compass
} from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';

export const DroneSprayPage: React.FC = () => {
  const { dronePlans, addDronePlan, executeDroneMission, crops, weather } = useFarmData();
  const { t } = useLanguage();

  const [selectedField, setSelectedField] = useState('Field 2 (North Tomato Plot)');
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [fieldAreaAcres, setFieldAreaAcres] = useState<number>(2.0);
  const [cropStage, setCropStage] = useState('Flowering Stage');
  const [sprayType, setSprayType] = useState<'Bio-Fungicide' | 'Micronutrient Mix' | 'Nano Urea' | 'Insecticide'>('Bio-Fungicide');
  const [altitudeMeters, setAltitudeMeters] = useState<number>(2.2);

  const activePlan = dronePlans[0];

  const handleCreateNewPlan = (e: React.FormEvent) => {
    e.preventDefault();
    addDronePlan({
      fieldName: selectedField,
      cropName: selectedCrop,
      areaAcres: fieldAreaAcres,
      sprayType,
      chemicalName: `${sprayType} - Standard Agriculture Formulation`,
      solutionVolumeLitres: fieldAreaAcres * 20,
      altitudeMeters,
      estimatedFlightTimeMinutes: Math.round(fieldAreaAcres * 7),
      batteryPacksNeeded: fieldAreaAcres > 2 ? 2 : 1,
      windSpeedAcceptable: weather.windSpeed < 14
    });
  };

  const isWindSafe = weather.windSpeed < 14;

  return (
    <div className="w-full min-w-0 space-y-8 pb-16 animate-in fade-in">
      {/* ================================================== */}
      {/* 1. HERO SECTION WITH REALISTIC AGRI-DRONE IMAGE */}
      {/* ================================================== */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E5EDE7]">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#172B24]">
          <img
            src="https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=1200&auto=format&fit=crop&q=80"
            alt="Agricultural drone spraying crops"
            className="w-full h-full object-cover opacity-90 hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/90 via-[#172B24]/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064E3B]/80 backdrop-blur-xs text-white text-xs font-bold w-fit mb-2">
              <Plane className="w-3.5 h-3.5" />
              <span>Agricultural Aviation & Precision Spraying</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Smart Drone Planning
            </h1>
            <p className="text-xs sm:text-base text-[#E5EDE7] mt-1 max-w-2xl leading-relaxed">
              Plan efficient field coverage with drone-based farm monitoring and spraying.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
        <p className="leading-relaxed">
          <strong>Certified Pilot Advisory:</strong> All drone missions operate with micronized nozzle droplet dispersion. Maintain safe clearance distance and follow DGCA drone safety guidelines.
        </p>
      </div>

      {/* ================================================== */}
      {/* 2. FIELD PARAMETERS (Selection, Crop, Area, Stage) */}
      {/* ================================================== */}
      <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-2xs space-y-4">
        <div className="border-b border-[#EFF4EF] pb-3">
          <h2 className="text-base font-extrabold text-[#172B24] font-heading">
            Field Configuration
          </h2>
          <p className="text-xs text-[#718078]">
            Select the parcel and growth stage to calibrate flight paths and droplet volume.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Field Selection */}
          <div>
            <label className="block text-xs font-bold text-[#3E5248] mb-1.5">
              Field Selection
            </label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs bg-white text-[#243A32] font-medium focus:ring-2 focus:ring-[#059669] outline-hidden"
            >
              <option value="Field 2 (North Tomato Plot)">Field 2 (North Tomato Plot)</option>
              <option value="Field 1 (Cauvery Paddy Basin)">Field 1 (Cauvery Paddy Basin)</option>
              <option value="Field 3 (Sugarcane Meadow)">Field 3 (Sugarcane Meadow)</option>
              <option value="Field 4 (Cotton Acreage)">Field 4 (Cotton Acreage)</option>
            </select>
          </div>

          {/* 2. Crop */}
          <div>
            <label className="block text-xs font-bold text-[#3E5248] mb-1.5">
              Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs bg-white text-[#243A32] font-medium focus:ring-2 focus:ring-[#059669] outline-hidden"
            >
              <option value="Tomato">Tomato (Hybrid F1)</option>
              <option value="Paddy">Paddy / Rice (Samba)</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Cotton">Cotton</option>
            </select>
          </div>

          {/* 3. Field Area */}
          <div>
            <label className="block text-xs font-bold text-[#3E5248] mb-1.5">
              Field Area
            </label>
            <select
              value={fieldAreaAcres}
              onChange={(e) => setFieldAreaAcres(parseFloat(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs bg-white text-[#243A32] font-medium focus:ring-2 focus:ring-[#059669] outline-hidden"
            >
              <option value={1.5}>1.5 Acres</option>
              <option value={2.0}>2.0 Acres</option>
              <option value={2.5}>2.5 Acres</option>
              <option value={3.0}>3.0 Acres</option>
            </select>
          </div>

          {/* 4. Crop Stage */}
          <div>
            <label className="block text-xs font-bold text-[#3E5248] mb-1.5">
              Crop Stage
            </label>
            <select
              value={cropStage}
              onChange={(e) => setCropStage(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs bg-white text-[#243A32] font-medium focus:ring-2 focus:ring-[#059669] outline-hidden"
            >
              <option value="Flowering Stage">Flowering Stage</option>
              <option value="Vegetative Stage">Vegetative Stage</option>
              <option value="Tillering Stage">Tillering Stage</option>
              <option value="Fruit Setting">Fruit Setting Stage</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. FOUR KEY FLIGHT METRICS CARDS */}
      {/* ================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Drone Coverage */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EDE7] shadow-2xs space-y-1">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A9A90]">
            Drone Coverage
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#064E3B] font-heading">
            {activePlan?.coverageProgress || 85}%
          </div>
          <div className="text-xs text-[#064E3B] font-semibold">
            Uniform Canopy Penetration
          </div>
        </div>

        {/* Metric 2: Estimated Flight Time */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EDE7] shadow-2xs space-y-1">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A9A90]">
            Estimated Flight Time
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#172B24] font-heading">
            {Math.round(fieldAreaAcres * 7)} Mins
          </div>
          <div className="text-xs text-[#718078]">
            ~7 mins per acre @ 18 km/h
          </div>
        </div>

        {/* Metric 3: Coverage Area */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EDE7] shadow-2xs space-y-1">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A9A90]">
            Coverage Area
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#172B24] font-heading">
            {fieldAreaAcres} Acres
          </div>
          <div className="text-xs text-[#718078]">
            Spray Volume: {fieldAreaAcres * 20} Litres
          </div>
        </div>

        {/* Metric 4: Planning Window */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EDE7] shadow-2xs space-y-1">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A9A90]">
            Planning Window
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900 font-heading">
            4:30 PM – 6:30 PM
          </div>
          <div className="text-xs text-[#718078]">
            Wind: {weather.windSpeed} km/h (Safe &lt; 14 km/h)
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 4. SIMPLE FIELD MAP WITH DRONE FLIGHT PATH */}
      {/* ================================================== */}
      <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFF4EF] pb-3">
          <div>
            <h3 className="font-extrabold text-base text-[#172B24] font-heading">
              Field Waypoint Map & Flight Path
            </h3>
            <p className="text-xs text-[#718078]">
              Visual agricultural flight path across {selectedField} ({selectedCrop})
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#064E3B] border border-[#A7F3D0] text-xs font-bold w-fit">
            Status: {activePlan?.status || 'Ready for Dispatch'}
          </span>
        </div>

        {/* Realistic Agricultural Map SVG */}
        <div className="relative w-full h-64 sm:h-80 bg-[#f4f7f2] rounded-2xl border border-[#CBD8D0] overflow-hidden flex items-center justify-center p-4">
          {/* Subtle agricultural grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#14532d10_1px,transparent_1px),linear-gradient(to_bottom,#14532d10_1px,transparent_1px)] bg-[size:28px_28px]"></div>

          <svg className="w-full h-full" viewBox="0 0 500 240">
            {/* Farm Field Boundary */}
            <rect
              x="25"
              y="20"
              width="450"
              height="200"
              rx="16"
              fill="#dcfce7"
              fillOpacity="0.5"
              stroke="#15803d"
              strokeWidth="2.5"
            />

            {/* Field Crop Rows Background Pattern */}
            {[50, 75, 100, 125, 150, 175, 200].map((y, i) => (
              <line
                key={i}
                x1="30"
                y1={y}
                x2="470"
                y2={y}
                stroke="#16a34a"
                strokeWidth="1"
                strokeOpacity="0.25"
              />
            ))}

            {/* Waypoint Flight Lines */}
            <path
              d="M 50 45 L 450 45 L 450 85 L 50 85 L 50 125 L 450 125 L 450 165 L 50 165 L 50 195 L 450 195"
              fill="none"
              stroke="#047857"
              strokeWidth="3"
              strokeDasharray="8,6"
            />

            {/* Waypoint markers */}
            {[45, 85, 125, 165, 195].map((y, idx) => (
              <g key={idx}>
                <circle cx="50" cy={y} r="5" fill="#047857" stroke="#ffffff" strokeWidth="2" />
                <circle cx="450" cy={y} r="5" fill="#047857" stroke="#ffffff" strokeWidth="2" />
              </g>
            ))}

            {/* Drone Icon Position */}
            <g
              transform={`translate(${
                activePlan?.status === 'In Flight' ? 250 : activePlan?.status === 'Completed' ? 450 : 50
              }, ${
                activePlan?.status === 'In Flight' ? 125 : activePlan?.status === 'Completed' ? 195 : 45
              })`}
              className="transition-all duration-1000"
            >
              <circle r="14" fill="#15803d" stroke="#ffffff" strokeWidth="3" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                🚁
              </text>
            </g>
          </svg>

          {/* Telemetry pill */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-[#E5EDE7] text-xs shadow-xs space-y-0.5 text-[#3E5248]">
            <div><strong>Altitude:</strong> {altitudeMeters} meters above canopy</div>
            <div><strong>Spray Rate:</strong> 1.4 L/minute</div>
          </div>
        </div>

        {/* Action Controls & Launch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="w-full min-w-0 space-y-1">
            <div className="text-xs text-[#718078]">
              Formulation: <strong>{sprayType} (Bio-protection)</strong>
            </div>
            <div className="text-xs text-[#064E3B] font-semibold">
              ✓ Weather verified: 0% rain forecast during flight window
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateNewPlan}
              className="px-4 py-2.5 rounded-xl border border-[#CBD8D0] hover:bg-[#F7FAF7] text-[#243A32] text-xs font-bold transition-all"
            >
              Recalculate Route
            </button>

            <button
              onClick={() => activePlan && executeDroneMission(activePlan.id)}
              className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#064E3B] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Simulate Flight</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
