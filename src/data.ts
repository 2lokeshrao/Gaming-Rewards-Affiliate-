import { GamingPlatform, GlobalConfig, WinnerTickerItem } from './types';

export const initialGlobalConfig: GlobalConfig = {
  heroHeadline: "Stop Wasting Money on Unverified Sites. Claim Your 100% Guaranteed Welcome Bonuses",
  heroSubheading: "Verified, licensed platforms with instant withdrawals, high RTP slots, and up to $1,500 + 500% first deposit bonuses.",
  topBannerTemplate: "🔥 Top Verified Gaming Sites available in {{country}} today!",
  enableLuckyWheel: true,
  enableLiveWinnersTicker: true,
  enableBotCloaking: true,
  enableSubPartnerProgram: true,
  subPartnerHeadline: "Become an Official Gaming Sub-Partner & Earn 45%-50% Lifetime RevShare",
  featuredPrizePlatformId: "1win",
  featuredPromoCode: "VIPBONUS500",
  wheelBonusText: "500% WELCOME BONUS + 200 FREE SPINS",
  // Standalone Custom Coupons
  customCoupons: [
    {
      id: "coupon_ipl2026",
      brandName: "Megapari",
      title: "IPL 2026 Cricket Special 100% Free Bet",
      code: "MEGACRICKET500",
      description: "Get 100% risk-free cricket bet up to ₹10,000 / $150 + 50 free spins on registration.",
      targetUrl: "https://megapari.com/?ref=VIPCRICKET",
      category: "Cricket & Sports",
      badgeText: "IPL 2026 SPECIAL",
      isActive: true,
      metaTitle: "Megapari Promo Code MEGACRICKET500 | Free Bet 2026",
      metaDescription: "Claim 100% risk free cricket bet with code MEGACRICKET500 on Megapari.",
      clicksCount: 340,
      copiesCount: 210
    },
    {
      id: "coupon_melbet",
      brandName: "Melbet",
      title: "Melbet Mega Deposit Boost 200%",
      code: "MELVIPMAX",
      description: "Unlock 200% first deposit bonus up to $250 + instant VIP cashback.",
      targetUrl: "https://melbet.com/?tag=VIPPROMO",
      category: "Casino & Slots",
      badgeText: "LIMITED TIME",
      isActive: true,
      metaTitle: "Melbet Promo Code MELVIPMAX | 200% Deposit Bonus",
      metaDescription: "Get official Melbet promo code MELVIPMAX for 200% deposit bonus.",
      clicksCount: 280,
      copiesCount: 175
    }
  ],
  // Tracking Pixels & Feedback
  globalTrackingPixels: {
    platformId: 'global',
    facebookPixelId: '123456789012345',
    googleAnalyticsId: 'G-MEASUREMENT123'
  },
  approvedFeedbacks: [
    {
      id: "fb_1",
      platformId: "1win",
      platformName: "1Win",
      userName: "Alex R.",
      rating: 5,
      comment: "Used promo code MAXBOOST500 during sign up and got 500% deposit bonus instantly! Instant UPI withdrawal worked in 5 minutes.",
      createdAt: "2026-08-09T14:30:00.000Z",
      isApproved: true
    },
    {
      id: "fb_2",
      platformId: "mostbet",
      platformName: "Mostbet",
      userName: "Rahul K.",
      rating: 5,
      comment: "Great odds on IPL matches and fast customer support via Telegram. Code works 100%.",
      createdAt: "2026-08-08T18:20:00.000Z",
      isApproved: true
    },
    {
      id: "fb_3",
      platformId: "stake",
      platformName: "Stake.com",
      userName: "Marco P.",
      rating: 4,
      comment: "VIP rakeback and instant crypto payout. Smooth registration experience.",
      createdAt: "2026-08-07T09:15:00.000Z",
      isApproved: true
    }
  ],
  // Social Media Channels
  telegramUrl: "https://t.me/BonusPromoCodeOfficial",
  instagramUrl: "https://instagram.com/bonuspromocode",
  tiktokUrl: "https://tiktok.com/@bonuspromocode",
  whatsappGroupUrl: "https://chat.whatsapp.com/BonusPromoCodeClub",
  youtubeUrl: "https://youtube.com/@BonusPromoCode",
  // FCM Push Notifications & A/B Testing Defaults
  pushNotifications: [
    {
      id: "pn_101",
      title: "🔥 500% FLASH BONUS ACTIVATED!",
      body: "Use promo code MAXBOOST500 on 1Win now. Extra 50 Free Spins ends in 1 hour!",
      type: "flash_bonus",
      targetPlatformId: "1win",
      targetPlatformName: "1Win",
      sentAt: "2026-08-10T08:00:00.000Z",
      recipientCount: 1420,
      promoCode: "MAXBOOST500",
      actionUrl: "/go/1win"
    },
    {
      id: "pn_102",
      title: "⚡ NEW ARRIVAL: Megapari 200% VIP Pass",
      body: "Exclusive code MEGAPRO200 is now live for instant casino & sports betting.",
      type: "new_arrival",
      targetPlatformId: "megapari",
      targetPlatformName: "Megapari",
      sentAt: "2026-08-09T16:30:00.000Z",
      recipientCount: 980,
      promoCode: "MEGAPRO200",
      actionUrl: "/go/megapari"
    }
  ],
  abTestConfig: {
    enabled: true,
    heroDesign: "variant_a",
    buttonColor: "amber",
    stats: {
      variantAViews: 3420,
      variantBViews: 3180,
      variantAClicks: 890,
      variantBClicks: 1140
    }
  },
  partnerPanelConfigs: [
    {
      platformId: "1win",
      platformName: "1Win Casino & Sports",
      apiKey: "1WIN_AFF_883921_SECRET",
      partnerApiUrl: "https://api.1win-partners.com/v2/stats",
      affiliateId: "1WIN_883921",
      postbackKey: "pb_1win_2026_xyz",
      syncEnabled: true,
      lastSyncedAt: new Date().toISOString(),
      stats: {
        totalRegistrations: 642,
        ftdCount: 418,
        totalDepositsAmount: 24850,
        netGamingRevenue: 18420,
        commissionEarned: 9210,
        revSharePercent: 50
      }
    },
    {
      platformId: "mostbet",
      platformName: "Mostbet Official",
      apiKey: "MOSTBET_KEY_992014",
      partnerApiUrl: "https://mostbet-partners.com/api/v1/reports",
      affiliateId: "MOST_992014",
      postbackKey: "pb_mostbet_882",
      syncEnabled: true,
      lastSyncedAt: new Date().toISOString(),
      stats: {
        totalRegistrations: 415,
        ftdCount: 260,
        totalDepositsAmount: 14200,
        netGamingRevenue: 11500,
        commissionEarned: 5175,
        revSharePercent: 45
      }
    },
    {
      platformId: "pinup",
      platformName: "Pin-Up Casino",
      apiKey: "PINUP_SECRET_44210",
      partnerApiUrl: "https://pin-up.partners/api/stats",
      affiliateId: "PINUP_44210",
      postbackKey: "pb_pinup_993",
      syncEnabled: true,
      lastSyncedAt: new Date().toISOString(),
      stats: {
        totalRegistrations: 380,
        ftdCount: 245,
        totalDepositsAmount: 12800,
        netGamingRevenue: 9800,
        commissionEarned: 4410,
        revSharePercent: 45
      }
    },
    {
      platformId: "1xbet",
      platformName: "1xBet Partners",
      apiKey: "1XBET_API_77391",
      partnerApiUrl: "https://1xbet-partners.com/api/statistics",
      affiliateId: "1X_77391",
      postbackKey: "pb_1x_1029",
      syncEnabled: true,
      lastSyncedAt: new Date().toISOString(),
      stats: {
        totalRegistrations: 290,
        ftdCount: 185,
        totalDepositsAmount: 9400,
        netGamingRevenue: 7200,
        commissionEarned: 2880,
        revSharePercent: 40
      }
    }
  ],
  // Security & Admin Link Hiding
  hideAdminLink: true,
  secretKeyTrigger: "Ctrl+Shift+A",
  // Email Eligibility Checker Settings
  strictEmailChecking: true,
  registeredEmailsList: [
    "lokeshrao050@gmail.com",
    "user@example.com",
    "test@gmail.com",
    "admin@1win.com",
    "player1@gmail.com"
  ]
};

export const initialPlatforms: GamingPlatform[] = [
  {
    id: "1win",
    slug: "1win",
    name: "1Win Casino & Sports",
    logoUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=160&auto=format&fit=crop&q=80",
    rating: 9.9,
    starRating: 5,
    badges: ["Instant UPI/Pix/Crypto", "No KYC Required", "24/7 Live Support", "High RTP Slots"],
    bonusText: "Get 500% Welcome Bonus + 100 Free Spins",
    promoCode: "MAXBOOST500",
    rawAffiliateUrl: "https://1win.pro/?open=register&p=PROMO123",
    masterPartnerUrl: "https://1win.run/affiliates?ref=MASTER_SUB_PARTNER",
    isFeatured: true,
    featuredRank: 1, // Gold
    isActive: true,
    clicksCount: 1420,
    copiesCount: 890,
    category: "Casino & Sportsbook",
    reviewContent: `
      # 1Win Casino & Sports Review 2026
      1Win is an industry-leading online gaming hub offering over 10,000 slots, live casino tables, crash games (Aviator, JetX), and sports betting.
      
      ### Key Highlights
      - **Instant Payouts:** Fast processing via UPI, Pix, USDT, Crypto, and Visa/Mastercard.
      - **Huge Welcome Bonus:** Up to 500% on first 4 deposits.
      - **Anonymity:** Fast 1-click registration without lengthy verification.
    `
  },
  {
    id: "mostbet",
    slug: "mostbet",
    name: "Mostbet Official",
    logoUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=160&auto=format&fit=crop&q=80",
    rating: 9.7,
    starRating: 5,
    badges: ["Fast Deposit Boost", "125% Sports Bonus", "Fast Cashouts", "Licensed Platform"],
    bonusText: "125% Bonus up to $300 + 250 Free Spins",
    promoCode: "MOSTBONUSVIP",
    rawAffiliateUrl: "https://mostbet.com/signup?partner=VIPGAMES",
    masterPartnerUrl: "https://mostbet.com/partner_program?ref=MASTER_SUB_PARTNER",
    isFeatured: true,
    featuredRank: 2, // Silver
    isActive: true,
    clicksCount: 1105,
    copiesCount: 630,
    category: "Sportsbook & Slots",
    reviewContent: `
      # Mostbet Review
      Mostbet provides incredible sports odds, esports wagering, and top-tier slot provider integrations.
      
      ### Why Choose Mostbet?
      - 24/7 Customer Care
      - Express bet boosts up to 40% extra winnings.
    `
  },
  {
    id: "pinup",
    slug: "pinup",
    name: "Pin-Up Casino",
    logoUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=160&auto=format&fit=crop&q=80",
    rating: 9.6,
    starRating: 5,
    badges: ["250 Free Spins", "Daily Cashback 10%", "Instant E-Wallets"],
    bonusText: "120% Bonus + 250 Free Spins on 1st Deposit",
    promoCode: "PINUPVIP2026",
    rawAffiliateUrl: "https://pin-up.casino/?promo=PINUPSUPER",
    masterPartnerUrl: "https://pin-up.partners/?ref=MASTER_SUB_PARTNER",
    isFeatured: true,
    featuredRank: 3, // Bronze
    isActive: true,
    clicksCount: 880,
    copiesCount: 410,
    category: "Live Casino & Slots",
    reviewContent: `
      # Pin-Up Casino Review
      Retro themed casino with ultra modern payment methods and fast withdrawals.
    `
  },
  {
    id: "stake",
    slug: "stake",
    name: "Stake Crypto Casino",
    logoUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=160&auto=format&fit=crop&q=80",
    rating: 9.5,
    starRating: 5,
    badges: ["Zero Fee Withdrawals", "VIP Rakeback", "Instant Crypto"],
    bonusText: "200% Deposit Match + VIP Level Up Boost",
    promoCode: "STAKEPRO2026",
    rawAffiliateUrl: "https://stake.com/?c=VIPPROMO",
    masterPartnerUrl: "https://stake.com/affiliates?ref=MASTER_SUB_PARTNER",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 750,
    copiesCount: 320,
    category: "Crypto Gaming",
    reviewContent: `
      # Stake.com Official Partner
      The world's biggest crypto casino with provably fair games and instant payouts.
    `
  },
  {
    id: "bcgame",
    slug: "bcgame",
    name: "BC.Game VIP",
    logoUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=160&auto=format&fit=crop&q=80",
    rating: 9.4,
    starRating: 5,
    badges: ["180% First Deposit", "Daily Spin Rewards", "No Limits"],
    bonusText: "Up to 360% Deposit Match across 4 deposits",
    promoCode: "BCVIPWIN",
    rawAffiliateUrl: "https://bc.game/i-VIPWIN-n/",
    masterPartnerUrl: "https://bc.game/affiliate?ref=MASTER_SUB_PARTNER",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 620,
    copiesCount: 290,
    category: "Crypto & Crash Games"
  },
  {
    id: "parimatch",
    slug: "parimatch",
    name: "Parimatch Global",
    logoUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=160&auto=format&fit=crop&q=80",
    rating: 9.3,
    starRating: 4,
    badges: ["Cricket & Football Odds", "UPI / NetBanking", "Official Sponsor"],
    bonusText: "150% Sports Bonus up to $200",
    promoCode: "PARIBONUS",
    rawAffiliateUrl: "https://parimatch.com/?btag=VIP123",
    masterPartnerUrl: "https://parimatch.com/affiliates?ref=MASTER_SUB_PARTNER",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 540,
    copiesCount: 180,
    category: "Sportsbook"
  }
];

export const initialFakeWinners: WinnerTickerItem[] = [
  { id: "1", userName: "Alex M.", amount: "$450", platformName: "1Win", country: "United States", flagEmoji: "🇺🇸", timeAgo: "12s ago" },
  { id: "2", userName: "Rahul S.", amount: "500% Bonus", platformName: "Mostbet", country: "India", flagEmoji: "🇮🇳", timeAgo: "34s ago" },
  { id: "3", userName: "Lucas R.", amount: "R$ 1,200", platformName: "Pin-Up", country: "Brazil", flagEmoji: "🇧🇷", timeAgo: "1m ago" },
  { id: "4", userName: "David K.", amount: "$1,850", platformName: "1Win", country: "Canada", flagEmoji: "🇨🇦", timeAgo: "2m ago" },
  { id: "5", userName: "Elena P.", amount: "€600", platformName: "Stake", country: "Germany", flagEmoji: "🇩🇪", timeAgo: "3m ago" },
  { id: "6", userName: "Tariq A.", amount: "1,500 AED", platformName: "1Win", country: "UAE", flagEmoji: "🇦🇪", timeAgo: "4m ago" },
  { id: "7", userName: "Mateo G.", amount: "$920", platformName: "BC.Game", country: "Mexico", flagEmoji: "🇲🇽", timeAgo: "5m ago" }
];

export const sampleFaqs = [
  {
    q: "How do I claim my exclusive deposit bonus?",
    a: "Select your preferred platform from our verified list, copy the promo code by clicking 'COPY', then click 'Claim Bonus Now'. Enter the promo code during sign-up to unlock your bonus automatically."
  },
  {
    q: "Are all listed platforms safe and verified?",
    a: "Yes! Every platform featured on our site undergoes strict audit checks for active licensing (e.g. Curacao, MGA), withdrawal speed, SSL encryption, and fair RNG gaming algorithms."
  },
  {
    q: "How fast are withdrawals processed?",
    a: "Most platforms support instant local payment methods (UPI, Pix, Crypto, E-Wallets) with withdrawal processing times ranging from instant up to 15 minutes."
  },
  {
    q: "Do I need KYC verification to start playing?",
    a: "Many of our top-ranked platforms (like 1Win and Stake) allow instant 1-click registration and fast gameplay without mandatory identity verification for initial small payouts."
  },
  {
    q: "Is the Lucky Wheel bonus guaranteed?",
    a: "Yes, every spin on our Lucky Wheel guarantees an exclusive high-tier VIP bonus code that unlocks extra spins and cash deposit matches."
  }
];
