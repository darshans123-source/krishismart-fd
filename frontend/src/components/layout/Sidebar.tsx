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
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFarmData } from '../../context/FarmDataContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigateAdmin?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isMobile = false,
  onCloseMobile,
  collapsed = false,
  onToggleCollapse,
  onNavigateAdmin
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
        { id: 'drone', label: 'Drone Intelligence', icon: Plane },
        { id: 'iot', label: 'IoT Monitoring', icon: Activity },
        { id: 'pump', label: 'Smart Pump', icon: Droplets },
      ]
    },
    {
      group: 'STORE',
      items: [
        { id: 'store', label: 'Marketplace', icon: ShoppingBag },
        { id: 'premium', label: 'Premium', icon: Crown },
      ]
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck },
      ]
    }
  ];

  const handleSelect = (tabId: string) => {
    if (tabId === 'admin') {
      if (onNavigateAdmin) onNavigateAdmin();
      if (isMobile && onCloseMobile) onCloseMobile();
      return;
    }
    setCurrentTab(tabId);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-transparent py-5 select-none overflow-y-auto ${
        isMobile ? 'w-full px-4' : collapsed ? 'w-[76px] px-2 shrink-0' : 'w-64 px-4 shrink-0'
      }`}
    >
      {/* Top Header if in Mobile Drawer */}
      {isMobile && (
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#E5EDE7]">
          <img
            src="/logo-icon.svg"
            alt="KrishiSmart AI logo"
            className="w-10 h-10 rounded-2xl shadow-sm"
          />
          <div>
            <div className="font-extrabold text-base text-[#172B24] font-heading tracking-tight">
              KRISHISMART <span className="text-[#064E3B]">AI</span>
            </div>
            <p className="text-[11px] text-[#718078]">Smart Agriculture for Farmers</p>
          </div>
        </div>
      )}

      {/* Collapse toggle (desktop only) */}
      {!isMobile && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="mb-4 ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-[#718078] hover:bg-white hover:text-[#064E3B] hover:shadow-soft transition-all"
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      )}

      {/* Navigation Sections */}
      <div className="space-y-6">
        {navItems.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className={`px-3 text-[11px] font-black tracking-wider uppercase text-[#8A9A90] ${!isMobile && collapsed ? 'hidden' : ''}`}>
              {sec.group}
            </div>
            {!isMobile && collapsed && <div className="mx-3 border-t border-[#E5EDE7]" />}
            <div className="space-y-1 mt-1.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id || (item.id === 'crops' && currentTab === 'crops');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    title={item.label}
                    aria-label={item.label}
                    className={`w-full flex items-center ${!isMobile && collapsed ? 'justify-center px-0' : 'justify-between px-2.5'} py-2 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                      isActive
                        ? 'bg-[#064E3B] text-white shadow-md shadow-[#064E3B]/20 font-bold'
                        : 'text-[#3E5248] hover:bg-white hover:text-[#064E3B] hover:shadow-soft'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-white/15 text-white'
                            : 'bg-[#EFF4EF] text-[#718078] group-hover:bg-[#D1FAE5] group-hover:text-[#064E3B]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className={`truncate ${!isMobile && collapsed ? 'hidden' : ''}`}>{item.label}</span>
                    </div>

                    {item.id === 'crops' && !collapsed && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#ECFDF5] text-[#064E3B]'
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
      {!isMobile && collapsed ? (
        <div className="mt-6 pt-4 border-t border-[#E5EDE7] flex justify-center">
          <button
            onClick={() => handleSelect('journey')}
            title={`${user?.streakDays || 1} day streak`}
            aria-label="Farm streak and rewards"
            className="w-10 h-10 rounded-xl bg-[#022C22] text-amber-400 flex items-center justify-center shadow-soft"
          >
            <Flame className="w-5 h-5" />
          </button>
        </div>
      ) : (
      <div className="mt-6 pt-4 border-t border-[#E5EDE7]">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#022C22] via-[#172B24] to-[#172B24] text-white shadow-soft relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold text-[#E5EDE7]">
                {user?.streakDays || 1} Day Streak
              </span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#064E3B] text-[#A7F3D0]">
              {user?.xp || 0} XP
            </span>
          </div>

          <div className="w-full bg-[#243A32] h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-[#10B981] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((user?.xp || 0) % 1000) / 10)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#8A9A90]">
            <span>{pendingTasksCount} Tasks Pending</span>
            <button
              onClick={() => handleSelect('journey')}
              className="text-[#34D399] hover:text-[#6EE7B7] font-bold flex items-center gap-0.5"
            >
              <span>Rewards</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      )}
    </aside>
  );
};
