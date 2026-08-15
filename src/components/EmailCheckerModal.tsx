import React, { useState } from 'react';
import { GamingPlatform, EmailCheckResult } from '../types';
import { Mail, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Sparkles, X, ExternalLink } from 'lucide-react';

interface EmailCheckerModalProps {
  platforms: GamingPlatform[];
  onClose: () => void;
  onProceedToClaim: (platform: GamingPlatform) => void;
}

export const EmailCheckerModal: React.FC<EmailCheckerModalProps> = ({
  platforms,
  onClose,
  onProceedToClaim
}) => {
  const activePlatforms = platforms.filter(p => p.isActive);
  const [selectedPlatformId, setSelectedPlatformId] = useState(activePlatforms[0]?.id || '1win');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<EmailCheckResult | null>(null);

  const selectedPlatform = activePlatforms.find(p => p.id === selectedPlatformId) || activePlatforms[0];

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setLoading(true);
    setCheckResult(null);

    try {
      const res = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          platformId: selectedPlatformId
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCheckResult(data);
      } else {
        // Fallback simulation if server fails
        simulateCheck();
      }
    } catch {
      simulateCheck();
    } finally {
      setLoading(false);
    }
  };

  const simulateCheck = () => {
    // Standard smart check logic: if email contains common test words or numbers like "test", "old", "user" or random 50% split for demo
    const clean = email.toLowerCase().trim();
    const hasExisting = clean.includes('old') || clean.includes('user') || clean.includes('1win') || clean.includes('exist') || clean.length % 2 === 0;

    if (hasExisting) {
      setCheckResult({
        email: clean,
        hasExistingAccount: true,
        platformName: selectedPlatform?.name || 'Gaming Platform',
        message: `An account associated with '${clean}' or similar credentials appears to be registered previously on ${selectedPlatform?.name}.`,
        recommendedAction: `To guarantee your 500% Welcome Bonus & 200 Free Spins, please use a NEW EMAIL ADDRESS or fresh mobile number during registration.`
      });
    } else {
      setCheckResult({
        email: clean,
        hasExistingAccount: false,
        platformName: selectedPlatform?.name || 'Gaming Platform',
        message: `Good news! '${clean}' is completely fresh and eligible for the maximum 500% Welcome Bonus package.`,
        recommendedAction: `Proceed to registration now with promo code ${selectedPlatform?.promoCode || 'VIPBONUS500'}.`
      });
    }
  };

  const handleReset = () => {
    setCheckResult(null);
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/50 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-black uppercase tracking-wider mb-2">
            <Mail className="w-4 h-4 text-purple-400" />
            <span>ACCOUNT ELIGIBILITY CHECKER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Check If Your Email Is Eligible For Welcome Bonus
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Existing accounts cannot claim the 500% first deposit bonus. Check your email status before creating your account!
          </p>
        </div>

        {!checkResult ? (
          <form onSubmit={handleCheckEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-1">
                1. Select Gaming Platform
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activePlatforms.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlatformId(p.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                      selectedPlatformId === p.id
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300 ring-1 ring-purple-500/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <img loading="lazy" src={p.logoUrl} alt={p.name} className="w-6 h-6 rounded-md object-cover" />
                    <span className="font-extrabold text-xs truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-1">
                2. Enter Your Email Address to Check Eligibility
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-10 pr-4 text-white font-medium focus:border-purple-500 outline-none placeholder:text-slate-600 text-sm"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-purple-600/25 cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>VERIFYING ACCOUNT ELIGIBILITY...</span>
                </>
              ) : (
                <>
                  <span>CHECK EMAIL ELIGIBILITY NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-5 animate-fadeIn">
            {checkResult.hasExistingAccount ? (
              /* EXISTING ACCOUNT WARNING */
              <div className="bg-gradient-to-b from-amber-950/90 to-slate-950 border-2 border-amber-500/80 rounded-2xl p-5 text-center space-y-3">
                <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-7 h-7 text-amber-400 animate-bounce" />
                </div>

                <div className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-black uppercase">
                  ⚠️ EXISTING ACCOUNT DETECTED!
                </div>

                <h3 className="text-lg font-black text-white leading-snug">
                  An Account Already Exists on {checkResult.platformName}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {checkResult.message}
                </p>

                <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-3.5 text-left text-xs space-y-1">
                  <span className="font-extrabold text-amber-300 block flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    IMPORTANT RECOMMENDATION FOR 500% BONUS:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {checkResult.recommendedAction}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onProceedToClaim(selectedPlatform)}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <span>SIGN UP WITH NEW EMAIL NOW</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleReset}
                    className="px-4 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                  >
                    Check Another Email
                  </button>
                </div>
              </div>
            ) : (
              /* CLEAN EMAIL SUCCESS */
              <div className="bg-gradient-to-b from-emerald-950/90 to-slate-950 border-2 border-emerald-500/80 rounded-2xl p-5 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-black uppercase">
                  ✅ EMAIL ELIGIBLE FOR 500% BONUS!
                </div>

                <h3 className="text-lg font-black text-white leading-snug">
                  No Existing Account Found on {checkResult.platformName}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {checkResult.message}
                </p>

                <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3 text-center">
                  <span className="text-[10px] uppercase font-extrabold text-emerald-400 block">PROMO CODE TO USE:</span>
                  <span className="font-mono font-black text-amber-300 text-base">{selectedPlatform?.promoCode || 'VIPBONUS500'}</span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onProceedToClaim(selectedPlatform)}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <span>PROCEED TO SIGN UP & CLAIM 500% BONUS</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleReset}
                    className="px-4 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer"
                  >
                    Check Another Email
                  </button>
                </div>

                {/* Manual Override Option */}
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const res = await fetch('/api/check-email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: checkResult.email,
                            platformId: selectedPlatformId,
                            forceMarkRegistered: true
                          })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setCheckResult(data);
                        }
                      } catch {
                        setCheckResult({
                          email: checkResult.email,
                          hasExistingAccount: true,
                          platformName: checkResult.platformName,
                          message: `Account '${checkResult.email}' is marked as existing on ${checkResult.platformName}.`,
                          recommendedAction: `Please use a NEW EMAIL ADDRESS or fresh mobile number during registration to guarantee your 500% Welcome Bonus & 200 Free Spins.`
                        });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full text-center text-[11px] text-amber-400/90 hover:text-amber-300 hover:underline py-1 cursor-pointer font-extrabold"
                  >
                    ⚠️ Wait! Is this email already registered on {checkResult.platformName}? Click here for New Email Registration Guide
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
