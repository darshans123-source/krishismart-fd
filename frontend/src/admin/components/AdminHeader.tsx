import React from 'react';
import { Menu, ExternalLink, ShieldCheck, Bell, Search, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../auth/AdminAuthContext';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  currentTab: AdminTab;
  onToggleMobileMenu: () => void;
  onNavigateFarmer: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onToggleMobileMenu,
  onNavigateFarmer
}) => {
  const { admin } = useAdminAuth();

  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Overview', subtitle: 'Real-time telemetry, platform metrics & quick actions' },
    pages: { title: 'Universal Page Manager', subtitle: 'Manage routes, published statuses, and visual page compositions' },
    'dashboard-editor': { title: 'Dashboard Hero & Layout Editor', subtitle: 'Live visual editor for greeting, hero banner & quick action widgets' },
    'my-farm': { title: 'Farm Parcels Manager', subtitle: 'Manage farmer land boundaries, irrigation sources and soil profiles' },
    crops: { title: 'Crop Portfolios & Agronomy', subtitle: 'Full CRUD for crops, stages, diseases, fertilizers and Kannada/Hindi naming' },
    'ai-advisor': { title: 'AI Knowledge & Agronomy Advisor', subtitle: 'Publish AI diagnostic articles, disease manuals and seasonal advice' },
    weather: { title: 'Weather & Climate Advisory', subtitle: 'Configure localized rain advisories, spraying windows and warning banners' },
    market: { title: 'Market Intelligence & Mandis', subtitle: 'Manage regional APMC mandi rates, minimum/maximum price boundaries and trends' },
    finance: { title: 'KrishiNidhi Finance & Loans', subtitle: 'Monitor farmer ledger summaries, loan schemes and credit metrics' },
    schemes: { title: 'Government Welfare Schemes', subtitle: 'Publish central & state subsidies with eligibility, documents and deadlines' },
    krishibhavishya: { title: 'KrishiBhavishya Price Predictor', subtitle: 'Configure AI predictive timeframe horizons and market sentiments' },
    drone: { title: 'DroneSpray Fleet Management', subtitle: 'Manage autonomous spray missions, pricing per acre, and flight parameters' },
    iot: { title: 'SmartFarm IoT & Telemetry', subtitle: 'Monitor soil moisture probes, weather masts, and node signal health' },
    'smart-pump': { title: 'Smart Pump Controller', subtitle: 'Configure automated irrigation schedules and soil moisture thresholds' },
    store: { title: 'Krishi Agri Store', subtitle: 'Manage bio-fertilizers, seeds, IoT sensors, pricing, stock and discounts' },
    users: { title: 'Farmer Users & Access', subtitle: 'View registered farmers, subscription tiers, and permission profiles' },
    notifications: { title: 'Broadcast Alerts Center', subtitle: 'Dispatch instant push alerts, weather warnings, and crop notices' },
    media: { title: 'Media Asset Library', subtitle: 'Upload, manage, and link agricultural imagery and documentation assets' },
    settings: { title: 'Platform & Brand Settings', subtitle: 'Configure website branding, logos, support helplines, and default languages' },
    'admin-users': { title: 'Admin Team & Roles', subtitle: 'Manage Super Admin, Admin, and Content Editor permission tiers' },
    activity: { title: 'Audit Activity Logs', subtitle: 'Complete chronological history of administrative operations and changes' }
  };

  const currentInfo = tabTitles[currentTab] || { title: 'Admin Portal', subtitle: 'KrishiSmart AI Content Management System' };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 lg:hidden transition-colors cursor-pointer"
          title="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-stone-900 font-heading tracking-tight">
              {currentInfo.title}
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live CMS
            </span>
          </div>
          <p className="text-xs text-stone-500 hidden sm:block truncate max-w-lg">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-2.5">
        {/* Switch to Farmer App */}
        <button
          onClick={onNavigateFarmer}
          className="px-3.5 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs hover:shadow-sm cursor-pointer"
          title="Open Farmer Front-facing Application"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View Farmer App</span>
        </button>

        {/* Current Admin Badge */}
        {admin && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-stone-100 border border-stone-200">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-2xs">
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-stone-900 leading-none">{admin.name.split(' ')[0]}</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{admin.role}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
