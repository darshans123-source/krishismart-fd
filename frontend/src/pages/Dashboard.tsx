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
  ShieldCheck
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
    { id: 'aiHub', label: 'Crop Scan', icon: '🌱', route: 'aiHub', bg: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200' },
    { id: 'weather', label: 'Weather', icon: '🌦️', route: 'weather', bg: 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200' },
    { id: 'market', label: 'Market', icon: '📈', route: 'market', bg: 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200' },
    { id: 'finance', label: 'Finance', icon: '💰', route: 'finance', bg: 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200' },
    { id: 'drone', label: 'Drone', icon: '🚁', route: 'drone', bg: 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200' },
    { id: 'pump', label: 'Pump', icon: '💧', route: 'pump', bg: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border-cyan-200' },
    { id: 'iot', label: 'IoT', icon: '📡', route: 'iot', bg: 'bg-stone-100 hover:bg-stone-200 text-stone-900 border-stone-300' }
  ];

  const heroConfig = cmsDashboard?.hero;
  const showHero = heroConfig ? heroConfig.visible !== false : true;

  const heroHeading = heroConfig?.mainHeading
    ? heroConfig.mainHeading.replace(/\{name\}/gi, user?.name ? user.name.toUpperCase() : 'FARMER')
    : heroConfig?.greeting
    ? `${heroConfig.greeting.toUpperCase()}, ${user?.name ? user.name.toUpperCase() : 'FARMER'} 🌱`
    : `GOOD AFTERNOON, ${user?.name ? user.name.toUpperCase() : 'FARMER'} 🌱`;

  const heroSubtitle = heroConfig?.subtitle || `Real-time farm status for ${locationState.address.district || 'Raichur'}, ${locationState.address.state || 'Karnataka'}.`;
  const heroBtnText = heroConfig?.buttonText || `Farm Health: ${aiFarmHealth.overall}/100`;

  const activeQuickActions = (cmsDashboard?.quickActions && Array.isArray(cmsDashboard.quickActions) && cmsDashboard.quickActions.length > 0)
    ? cmsDashboard.quickActions.filter((qa: any) => qa.visible !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    : defaultQuickActions;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-200">
      {/* ================================================== */}
      {/* 1. TOP 5-SECOND OVERVIEW & GREETING BANNER */}
      {/* ================================================== */}
      {showHero && (
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-6 sm:p-8 shadow-sm border border-emerald-700/80 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
                <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                <span>Smart Farming Platform</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                {heroHeading}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
                {heroSubtitle}
              </p>
            </div>

            <button
              onClick={() => setShowHealthModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold flex items-center gap-2 self-start md:self-auto transition-all shadow-xs cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-emerald-200" />
              <span>{heroBtnText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Clean Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-emerald-700/70">
            {/* 1. Location */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-600/30 text-left transition-colors group cursor-pointer"
            >
              <div className="text-[11px] text-emerald-200 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Current Location</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 truncate group-hover:text-emerald-200">
                📍 {locationState.address.district || 'Raichur'}, {locationState.address.state || 'Karnataka'}
              </div>
              <div className="text-[10px] text-emerald-300 mt-0.5">Click to change</div>
            </button>

            {/* 2. Weather */}
            <button
              onClick={() => onNavigate('weather')}
              className="p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-600/30 text-left transition-colors group cursor-pointer"
            >
              <div className="text-[11px] text-emerald-200 flex items-center gap-1.5 font-medium">
                <Sun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Weather</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 group-hover:text-emerald-200">
                🌡️ {weather.temp}°C • {weather.condition}
              </div>
              <div className="text-[10px] text-emerald-300 mt-0.5">Wind: {weather.windSpeed} km/h</div>
            </button>

            {/* 3. Crop Health */}
            <button
              onClick={() => onNavigate('myFarms')}
              className="p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-600/30 text-left transition-colors group cursor-pointer"
            >
              <div className="text-[11px] text-emerald-200 flex items-center gap-1.5 font-medium">
                <Wheat className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Crop Health</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 group-hover:text-emerald-200">
                🌾 {aiFarmHealth.cropHealth}% Healthy
              </div>
              <div className="text-[10px] text-emerald-300 mt-0.5">{crops.length} crops active</div>
            </button>

            {/* 4. Soil Moisture */}
            <button
              onClick={() => onNavigate('pump')}
              className="p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-600/30 text-left transition-colors group cursor-pointer"
            >
              <div className="text-[11px] text-emerald-200 flex items-center gap-1.5 font-medium">
                <Droplets className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span>Soil Moisture</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 group-hover:text-emerald-200">
                💧 {weather.soilMoisture}% (Optimal)
              </div>
              <div className="text-[10px] text-emerald-300 mt-0.5">Pump: {smartPump.status}</div>
            </button>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 2. QUICK ACTIONS (Large, clean, simple buttons) */}
      {/* ================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-stone-500 font-heading">
            Quick Actions
          </h2>
          <span className="text-[11px] text-stone-500 font-medium">One-tap farm shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {activeQuickActions.map((act: any) => (
            <button
              key={act.id}
              onClick={() => onNavigate(act.route || act.id)}
              className={`p-3.5 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-sm active:scale-98 cursor-pointer ${
                act.bg || 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
              }`}
            >
              <span className="text-2xl mb-1">{act.icon}</span>
              <span className="text-xs font-bold">{act.label || act.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. MY CROPS (3-4 Large Cards with Realistic Photos) */}
      {/* ================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-stone-900 font-heading">
              MY CROPS
            </h2>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              {crops.length} Fields Monitored
            </span>
          </div>

          <button
            onClick={() => onNavigate('myFarms')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
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
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              {/* Realistic Crop Image */}
              <div className="relative w-full h-36 bg-stone-100 overflow-hidden">
                <img
                  src={
                    crop.imageUrl ||
                    (crop.name.toLowerCase().includes('tomato')
                      ? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
                      : crop.name.toLowerCase().includes('sugarcane')
                      ? 'https://images.unsplash.com/photo-1598112972019-91e30f406976?w=600&auto=format&fit=crop&q=80'
                      : crop.name.toLowerCase().includes('cotton')
                      ? 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80')
                  }
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs ${
                    crop.status === 'Healthy'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {crop.status}
                </span>
                <span className="absolute bottom-2 left-2 bg-stone-900/70 text-white backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {crop.area} Acres
                </span>
              </div>

              {/* Crop Content */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base font-heading">
                    {crop.name === 'Paddy' ? '🌾 Paddy' : crop.name === 'Tomato' ? '🍅 Tomato' : crop.name === 'Sugarcane' ? '🎋 Sugarcane' : `🌱 ${crop.name}`}
                  </h3>
                  <div className="text-xs text-stone-500 capitalize mt-0.5">
                    Stage: <strong className="text-stone-700">{crop.currentStage} stage</strong>
                  </div>
                </div>

                {/* Next Task Highlight Box */}
                <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-emerald-800">
                    Next Task
                  </div>
                  <div className="font-semibold text-emerald-900 leading-snug">
                    {crop.nextTask || 'Scheduled: Weekly farm inspection'}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Harvest Date:</span>
                  <span className="font-bold text-stone-800">{crop.expectedHarvestDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* 4. FARM ADVICE & RECOMMENDATIONS (Natural Language) */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Farm Advice & Today's Recommendations) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Farm Advice Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  🌱
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider font-heading">
                    Farm Advice
                  </h2>
                  <span className="text-[11px] text-stone-500">
                    Daily summary for {locationState.address.district || 'Raichur'} • Updated just now
                  </span>
                </div>
              </div>

              <button
                onClick={handleToggleSpeakBriefing}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  isSpeakingBriefing
                    ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                    : 'bg-stone-50 hover:bg-emerald-50 text-stone-700 border-stone-200'
                }`}
                title="Read advice aloud"
              >
                {isSpeakingBriefing ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeakingBriefing ? 'Stop' : 'Listen Advice'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
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

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  AI Suggestion
                </div>
                <div className="text-xs font-bold">Optimal Spray Window</div>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Wind speed is calm ({weather.windSpeed} km/h). Safe for foliar application between 4:00 PM – 6:30 PM.
                </p>
              </div>
            </div>
          </div>

          {/* Today's Farm Tasks Checklist */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider font-heading">
                  Today's Farm Tasks
                </h2>
                <p className="text-xs text-stone-500">
                  {pendingTasks.length} pending tasks for today
                </p>
              </div>
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-stone-50 border-stone-200 opacity-60'
                      : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <div
                        className={`text-xs sm:text-sm font-bold ${
                          task.completed ? 'line-through text-stone-400' : 'text-stone-800'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-emerald-700">{task.category}</span>
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
                        : 'bg-stone-100 text-stone-600'
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
          <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/80 border border-amber-200/90 text-amber-950 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-amber-200/60 text-amber-900 border border-amber-300/60 text-[10px] font-black rounded-full uppercase">
                KrishiBhavishya
              </span>
              <span className="text-[11px] font-bold text-amber-800">APMC Mandis</span>
            </div>

            <div>
              <h3 className="text-base font-extrabold font-heading text-stone-900">
                When should I sell my crop?
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Tomato & Paddy prices are projected to rise over the next 15–30 days.
              </p>
            </div>

            {/* 3 Price points */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-white border border-amber-200">
                <div className="text-[10px] text-stone-400 font-bold uppercase">Today</div>
                <div className="text-sm font-black text-stone-900 mt-0.5">₹24/kg</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-amber-200">
                <div className="text-[10px] text-stone-400 font-bold uppercase">15 Days</div>
                <div className="text-sm font-black text-amber-800 mt-0.5">₹29/kg</div>
              </div>
              <div className="p-2 rounded-xl bg-amber-100 border border-amber-300">
                <div className="text-[10px] text-amber-800 font-black uppercase">30 Days</div>
                <div className="text-sm font-black text-emerald-700 mt-0.5">₹34/kg ⭐</div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('krishiBhavishya')}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Selling Advice</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Nearby Mandi Rates */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-700" />
                <h3 className="font-extrabold text-sm text-stone-900 font-heading">
                  Nearby Market Rates
                </h3>
              </div>
              <button
                onClick={() => onNavigate('market')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                All Mandis
              </button>
            </div>

            <div className="space-y-2.5">
              {nearbyMandis.slice(0, 3).map((mandi) => (
                <div
                  key={mandi.id}
                  onClick={() => onNavigate('market')}
                  className="p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50/50 border border-stone-200/80 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-stone-900">
                      📍 {mandi.marketName}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {mandi.commodity} • {mandi.distanceKm} km away
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-stone-900">
                      ₹{mandi.currentPrice}/qtl
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        mandi.priceChange >= 0 ? 'text-emerald-700' : 'text-rose-700'
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
          <div className="p-5 rounded-3xl bg-stone-900 text-white shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white font-heading">
                Ask Krishi AI
              </h3>
            </div>
            <p className="text-xs text-stone-300">
              Ask any question about your crops, water scheduling, pests, or market prices.
            </p>

            <form onSubmit={handleCommandSubmit} className="relative">
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Type your question in simple words..."
                className="w-full pl-3 pr-20 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 placeholder:text-stone-400"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900 font-heading">
                Schedule New Farm Task
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Check drip lines for calcium clogging"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e: any) => setNewTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
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
                  <label className="block text-xs font-bold text-stone-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e: any) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Due Date / Time</label>
                <input
                  type="text"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all mt-2 cursor-pointer"
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
