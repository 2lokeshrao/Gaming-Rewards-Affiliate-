import React, { useState, useEffect, lazy, Suspense } from 'react';
import { GamingPlatform, GlobalConfig, AnalyticsStats, TrackLog, WinnerTickerItem, UserGeo, SubPartnerApplication } from './types';
import { injectFaqSchemaInHead } from './utils/seo';
import { TopBanner } from './components/TopBanner';
import { HeroSection } from './components/HeroSection';
import { TopThreeCarousel } from './components/TopThreeCarousel';
import { OfferGrid } from './components/OfferGrid';
import { SocialMediaBar } from './components/SocialMediaBar';
import { LiveWinnersTicker } from './components/LiveWinnersTicker';
import { ShieldCheck, Award, Lock, Sparkles, Users, Mail, RefreshCw } from 'lucide-react';

// Code-Splitting with React.lazy for heavy components & modals
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const SeoContentSection = lazy(() => import('./components/SeoContentSection').then(m => ({ default: m.SeoContentSection })));
const FaqSection = lazy(() => import('./components/FaqSection').then(m => ({ default: m.FaqSection })));
const CustomCouponsSection = lazy(() => import('./components/CustomCouponsSection').then(m => ({ default: m.CustomCouponsSection })));
const LuckyWheelModal = lazy(() => import('./components/LuckyWheelModal').then(m => ({ default: m.LuckyWheelModal })));
const SubPartnerModal = lazy(() => import('./components/SubPartnerModal').then(m => ({ default: m.SubPartnerModal })));
const EmailCheckerModal = lazy(() => import('./components/EmailCheckerModal').then(m => ({ default: m.EmailCheckerModal })));
const ClaimWithQrModal = lazy(() => import('./components/ClaimWithQrModal').then(m => ({ default: m.ClaimWithQrModal })));
const PlatformFeedbackModal = lazy(() => import('./components/PlatformFeedbackModal').then(m => ({ default: m.PlatformFeedbackModal })));
const AdminLoginModal = lazy(() => import('./components/AdminLoginModal').then(m => ({ default: m.AdminLoginModal })));
const ExitIntentModal = lazy(() => import('./components/ExitIntentModal').then(m => ({ default: m.ExitIntentModal })));

export default function App() {
  const [platforms, setPlatforms] = useState<GamingPlatform[]>([]);
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [fakeWinners, setFakeWinners] = useState<WinnerTickerItem[]>([]);
  const [logs, setLogs] = useState<TrackLog[]>([]);
  const [subPartners, setSubPartners] = useState<SubPartnerApplication[]>([]);
  const [geo, setGeo] = useState<UserGeo>({
    country: 'United States',
    countryCode: 'US',
    city: 'Detecting...',
    ip: '127.0.0.1',
    flag: '🇺🇸'
  });

  const [loading, setLoading] = useState(true);

  // Modals
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [showSubPartnerModal, setShowSubPartnerModal] = useState(false);
  const [showEmailCheckerModal, setShowEmailCheckerModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [selectedQrPlatform, setSelectedQrPlatform] = useState<GamingPlatform | null>(null);
  const [selectedFeedbackPlatform, setSelectedFeedbackPlatform] = useState<GamingPlatform | null>(null);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('affiliate_admin_token'));
  const [viewingAdmin, setViewingAdmin] = useState(false);

  // Active Urgency Timer State
  const [activeUrgencyTimer, setActiveUrgencyTimer] = useState<{
    platformName: string;
    promoCode: string;
    slug: string;
    endTime: number;
  } | null>(() => {
    try {
      const saved = sessionStorage.getItem('active_urgency_timer');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.endTime > Date.now()) {
          return parsed;
        }
      }
    } catch {}
    return null;
  });

  // Stealth Hotkey (Ctrl + Shift + A) & URL Query Listener for Secret Admin Access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (adminToken) {
          setViewingAdmin(true);
        } else {
          setShowAdminLogin(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Check URL query ?admin=1
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1' || params.get('secret') === 'admin') {
      if (adminToken) {
        setViewingAdmin(true);
      } else {
        setShowAdminLogin(true);
      }
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adminToken]);

  // Fetch data on load
  const loadData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        setPlatforms(data.platforms);
        setConfig(data.config);
        setStats(data.stats);
        setFakeWinners(data.fakeWinners);
        setLogs(data.logs);
        if (data.subPartners) setSubPartners(data.subPartners);
        if (data.geo) setGeo(data.geo);

        // Record A/B test view impression
        if (data.config?.abTestConfig?.enabled && !sessionStorage.getItem('ab_view_recorded')) {
          sessionStorage.setItem('ab_view_recorded', 'true');
          const design = data.config.abTestConfig.heroDesign;
          const abStats = data.config.abTestConfig.stats || { variantAViews: 0, variantBViews: 0, variantAClicks: 0, variantBClicks: 0 };
          const updatedAb = {
            ...data.config.abTestConfig,
            stats: {
              ...abStats,
              variantAViews: design === 'variant_a' ? abStats.variantAViews + 1 : abStats.variantAViews,
              variantBViews: design === 'variant_b' ? abStats.variantBViews + 1 : abStats.variantBViews
            }
          };
          const updatedConfig = { ...data.config, abTestConfig: updatedAb };
          setConfig(updatedConfig);
          handleSaveConfigFromAdmin(updatedConfig);
        }
      }
    } catch (err) {
      console.error('Failed to load initial affiliate data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Inject dynamic FAQ Schema.org JSON-LD into head for SEO crawlers
  useEffect(() => {
    if (platforms && platforms.length > 0) {
      injectFaqSchemaInHead(platforms);
    }
  }, [platforms]);

  // Trigger Lucky Wheel after 5 seconds automatically if enabled
  useEffect(() => {
    if (!config || !config.enableLuckyWheel) return;

    const hasSeenWheel = sessionStorage.getItem('has_seen_wheel');
    if (!hasSeenWheel) {
      const timer = setTimeout(() => {
        setShowWheelModal(true);
        sessionStorage.setItem('has_seen_wheel', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [config]);

  // Handle Event Tracking
  const trackEvent = async (eventType: 'click' | 'copy' | 'wheel_spin', platformId?: string) => {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, platformId })
      });
    } catch (err) {
      console.error('Tracking error:', err);
    }
  };

  // Submit Sub-Partner Application
  const handleSubmitSubPartner = async (appData: {
    fullName: string;
    email: string;
    whatsapp: string;
    platformId: string;
    platformName: string;
    trafficSource: string;
    estimatedMonthlyPlayers: string;
  }) => {
    try {
      const res = await fetch('/api/sub-partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.application) {
          setSubPartners(prev => [data.application, ...prev]);
        }
      }
    } catch (err) {
      console.error('Failed to submit sub-partner application:', err);
    }
  };

  // Update Sub-Partner Status from Admin
  const handleUpdateSubPartnerStatus = async (id: string, status: 'approved' | 'contacted' | 'pending') => {
    try {
      const res = await fetch(`/api/admin/sub-partners/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setSubPartners(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
      }
    } catch (err) {
      console.error('Failed to update sub-partner status:', err);
    }
  };

  // Claim click handler -> Activates 10 min urgency timer & redirects to /go/slug
  const handleClaimClick = (p: GamingPlatform) => {
    trackEvent('click', p.id);
    const endTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    const timerData = {
      platformName: p.name,
      promoCode: p.promoCode || 'MAXBOOST500',
      slug: p.slug,
      endTime
    };
    setActiveUrgencyTimer(timerData);
    try {
      sessionStorage.setItem('active_urgency_timer', JSON.stringify(timerData));
    } catch {}

    window.open(`/go/${p.slug}`, '_blank');
  };

  // Submit Feedback Handler (adds to pending queue for Admin Approval)
  const handleSubmitFeedback = (fb: { platformId: string; platformName: string; userName: string; rating: number; comment: string }) => {
    const newFb = {
      ...fb,
      id: `fb_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isApproved: false
    };

    if (config) {
      const updatedApproved = [...(config.approvedFeedbacks || []), newFb];
      const updatedConfig = { ...config, approvedFeedbacks: updatedApproved };
      setConfig(updatedConfig);
      handleSaveConfigFromAdmin(updatedConfig);
    }
  };

  // Copy code handler
  const handleCopyCode = (p: GamingPlatform) => {
    trackEvent('copy', p.id);
  };

  // Wheel prize redirect
  const handleWheelClaimPrize = (p: GamingPlatform, code: string) => {
    trackEvent('wheel_spin', p.id);
    const endTime = Date.now() + 10 * 60 * 1000;
    const timerData = {
      platformName: p.name,
      promoCode: code || p.promoCode || 'MAXBOOST500',
      slug: p.slug,
      endTime
    };
    setActiveUrgencyTimer(timerData);
    try {
      sessionStorage.setItem('active_urgency_timer', JSON.stringify(timerData));
    } catch {}

    window.open(`/go/${p.slug}`, '_blank');
    setShowWheelModal(false);
  };

  // Admin Login
  const handleAdminLogin = async (passcode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('affiliate_admin_token', data.token);
          setAdminToken(data.token);
          setShowAdminLogin(false);
          setViewingAdmin(true);
          return true;
        }
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('affiliate_admin_token');
    setAdminToken(null);
    setViewingAdmin(false);
  };

  // Save Platforms from Admin
  const handleSavePlatformsFromAdmin = async (updated: GamingPlatform[]) => {
    setPlatforms(updated);
    if (!adminToken) return;

    try {
      await fetch('/api/admin/platforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ platforms: updated })
      });
    } catch (err) {
      console.error('Failed to save platforms:', err);
    }
  };

  // Save Config from Admin
  const handleSaveConfigFromAdmin = async (updatedConfig: GlobalConfig) => {
    setConfig(updatedConfig);
    if (!adminToken) return;

    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ config: updatedConfig })
      });
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  const scrollToOffers = () => {
    const elem = document.getElementById('offers-list');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-bold text-sm tracking-wider">LOADING VERIFIED GAMING REWARDS...</p>
      </div>
    );
  }

  // If currently viewing full admin panel
  if (viewingAdmin && adminToken && stats) {
    return (
      <AdminPanel
        token={adminToken}
        onLogout={handleAdminLogout}
        platforms={platforms}
        config={config}
        stats={stats}
        logs={logs}
        subPartners={subPartners}
        onSavePlatforms={handleSavePlatformsFromAdmin}
        onSaveConfig={handleSaveConfigFromAdmin}
        onUpdateSubPartnerStatus={handleUpdateSubPartnerStatus}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* 1. Geo Top Banner */}
      <TopBanner geo={geo} bannerTemplate={config.topBannerTemplate} activeUrgencyTimer={activeUrgencyTimer} />

      {/* Social Media VIP Channels Banner */}
      <SocialMediaBar config={config} variant="banner" />

      {/* Main Container */}
      <main className="pb-16">
        {/* 2. Hero Section */}
        <HeroSection
          headline={config.heroHeadline}
          subheading={config.heroSubheading}
          onScrollToOffers={scrollToOffers}
          onOpenEmailChecker={() => setShowEmailCheckerModal(true)}
          abTestConfig={config.abTestConfig}
        />

        {/* 3. Top 3 Featured Carousel / Cards */}
        <TopThreeCarousel
          platforms={platforms}
          onClaimClick={handleClaimClick}
          onCopyCode={handleCopyCode}
          onOpenQrModal={(p) => setSelectedQrPlatform(p)}
          onOpenFeedbackModal={(p) => setSelectedFeedbackPlatform(p)}
        />

        {/* Floating Action Launchers */}
        <div className="max-w-7xl mx-auto px-4 my-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowEmailCheckerModal(true)}
            className="px-6 py-3 rounded-full bg-slate-900 border border-purple-500/50 hover:border-purple-400 text-purple-300 font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-950/40 flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-transform"
          >
            <Mail className="w-4 h-4 text-purple-400" />
            <span>CHECK EMAIL ELIGIBILITY (GET 500% BONUS)</span>
          </button>

          {config.enableLuckyWheel && (
            <button
              onClick={() => setShowWheelModal(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 font-black text-xs sm:text-sm text-white shadow-xl shadow-purple-600/30 flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>SPIN LUCKY WHEEL FOR EXTRA 500% BONUS!</span>
            </button>
          )}

          {config.enableSubPartnerProgram !== false && (
            <button
              onClick={() => setShowSubPartnerModal(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 font-black text-xs sm:text-sm text-white shadow-xl shadow-cyan-600/30 flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-transform"
            >
              <Users className="w-4 h-4 text-cyan-200" />
              <span>BECOME SUB-PARTNER (EARN 50% REVSHARE)</span>
            </button>
          )}
        </div>

        <Suspense fallback={<div className="h-20" />}>
          {/* 4. Standalone Custom Coupons Section */}
          {config.customCoupons && config.customCoupons.length > 0 && (
            <CustomCouponsSection
              coupons={config.customCoupons}
              onClaimCoupon={(c) => {
                trackEvent('click', c.id);
              }}
            />
          )}

          {/* 5. Complete Offers Directory */}
          <OfferGrid
            platforms={platforms}
            onClaimClick={handleClaimClick}
            onCopyCode={handleCopyCode}
            onSubPartnerClick={() => setShowSubPartnerModal(true)}
            onOpenQrModal={(p) => setSelectedQrPlatform(p)}
            onOpenFeedbackModal={(p) => setSelectedFeedbackPlatform(p)}
          />

          {/* 6. SEO Article & Keyword Index Table */}
          <SeoContentSection
            platforms={platforms}
            customCoupons={config.customCoupons || []}
            onClaimClick={handleClaimClick}
          />

          {/* 7. FAQ Section */}
          <FaqSection />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-10 px-4 text-center text-slate-400 text-xs">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>VIP Rewards Gaming Affiliate Portal &copy; 2026</span>
          </div>

          {/* Social Media Footer Icons */}
          <div className="flex justify-center py-2">
            <SocialMediaBar config={config} variant="footer" />
          </div>

          <p className="max-w-3xl mx-auto leading-relaxed text-slate-400 text-[11px]">
            This site is an independent gaming review and affiliate portal. We provide promotional bonus codes and reviews for licensed online gaming and sports platforms. Please gamble responsibly. 18+ Only.
          </p>

          <div className="flex items-center justify-center gap-4 text-[11px] pt-2">
            <button
              onClick={() => setShowSubPartnerModal(true)}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1 rounded-md border border-cyan-500/30"
            >
              <Users className="w-3 h-3" /> Become a Sub-Partner Agent
            </button>

            {/* Stealth Admin Access - If hideAdminLink is true, render a subtle lock icon button */}
            {config.hideAdminLink ? (
              <button
                onClick={() => {
                  if (adminToken) {
                    setViewingAdmin(true);
                  } else {
                    setShowAdminLogin(true);
                  }
                }}
                className="opacity-20 hover:opacity-100 transition-opacity p-1 text-slate-600 hover:text-amber-400 cursor-pointer"
                title="Secret Admin Access (or press Ctrl+Shift+A)"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (adminToken) {
                    setViewingAdmin(true);
                  } else {
                    setShowAdminLogin(true);
                  }
                }}
                className="text-slate-400 hover:text-amber-400 underline flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3" /> Admin Portal
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Pop-up Modals & Floating Components */}
      <Suspense fallback={null}>
        {showEmailCheckerModal && (
          <EmailCheckerModal
            platforms={platforms}
            onClose={() => setShowEmailCheckerModal(false)}
            onProceedToClaim={handleClaimClick}
          />
        )}

        {showWheelModal && (
          <LuckyWheelModal
            platforms={platforms}
            config={config}
            onClaimPrize={handleWheelClaimPrize}
            onClose={() => setShowWheelModal(false)}
          />
        )}

        {showSubPartnerModal && (
          <SubPartnerModal
            platforms={platforms}
            onClose={() => setShowSubPartnerModal(false)}
            onSubmitApplication={handleSubmitSubPartner}
          />
        )}

        {showAdminLogin && (
          <AdminLoginModal
            onLogin={handleAdminLogin}
            onClose={() => setShowAdminLogin(false)}
          />
        )}

        {/* QR Code Continuation Modal */}
        {selectedQrPlatform && (
          <ClaimWithQrModal
            platform={selectedQrPlatform}
            isOpen={!!selectedQrPlatform}
            onClose={() => setSelectedQrPlatform(null)}
            onProceedDesktop={() => {
              const p = selectedQrPlatform;
              setSelectedQrPlatform(null);
              handleClaimClick(p);
            }}
          />
        )}

        {/* Community Feedback & Review Modal */}
        {selectedFeedbackPlatform && (
          <PlatformFeedbackModal
            platform={selectedFeedbackPlatform}
            approvedFeedbacks={config?.approvedFeedbacks?.filter(f => f.isApproved) || []}
            isOpen={!!selectedFeedbackPlatform}
            onClose={() => setSelectedFeedbackPlatform(null)}
            onSubmitFeedback={handleSubmitFeedback}
          />
        )}

        {/* Exit-Intent Popup Modal */}
        {platforms.length > 0 && (
          <ExitIntentModal
            topPlatform={platforms.find(p => p.isFeatured && p.isActive) || platforms[0]}
            onClaimClick={handleClaimClick}
            onCopyCode={handleCopyCode}
          />
        )}
      </Suspense>

      {/* Live Winners Toast Ticker */}
      <LiveWinnersTicker
        initialWinners={fakeWinners}
        enabled={config.enableLiveWinnersTicker}
      />
    </div>
  );
}
