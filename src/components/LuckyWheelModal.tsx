import React, { useState, useEffect } from 'react';
import { GamingPlatform, GlobalConfig } from '../types';
import { Sparkles, Trophy, X, ExternalLink, RefreshCw, Timer } from 'lucide-react';
import { UrgencyTimer } from './UrgencyTimer';
import confetti from 'canvas-confetti';

interface LuckyWheelProps {
  platforms: GamingPlatform[];
  config: GlobalConfig;
  onClaimPrize: (platform: GamingPlatform, promoCode: string) => void;
  onClose: () => void;
}

const WHEEL_SEGMENTS = [
  { label: "500% BONUS", color: "#8b5cf6", code: "LUCKY500" },
  { label: "200 FREE SPINS", color: "#ec4899", code: "SPINS200" },
  { label: "NO DEPOSIT $50", color: "#f59e0b", code: "NODEP50" },
  { label: "100% CASHBACK", color: "#10b981", code: "CASH100" },
  { label: "VIP RAKEBACK", color: "#06b6d4", code: "VIPRAKE" },
  { label: "300% BONUS + 100 FS", color: "#e11d48", code: "MEGA300" }
];

export const LuckyWheelModal: React.FC<LuckyWheelProps> = ({ platforms, config, onClaimPrize, onClose }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<{ label: string; code: string } | null>(null);

  const topPlatform = platforms.find(p => p.id === config.featuredPrizePlatformId) || platforms[0];

  const handleSpin = () => {
    if (spinning || wonPrize) return;

    setSpinning(true);
    // Pick a winning segment index (e.g., segment 0 or 1 for best high value)
    const winningIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    // Extra rotations + offset to center on the winning slice
    const totalRotation = 360 * 5 + (360 - (winningIndex * segmentAngle + segmentAngle / 2));

    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      const prize = WHEEL_SEGMENTS[winningIndex];
      setWonPrize(prize);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80 text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            LUCKY SPIN WHEEL OF FORTUNE
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            {wonPrize ? "🎉 CONGRATULATIONS! YOU WON!" : "Spin to Win Exclusive Bonus!"}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            {wonPrize
              ? `You unlocked ${wonPrize.label}! Claim it on ${topPlatform?.name || 'top platform'} now.`
              : "Spin the lucky wheel now to claim guaranteed welcome deposit multipliers and free spins!"}
          </p>
        </div>

        {/* Wheel graphic or Winner State */}
        {!wonPrize ? (
          <div className="relative my-6 flex flex-col items-center justify-center">
            {/* Pointer Pin */}
            <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-amber-400 drop-shadow-md" />

            {/* Canvas / Styled SVG Wheel */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-amber-400 shadow-2xl shadow-amber-500/20 overflow-hidden">
              <div
                className="w-full h-full relative transition-transform duration-[4500ms] ease-out"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {WHEEL_SEGMENTS.map((seg, i) => {
                  const angle = (360 / WHEEL_SEGMENTS.length) * i;
                  return (
                    <div
                      key={i}
                      className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left flex items-start justify-center pt-4 pr-4"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        backgroundColor: seg.color,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%)'
                      }}
                    >
                      <span className="text-[10px] sm:text-[11px] font-black text-white text-center drop-shadow-sm uppercase leading-tight transform rotate-45 translate-x-2">
                        {seg.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Center Hub Button */}
              <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center shadow-lg z-10">
                <Trophy className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>
            </div>

            {/* Spin CTA Button */}
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {spinning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>SPINNING WHEEL...</span>
                </>
              ) : (
                <span>SPIN & CLAIM YOUR PRIZE NOW!</span>
              )}
            </button>
          </div>
        ) : (
          /* Won Prize Banner */
          <div className="my-6 space-y-4">
            {/* Registration Countdown Timer */}
            <UrgencyTimer initialMinutes={9} initialSeconds={59} label="⚡ SIGN-UP & CLAIM TIMER:" variant="banner" />

            <div className="bg-gradient-to-br from-purple-950 to-slate-950 border-2 border-amber-400/80 rounded-2xl p-6 shadow-xl text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">YOUR EXCLUSIVE PRIZE UNLOCKED</span>
              <div className="text-2xl font-black text-white my-1">{wonPrize.label}</div>
              <div className="mt-3 bg-slate-950 border border-slate-800 rounded-xl p-3 inline-block font-mono text-amber-300 font-bold text-base">
                PROMO CODE: {config.featuredPromoCode || wonPrize.code}
              </div>
            </div>

            <button
              onClick={() => onClaimPrize(topPlatform, config.featuredPromoCode || wonPrize.code)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-lg shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer animate-bounce hover:animate-none"
            >
              <span>REGISTER & CLAIM ON {topPlatform?.name || 'OFFER'} NOW!</span>
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
