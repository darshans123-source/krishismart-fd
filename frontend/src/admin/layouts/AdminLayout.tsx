import React, { useState } from 'react';
import { AdminSidebar, AdminTab } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';

// Pages
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminPagesManager } from '../pages/AdminPagesManager';
import { AdminDashboardEditor } from '../pages/AdminDashboardEditor';
import { AdminCropsManager } from '../pages/AdminCropsManager';
import { AdminMarketManager } from '../pages/AdminMarketManager';
import { AdminSchemesManager } from '../pages/AdminSchemesManager';
import { AdminWeatherManager } from '../pages/AdminWeatherManager';
import { AdminAIAdvisorManager } from '../pages/AdminAIAdvisorManager';
import { AdminDroneManager } from '../pages/AdminDroneManager';
import { AdminIoTManager } from '../pages/AdminIoTManager';
import { AdminSmartPumpManager } from '../pages/AdminSmartPumpManager';
import { AdminStoreManager } from '../pages/AdminStoreManager';
import { AdminMediaLibrary } from '../pages/AdminMediaLibrary';
import { AdminUsersManager } from '../pages/AdminUsersManager';
import { AdminNotificationsManager } from '../pages/AdminNotificationsManager';
import { AdminSettingsPage } from '../pages/AdminSettingsPage';
import { AdminUsersRolesPage } from '../pages/AdminUsersRolesPage';
import { AdminActivityLogsPage } from '../pages/AdminActivityLogsPage';

interface AdminLayoutProps {
  initialTab?: AdminTab;
  onNavigateFarmer: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ initialTab = 'dashboard', onNavigateFarmer }) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>(initialTab);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <AdminDashboardPage onNavigateTab={(tab) => setCurrentTab(tab)} onNavigateFarmer={onNavigateFarmer} />;
      case 'pages':
        return <AdminPagesManager onNavigateTab={(tab) => setCurrentTab(tab)} />;
      case 'dashboard-editor':
        return <AdminDashboardEditor onNavigateFarmer={onNavigateFarmer} />;
      case 'my-farm':
      case 'crops':
        return <AdminCropsManager />;
      case 'ai-advisor':
        return <AdminAIAdvisorManager />;
      case 'weather':
        return <AdminWeatherManager />;
      case 'market':
        return <AdminMarketManager />;
      case 'finance':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
              <h2 className="text-lg font-extrabold text-stone-900 font-heading">KrishiNidhi Finance Settings</h2>
              <p className="text-xs text-stone-500 mt-1">Configure interest subvention rates, crop loan limits, and credit scores.</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
                  <div className="text-xs font-semibold text-teal-800">KCC Short-term Loan Cap</div>
                  <div className="text-2xl font-black text-teal-950 mt-1">₹3,00,000</div>
                  <div className="text-[11px] text-teal-700 mt-0.5">Effective 4% interest rate</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="text-xs font-semibold text-emerald-800">Average Kisan Credit Score</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">785 / 900</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">High creditworthiness</div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <div className="text-xs font-semibold text-blue-800">Total Approved Loans</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">₹7,50,000</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">Disbursed via Direct Benefit Transfer</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'schemes':
        return <AdminSchemesManager />;
      case 'krishibhavishya':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
              <h2 className="text-lg font-extrabold text-stone-900 font-heading">KrishiBhavishya Forecast Parameters</h2>
              <p className="text-xs text-stone-500 mt-1">Fine-tune AI price prediction weights, mandi arrival multipliers, and export sentiments.</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="text-sm font-bold text-stone-900">Tomato Price Trajectory (Next 30 Days)</div>
                  <div className="text-xs text-stone-600">Current: ₹24.5/kg → Peak Expected: ₹42.0/kg (+71.4%)</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">AI Confidence: 91% (Strong Bullish)</div>
                </div>
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="text-sm font-bold text-stone-900">Onion Price Trajectory (Next 30 Days)</div>
                  <div className="text-xs text-stone-600">Current: ₹34.0/kg → Peak Expected: ₹48.0/kg (+41.2%)</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">AI Confidence: 88% (Bullish)</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'drone':
        return <AdminDroneManager />;
      case 'iot':
        return <AdminIoTManager />;
      case 'smart-pump':
        return <AdminSmartPumpManager />;
      case 'store':
        return <AdminStoreManager />;
      case 'users':
        return <AdminUsersManager />;
      case 'notifications':
        return <AdminNotificationsManager />;
      case 'media':
        return <AdminMediaLibrary />;
      case 'settings':
        return <AdminSettingsPage />;
      case 'admin-users':
        return <AdminUsersRolesPage />;
      case 'activity':
        return <AdminActivityLogsPage />;
      default:
        return <AdminDashboardPage onNavigateTab={(tab) => setCurrentTab(tab)} onNavigateFarmer={onNavigateFarmer} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9f4] text-stone-900 flex font-sans">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0">
        <AdminSidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onNavigateFarmer={onNavigateFarmer}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-4/5 max-w-xs bg-[#082015] h-full shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto">
            <AdminSidebar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              isCollapsed={false}
              setIsCollapsed={() => {}}
              isMobile={true}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              onNavigateFarmer={onNavigateFarmer}
            />
          </div>
          <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          currentTab={currentTab}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
          onNavigateFarmer={onNavigateFarmer}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};
