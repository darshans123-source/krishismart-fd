import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Droplets,
  Coins,
  Sun,
  CloudSun,
  BrainCircuit,
  Store,
  Plane,
  Plus,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Volume2,
  VolumeX,
  MapPin,
  HelpCircle,
  ArrowRight,
  Activity,
  Wheat,
  ShieldCheck,
  ScanSearch
} from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';
import { AIFarmHealthModal } from '../components/dashboard/AIFarmHealthModal';

interface DashboardProps {
  onNavigate: (tabId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const {
    user,
    crops,
    tasks,
    toggleTask,
    addTask,
    weather,
    isWeatherLive,
    weatherLastUpdated,
    financialSummary,
    smartPump,
    locationState,
    setIsLocationModalOpen,
    aiFarmHealth,
    aiBriefing,
    nearbyMandis,
    openAIChatWithPrompt,
    cmsDashboard
  } = useFarmData();

  const { t } = useLanguage();

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<
    'Irrigation' | 'Fertilizer' | 'Pesticide' | 'Harvest' | 'Soil' | 'Drone' | 'Market'
  >('Irrigation');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Today, 5:00 PM');
  const [isSpeakingBriefing, setIsSpeakingBriefing] = useState(false);
  const [commandInput, setCommandInput] = useState('');

  const pendingTasks = tasks.filter((t) => !t.completed);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle,
      category: newTaskCategory,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      xpReward: 40,
      notes: 'Added from farmer daily schedule'
    });
    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  // Text-to-speech for Farm Advice Briefing
  const handleToggleSpeakBriefing = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeakingBriefing) {
      window.speechSynthesis.cancel();
      setIsSpeakingBriefing(false);
    } else {
      const textToRead = `${aiBriefing.greeting}. ${aiBriefing.summary}. ${aiBriefing.bullets.join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeakingBriefing(false);
      utterance.onerror = () => setIsSpeakingBriefing(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeakingBriefing(true);
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    openAIChatWithPrompt(commandInput.trim());
    setCommandInput('');
  };

  // Quick action buttons matching specification with dynamic CMS fallback
  const defaultQuickActions = [
    { id: 'aiHub', label: 'Crop Scan', icon: '🌱', route: 'aiHub', bg: 'bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#064E3B] border-[#A7F3D0]' },
    { id: 'weather', label: 'Weather', icon: '🌦️', route: 'weather', bg: 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200' },
    { id: 'market', label: 'Market', icon: '📈', route: 'market', bg: 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200' },
    { id: 'finance', label: 'Finance', icon: '💰', route: 'finance', bg: 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200' },
    { id: 'drone', label: 'Drone', icon: '🚁', route: 'drone', bg: 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200' },
    { id: 'pump', label: 'Pump', icon: '💧', route: 'pump', bg: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border-cyan-200' },
    { id: 'iot', label: 'IoT', icon: '📡', route: 'iot', bg: 'bg-[#EFF4EF] hover:bg-[#E5EDE7] text-[#172B24] border-[#CBD8D0]' }
  ];

  // Premium quick-action visuals: one clean Lucide icon in a muted tint,
  // instead of rainbow pastel tiles with emoji. CMS actions fall back to
  // their supplied icon only when no mapped visual exists.
  const quickActionVisuals: Record<string, { icon: React.ComponentType<{ className?: string }>; tint: string }> = {
    aiHub: { icon: ScanSearch, tint: 'bg-[#ECFDF5] text-[#064E3B] ring-[#D1FAE5]' },
    weather: { icon: CloudSun, tint: 'bg-amber-50 text-amber-700 ring-amber-100' },
    market: { icon: TrendingUp, tint: 'bg-sky-50 text-sky-700 ring-sky-100' },
    finance: { icon: Coins, tint: 'bg-teal-50 text-teal-700 ring-teal-100' },
    drone: { icon: Plane, tint: 'bg-violet-50 text-violet-700 ring-violet-100' },
    pump: { icon: Droplets, tint: 'bg-cyan-50 text-cyan-700 ring-cyan-100' },
    iot: { icon: Activity, tint: 'bg-[#EFF4EF] text-[#3E5248] ring-[#E5EDE7]' }
  };

  const heroConfig = cmsDashboard?.hero;
  const showHero = heroConfig ? heroConfig.visible !== false : true;

  // Real, time-aware greeting in sentence case — not a shouted, all-caps
  // "GOOD AFTERNOON" at every hour, and no emoji in the heading.
  const formatDisplayName = (name?: string) =>
    (name || 'Farmer')
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  const hourNow = new Date().getHours();
  const timeGreeting = hourNow < 12 ? 'Good morning' : hourNow < 17 ? 'Good afternoon' : 'Good evening';
  const heroHeading = heroConfig?.mainHeading
    ? heroConfig.mainHeading.replace(/\{name\}/gi, formatDisplayName(user?.name)).replace(/🌱/g, '').trim()
    : heroConfig?.greeting
    ? `${heroConfig.greeting.replace(/🌱/g, '').trim()}, ${formatDisplayName(user?.name)}`
    : `${timeGreeting}, ${formatDisplayName(user?.name)}`;

  const heroSubtitle = heroConfig?.subtitle || `Real-time farm status for ${locationState.address.district || 'Raichur'}, ${locationState.address.state || 'Karnataka'}.`;
  const heroBtnText = heroConfig?.buttonText || `Farm Health: ${aiFarmHealth.overall}/100`;

  const activeQuickActions = (cmsDashboard?.quickActions && Array.isArray(cmsDashboard.quickActions) && cmsDashboard.quickActions.length > 0)
    ? cmsDashboard.quickActions.filter((qa: any) => qa.visible !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    : defaultQuickActions;

  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-8 pb-2 animate-in fade-in duration-200">
      {/* ================================================== */}
      {/* 1. TOP 5-SECOND OVERVIEW & GREETING BANNER */}
      {/* ================================================== */}
      {showHero && (
        <div className="premium-hero rounded-[1.75rem] w-full min-w-0 overflow-hidden text-white p-4 sm:p-6 lg:p-8 border border-[#064E3B]/20 space-y-5">
          <div className="pointer-events-none absolute -right-10 -top-16 w-64 h-64 rounded-full bg-[#34D399]/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 bottom-0 w-48 h-48 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full min-w-0 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#D1FAE5] text-[11px] font-semibold tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]"></span>
                </span>
                <span>Live · Smart Farming Platform</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white tracking-tight leading-tight break-words">
                {heroHeading}
              </h1>
              <p className="text-sm sm:text-base text-[#D1FAE5]/90 max-w-xl leading-relaxed">
                {heroSubtitle}
              </p>
            </div>

            <button
              onClick={() => setShowHealthModal(true)}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-[#ECFDF5] text-[#022C22] text-xs font-bold flex items-center gap-2 self-start md:self-auto transition-all shadow-md cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#064E3B]" />
              <span>{heroBtnText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Clean Quick Metrics */}
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-5 border-t border-white/10">
            {/* 1. Location */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="p-3 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/15 text-left transition-colors group cursor-pointer min-w-0"
            >
              <div className="text-[11px] text-[#A7F3D0] flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#6EE7B7] shrink-0" />
                <span className="uppercase tracking-wider">Current Location</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 truncate group-hover:text-[#A7F3D0]">
                {locationState.address.district || 'Raichur'}, {locationState.address.state || 'Karnataka'}
              </div>
              <div className="text-[10px] text-[#6EE7B7] mt-0.5">Click to change</div>
            </button>

            {/* 2. Weather */}
            <button
              onClick={() => onNavigate('weather')}
              className="p-3 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/15 text-left transition-colors group cursor-pointer min-w-0"
            >
              <div className="text-[11px] text-[#A7F3D0] flex items-center gap-1.5 font-medium">
                <Sun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="uppercase tracking-wider">Weather</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 group-hover:text-[#A7F3D0]">
                {weather.temp}°C • {weather.condition}
              </div>
              <div className="text-[10px] text-[#6EE7B7] mt-0.5">Wind: {weather.windSpeed} km/h</div>
            </button>

            {/* 3. Crop Health */}
            <button
              onClick={() => onNavigate('myFarms')}
              className="p-3 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/15 text-left transition-colors group cursor-pointer min-w-0"
            >
              <div className="text-[11px] text-[#A7F3D0] flex items-center gap-1.5 font-medium">
                <Wheat className="w-3.5 h-3.5 text-[#6EE7B7] shrink-0" />
                <span className="uppercase tracking-wider">Crop Health</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 group-hover:text-[#A7F3D0]">
                {aiFarmHealth.cropHealth}% Healthy
              </div>
              <div className="text-[10px] text-[#6EE7B7] mt-0.5">{crops.length} crops active</div>
            </button>

            {/* 4. Soil Moisture */}
            <button
              onClick={() => onNavigate('pump')}
              className="p-3 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/15 text-left transition-colors group cursor-pointer min-w-0"
            >
              <div className="text-[11px] text-[#A7F3D0] flex items-center gap-1.5 font-medium">
                <Droplets className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span className="uppercase tracking-wider">Soil Moisture</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 group-hover:text-[#A7F3D0]">
                {weather.soilMoisture}% (Optimal)
              </div>
              <div className="text-[10px] text-[#6EE7B7] mt-0.5">Pump: {smartPump.status}</div>
            </button>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 2. QUICK ACTIONS (Large, clean, simple buttons) */}
      {/* ================================================== */}
      <div className="w-full min-w-0 space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#172B24] font-heading">
            Quick actions
          </h2>
          <span className="text-xs text-[#718078] font-medium">One-tap farm shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {activeQuickActions.map((act: any) => {
            const visual = quickActionVisuals[act.route || act.id];
            const VisualIcon = visual?.icon;
            return (
              <button
                key={act.id}
                onClick={() => onNavigate(act.route || act.id)}
                className="premium-card premium-card-hover p-3 sm:p-4 flex flex-col items-center justify-center text-center cursor-pointer group h-full min-w-0"
              >
                {VisualIcon ? (
                  <span className={`w-11 h-11 rounded-2xl ring-1 flex items-center justify-center mb-2 ${visual.tint}`}>
                    <VisualIcon className="w-5 h-5" />
                  </span>
                ) : (
                  <span className="text-2xl mb-1">{act.icon}</span>
                )}
                <span className="text-xs font-bold text-[#172B24]">{act.label || act.title}</span>
                <span className="text-[10px] font-medium text-[#8A9A90] group-hover:text-[#064E3B] mt-0.5">Open →</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. MY CROPS (3-4 Large Cards with Realistic Photos) */}
      {/* ================================================== */}
      <div className="w-full min-w-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#172B24] font-heading">
              My crops
            </h2>
            <span className="px-2.5 py-0.5 bg-[#ECFDF5] text-[#064E3B] text-xs font-bold rounded-full border border-[#A7F3D0]">
              {crops.length} fields monitored
            </span>
          </div>

          <button
            onClick={() => onNavigate('myFarms')}
            className="text-xs font-bold text-[#064E3B] hover:text-[#064E3B] flex items-center gap-1"
          >
            <span>View All Crops</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {crops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => onNavigate('myFarms')}
              className="premium-card premium-card-hover overflow-hidden cursor-pointer flex flex-col justify-between group w-full min-w-0"
            >
              {/* Realistic Crop Image — gradient behind it so a failed
                  image never shows a broken-image icon in the card. */}
              <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-[#D1FAE5] via-[#ECFDF5] to-amber-50 overflow-hidden">
                <img
                  onError={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                  src={
                    crop.imageUrl ||
                    (crop.name.toLowerCase().includes('tomato')
                      ? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
                      : crop.name.toLowerCase().includes('sugarcane')
                      ? 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80'
                      : crop.name.toLowerCase().includes('cotton')
                      ? 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80')
                  }
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-[#172B24] shadow-sm ring-1 ring-[#E5EDE7]/80">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      crop.status === 'Healthy' ? 'bg-[#10B981]' : 'bg-amber-500'
                    }`}
                  />
                  {crop.status}
                </span>
                <span className="absolute bottom-2 left-2 bg-[#172B24]/70 text-white backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {crop.area} Acres
                </span>
              </div>

              {/* Crop Content */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-[#172B24] text-base font-heading">
                    {crop.name}
                  </h3>
                  <div className="text-xs text-[#718078] capitalize mt-0.5">
                    Stage: <strong className="text-[#3E5248]">{crop.currentStage} stage</strong>
                  </div>
                </div>

                {/* Next Task Highlight Box */}
                <div className="mt-2 p-2.5 rounded-xl bg-[#ECFDF5]/70 border border-[#D1FAE5] text-xs space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-[#064E3B]">
                    Next Task
                  </div>
                  <div className="font-semibold text-[#064E3B] leading-snug">
                    {crop.nextTask || 'Scheduled: Weekly farm inspection'}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EFF4EF] flex items-center justify-between text-[11px] text-[#718078]">
                  <span>Harvest Date:</span>
                  <span className="font-bold text-[#243A32]">{crop.expectedHarvestDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Farm Analytics — real recorded data only: land and crop counts
          from your crops, health and moisture from live context, income and
          profit from your recorded finance summary. No forecast or trend
          percentages are invented here. */}
      <div className="w-full min-w-0 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#172B24] font-heading">Farm analytics</h2>
          <span className="text-xs text-[#718078]">From your recorded farm data</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { icon: Wheat, label: 'Total land', value: `${crops.reduce((sum, c) => sum + (c.area || 0), 0).toFixed(1)} acres`, sub: `${crops.length} fields`, onClick: () => onNavigate('myFarms') },
            { icon: Sprout, label: 'Active crops', value: `${crops.length}`, sub: 'Currently monitored', onClick: () => onNavigate('myFarms') },
            { icon: ShieldCheck, label: 'Farm health', value: `${aiFarmHealth.overall}/100`, sub: `${aiFarmHealth.cropHealth}% crop health`, onClick: () => setShowHealthModal(true) },
            { icon: Droplets, label: 'Soil moisture', value: `${weather.soilMoisture}%`, sub: `Pump: ${smartPump.status}`, onClick: () => onNavigate('iot') },
            { icon: Coins, label: 'Total income', value: `₹${financialSummary.totalIncome.toLocaleString('en-IN')}`, sub: 'Recorded income', onClick: () => onNavigate('finance') },
            { icon: TrendingUp, label: 'Net profit', value: `₹${financialSummary.netProfit.toLocaleString('en-IN')}`, sub: `${financialSummary.profitMargin}% margin`, onClick: () => onNavigate('finance') },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <button key={stat.label} onClick={stat.onClick} className="ds-card ds-card-hover p-3 sm:p-4 text-left min-w-0">
                <span className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#718078]">{stat.label}</span>
                <span className="block text-base font-bold text-[#172B24] font-heading mt-0.5 truncate">{stat.value}</span>
                <span className="block text-[11px] text-[#718078] mt-0.5 truncate">{stat.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================== */}
      {/* 4. FARM ADVICE & RECOMMENDATIONS (Natural Language) */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Farm Advice & Today's Recommendations) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Farm Advice Card */}
          <div className="p-5 sm:p-6 premium-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D1FAE5] text-[#064E3B] flex items-center justify-center font-bold">
                  🌱
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#172B24] uppercase tracking-wider font-heading">
                    Farm Advice
                  </h2>
                  <span className="text-[11px] text-[#718078]">
                    Daily summary for {locationState.address.district || 'Raichur'} • Updated just now
                  </span>
                </div>
              </div>

              <button
                onClick={handleToggleSpeakBriefing}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  isSpeakingBriefing
                    ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                    : 'bg-[#F7FAF7] hover:bg-[#ECFDF5] text-[#3E5248] border-[#E5EDE7]'
                }`}
                title="Read advice aloud"
              >
                {isSpeakingBriefing ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeakingBriefing ? 'Stop' : 'Listen Advice'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#3E5248] font-medium leading-relaxed bg-[#F7FAF7] p-3.5 rounded-2xl border border-[#E5EDE7]/80">
              "{aiBriefing.summary}"
            </p>

            {/* 3 Actionable Natural Recommendations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-900 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Today's Recommendation
                </div>
                <div className="text-xs font-bold">Irrigation Advice</div>
                <p className="text-[11px] text-blue-800 leading-snug">
                  {weather.soilMoisture > 50
                    ? `Soil moisture is optimal (${weather.soilMoisture}%). Hold drip irrigation until evening.`
                    : 'Soil moisture is low. Recommended 45 minutes drip cycle tomorrow morning.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Possible Risk
                </div>
                <div className="text-xs font-bold">Crop Disease Alert</div>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Humidity is {weather.humidity}%. Check tomato lower leaves for early blight and apply bio-spray.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#064E3B] space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#064E3B]">
                  AI Suggestion
                </div>
                <div className="text-xs font-bold">Optimal Spray Window</div>
                <p className="text-[11px] text-[#064E3B] leading-snug">
                  Wind speed is calm ({weather.windSpeed} km/h). Safe for foliar application between 4:00 PM – 6:30 PM.
                </p>
              </div>
            </div>
          </div>

          {/* Today's Farm Tasks Checklist */}
          <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-[#172B24] uppercase tracking-wider font-heading">
                  Today's Farm Tasks
                </h2>
                <p className="text-xs text-[#718078]">
                  {pendingTasks.length} pending tasks for today
                </p>
              </div>
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#064E3B] text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#A7F3D0]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="w-full min-w-0 space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-[#F7FAF7] border-[#E5EDE7] opacity-60'
                      : 'bg-white border-[#E5EDE7] hover:border-[#6EE7B7] hover:bg-[#ECFDF5]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-[#064E3B] border-[#064E3B] text-white'
                          : 'border-[#CBD8D0] bg-white'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <div
                        className={`text-xs sm:text-sm font-bold ${
                          task.completed ? 'line-through text-[#8A9A90]' : 'text-[#243A32]'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[11px] text-[#8A9A90] flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-[#064E3B]">{task.category}</span>
                        <span>•</span>
                        <span>Due {task.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      task.priority === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : task.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-[#EFF4EF] text-[#5A6E64]'
                    }`}
                  >
                    +{task.xpReward} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (KrishiBhavishya Spotlight & Nearby Mandis) */}
        <div className="lg:col-span-4 space-y-6">
          {/* KrishiBhavishya Spotlight (Simplified Selling Timeline) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-amber-200/60 text-amber-900 border border-amber-300/60 text-[10px] font-black rounded-full uppercase">
                KrishiBhavishya
              </span>
              <span className="text-[11px] font-bold text-amber-800">APMC Mandis</span>
            </div>

            <div>
              <h3 className="text-base font-extrabold font-heading text-[#172B24]">
                When should I sell my crop?
              </h3>
              <p className="text-xs text-[#5A6E64] mt-1 leading-relaxed">
                Tomato & Paddy prices are projected to rise over the next 15–30 days.
              </p>
            </div>

            {/* 3 Price points */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-white border border-amber-200">
                <div className="text-[10px] text-[#8A9A90] font-bold uppercase">Today</div>
                <div className="text-sm font-black text-[#172B24] mt-0.5">₹24/kg</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-amber-200">
                <div className="text-[10px] text-[#8A9A90] font-bold uppercase">15 Days</div>
                <div className="text-sm font-black text-amber-800 mt-0.5">₹29/kg</div>
              </div>
              <div className="p-2 rounded-xl bg-amber-100 border border-amber-300">
                <div className="text-[10px] text-amber-800 font-black uppercase">30 Days</div>
                <div className="text-sm font-black text-[#064E3B] mt-0.5">₹34/kg ⭐</div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('krishiBhavishya')}
              className="w-full py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#064E3B] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Selling Advice</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Nearby Mandi Rates */}
          <div className="p-5 premium-card space-y-3">
            <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-2.5">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#064E3B]" />
                <h3 className="font-extrabold text-sm text-[#172B24] font-heading">
                  Nearby Market Rates
                </h3>
              </div>
              <button
                onClick={() => onNavigate('market')}
                className="text-xs font-bold text-[#064E3B] hover:text-[#064E3B]"
              >
                All Mandis
              </button>
            </div>

            <div className="w-full min-w-0 space-y-2.5">
              {nearbyMandis.slice(0, 3).map((mandi) => (
                <div
                  key={mandi.id}
                  onClick={() => onNavigate('market')}
                  className="p-3 rounded-2xl bg-[#F7FAF7] hover:bg-[#ECFDF5]/50 border border-[#E5EDE7]/80 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-[#172B24]">
                      📍 {mandi.marketName}
                    </div>
                    <div className="text-[11px] text-[#718078]">
                      {mandi.commodity} • {mandi.distanceKm} km away
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-[#172B24]">
                      ₹{mandi.currentPrice}/qtl
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        mandi.priceChange >= 0 ? 'text-[#064E3B]' : 'text-rose-700'
                      }`}
                    >
                      {mandi.priceChange >= 0 ? `+${mandi.priceChange}%` : `${mandi.priceChange}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ask Krishi AI Assistant Input */}
          <div className="p-5 rounded-2xl bg-[#172B24] text-white shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#34D399]" />
              <h3 className="font-extrabold text-sm text-white font-heading">
                Ask Krishi AI
              </h3>
            </div>
            <p className="text-xs text-[#CBD8D0]">
              Ask any question about your crops, water scheduling, pests, or market prices.
            </p>

            <form onSubmit={handleCommandSubmit} className="relative">
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Type your question in simple words..."
                className="w-full pl-3 pr-20 py-2.5 bg-[#243A32] border border-[#3E5248] rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-[#10B981] placeholder:text-[#8A9A90]"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#10B981] text-white font-bold text-xs transition-colors"
              >
                Ask
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* AI Farm Health Explanation Modal */}
      <AIFarmHealthModal
        isOpen={showHealthModal}
        onClose={() => setShowHealthModal(false)}
        onNavigate={onNavigate}
      />

      {/* ADD TASK MODAL */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#E5EDE7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
              <h3 className="font-bold text-base text-[#172B24] font-heading">
                Schedule New Farm Task
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-[#8A9A90] hover:text-[#3E5248] font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="w-full min-w-0 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#3E5248] mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Check drip lines for calcium clogging"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm focus:ring-2 focus:ring-[#059669] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#3E5248] mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e: any) => setNewTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD8D0] text-xs bg-white"
                  >
                    <option value="Irrigation">Irrigation</option>
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Pesticide">Pesticide</option>
                    <option value="Harvest">Harvest</option>
                    <option value="Soil">Soil</option>
                    <option value="Drone">Drone</option>
                    <option value="Market">Market</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3E5248] mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e: any) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD8D0] text-xs bg-white"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E5248] mb-1">Due Date / Time</label>
                <input
                  type="text"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD8D0] text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#064E3B] hover:bg-[#064E3B] text-white font-bold text-sm shadow-md transition-all mt-2 cursor-pointer"
              >
                Schedule Task (+40 XP)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
