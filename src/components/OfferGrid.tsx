import React, { useState } from 'react';
import { GamingPlatform, UserGeo } from '../types';
import { Star, ShieldCheck, Copy, ExternalLink, Flame, Sparkles, Users, QrCode, MessageSquare, MapPin } from 'lucide-react';
import { UrgencyTimer } from './UrgencyTimer';
import { AdContainer } from './AdContainer';
import confetti from 'canvas-confetti';

interface OfferGridProps {
  platforms: GamingPlatform[];
  geo?: UserGeo;
  onClaimClick: (platform: GamingPlatform) => void;
  onCopyCode: (platform: GamingPlatform) => void;
  onSubPartnerClick?: (platform: GamingPlatform) => void;
  onOpenQrModal?: (platform: GamingPlatform) => void;
  onOpenFeedbackModal?: (platform: GamingPlatform) => void;
}

export const OfferGrid: React.FC<OfferGridProps> = ({
  platforms,
  geo,
  onClaimClick,
  onCopyCode,
  onSubPartnerClick,
  onOpenQrModal,
  onOpenFeedbackModal
}) => {
  const activePlatforms = platforms.filter(p => p.isActive);
  
  // Localized redirect logic: Prioritize specific offers based on UserGeo (e.g., India)
  const sortedPlatforms = [...activePlatforms].sort((a, b) => {
    if (geo?.countryCode === 'IN') {
      // Prioritize platforms that might support UPI (just as an example logic, we'll boost '1win' and 'parimatch')
      const aIsLocal = a.name.toLowerCase().includes('1win') || a.name.toLowerCase().includes('parimatch') || a.name.toLowerCase().includes('melbet');
      const bIsLocal = b.name.toLowerCase().includes('1win') || b.name.toLowerCase().includes('parimatch') || b.name.toLowerCase().includes('melbet');
      
      if (aIsLocal && !bIsLocal) return -1;
      if (!aIsLocal && bIsLocal) return 1;
    }
    return 0; // fallback to original order
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (p: GamingPlatform, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(p.promoCode);
    setCopiedId(p.id);
    onCopyCode(p);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="offers-list" className="py-12 px-4 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>VERIFIED PROMO & PARTNER DIRECTORY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            All Verified Gaming Offers & Sub-Partner Sign-Ups
          </h2>
        </div>
        <div className="text-slate-400 text-xs font-medium bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Showing {activePlatforms.length} Active Verified Partners</span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedPlatforms.map((p, index) => (
          <React.Fragment key={p.id}>
            <div
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-xl hover:shadow-purple-900/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-4 lg:w-1/4">
              <span className="font-extrabold text-slate-500 text-sm w-5 text-center shrink-0">
                #{index + 1}
              </span>
              <img
                src={p.logoUrl}
                alt={p.name}
                loading="lazy"
                decoding="async"
                width="64"
                height="64"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
              />
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight flex items-center flex-wrap gap-2">
                  {p.name}
                  {p.isFeatured && (
                    <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                      FEATURED
                    </span>
                  )}
                  {/* Conditional HOT badge for high CTR / popular offers */}
                  {(p.clicksCount > 500) && (
                    <span className="relative flex items-center justify-center ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-md bg-red-500 opacity-40"></span>
                      <span className="relative bg-gradient-to-r from-red-600 to-rose-600 border border-red-400 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-[0_0_10px_rgba(225,29,72,0.5)]">
                        <Flame className="w-3 h-3 text-white fill-white" />
                        HOT
                      </span>
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">{p.rating} / 10</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">{p.category}</span>
              </div>
            </div>

            {/* Bonus Details & Badges */}
            <div className="flex-1 lg:w-2/4">
              <div className="bg-gradient-to-r from-purple-950/60 to-slate-950 border border-purple-500/30 rounded-xl p-3 mb-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider block">
                    EXCLUSIVE PROMO OFFER
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {p.bonusText}
                  </span>
                </div>
                <UrgencyTimer initialMinutes={19} initialSeconds={30} variant="card" />
              </div>

              {/* Badges pills */}
              <div className="flex flex-wrap gap-1.5">
                {p.badges.map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-medium"
                  >
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Promo Code, Claim CTA & Sub-Partner CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-center gap-2 lg:w-1/4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between gap-3 w-full">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">PROMO CODE</span>
                  <span className="font-mono font-black text-amber-400 text-xs tracking-wider">
                    {p.promoCode}
                  </span>
                </div>
                <button
                  onClick={(e) => handleCopy(p, e)}
                  className="px-2 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedId === p.id ? 'COPIED! ✅' : 'COPY'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 w-full">
                <button
                  onClick={() => onClaimClick(p)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs tracking-wide shadow-md shadow-amber-500/15 transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
                >
                  <span>CLAIM BONUS</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {onOpenQrModal && (
                  <button
                    onClick={() => onOpenQrModal(p)}
                    title="Scan Mobile QR Code"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                )}

                {onOpenFeedbackModal && (
                  <button
                    onClick={() => onOpenFeedbackModal(p)}
                    title="Community Reviews & Feedback"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-purple-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
              </div>

              {onSubPartnerClick && (
                <button
                  onClick={() => onSubPartnerClick(p)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-cyan-500/30 text-cyan-300 font-extrabold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Become Sub-Partner (50% RevShare)</span>
                </button>
              )}
            </div>
          </div>
          {/* Smart ad-insertion: after every 4th game item */}
          {(index + 1) % 4 === 0 && index !== sortedPlatforms.length - 1 && (
            <div className="py-2">
              <AdContainer slotId={`offer_grid_inline_${index}`} />
            </div>
          )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
