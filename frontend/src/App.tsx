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
import { CropCatalogPage } from './pages/CropCatalogPage';
import { CropHealthPage } from './pages/CropHealthPage';
import { AICropDoctorPage } from './pages/AICropDoctorPage';
import { SoilHealthPage } from './pages/SoilHealthPage';
import { PestDetectionPage } from './pages/PestDetectionPage';
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
import { SplashScreen } from './components/layout/SplashScreen';

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
  // Usability fix (issue 3): sidebar ALWAYS starts expanded with labels.
  // Farmers should not have to guess icons. Collapsing is still allowed
  // for the session, but it is never persisted as the default.
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((prev) => {
      return !prev;
    });
  };
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Splash screen: initial mount only. Navigation changes currentTab,
  // never remounts this component, so the splash never reappears.
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  useEffect(() => {
    // Splash stays for 5 seconds total: fade out starts at 4.5s, removed at 5s.
    const fade = window.setTimeout(() => setSplashFading(true), 4500);
    const remove = window.setTimeout(() => setShowSplash(false), 5000);
    return () => { window.clearTimeout(fade); window.clearTimeout(remove); };
  }, []);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register' | 'onboarding' | 'pin'>('pin');

  const { isAuthenticated, isLocationModalOpen, setIsLocationModalOpen, setIsAIChatOpen } = useFarmData();

  // Expected login flow, step 7: after a real session arrives, a user
  // sitting on the public landing page goes to the dashboard. This
  // only fires landing -> dashboard, never the reverse, so it cannot
  // loop, and unauthenticated users stay free to browse the public page.
  useEffect(() => {
    if (isAuthenticated && currentTab === 'landing') setCurrentTab('dashboard');
  }, [isAuthenticated, currentTab]);

  const handleOpenAuth = (mode: 'login' | 'register' | 'onboarding' | 'pin' = 'pin') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const renderActivePage = () => {
    switch (currentTab) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => handleOpenAuth('pin')}
            onExploreApp={() => setCurrentTab('dashboard')}
            onSelectModule={(mod) => setCurrentTab(mod)}
          />
        );
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'myFarms':
        return <MyFarmsPage onBrowseCrops={() => setCurrentTab('crops')} />;
      case 'crops':
        return <CropCatalogPage onViewMyFarm={() => setCurrentTab('myFarms')} />;
      case 'cropHealth':
        return <CropHealthPage />;
      case 'aiDoctor':
        return <AICropDoctorPage />;
      case 'soilHealth':
        return <SoilHealthPage />;
      case 'pestDetection':
        return <PestDetectionPage />;
      case 'aiHub':
        // Legacy tab (old dashboard/sidebar links): Crop Health is the
        // closest distinct page, so old links land there, not on a
        // shared hub page.
        return <CropHealthPage />;
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
    <div className="app-shell min-h-screen w-full max-w-none min-w-0 text-[#14251D] flex flex-col selection:bg-[#059669] selection:text-white overflow-x-clip">
      {showSplash && <SplashScreen fading={splashFading} />}

      {/* Top Universal Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={() => handleOpenAuth('pin')}
        onOpenCart={() => setCurrentTab('store')}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onNavigateAdmin={onNavigateAdmin}
      />

      {/* Main Body with Desktop Sidebar + Content Area */}
      <div className="flex-1 w-full max-w-none min-w-0 flex">
        {/* Desktop Sidebar (hidden on public landing page) */}
        {currentTab !== 'landing' && (
          <div className="hidden lg:block glass-strong border-r border-white/60">
            <Sidebar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              collapsed={isSidebarCollapsed}
              onToggleCollapse={toggleSidebarCollapsed}
              onNavigateAdmin={onNavigateAdmin}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
            />
          </div>
        )}

        {/* Dynamic Page Content */}
        <main
          className={`page-fade-in flex-1 min-w-0 w-full overflow-x-hidden ${
            currentTab === 'landing' ? 'p-0' : 'p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-full'
          }`}
        >
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Drawer Navigation Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-[#022C22]/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-4/5 max-w-xs bg-white/75 backdrop-blur-xl h-full shadow-2xl p-4 animate-in slide-in-from-left duration-200 overflow-y-auto">
            <Sidebar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              isMobile={true}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              onNavigateAdmin={onNavigateAdmin}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
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
