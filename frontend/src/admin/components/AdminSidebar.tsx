import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Sliders,
  MapPin,
  Wheat,
  BrainCircuit,
  CloudSun,
  TrendingUp,
  Coins,
  ShieldCheck,
  Sparkles,
  Plane,
  Radio,
  Droplets,
  Store,
  Users,
  Bell,
  Image as ImageIcon,
  Settings,
  UserCheck,
  History,
  ChevronLeft,
  ChevronRight,
  Sprout,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useAdminAuth } from '../auth/AdminAuthContext';

export type AdminTab =
  | 'dashboard'
  | 'pages'
  | 'dashboard-editor'
  | 'my-farm'
  | 'crops'
  | 'ai-advisor'
  | 'weather'
  | 'market'
  | 'finance'
  | 'schemes'
  | 'krishibhavishya'
  | 'drone'
  | 'iot'
  | 'smart-pump'
  | 'store'
  | 'users'
  | 'notifications'
  | 'media'
  | 'settings'
  | 'admin-users'
  | 'activity';

interface AdminSidebarProps {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
  onNavigateFarmer: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  setCurrentTab,
  isCollapsed,
  setIsCollapsed,
  isMobile = false,
  onCloseMobile,
  onNavigateFarmer
}) => {
  const { admin, logout, hasRole } = useAdminAuth();

  const navGroups = [
    {
      group: 'Core Overview',
      items: [
        { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'pages' as AdminTab, label: 'Pages Manager', icon: FileText, badge: 'CMS' },
        { id: 'dashboard-editor' as AdminTab, label: 'Dashboard Editor', icon: Sliders, badge: 'Live' }
      ]
    },
    {
      group: 'Farm Modules',
      items: [
        { id: 'my-farm' as AdminTab, label: 'My Farm', icon: MapPin },
        { id: 'crops' as AdminTab, label: 'Crops', icon: Wheat },
        { id: 'ai-advisor' as AdminTab, label: 'AI Advisor', icon: BrainCircuit },
        { id: 'weather' as AdminTab, label: 'Weather', icon: CloudSun },
        { id: 'market' as AdminTab, label: 'Market', icon: TrendingUp },
        { id: 'finance' as AdminTab, label: 'Finance', icon: Coins },
        { id: 'schemes' as AdminTab, label: 'Government Schemes', icon: ShieldCheck },
        { id: 'krishibhavishya' as AdminTab, label: 'KrishiBhavishya', icon: Sparkles },
        { id: 'drone' as AdminTab, label: 'Drone', icon: Plane },
        { id: 'iot' as AdminTab, label: 'IoT', icon: Radio },
        { id: 'smart-pump' as AdminTab, label: 'Smart Pump', icon: Droplets },
        { id: 'store' as AdminTab, label: 'Krishi Store', icon: Store }
      ]
    },
    {
      group: 'Management & System',
      items: [
        { id: 'users' as AdminTab, label: 'Users', icon: Users },
        { id: 'notifications' as AdminTab, label: 'Notifications', icon: Bell },
        { id: 'media' as AdminTab, label: 'Media Library', icon: ImageIcon },
        { id: 'settings' as AdminTab, label: 'Site Settings', icon: Settings },
        { id: 'admin-users' as AdminTab, label: 'Admin Users', icon: UserCheck, superAdminOnly: true },
        { id: 'activity' as AdminTab, label: 'Activity Logs', icon: History }
      ]
    }
  ];

  const handleSelect = (tab: AdminTab) => {
    setCurrentTab(tab);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`h-full flex flex-col justify-between transition-all duration-300 select-none ${
        isMobile
          ? 'w-full bg-[#082015] text-white'
          : isCollapsed
          ? 'w-20 bg-[#082015] text-white border-r border-emerald-900/50 shadow-xl'
          : 'w-72 bg-[#082015] text-white border-r border-emerald-900/50 shadow-xl'
      }`}
    >
      {/* Top Brand Banner */}
      <div>
        <div className="p-4 border-b border-emerald-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shrink-0 shadow-md shadow-emerald-900/50">
              <Sprout className="w-5 h-5 text-stone-950 font-bold" />
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="truncate">
                <div className="text-sm font-extrabold font-heading text-white tracking-tight">
                  KrishiSmart AI
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                  CMS Admin Portal
                </div>
              </div>
            )}
          </div>

          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800 text-emerald-300 hover:text-white transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Items Scroll Area */}
        <div className="overflow-y-auto max-h-[calc(100vh-190px)] py-3 px-2 space-y-4">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              {(!isCollapsed || isMobile) && (
                <div className="px-3 py-1 text-[10px] font-bold text-emerald-400/60 uppercase tracking-wider font-heading">
                  {grp.group}
                </div>
              )}

              {grp.items.map((item) => {
                if (item.superAdminOnly && !hasRole('Super Admin')) {
                  return null;
                }
                const isActive = currentTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-stone-950 shadow-md shadow-emerald-700/30 font-bold'
                        : 'text-emerald-100/80 hover:bg-emerald-900/50 hover:text-white'
                    } ${isCollapsed && !isMobile ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-emerald-400'}`} />
                    {(!isCollapsed || isMobile) && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {(!isCollapsed || isMobile) && item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-stone-950 text-emerald-300'
                            : 'bg-emerald-800/60 text-emerald-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile & Switch Area */}
      <div className="p-3 border-t border-emerald-900/60 bg-[#06180f] space-y-2">
        {/* Quick Link to Farmer Frontend */}
        <button
          onClick={onNavigateFarmer}
          className={`w-full flex items-center gap-2 p-2.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-200 text-xs font-bold transition-colors cursor-pointer ${
            isCollapsed && !isMobile ? 'justify-center p-2' : ''
          }`}
          title="Open Farmer Application"
        >
          <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0" />
          {(!isCollapsed || isMobile) && <span>View Farmer App</span>}
        </button>

        {/* Logged in Admin Badge */}
        {(!isCollapsed || isMobile) && admin && (
          <div className="px-3 py-2 rounded-2xl bg-emerald-900/30 border border-emerald-800/40 flex items-center justify-between">
            <div className="truncate mr-2">
              <div className="text-xs font-bold text-white truncate">{admin.name}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">{admin.role}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-xl hover:bg-rose-950/80 text-rose-300 hover:text-rose-100 transition-colors cursor-pointer"
              title="Sign Out Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isCollapsed && !isMobile && (
          <button
            onClick={logout}
            className="w-full flex justify-center p-2 rounded-xl text-rose-300 hover:bg-rose-950/60 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
