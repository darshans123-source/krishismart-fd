import React from 'react';
import {
  Award,
  Flame,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  Droplets,
  Sprout,
  ShieldCheck,
  Plane
} from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';

export const KrishiJourneyPage: React.FC = () => {
  const { user, achievements } = useFarmData();
  const { t } = useLanguage();

  const currentLevel = user?.level || 1;
  const currentXP = user?.xp || 0;
  const nextLevelXP = currentLevel * 1000;
  const xpInCurrentLevel = currentXP % 1000;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / 1000) * 100));

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="w-full min-w-0 space-y-8 pb-12 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1 border border-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Farm Gamification & Rewards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] font-heading">
            {t('krishiJourney')}
          </h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            Earn Experience Points (XP) for soil scans, water conservation, precision drone missions, and peak market sales.
          </p>
        </div>
      </div>

      {/* 1. LEVEL & STREAK HERO CARD */}
      <div className="bg-gradient-to-br from-[#022C22] via-[#172B24] to-[#022C22] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#10B981]/30 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex flex-col items-center justify-center text-[#022C22] font-black shadow-lg shadow-amber-500/20">
              <span className="text-xs uppercase tracking-wider font-extrabold">Level</span>
              <span className="text-3xl leading-none font-heading">{currentLevel}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-heading text-white">
                  Smart Precision Cultivator
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/30 text-[#6EE7B7] text-[10px] font-bold">
                  Top 5% in Mandya
                </span>
              </div>
              <p className="text-xs text-[#CBD8D0] mt-1">
                Total XP Earned: <strong className="text-amber-400">{currentXP.toLocaleString('en-IN')} XP</strong>
              </p>
            </div>
          </div>

          {/* Daily Streak Badge */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 self-start md:self-auto">
            <Flame className="w-8 h-8 text-amber-400 animate-bounce" />
            <div>
              <div className="text-2xl font-black text-white font-heading">
                {user?.streakDays || 1} Days
              </div>
              <div className="text-[10px] text-[#CBD8D0] font-semibold">Active Daily Farming Streak</div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="w-full min-w-0 space-y-2 pt-2 border-t border-[#243A32]">
          <div className="flex justify-between text-xs text-[#CBD8D0] font-semibold">
            <span>Level {currentLevel} Progress ({xpInCurrentLevel} / 1000 XP)</span>
            <span className="text-amber-300">{1000 - xpInCurrentLevel} XP until Level {currentLevel + 1}</span>
          </div>
          <div className="w-full bg-[#243A32] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#3E5248]">
            <div
              className="bg-gradient-to-r from-[#10B981] via-teal-400 to-amber-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. ACHIEVEMENTS & BADGES MATRIX */}
      <div className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
          <div>
            <h3 className="font-extrabold text-base text-[#172B24] font-heading">
              Agri-Master Badges ({unlockedCount} of {achievements.length} Unlocked)
            </h3>
            <p className="text-xs text-[#718078]">Milestones achieved on your smart farming journey.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                ach.unlocked
                  ? 'bg-[#ECFDF5]/40 border-[#6EE7B7] shadow-2xs'
                  : 'bg-[#F7FAF7]/60 border-[#E5EDE7] opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{ach.icon}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      ach.unlocked
                        ? 'bg-[#D1FAE5] text-[#064E3B]'
                        : 'bg-[#E5EDE7] text-[#5A6E64]'
                    }`}
                  >
                    +{ach.xpValue} XP
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-[#172B24] font-heading">
                  {ach.name}
                </h4>
                <p className="text-xs text-[#718078] mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5EDE7]/60 flex items-center justify-between text-[11px]">
                {ach.unlocked ? (
                  <span className="text-[#064E3B] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked {ach.unlockedAt}</span>
                  </span>
                ) : (
                  <span className="text-[#8A9A90] font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{ach.progress} / {ach.maxProgress} in progress</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
