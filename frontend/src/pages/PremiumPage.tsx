import React from 'react';
import {
  Crown,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  BrainCircuit,
  TrendingUp,
  Activity,
  Plane,
  X
} from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';

export const PremiumPage: React.FC = () => {
  const { user, isProUnlocked, unlockProTier } = useFarmData();
  const { t } = useLanguage();

  const plans = [
    {
      name: 'Free Starter',
      price: '₹0',
      period: 'Forever Free',
      description: 'Essential farm tracking, basic 3-day weather, and standard mandi prices.',
      features: [
        'Up to 2 Farm Parcels',
        'Basic AI Crop Doctor (5 scans/month)',
        'Standard Mandi Price Ticker',
        'Basic Weather & Rain Alert',
        'Community Forum Access'
      ],
      isPopular: false,
      isCurrent: !isProUnlocked,
      buttonText: 'Current Plan',
      buttonAction: () => {}
    },
    {
      name: 'KrishiSmart Pro',
      price: '₹499',
      period: 'per year',
      description: 'Full AI Suite, 60-Day KrishiBhavishya Time Machine, Drone Spray Planner, and IoT Automation.',
      features: [
        'Unlimited Farm Parcels & Crops',
        'Unlimited AI Crop Doctor Scans (95%+ accuracy)',
        'KrishiBhavishya 60-Day Mandi Price Time Machine',
        'DroneSpray AI Autonomous Flight Planning',
        'Smart Irrigation Auto-Pump LoRaWAN integration',
        'WhatsApp/SMS Voice & Emergency Weather Alerts',
        'Priority Agronomist Chat Support'
      ],
      isPopular: true,
      isCurrent: isProUnlocked,
      buttonText: isProUnlocked ? 'Plan Active (PRO)' : 'Upgrade to Pro (+500 XP)',
      buttonAction: unlockProTier
    },
    {
      name: 'FPO & Enterprise Cluster',
      price: '₹4,999',
      period: 'per cluster / year',
      description: 'For Farmer Producer Organizations (FPOs), Cooperatives, and Large Agro-Estates.',
      features: [
        'Everything in Pro Plan',
        'Manage up to 500 Farmers in single FPO Dashboard',
        'Bulk Drone Spray Fleet Scheduling',
        'Custom APMC Wholesale B2B Contracts',
        'Custom Soil Lab N-P-K API Integrations',
        'Dedicated Agronomist & Telemetry Specialist'
      ],
      isPopular: false,
      isCurrent: false,
      buttonText: 'Contact FPO Team',
      buttonAction: unlockProTier
    }
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold border border-amber-300">
          <Crown className="w-3.5 h-3.5 text-amber-600" />
          <span>KrishiSmart Pro Memberships</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B24] font-heading">
          Unlock the Full Power of Intelligent Farming
        </h1>
        <p className="text-xs sm:text-sm text-[#718078]">
          Equip your agricultural operations with predictive market intelligence, automated drip controls, and AI agronomy.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all duration-300 relative ${
              plan.isPopular
                ? 'bg-gradient-to-b from-[#172B24] via-[#172B24] to-[#022C22] text-white shadow-2xl border-2 border-amber-400/80 -translate-y-2'
                : 'bg-white text-[#172B24] border border-[#E5EDE7] shadow-sm'
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-[#022C22] text-[10px] font-black uppercase tracking-wider shadow-md">
                ⭐ Most Recommended
              </span>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-extrabold text-lg font-heading ${plan.isPopular ? 'text-white' : 'text-[#172B24]'}`}>
                  {plan.name}
                </h3>
                {plan.isCurrent && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981]/30">
                    Active
                  </span>
                )}
              </div>

              <p className={`text-xs ${plan.isPopular ? 'text-[#CBD8D0]' : 'text-[#718078]'} leading-relaxed mb-4`}>
                {plan.description}
              </p>

              <div className="flex items-baseline gap-1.5 pb-4 border-b border-[#EFF4EF]/20">
                <span className={`text-3xl sm:text-4xl font-black font-heading ${plan.isPopular ? 'text-amber-400' : 'text-[#172B24]'}`}>
                  {plan.price}
                </span>
                <span className={`text-xs ${plan.isPopular ? 'text-[#8A9A90]' : 'text-[#718078]'}`}>
                  / {plan.period}
                </span>
              </div>

              {/* Features list */}
              <div className="space-y-2.5 pt-4 text-xs">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.isPopular ? 'text-[#34D399]' : 'text-[#059669]'
                      }`}
                    />
                    <span className={plan.isPopular ? 'text-[#E5EDE7]' : 'text-[#3E5248]'}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={plan.buttonAction}
              disabled={plan.isCurrent}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all ${
                plan.isPopular
                  ? 'bg-amber-500 hover:bg-amber-400 text-[#022C22] shadow-amber-500/20'
                  : plan.isCurrent
                  ? 'bg-[#EFF4EF] text-[#8A9A90] cursor-default'
                  : 'bg-[#059669] hover:bg-[#064E3B] text-white'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
