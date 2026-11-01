import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  Thermometer,
  CloudRain,
  Radio,
  Plus,
  Battery,
  Wifi,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';
import { IoTDevice } from '../types';

export const SmartFarmIoTPage: React.FC = () => {
  const { iotDevices, addIoTDevice } = useFarmData();
  const { t } = useLanguage();

  const [showAddModal, setShowAddModal] = useState(false);
  const [devName, setDevName] = useState('');
  const [devType, setDevType] = useState<IoTDevice['type']>('Soil Probe');
  const [devLocation, setDevLocation] = useState('Field 1 (Paddy Parcel)');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devName.trim()) return;
    addIoTDevice({
      name: devName,
      type: devType,
      fieldLocation: devLocation,
      batteryLevel: 100,
      signalStrength: 95,
      metrics: {
        soilMoisture: 58,
        soilTemp: 27,
        ambientTemp: 29.5,
        humidity: 65
      }
    });
    setDevName('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full min-w-0 space-y-8 pb-16 animate-in fade-in">
      {/* ================================================== */}
      {/* 1. HERO WITH REAL FARM IoT SENSOR IMAGE */}
      {/* ================================================== */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E5EDE7]">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#172B24]">
          <img
            src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&auto=format&fit=crop&q=80"
            alt="Real farm with IoT soil sensors installed"
            className="w-full h-full object-cover opacity-90 hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/90 via-[#172B24]/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064E3B]/80 backdrop-blur-xs text-white text-xs font-bold w-fit mb-2">
              <Radio className="w-3.5 h-3.5" />
              <span>In-Field Wireless Farm Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              IoT Smart Farming
            </h1>
            <p className="text-xs sm:text-base text-[#E5EDE7] mt-1 max-w-2xl leading-relaxed">
              Real-time monitoring of soil, weather, water tanks, and irrigation pumps across your fields.
            </p>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 2. FIVE SIMPLE SENSOR CARDS (Moisture, Temp, Tank, Rain, Online) */}
      {/* ================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Soil Moisture */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-[#E5EDE7] shadow-2xs space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E64] flex items-center gap-1">
              <span>🌱</span> Soil Moisture
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" title="Sensor status: OK" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#172B24] font-heading">
            58%
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#064E3B]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal</span>
          </div>
        </div>

        {/* 2. Soil Temperature */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-[#E5EDE7] shadow-2xs space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E64] flex items-center gap-1">
              <span>🌡️</span> Soil Temp
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" title="Sensor status: OK" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#172B24] font-heading">
            27°C
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#064E3B]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Normal</span>
          </div>
        </div>

        {/* 3. Water Tank */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-[#E5EDE7] shadow-2xs space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E64] flex items-center gap-1">
              <span>💧</span> Water Tank
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" title="Sensor status: OK" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-800 font-heading">
            74%
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-cyan-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Good (37,000 L)</span>
          </div>
        </div>

        {/* 4. Rain Sensor */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-[#E5EDE7] shadow-2xs space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E64] flex items-center gap-1">
              <span>🌧️</span> Rain Sensor
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" title="Sensor status: OK" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#172B24] font-heading">
            No Rain
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#718078]">
            <span>0.0 mm past 24h</span>
          </div>
        </div>

        {/* 5. Device Status */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-[#E5EDE7] shadow-2xs space-y-2 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6E64] flex items-center gap-1">
              <span>📡</span> Device Status
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" title="Sensor status: OK" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#064E3B] font-heading">
            7/8 Online
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#064E3B]">
            <span>1 Standby (Solar)</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. REAL-LOOKING FARM EQUIPMENT & SENSOR DIAGRAM */}
      {/* ================================================== */}
      <div className="bg-white/75 backdrop-blur-xl rounded-2xl border border-[#E5EDE7] p-6 shadow-2xs space-y-5">
        <div className="border-b border-[#EFF4EF] pb-3">
          <h2 className="text-base font-extrabold text-[#172B24] font-heading">
            Farm Sensor Network Overview
          </h2>
          <p className="text-xs text-[#718078]">
            Physical layout connecting soil sensors, weather stations, water storage, pump, and crop fields.
          </p>
        </div>

        {/* Clean Farm System Visual Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {/* Node 1: Soil Sensor */}
          <div className="p-4 rounded-2xl bg-[#f7f9f6] border border-[#A7F3D0] text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#D1FAE5] text-[#064E3B] flex items-center justify-center text-xl shadow-xs">
              🌱
            </div>
            <div className="text-xs font-bold text-[#172B24]">Soil Sensor</div>
            <div className="text-[11px] text-[#718078] leading-tight">
              Root zone probes at 15cm & 30cm depth
            </div>
            <span className="inline-block px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#064E3B] text-[10px] font-extrabold">
              58% VWC
            </span>
          </div>

          {/* Node 2: Weather Sensor */}
          <div className="p-4 rounded-2xl bg-[#f7f9f6] border border-amber-200 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shadow-xs">
              🌦️
            </div>
            <div className="text-xs font-bold text-[#172B24]">Weather Sensor</div>
            <div className="text-[11px] text-[#718078] leading-tight">
              Wind speed, humidity, solar lux on farm mast
            </div>
            <span className="inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold">
              27°C • Calm
            </span>
          </div>

          {/* Node 3: Water Tank */}
          <div className="p-4 rounded-2xl bg-[#f7f9f6] border border-cyan-200 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-xl shadow-xs">
              💧
            </div>
            <div className="text-xs font-bold text-[#172B24]">Water Tank</div>
            <div className="text-[11px] text-[#718078] leading-tight">
              Ultrasonic depth sensor in overhead sump
            </div>
            <span className="inline-block px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 text-[10px] font-extrabold">
              74% (37K L)
            </span>
          </div>

          {/* Node 4: Smart Pump */}
          <div className="p-4 rounded-2xl bg-[#f7f9f6] border border-[#A7F3D0] text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#D1FAE5] text-[#064E3B] flex items-center justify-center text-xl shadow-xs">
              ⚙️
            </div>
            <div className="text-xs font-bold text-[#172B24]">Pump Starter</div>
            <div className="text-[11px] text-[#718078] leading-tight">
              5.0 HP Submersible motor automated relay
            </div>
            <span className="inline-block px-2 py-0.5 rounded-md bg-[#064E3B] text-white text-[10px] font-extrabold">
              AUTO Mode
            </span>
          </div>

          {/* Node 5: Field */}
          <div className="p-4 rounded-2xl bg-[#f7f9f6] border border-[#E5EDE7] text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E5EDE7] text-[#243A32] flex items-center justify-center text-xl shadow-xs">
              🌾
            </div>
            <div className="text-xs font-bold text-[#172B24]">Active Field</div>
            <div className="text-[11px] text-[#718078] leading-tight">
              Drip lines & micro-sprinklers in Tomato & Paddy
            </div>
            <span className="inline-block px-2 py-0.5 rounded-md bg-[#EFF4EF] text-[#3E5248] text-[10px] font-extrabold">
              6.5 Total Acres
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 4. REGISTERED SENSORS LIST */}
      {/* ================================================== */}
      <div className="bg-white/75 backdrop-blur-xl rounded-2xl border border-[#E5EDE7] p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFF4EF] pb-3">
          <div>
            <h3 className="font-extrabold text-base text-[#172B24] font-heading">
              Installed Probes & Farm Nodes ({iotDevices.length} Connected)
            </h3>
            <p className="text-xs text-[#718078]">
              Long-range LoRa wireless battery-powered sensor hardware.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#064E3B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Sensor</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {iotDevices.map((dev) => (
            <div
              key={dev.id}
              className="p-4 rounded-2xl border border-[#E5EDE7] bg-[#F7FAF7] hover:border-[#6EE7B7] transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#064E3B]">
                    ● {dev.status}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-[#718078]">
                    <Battery className="w-3.5 h-3.5 text-[#059669]" />
                    <span>{dev.batteryLevel}%</span>
                    <span>•</span>
                    <Wifi className="w-3.5 h-3.5 text-blue-600" />
                    <span>{dev.signalStrength}% Signal</span>
                  </div>
                </div>

                <div className="text-sm font-bold text-[#172B24]">{dev.name}</div>
                <div className="text-xs text-[#718078] mt-0.5">
                  Type: {dev.type} | Location: {dev.fieldLocation}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-[#E5EDE7] text-xs">
                  {dev.metrics.soilMoisture !== undefined && (
                    <div className="p-2 rounded-xl bg-white/75 backdrop-blur-xl border border-[#E5EDE7] text-center">
                      <div className="text-[10px] text-[#8A9A90] font-bold">Moisture</div>
                      <div className="font-bold text-[#172B24]">{dev.metrics.soilMoisture}%</div>
                    </div>
                  )}
                  {dev.metrics.soilTemp !== undefined && (
                    <div className="p-2 rounded-xl bg-white/75 backdrop-blur-xl border border-[#E5EDE7] text-center">
                      <div className="text-[10px] text-[#8A9A90] font-bold">Soil Temp</div>
                      <div className="font-bold text-[#172B24]">{dev.metrics.soilTemp}°C</div>
                    </div>
                  )}
                  {dev.metrics.ambientTemp !== undefined && (
                    <div className="p-2 rounded-xl bg-white/75 backdrop-blur-xl border border-[#E5EDE7] text-center">
                      <div className="text-[10px] text-[#8A9A90] font-bold">Air Temp</div>
                      <div className="font-bold text-[#172B24]">{dev.metrics.ambientTemp}°C</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-[#8A9A90] flex items-center justify-between">
                <span>Node ID: {dev.id}</span>
                <span>Last report: {dev.lastPing}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONNECT DEVICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#E5EDE7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
              <h3 className="font-bold text-base text-[#172B24] font-heading">
                Connect Wireless Sensor
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8A9A90] hover:text-[#3E5248] font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="w-full min-w-0 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#3E5248] mb-1">Sensor Nickname</label>
                <input
                  type="text"
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  placeholder="e.g. Field C Sugarcane Probe"
                  required
                  className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs focus:ring-2 focus:ring-[#059669] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3E5248] mb-1">Sensor Type</label>
                <select
                  value={devType}
                  onChange={(e: any) => setDevType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs bg-white/75 backdrop-blur-xl"
                >
                  <option value="Soil Probe">Soil Moisture & Temp Probe</option>
                  <option value="Weather Node">Micro-Climate Farm Station</option>
                  <option value="Water Level Sensor">Water Tank Sensor</option>
                  <option value="Pump Controller">Pump Starter Relay Unit</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#3E5248] mb-1">Field Location</label>
                <input
                  type="text"
                  value={devLocation}
                  onChange={(e) => setDevLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#064E3B] hover:bg-[#064E3B] text-white font-bold text-sm shadow-md transition-all mt-2 cursor-pointer"
              >
                Pair Sensor (+120 XP)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
