import React from 'react';
import {
  Home,
  Sprout,
  BrainCircuit,
  TrendingUp,
  User
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAI?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab
}) => {
  if (currentTab === 'landing') return null;

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'myFarms', label: 'Farm', icon: Sprout },
    { id: 'aiHub', label: 'AI', icon: BrainCircuit },
    { id: 'market', label: 'Market', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 w-full min-w-0 bg-white border-t border-[#E5EDE7] shadow-lg px-1 py-1.5 flex items-stretch lg:hidden safe-area-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-150 min-h-[48px] active:scale-95 ${
              isActive
                ? 'text-[#064E3B] font-bold bg-[#ECFDF5]'
                : 'text-[#5A6E64] hover:text-[#172B24] font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-[#064E3B]' : 'text-[#718078]'}`} />
            <span className="text-[11px] mt-1 font-semibold tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
