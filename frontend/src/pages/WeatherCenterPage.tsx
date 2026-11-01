import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  CloudLightning,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Thermometer,
  Gauge,
  Compass,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';

export const WeatherCenterPage: React.FC = () => {
  const {
    weather,
    locationState,
    setIsLocationModalOpen,
    refreshWeather,
    weatherLastUpdated,
    isWeatherLive
  } = useFarmData();
  const { t } = useLanguage();

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-1 border border-amber-200">
            <CloudSun className="w-3.5 h-3.5" />
            <span>Hyper-Local Micro-Climate Station</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] font-heading">
            {t('weatherCenter')}
          </h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            Real-time farm weather telemetry in {locationState.address.formatted}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F7FAF7] border border-[#E5EDE7] text-[#3E5248] font-bold text-xs shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#059669]" />
            <span>📍 Change Location</span>
          </button>
          <button
            onClick={refreshWeather}
            className="px-3.5 py-2 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white font-bold text-xs shadow-md shadow-[#059669]/20 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 1. HERO WEATHER GLANCE & ADVISORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Current Weather Big Card */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#172B24] via-slate-850 to-[#022C22] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#3E5248]/80 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Current Weather Telemetry • {weatherLastUpdated}
              </span>
              <h2 className="text-xl font-bold text-white font-heading">
                {locationState.address.formatted}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#10B981]/20 text-[#6EE7B7] text-xs font-extrabold border border-[#10B981]/30">
              {isWeatherLive ? '● Live Station' : 'Synced'}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-400 border border-white/10">
              <Sun className="w-12 h-12" />
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-black font-heading text-white">
                {weather.temp}°C
              </div>
              <p className="text-sm text-[#CBD8D0] font-medium mt-1">
                {weather.condition} • Feels like 31°C
              </p>
            </div>
          </div>

          {/* Micro-climate 4-metrics bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#243A32] text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[#8A9A90] font-medium">Humidity</div>
              <div className="text-base font-bold text-white mt-0.5">{weather.humidity}%</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[#8A9A90] font-medium">Wind Speed</div>
              <div className="text-base font-bold text-white mt-0.5">{weather.windSpeed} km/h</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[#8A9A90] font-medium">Soil Temp</div>
              <div className="text-base font-bold text-white mt-0.5">{weather.soilTemp}°C</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[#8A9A90] font-medium">Air Quality</div>
              <div className="text-base font-bold text-[#34D399] mt-0.5">{weather.airQuality}</div>
            </div>
          </div>
        </div>

        {/* Right Smart Spraying & Irrigation Advisory Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Foliar Spraying Window */}
          <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#059669]" />
                <h3 className="font-extrabold text-sm text-[#172B24] font-heading">
                  AI Foliar Spraying Window
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#064E3B] text-xs font-bold">
                {weather.sprayingAdvisory.status}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-xs text-[#064E3B]">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Best Spraying Window: {weather.sprayingAdvisory.bestWindow}</span>
              </div>
              <p className="text-[#064E3B] leading-relaxed">
                {weather.sprayingAdvisory.reason}
              </p>
            </div>
          </div>

          {/* Irrigation & Rain Alert */}
          <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-600" />
                <h3 className="font-extrabold text-sm text-[#172B24] font-heading">
                  Smart Irrigation Advisory
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold">
                Standby Mode
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-100 text-xs text-cyan-900">
              <p className="text-cyan-800 leading-relaxed font-medium">
                {weather.irrigationAdvisory.reason}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 7-DAY FORECAST GRID */}
      <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
          <div>
            <h3 className="font-extrabold text-base text-[#172B24] font-heading">
              7-Day Agricultural Weather Forecast
            </h3>
            <p className="text-xs text-[#718078]">
              Predictive rainfall radar and daily diurnal temperature ranges.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 text-center">
          {weather.forecast.map((fc, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border transition-all ${
                i === 0
                  ? 'bg-[#ECFDF5] border-[#6EE7B7] ring-2 ring-[#10B981]/20'
                  : 'bg-[#F7FAF7]/70 border-[#E5EDE7]'
              }`}
            >
              <div className="text-xs font-bold text-[#3E5248]">{fc.day}</div>
              <div className="text-[10px] text-[#8A9A90]">{fc.date}</div>

              <div className="my-3 flex justify-center text-amber-500">
                {fc.icon === 'sun' && <Sun className="w-8 h-8" />}
                {fc.icon === 'cloud-sun' && <CloudSun className="w-8 h-8" />}
                {fc.icon === 'cloud-rain' && <CloudRain className="w-8 h-8 text-blue-500" />}
                {fc.icon === 'cloud-lightning' && <CloudLightning className="w-8 h-8 text-purple-500" />}
                {fc.icon === 'cloud' && <CloudSun className="w-8 h-8 text-[#8A9A90]" />}
              </div>

              <div className="text-sm font-black text-[#172B24]">
                {fc.tempMax}° / <span className="text-xs font-normal text-[#718078]">{fc.tempMin}°</span>
              </div>

              <div className="text-[10px] font-bold text-blue-600 mt-2 flex items-center justify-center gap-1">
                <Droplets className="w-3 h-3" />
                <span>{fc.rainProb}% Rain</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
