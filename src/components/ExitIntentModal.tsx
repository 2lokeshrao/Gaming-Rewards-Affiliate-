import React, { useState, useEffect } from 'react';
import { GamingPlatform } from '../types';
import { Sparkles, Copy, ExternalLink, X, Flame, ShieldAlert, Award, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExitIntentModalProps {
  topPlatform: GamingPlatform;
  onClaimClick: (platform: GamingPlatform) => void;
  onCopyCode: (platform: GamingPlatform) => void;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({
  topPlatform,
  onClaimClick,
  onCopyCode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes countdown timer

  useEffect(() => {
    // Check if exit intent was already triggered during this session
    const alreadyShown = sessionStorage.getItem('exit_intent_shown');
    if (alreadyShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if cursor leaves viewport at top boundary
      if (e.clientY <= 15 || e.relatedTarget === null) {
        triggerModal();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Potential exit on mobile or tab switch
        triggerModal();
      }
    };

    const triggerModal = () => {
      if (!sessionStorage.getItem('exit_intent_shown')) {
        sessionStorage.setItem('exit_intent_shown', 'true');
        setIsOpen(true);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.4 }
          });
        } catch (err) {
          console.log('Confetti effect:', err);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !topPlatform) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const handleCopy = () => {
    onCopyCode(topPlatform);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 md:p-8 shadow-2xl shadow-amber-500/20 overflow-hidden">
        {/* Glow ambient background element */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Urgency Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-black text-xs border border-red-500/40 flex items-center gap-1.5 animate-pulse">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            WAIT! DON'T LEAVE YOUR BONUS BEHIND!
          </span>

          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-full border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>EXPIRES: {formattedTime}</span>
          </div>
        </div>

        {/* Hero Card Content */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
            <img
              src={topPlatform.logoUrl}
              alt={topPlatform.name}
              className="h-12 object-contain"
              loading="lazy"
            />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span>{topPlatform.name} VIP Bonus Unlocked</span>
            </h3>
            <p className="text-amber-300 font-extrabold text-lg mt-1">
              {topPlatform.bonusText || '500% Deposit Match + 100 Free Spins'}
            </p>
          </div>

          {/* Promo Code Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Exclusive VIP Promo Code
            </div>
            <div className="flex items-center justify-between bg-slate-900 rounded-xl p-2.5 border border-slate-800">
              <span className="text-xl font-mono font-black text-amber-400 tracking-wider pl-2">
                {topPlatform.promoCode}
              </span>

              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'COPIED!' : 'COPY CODE'}</span>
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-2 text-left text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified 100% Working</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Instant Payouts</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              onClaimClick(topPlatform);
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group hover:scale-[1.02]"
          >
            <span>CLAIM 500% BONUS INSTANTLY</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="text-xs text-slate-500 hover:text-slate-400 cursor-pointer underline"
          >
            No thanks, I will forfeit this 500% bonus
          </button>
        </div>
      </div>
    </div>
  );
};
