import React, { useState } from 'react';
import { GamingPlatform } from '../types';
import { Crown, Star, CheckCircle2, Copy, ExternalLink, Flame, ShieldCheck, QrCode, MessageSquare } from 'lucide-react';
import { UrgencyTimer } from './UrgencyTimer';
import confetti from 'canvas-confetti';

interface TopThreeProps {
  platforms: GamingPlatform[];
  onClaimClick: (platform: GamingPlatform) => void;
  onCopyCode: (platform: GamingPlatform) => void;
  onOpenQrModal?: (platform: GamingPlatform) => void;
  onOpenFeedbackModal?: (platform: GamingPlatform) => void;
}

export const TopThreeCarousel: React.FC<TopThreeProps> = ({
  platforms,
  onClaimClick,
  onCopyCode,
  onOpenQrModal,
  onOpenFeedbackModal
}) => {
  const topPlatforms = platforms
    .filter(p => p.isActive && p.isFeatured)
    .sort((a, b) => (a.featuredRank || 99) - (b.featuredRank || 99))
    .slice(0, 3);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (p: GamingPlatform, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(p.promoCode);
    setCopiedId(p.id);
    onCopyCode(p);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (topPlatforms.length === 0) return null;

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>TOP 3 GUARANTEED WINNERS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Highest Converting & Fastest Payout Gaming Sites
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
          Tested and verified daily for instant withdrawal speed, maximum RTP slots, and highest welcome bonus multipliers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {topPlatforms.map((p) => {
          const isGold = p.featuredRank === 1;
          const isSilver = p.featuredRank === 2;
          const isBronze = p.featuredRank === 3;

          const badgeBg = isGold
            ? 'from-amber-400 via-yellow-500 to-amber-600'
            : isSilver
            ? 'from-slate-300 via-slate-400 to-slate-500'
            : 'from-amber-700 via-amber-800 to-amber-900';

          const badgeLabel = isGold ? '#1 TOP CHOICE GOLD' : isSilver ? '#2 SILVER RANK' : '#3 BRONZE RANK';
          const cardGlow = isGold
            ? 'border-amber-500/60 shadow-2xl shadow-amber-500/15 ring-1 ring-amber-500/30'
            : isSilver
            ? 'border-slate-400/50 shadow-xl shadow-slate-500/10'
            : 'border-amber-800/60 shadow-xl shadow-amber-900/10';

          return (
            <div
              key={p.id}
              className={`relative bg-slate-900/90 rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${cardGlow}`}
            >
              {/* Badge rank bar */}
              <div
                className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black tracking-wider text-slate-950 bg-gradient-to-r shadow-md flex items-center gap-1.5 uppercase ${badgeBg}`}
              >
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>{badgeLabel}</span>
              </div>

              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mt-2 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.logoUrl}
                      alt={p.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-slate-700/80 shadow-md bg-slate-800"
                    />
                    <div>
                      <h3 className="font-extrabold text-lg text-white leading-tight flex items-center gap-1.5">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-400 font-bold">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-slate-300 ml-1">({p.rating}/10)</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Trust Rating</span>
                    <span className="text-lg font-black text-emerald-400">{p.rating} / 10</span>
                  </div>
                </div>

                {/* Bonus highlight box */}
                <div className="bg-gradient-to-br from-purple-950/80 to-slate-950 border border-purple-500/40 rounded-xl p-3.5 my-4 text-center">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest block">
                      EXCLUSIVE WELCOME OFFER
                    </span>
                    <UrgencyTimer initialMinutes={12} initialSeconds={45} variant="compact" />
                  </div>
                  <div className="text-base sm:text-lg font-black text-amber-300 leading-tight">
                    {p.bonusText}
                  </div>
                </div>

                {/* Badges list */}
                <div className="space-y-1.5 mb-6">
                  {p.badges.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Promo Code Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">PROMO CODE</span>
                    <span className="font-mono font-black text-amber-400 text-sm tracking-wider">
                      {p.promoCode}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleCopy(p, e)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedId === p.id ? 'COPIED! ✅' : 'COPY'}</span>
                  </button>
                </div>

                {/* Main CTA & Quick Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onClaimClick(p)}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
                  >
                    <span>CLAIM BONUS</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {onOpenQrModal && (
                    <button
                      onClick={() => onOpenQrModal(p)}
                      title="Scan Mobile QR Code"
                      className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  )}

                  {onOpenFeedbackModal && (
                    <button
                      onClick={() => onOpenFeedbackModal(p)}
                      title="Community Reviews & Feedback"
                      className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-purple-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
