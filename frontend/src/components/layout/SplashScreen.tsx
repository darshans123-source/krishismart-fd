import React from 'react';

/**
 * Ultra-premium splash screen.
 *
 * Shown only on initial application mount (App renders it once, then
 * removes it after the fade-out animation). Tab navigation never
 * remounts App, so it never reappears on navigation. There is no
 * artificial loading delay: the splash is only as long as its own
 * fade-in / fade-out animation (~1.1s total), and reduced-motion
 * users get the animation-free version via CSS.
 */
export const SplashScreen: React.FC<{ fading: boolean }> = ({ fading }) => {
  const particles = [
    { left: '12%', top: '22%', size: 10, delay: '0s' },
    { left: '82%', top: '28%', size: 14, delay: '0.8s' },
    { left: '68%', top: '68%', size: 8, delay: '1.6s' },
    { left: '24%', top: '74%', size: 12, delay: '0.4s' },
    { left: '90%', top: '58%', size: 9, delay: '2.2s' },
    { left: '45%', top: '14%', size: 7, delay: '1.2s' },
  ];

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden bg-[#022C22] text-white ${fading ? 'splash-fade-out' : ''}`}
      aria-label="KrishiSmart AI loading"
      role="status"
    >
      {/* Full-screen real farmland photo with dark forest overlay */}
      <img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2000&auto=format&fit=crop&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#022C22]/80 via-[#022C22]/55 to-[#022C22]/90" />

      {/* Floating leaf particles (pure CSS, decorative) */}
      {particles.map((pt, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="splash-particle absolute rounded-full bg-[#6EE7B7]/60"
          style={{ left: pt.left, top: pt.top, width: pt.size, height: pt.size, animationDelay: pt.delay }}
        />
      ))}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <img
          src="/logo-icon.svg"
          alt="KrishiSmart AI logo"
          className="splash-logo w-24 h-24 sm:w-28 sm:h-28 rounded-[1.75rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] ring-1 ring-white/30"
        />
        <h1 className="splash-text mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight font-heading">
          KRISHISMART <span className="text-[#6EE7B7]">AI</span>
        </h1>
        <p className="splash-tagline mt-3 text-sm sm:text-base text-white/85 max-w-md leading-relaxed">
          Smart Farming. Better Decisions. Better Future.
        </p>

        {/* Loading progress indicator (animation only, not a data wait) */}
        <div className="mt-8 w-48 sm:w-56 h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div className="splash-progress-bar h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#D6AD55]" />
        </div>
        <p className="mt-3 text-[11px] font-semibold tracking-widest text-white/60 uppercase">
          Preparing your farm
        </p>
      </div>
    </div>
  );
};
