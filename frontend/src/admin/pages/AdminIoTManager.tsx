import React, { useState, useEffect } from 'react';
import { 
  Cpu, Wifi, WifiOff, Battery, Droplets, Thermometer, 
  Wind, MapPin, RefreshCw, Edit2, CheckCircle2, AlertTriangle, 
  Activity, Sliders 
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';

interface IoTDevice {
  id: string;
  name: string;
  type: string;
  status: 'Online' | 'Offline' | 'Alert';
  location: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  batteryLevel: number;
  signalStrength: string;
  lastPing: string;
}

export const AdminIoTManager: React.FC = () => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<IoTDevice>>({});

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await adminApi.iot.getAll();
      if (res && res.data) {
        setDevices(res.data);
      }
    } catch (e) {
      console.error('Failed to load IoT telemetry:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleOpenEdit = (device: IoTDevice) => {
    setSelectedDevice(device);
    setFormData({ ...device });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;

    try {
      setSaving(true);
      await adminApi.iot.update(selectedDevice.id, formData);
      setIsModalOpen(false);
      await fetchDevices();
    } catch (e) {
      console.error('Failed to update IoT device:', e);
      alert('Failed to update sensor parameters.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            Edge Sensor Mesh & LoRaWAN Gateway
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight font-heading">
            IoT & Telemetry Manager
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time telemetry, soil probes, micro-weather sensors, solar battery monitoring, and calibration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDevices}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 bg-white hover:bg-stone-50 text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Telemetry
          </button>
        </div>
      </div>

      {/* Network Health Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Connected Probes</div>
            <div className="text-2xl font-black text-stone-900 mt-1">{devices.length} Nodes</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">LoRaWAN 868MHz Mesh</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
            <Wifi className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Avg Soil Moisture</div>
            <div className="text-2xl font-black text-teal-900 mt-1">
              {devices.length > 0
                ? Math.round(devices.reduce((acc, d) => acc + (d.soilMoisture || 0), 0) / devices.length)
                : 64}%
            </div>
            <div className="text-[11px] text-teal-700 font-semibold mt-0.5">Optimum Root Zone</div>
          </div>
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
            <Droplets className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Ambient Soil Temp</div>
            <div className="text-2xl font-black text-amber-900 mt-1">
              {devices.length > 0 ? devices[0]?.temperature : 26}°C
            </div>
            <div className="text-[11px] text-stone-500 font-semibold mt-0.5">Root Thermal Zone</div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
            <Thermometer className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Network Uptime</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">99.8%</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Solar backed supercapacitors</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sensor Node Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Reading IoT telemetry channels...</p>
        </div>
      ) : devices.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <Cpu className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No IoT devices registered</h3>
          <p className="text-xs text-stone-500 mt-1">Deploy sensor nodes to capture live telemetry.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {devices.map(dev => (
            <div
              key={dev.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">{dev.id}</span>
                    <h3 className="text-base font-bold text-stone-900 leading-tight mt-0.5">{dev.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {dev.location}
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    dev.status === 'Online'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : dev.status === 'Alert'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      dev.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                    }`} />
                    {dev.status}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100">
                  <div className="text-center">
                    <div className="text-[10px] font-semibold text-stone-500 flex items-center justify-center gap-1 mb-1">
                      <Droplets className="w-3 h-3 text-teal-600" /> Moisture
                    </div>
                    <div className="text-lg font-black text-stone-900">{dev.soilMoisture}%</div>
                  </div>

                  <div className="text-center border-x border-stone-200">
                    <div className="text-[10px] font-semibold text-stone-500 flex items-center justify-center gap-1 mb-1">
                      <Thermometer className="w-3 h-3 text-amber-600" /> Temp
                    </div>
                    <div className="text-lg font-black text-stone-900">{dev.temperature}°C</div>
                  </div>

                  <div className="text-center">
                    <div className="text-[10px] font-semibold text-stone-500 flex items-center justify-center gap-1 mb-1">
                      <Wind className="w-3 h-3 text-blue-600" /> Humidity
                    </div>
                    <div className="text-lg font-black text-stone-900">{dev.humidity}%</div>
                  </div>
                </div>

                {/* Battery & Health */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span className="flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-emerald-600" /> Battery Level
                    </span>
                    <span className="font-bold text-stone-800">{dev.batteryLevel}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${dev.batteryLevel > 30 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${dev.batteryLevel}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                    <span>Signal: {dev.signalStrength || '-74 dBm (Strong)'}</span>
                    <span>Ping: {dev.lastPing || '2m ago'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-800">
                  Type: {dev.type}
                </span>
                <button
                  onClick={() => handleOpenEdit(dev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                >
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  Calibrate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calibration Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Calibrate Node: ${selectedDevice?.name || ''}`}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Sensor Node Name</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Location / Plot</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Operational Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30"
              >
                <option value="Online">Online (Broadcasting)</option>
                <option value="Alert">Alert (Threshold Exceeded)</option>
                <option value="Offline">Offline (Sleep / Disconnected)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Moisture (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.soilMoisture || 0}
                onChange={(e) => setFormData({ ...formData, soilMoisture: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Temperature (°C)</label>
              <input
                type="number"
                value={formData.temperature || 0}
                onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Humidity (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.humidity || 0}
                onChange={(e) => setFormData({ ...formData, humidity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Battery Level (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.batteryLevel || 100}
              onChange={(e) => setFormData({ ...formData, batteryLevel: Number(e.target.value) })}
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
              {saving ? 'Calibrating...' : 'Save Calibration'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
