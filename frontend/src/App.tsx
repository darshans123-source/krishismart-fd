import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { FarmDataProvider, useFarmData } from './context/FarmDataContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { FloatingAIChat } from './components/ai/FloatingAIChat';

// Farmer Pages
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MyFarmsPage } from './pages/MyFarmsPage';
import { AIHubPage } from './pages/AIHubPage';
import { KrishiNidhiPage } from './pages/KrishiNidhiPage';
import { KrishiBhavishyaPage } from './pages/KrishiBhavishyaPage';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage';
import { MarketIntelligencePage } from './pages/MarketIntelligencePage';
import { WeatherCenterPage } from './pages/WeatherCenterPage';
import { DroneSprayPage } from './pages/DroneSprayPage';
import { SmartFarmIoTPage } from './pages/SmartFarmIoTPage';
import { SmartPumpPage } from './pages/SmartPumpPage';
import { KrishiStorePage } from './pages/KrishiStorePage';
import { PremiumPage } from './pages/PremiumPage';
import { KrishiJourneyPage } from './pages/KrishiJourneyPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';
import { AuthModal } from './pages/AuthModal';
import { AlertCenterModal } from './pages/AlertCenterModal';
import { LocationModal } from './components/layout/LocationModal';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

// Admin CMS System
import { AdminAuthProvider } from './admin/auth/AdminAuthContext';
import { AdminLoginPage } from './admin/auth/AdminLoginPage';
import { AdminProtectedRoute } from './admin/auth/AdminProtectedRoute';
import { AdminLayout } from './admin/layouts/AdminLayout';
import { AdminTab } from './admin/components/AdminSidebar';

interface MainAppContentProps {
  onNavigateAdmin: () => void;
}

const MainAppContent: React.FC<MainAppContentProps> = ({ onNavigateAdmin }) => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register' | 'onboarding'>('login');

  const { isAuthenticated, isLocationModalOpen, setIsLocationModalOpen, setIsAIChatOpen } = useFarmData();

  const handleOpenAuth = (mode: 'login' | 'register' | 'onboarding' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const renderActivePage = () => {
    switch (currentTab) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => handleOpenAuth('onboarding')}
            onExploreApp={() => setCurrentTab('dashboard')}
            onSelectModule={(mod) => setCurrentTab(mod)}
          />
        );
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'myFarms':
      case 'crops':
        return <MyFarmsPage />;
      case 'aiHub':
        return <AIHubPage />;
      case 'finance':
        return <KrishiNidhiPage />;
      case 'krishiBhavishya':
        return <KrishiBhavishyaPage />;
      case 'govtSchemes':
        return <GovernmentSchemesPage />;
      case 'market':
        return <MarketIntelligencePage />;
      case 'weather':
        return <WeatherCenterPage />;
      case 'drone':
        return <DroneSprayPage />;
      case 'iot':
        return <SmartFarmIoTPage />;
      case 'pump':
        return <SmartPumpPage />;
      case 'store':
        return <KrishiStorePage />;
      case 'premium':
        return <PremiumPage />;
      case 'journey':
        return <KrishiJourneyPage />;
      case 'profile':
        return <FarmerProfilePage />;
      default:
        return <Dashboard onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfcf9] text-stone-900 flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Top Universal Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={() => handleOpenAuth('login')}
        onOpenCart={() => setCurrentTab('store')}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onNavigateAdmin={onNavigateAdmin}
      />

      {/* Main Body with Desktop Sidebar + Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar (hidden on public landing page) */}
        {currentTab !== 'landing' && (
          <div className="hidden lg:block">
            <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
          </div>
        )}

        {/* Dynamic Page Content */}
        <main
          className={`flex-1 overflow-x-hidden ${
            currentTab === 'landing' ? 'p-0' : 'p-4 sm:p-6 lg:p-8 max-w-full'
          }`}
        >
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Drawer Navigation Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl p-4 animate-in slide-in-from-left duration-200 overflow-y-auto">
            <Sidebar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              isMobile={true}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
          </div>
          <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Floating 24/7 AI Assistant */}
      <FloatingAIChat />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAI={() => setIsAIChatOpen(true)}
      />

      {/* Location Settings & Geolocation Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* Auth & Onboarding Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authInitialMode}
      />

      {/* Notifications Drawer */}
      <AlertCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (url: string) => {
    window.history.pushState(null, '', url);
    setCurrentPath(url);
    window.scrollTo(0, 0);
  };

  // 1. Admin Login Screen (/admin/login)
  if (currentPath === '/admin/login') {
    return (
      <AdminAuthProvider>
        <AdminLoginPage
          onLoginSuccess={() => navigateTo('/admin')}
          onNavigateFarmer={() => navigateTo('/')}
        />
      </AdminAuthProvider>
    );
  }

  // 2. Protected Admin Portal (/admin and /admin/*)
  if (currentPath.startsWith('/admin')) {
    const tabSegment = currentPath.replace('/admin', '').replace(/^\//, '').split('/')[0] as AdminTab;
    const initialTab: AdminTab = tabSegment || 'dashboard';

    return (
      <AdminAuthProvider>
        <AdminProtectedRoute onRedirectLogin={() => navigateTo('/admin/login')}>
          <AdminLayout
            initialTab={initialTab}
            onNavigateFarmer={() => navigateTo('/')}
          />
        </AdminProtectedRoute>
      </AdminAuthProvider>
    );
  }

  // 3. Farmer Web Application (100% untouched and functional)
  return (
    <LanguageProvider>
      <ToastProvider>
        <FarmDataProvider>
          <MainAppContent onNavigateAdmin={() => navigateTo('/admin')} />
        </FarmDataProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
