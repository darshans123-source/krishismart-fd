import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  Wheat,
  BrainCircuit,
  Coins,
  TrendingUp,
  Landmark,
  Store,
  CloudSun,
  Plane,
  Activity,
  Droplets,
  ShoppingBag,
  Crown,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFarmData } from '../../context/FarmDataContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isMobile = false,
  onCloseMobile
}) => {
  const { t } = useLanguage();
  const { user, crops, tasks, isProUnlocked } = useFarmData();

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const navItems = [
    {
      group: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'myFarms', label: 'My Farm', icon: Sprout },
        { id: 'crops', label: 'Crops', icon: Wheat },
        { id: 'aiHub', label: 'AI Advisor', icon: BrainCircuit },
        { id: 'weather', label: 'Weather', icon: CloudSun },
      ]
    },
    {
      group: 'SMART FARM',
      items: [
        { id: 'market', label: 'Market', icon: Store },
        { id: 'finance', label: 'Finance', icon: Coins },
        { id: 'govtSchemes', label: 'Government Schemes', icon: Landmark },
        { id: 'krishiBhavishya', label: 'KrishiBhavishya', icon: TrendingUp },
      ]
    },
    {
      group: 'TECHNOLOGY',
      items: [
        { id: 'drone', label: 'Drone', icon: Plane },
        { id: 'iot', label: 'IoT', icon: Activity },
        { id: 'pump', label: 'Smart Pump', icon: Droplets },
      ]
    },
    {
      group: 'STORE',
      items: [
        { id: 'store', label: 'Krishi Store', icon: ShoppingBag },
        { id: 'premium', label: 'Premium', icon: Crown },
      ]
    }
  ];

  const handleSelect = (tabId: string) => {
    setCurrentTab(tabId);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-transparent py-5 select-none overflow-y-auto ${
        isMobile ? 'w-full px-4' : 'w-64 px-4 shrink-0'
      }`}
    >
      {/* Top Header if in Mobile Drawer */}
      {isMobile && (
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-stone-200">
          <img
            src="/logo-icon.svg"
            alt="KrishiSmart AI logo"
            className="w-10 h-10 rounded-2xl shadow-sm"
          />
          <div>
            <div className="font-extrabold text-base text-stone-900 font-heading tracking-tight">
              KRISHISMART <span className="text-emerald-700">AI</span>
            </div>
            <p className="text-[11px] text-stone-500">Smart Agriculture for Farmers</p>
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="space-y-6">
        {navItems.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[11px] font-black tracking-wider uppercase text-stone-400">
              {sec.group}
            </div>
            <div className="space-y-1 mt-1.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id || (item.id === 'crops' && currentTab === 'crops');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 font-bold'
                        : 'text-stone-700 hover:bg-white hover:text-emerald-900 hover:shadow-soft'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-white/15 text-white'
                            : 'bg-stone-100 text-stone-500 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.id === 'crops' && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {crops.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Farm Snapshot Card */}
      <div className="mt-6 pt-4 border-t border-stone-200">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-900 text-white shadow-soft relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold text-stone-200">
                {user?.streakDays || 1} Day Streak
              </span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-200">
              {user?.xp || 0} XP
            </span>
          </div>

          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((user?.xp || 0) % 1000) / 10)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-stone-400">
            <span>{pendingTasksCount} Tasks Pending</span>
            <button
              onClick={() => handleSelect('journey')}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5"
            >
              <span>Rewards</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
