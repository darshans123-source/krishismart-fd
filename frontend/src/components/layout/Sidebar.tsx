import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Sprout,
  Wheat,
  HeartPulse,
  ScanSearch,
  CloudSun,
  FlaskConical,
  Droplets,
  Bug,
  Plane,
  Cpu,
  Store,
  TrendingUp,
  Landmark,
  Banknote,
  Umbrella,
  ShoppingBag,
  Crown,
  BrainCircuit,
  BarChart3,
  Bell,
  LifeBuoy,
  Flame,
  ShieldCheck,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  LogOut
} from 'lucide-react';
import { useFarmData } from '../../context/FarmDataContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigateAdmin?: () => void;
  onOpenNotifications?: () => void;
}

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tab?: string;
  action?: 'notifications' | 'admin';
  badge?: number;
};

/*
  LEFT SIDEBAR ONLY — redesign, 2026-11-02.
  Header, dashboard content, cards, background and colours outside this
  panel are untouched. Every existing route is preserved; items that have
  no dedicated page of their own point at the closest existing page, so
  no sidebar entry is a dead link:
    Crop Health / Soil Health / Pest Detection -> aiHub (AI Hub holds the
      Crop Doctor scan, soil tools and pest advice)
    AI Farming Assistant -> aiHub
    Farm Loans / Insurance -> finance (KrishiNidhi finance page)
    Reports & Analytics -> krishiBhavishya
    Help & Support -> profile
    Notifications -> the existing notifications panel, via
      onOpenNotifications (wired in App.tsx, header itself unchanged)
  Active highlighting tracks the last sidebar item chosen, not just the
  tab, so several labels sharing one page do not all light up at once.
  When navigation comes from elsewhere (e.g. a dashboard button), the
  highlight falls back to that page's primary sidebar item.
*/
const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, tab: 'dashboard' },
      { id: 'myFarms', label: 'My Farm', icon: Sprout, tab: 'myFarms' },
      { id: 'crops', label: 'Crop Management', icon: Wheat, tab: 'crops' },
      { id: 'cropHealth', label: 'Crop Health', icon: HeartPulse, tab: 'aiHub' },
    ]
  },
  {
    group: 'SMART FARMING',
    items: [
      { id: 'aiCropDoctor', label: 'AI Crop Doctor', icon: ScanSearch, tab: 'aiHub' },
      { id: 'weather', label: 'Weather', icon: CloudSun, tab: 'weather' },
      { id: 'soilHealth', label: 'Soil Health', icon: FlaskConical, tab: 'aiHub' },
      { id: 'irrigation', label: 'Irrigation', icon: Droplets, tab: 'pump' },
      { id: 'pestDetection', label: 'Pest Detection', icon: Bug, tab: 'aiHub' },
      { id: 'drone', label: 'Drone Monitoring', icon: Plane, tab: 'drone' },
      { id: 'iot', label: 'IoT Devices', icon: Cpu, tab: 'iot' },
    ]
  },
  {
    group: 'MARKET & FINANCE',
    items: [
      { id: 'mandiPrices', label: 'Mandi Prices', icon: Store, tab: 'market' },
      { id: 'marketInsights', label: 'Market Insights', icon: TrendingUp, tab: 'krishiBhavishya' },
      { id: 'govtSchemes', label: 'Government Schemes', icon: Landmark, tab: 'govtSchemes' },
      { id: 'farmLoans', label: 'Farm Loans', icon: Banknote, tab: 'finance' },
      { id: 'insurance', label: 'Insurance', icon: Umbrella, tab: 'finance' },
      { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, tab: 'store' },
      { id: 'premium', label: 'Premium', icon: Crown, tab: 'premium' },
    ]
  },
  {
    group: 'TOOLS',
    items: [
      { id: 'aiAssistant', label: 'AI Farming Assistant', icon: BrainCircuit, tab: 'aiHub' },
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, tab: 'krishiBhavishya' },
      { id: 'notifications', label: 'Notifications', icon: Bell, action: 'notifications' },
      { id: 'help', label: 'Help & Support', icon: LifeBuoy, tab: 'profile' },
      { id: 'rewards', label: 'Rewards & Journey', icon: Flame, tab: 'journey' },
      { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck, action: 'admin' },
    ]
  }
];

const PRIMARY_ITEM_FOR_TAB: Record<string, string> = {
  dashboard: 'dashboard',
  myFarms: 'myFarms',
  crops: 'crops',
  aiHub: 'aiCropDoctor',
  weather: 'weather',
  pump: 'irrigation',
  drone: 'drone',
  iot: 'iot',
  market: 'mandiPrices',
  krishiBhavishya: 'marketInsights',
  govtSchemes: 'govtSchemes',
  finance: 'farmLoans',
  store: 'marketplace',
  premium: 'premium',
  journey: 'rewards',
  profile: 'help'
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isMobile = false,
  onCloseMobile,
  collapsed = false,
  onToggleCollapse,
  onNavigateAdmin,
  onOpenNotifications
}) => {
  const { user, crops, tasks, isProUnlocked, logout } = useFarmData();

  const pendingTasksCount = tasks.filter((task) => !task.completed).length;
  const [selectedId, setSelectedId] = useState<string>(
    () => PRIMARY_ITEM_FOR_TAB[currentTab] || 'dashboard'
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NAV_GROUPS.forEach((g) => { initial[g.group] = true; });
    return initial;
  });

  // Navigation from outside the sidebar (dashboard buttons, header):
  // move the highlight to that page's primary item. A sidebar click
  // already set selectedId to an item on the new tab, so it is kept.
  useEffect(() => {
    setSelectedId((prev) => {
      const prevItem = NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === prev);
      if (prevItem && prevItem.tab === currentTab) return prev;
      return PRIMARY_ITEM_FOR_TAB[currentTab] || prev;
    });
  }, [currentTab]);

  const handleSelect = (item: NavItem) => {
    setSelectedId(item.id);
    if (item.action === 'admin') {
      if (onNavigateAdmin) onNavigateAdmin();
    } else if (item.action === 'notifications') {
      if (onOpenNotifications) onOpenNotifications();
    } else if (item.tab) {
      setCurrentTab(item.tab);
    }
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleLogout = async () => {
    await logout();
    if (isMobile && onCloseMobile) onCloseMobile();
  };

  const displayName = user?.name || 'Farmer';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const isCollapsed = !isMobile && collapsed;

  return (
    <aside
      className={`h-full flex flex-col bg-white shadow-[4px_0_24px_rgba(2,44,34,0.06)] select-none overflow-y-auto ${
        isMobile ? 'w-full px-4 py-5' : isCollapsed ? 'w-[84px] px-2.5 py-5 shrink-0' : 'w-72 px-4 py-5 shrink-0'
      }`}
    >
      {/* Mobile drawer header (logo only; desktop brand lives in the header) */}
      {isMobile && (
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[#E5EDE7]">
          <img
            src="/logo-icon.svg"
            alt="KrishiSmart AI logo"
            className="w-10 h-10 rounded-2xl shadow-sm"
          />
          <div>
            <div className="font-extrabold text-base text-[#172B24] font-heading tracking-tight">
              KRISHISMART <span className="text-[#065F46]">AI</span>
            </div>
            <p className="text-xs text-[#718078]">Smart Agriculture for Farmers</p>
          </div>
        </div>
      )}

      {/* Collapse toggle (desktop only) */}
      {!isMobile && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="mb-5 ml-auto flex items-center justify-center w-9 h-9 rounded-xl text-[#718078] bg-[#F3F6F4] hover:bg-[#ECFDF5] hover:text-[#065F46] transition-all"
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      )}

      {/* Navigation groups — each group expands/collapses */}
      <nav className="flex-1 space-y-5" aria-label="Main navigation">
        {NAV_GROUPS.map((sec) => {
          const isOpen = openGroups[sec.group] !== false;
          return (
            <div key={sec.group} className="space-y-1.5">
              {isCollapsed ? (
                <div className="mx-3 border-t border-[#E5EDE7]" aria-hidden="true" />
              ) : (
                <button
                  type="button"
                  onClick={() => setOpenGroups((prev) => ({ ...prev, [sec.group]: !isOpen }))}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase text-[#718078] hover:text-[#065F46] transition-colors"
                >
                  <span>{sec.group}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}
                  />
                </button>
              )}
              {(isOpen || isCollapsed) && (
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = selectedId === item.id;
                    const badge = item.id === 'crops' ? crops.length : undefined;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        title={item.label}
                        aria-label={item.label}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-2.5'} py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                          isActive
                            ? 'bg-[#065F46] text-white shadow-md shadow-[#065F46]/25'
                            : 'text-[#3E5248] hover:bg-[#ECFDF5] hover:text-[#065F46]'
                        }`}
                      >
                        <span className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? 'bg-white/15 text-white'
                                : 'bg-[#F3F6F4] text-[#718078] group-hover:bg-white group-hover:text-[#059669]'
                            }`}
                          >
                            <Icon className="w-[18px] h-[18px]" />
                          </span>
                          <span className={`truncate ${isCollapsed ? 'hidden' : ''}`}>{item.label}</span>
                        </span>
                        {badge !== undefined && !isCollapsed && (
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              isActive ? 'bg-white/20 text-white' : 'bg-[#ECFDF5] text-[#065F46]'
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom user profile */}
      {isCollapsed ? (
        <div className="mt-6 pt-4 border-t border-[#E5EDE7] flex flex-col items-center gap-2">
          <button
            onClick={() => handleSelect({ id: 'help', label: 'Profile', icon: Settings, tab: 'profile' })}
            title={displayName}
            aria-label={`${displayName}, Farm Manager, open profile`}
            className="w-11 h-11 rounded-full bg-[#ECFDF5] text-[#065F46] font-bold flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-[#059669] transition-all"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </button>
          <button
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="w-9 h-9 rounded-xl text-[#718078] hover:bg-[#ECFDF5] hover:text-[#065F46] flex items-center justify-center transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="mt-6 pt-4 border-t border-[#E5EDE7] space-y-3">
          <button
            type="button"
            onClick={() => handleSelect({ id: 'help', label: 'Profile', icon: Settings, tab: 'profile' })}
            title="Open profile"
            className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-[#F3F6F4] hover:bg-[#ECFDF5] transition-colors text-left"
          >
            <span className="w-11 h-11 rounded-full bg-[#ECFDF5] text-[#065F46] font-bold flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-[#E5EDE7]">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-[#172B24]">{displayName}</span>
              <span className="block text-xs text-[#718078]">Farm Manager</span>
              <span className="block text-[11px] text-[#718078] mt-0.5">
                {user?.streakDays || 1} day streak · {user?.xp || 0} XP · {pendingTasksCount} tasks pending
              </span>
            </span>
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSelect({ id: 'help', label: 'Profile', icon: Settings, tab: 'profile' })}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-[#3E5248] bg-[#F3F6F4] hover:bg-[#ECFDF5] hover:text-[#065F46] transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-[#3E5248] bg-[#F3F6F4] hover:bg-[#ECFDF5] hover:text-[#065F46] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          {isProUnlocked && (
            <p className="text-center text-[11px] font-bold text-[#059669]">Pro unlocked</p>
          )}
        </div>
      )}
    </aside>
  );
};
