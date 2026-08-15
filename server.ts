import DOMPurify from 'isomorphic-dompurify';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import * as admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import jwt from 'jsonwebtoken';
import { GoogleGenAI, Type } from '@google/genai';
import { initialGlobalConfig, initialPlatforms, initialFakeWinners } from './src/data';
import { GamingPlatform, GlobalConfig, AnalyticsStats, TrackLog, SubPartnerApplication } from './src/types';
import rateLimit from 'express-rate-limit';

const app = express();
app.disable('x-powered-by');
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE;

if (!JWT_SECRET || !ADMIN_PASSCODE) {
  console.error("FATAL ERROR: JWT_SECRET or ADMIN_PASSCODE environment variables are missing.");
  process.exit(1);
}

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

// Initialize Firebase
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firestoreDb: any = null;
try {
  if (fs.existsSync(firebaseConfigPath)) {
    const config = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
    const appInfo = admin.initializeApp({
      projectId: config.projectId,
    });
    if (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') {
      firestoreDb = getFirestore(appInfo, config.firestoreDatabaseId);
    } else {
      firestoreDb = getFirestore();
    }
  } else {
    admin.initializeApp();
    firestoreDb = getFirestore();
  }
  console.log("Firebase initialized successfully");
} catch (e) {
  console.error("Firebase init error:", e);
}


// In-Memory Database State
let statePlatforms: GamingPlatform[] = [...initialPlatforms];
let stateConfig: GlobalConfig = { ...initialGlobalConfig };
let stateFakeWinners = [...initialFakeWinners];

let stateSubPartners: SubPartnerApplication[] = [
  {
    id: "sub_1",
    fullName: "Rahul Sharma",
    email: "rahul.telegram@example.com",
    whatsapp: "+91 98765 43210",
    platformId: "1win",
    platformName: "1Win Casino & Sports",
    trafficSource: "Telegram Channel (45k Members)",
    estimatedMonthlyPlayers: "100 - 300 Players / Month",
    status: "approved",
    appliedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sub_2",
    fullName: "Alex Miller",
    email: "alex.affiliate@example.com",
    whatsapp: "+1 555 019 2831",
    platformId: "mostbet",
    platformName: "Mostbet Official",
    trafficSource: "YouTube Gaming Reviews",
    estimatedMonthlyPlayers: "50 - 150 Players / Month",
    status: "pending",
    appliedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  }
];

import fs from 'fs';
const DB_FILE = path.join(process.cwd(), 'database.json');

function saveState() {
  const data = { statePlatforms, stateConfig, stateFakeWinners, stateSubPartners };
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Save state error:", e);
  }
}

try {
  if (fs.existsSync(DB_FILE)) {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (data.statePlatforms) statePlatforms = data.statePlatforms;
    if (data.stateConfig) stateConfig = data.stateConfig;
    if (data.stateFakeWinners) stateFakeWinners = data.stateFakeWinners;
    if (data.stateSubPartners) stateSubPartners = data.stateSubPartners;
    console.log("Loaded state from database.json");
  }
} catch (e) {
  console.error("Load state error:", e);
}


let stateCustomPages: any[] = [];
let stateStats: AnalyticsStats = {
  totalVisits: 1820,
  totalClicks: 840,
  totalPromoCopies: 490,
  totalWheelSpins: 310,
  totalSubPartnerApps: 2,
  platformStats: {},
  dailyTrends: [
    { date: 'Aug 04', clicks: 120, conversions: 40 },
    { date: 'Aug 05', clicks: 150, conversions: 55 },
    { date: 'Aug 06', clicks: 180, conversions: 60 },
    { date: 'Aug 07', clicks: 140, conversions: 45 },
    { date: 'Aug 08', clicks: 200, conversions: 80 },
    { date: 'Aug 09', clicks: 250, conversions: 95 },
    { date: 'Aug 10', clicks: 310, conversions: 120 }
  ]
};

let stateTrackLogs: TrackLog[] = [
  {
    id: "log_1",
    eventType: "click",
    platformId: "1win",
    platformName: "1Win Casino",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    country: "United States",
    ip: "127.0.0.1",
    userAgent: "Mozilla/5.0"
  },
  {
    id: "log_2",
    eventType: "copy",
    platformId: "mostbet",
    platformName: "Mostbet Official",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    country: "India",
    ip: "127.0.0.1",
    userAgent: "Mozilla/5.0"
  }
];

// Helper to detect country from IP / headers
function getGeoFromRequest(req: Request) {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
  const countryHeader = (req.headers['cf-ipcountry'] as string) || (req.headers['x-appengine-country'] as string);

  if (countryHeader && countryHeader !== 'XX') {
    return {
      country: countryHeader === 'IN' ? 'India' : countryHeader === 'US' ? 'United States' : countryHeader === 'BR' ? 'Brazil' : countryHeader,
      countryCode: countryHeader,
      city: 'Detected City',
      ip,
      flag: countryHeader === 'IN' ? '🇮🇳' : countryHeader === 'US' ? '🇺🇸' : countryHeader === 'BR' ? '🇧🇷' : '🌐'
    };
  }

  // Fallback defaults
  return {
    country: 'United States',
    countryCode: 'US',
    city: 'Global Region',
    ip: ip === '::1' ? '127.0.0.1' : ip,
    flag: '🇺🇸'
  };
}

// Bot Detection Regex for Cloaking
const BOT_USER_AGENTS = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|pinterestbot|slackbot|vkShare|W3C_Validator|AdsBot-Google|Mediapartners-Google|Lighthouse/i;

// Auth Middleware
function verifyJwtToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Brute-force Login Protection & Rate-Limiting Tracker
const loginAttemptTracker: Record<string, { attempts: number[]; lockUntil: number }> = {};
const checkedEmails = new Set<string>();

// Rate Limiting Middleware for Admin Login
const adminLoginRateLimiter = (req: Request, res: Response, next: Function) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minute sliding window
  const maxAttempts = 5; // Max 5 login attempts per 15 mins

  if (!loginAttemptTracker[clientIp]) {
    loginAttemptTracker[clientIp] = { attempts: [], lockUntil: 0 };
  }

  const record = loginAttemptTracker[clientIp];

  // Check active lockout
  if (record.lockUntil > now) {
    const remainingSeconds = Math.ceil((record.lockUntil - now) / 1000);
    res.setHeader('Retry-After', remainingSeconds);
    res.setHeader('X-RateLimit-Limit', maxAttempts);
    res.setHeader('X-RateLimit-Remaining', 0);
    return res.status(429).json({
      success: false,
      message: `🔒 BRUTE-FORCE LOCKOUT: Too many failed admin login attempts from IP ${clientIp}. Access blocked for ${remainingSeconds} seconds.`
    });
  }

  // Filter attempts within the sliding window
  record.attempts = record.attempts.filter(timestamp => now - timestamp < windowMs);

  if (record.attempts.length >= maxAttempts) {
    record.lockUntil = now + 15 * 60 * 1000; // 15 minute lock
    res.setHeader('Retry-After', 900);
    return res.status(429).json({
      success: false,
      message: `🔒 RATE LIMIT EXCEEDED: 5 failed attempts reached from IP ${clientIp}. Blocked for 15 minutes.`
    });
  }

  res.setHeader('X-RateLimit-Limit', maxAttempts);
  res.setHeader('X-RateLimit-Remaining', maxAttempts - record.attempts.length);
  next();
};

// Login Handler Function
const handleAdminLogin = (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
  const record = loginAttemptTracker[clientIp] || { attempts: [], lockUntil: 0 };
  const { password } = req.body;

  if (password === ADMIN_PASSCODE) {
    // Successful login -> Reset rate limiter record
    loginAttemptTracker[clientIp] = { attempts: [], lockUntil: 0 };
    const token = jwt.sign({ role: 'admin', authAt: Date.now() }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ success: true, token });
  } else {
    record.attempts.push(Date.now());
    if (record.attempts.length >= 5) {
      record.lockUntil = Date.now() + 15 * 60 * 1000;
    }
    loginAttemptTracker[clientIp] = record;

    // Introduce security delay to thwart dictionary timing attacks
    setTimeout(() => {
      const remaining = 5 - record.attempts.length;
      return res.status(401).json({
        success: false,
        message: record.attempts.length >= 5
          ? '🔒 Account locked for 15 minutes due to 5 failed password attempts.'
          : `Invalid passcode! Security Warning: ${remaining} attempt(s) remaining before IP lockout.`
      });
    }, 500);
  }
};

// API: Login Endpoints (supports both /api/auth/login and /api/admin/login)
app.post('/api/auth/login', adminLoginRateLimiter, handleAdminLogin);
app.post('/api/admin/login', adminLoginRateLimiter, handleAdminLogin);

// API: Email Eligibility & Duplicate Check
app.post('/api/check-email', (req, res) => {
  const { email, platformId } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

    if (req.body.forceMarkRegistered) {
    return res.status(403).json({ error: 'Manual registration marking is disabled' });
  }
  const cleanEmail = email.trim().toLowerCase();
  const platform = statePlatforms.find(p => p.id === platformId) || statePlatforms[0];

  const registeredList = stateConfig.registeredEmailsList || [
    "user@example.com",
    "test@gmail.com",
    "admin@1win.com"
  ];

  // Check if email exists in list or matches keywords/checkedEmails
  const isExplicitlyRegistered = registeredList.some(registered =>
    cleanEmail === registered.toLowerCase() || cleanEmail.includes(registered.toLowerCase())
  );

  const hasExisting = isExplicitlyRegistered ||
    checkedEmails.has(cleanEmail) ||
    cleanEmail.includes('old') ||
    cleanEmail.includes('1win') ||
    cleanEmail.includes('user') ||
    cleanEmail.includes('exist') ||
    cleanEmail.includes('lokesh');

  checkedEmails.add(cleanEmail);

  if (hasExisting) {
    return res.json({
      email: cleanEmail,
      hasExistingAccount: true,
      platformName: platform?.name || 'Gaming Platform',
      message: `An account associated with '${cleanEmail}' is already registered on ${platform?.name || 'this platform'}.`,
      recommendedAction: `To guarantee your 500% Welcome Bonus & 200 Free Spins, please create your account using a NEW EMAIL ADDRESS or fresh mobile number.`
    });
  } else {
    return res.json({
      email: cleanEmail,
      hasExistingAccount: false,
      platformName: platform?.name || 'Gaming Platform',
      message: `Good news! '${cleanEmail}' is 100% fresh and eligible for the maximum 500% Welcome Bonus package.`,
      recommendedAction: `Proceed to official registration now with promo code ${platform?.promoCode || 'VIPBONUS500'}.`
    });
  }
});


// API: S2S Postback (Webhook) Route for Affiliate Networks
app.get('/api/postback/:platform', async (req, res) => {
  const secret = req.query.secret || req.query.key;
  const platform = statePlatforms.find(p => p.id === req.params.platform || p.slug === req.params.platform);

  if (!platform || !secret || secret !== (platform as any).postbackKey) {
    return res.status(403).send('Forbidden');
  }

  const reqPlatform = req.params.platform;
  const { click_id, event, player, sum, currency, ...otherParams } = req.query;

  const postbackData = {
    platform: reqPlatform,
    click_id: click_id || null,
    event: event || 'unknown',
    player_id: player || null,
    sum: sum ? parseFloat(sum as string) : 0,
    currency: currency || null,
    rawQuery: req.query,
    receivedAt: new Date().toISOString()
  };

  try {
    if (firestoreDb) {
      await firestoreDb.collection('s2s_postbacks').add({
        ...postbackData,
        timestamp: FieldValue.serverTimestamp()
      });
      console.log(`Saved S2S postback for ${reqPlatform} to Firestore.`);
    } else {
      console.log("Firestore DB not initialized, postback only in memory");
    }
    
    // Also push to local state for temporary viewing in admin
    stateTrackLogs.unshift({
      id: `pb_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      eventType: 'visit' as any,
      platformId: platform.id,
      platformName: platform.name,
      timestamp: new Date().toISOString(),
      country: 'S2S',
      ip: 'Server',
      userAgent: 'S2S Webhook'
    });
    if (stateTrackLogs.length > 100) stateTrackLogs.pop();
    
    // We must return 200 OK so the network knows we received it
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error saving postback:', error);
    res.status(500).send('Error');
  }
});

// API: Get Public Data
app.get('/api/data', (req, res) => {
  stateStats.totalVisits += 1;
  const geo = getGeoFromRequest(req);

  const safePlatforms = statePlatforms.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    logoUrl: p.logoUrl,
    rating: p.rating,
    starRating: p.starRating,
    badges: p.badges,
    bonusText: p.bonusText,
    promoCode: p.promoCode,
    isFeatured: p.isFeatured,
    featuredRank: p.featuredRank,
    isActive: p.isActive,
    category: p.category
  }));

  const safeConfig = {
    heroHeadline: stateConfig.heroHeadline,
    heroSubheading: stateConfig.heroSubheading,
    topBannerTemplate: stateConfig.topBannerTemplate,
    enableLuckyWheel: stateConfig.enableLuckyWheel,
    enableLiveWinnersTicker: stateConfig.enableLiveWinnersTicker,
    enableSubPartnerProgram: stateConfig.enableSubPartnerProgram,
    subPartnerHeadline: stateConfig.subPartnerHeadline,
    featuredPrizePlatformId: stateConfig.featuredPrizePlatformId,
    featuredPromoCode: stateConfig.featuredPromoCode,
    wheelBonusText: stateConfig.wheelBonusText,
    customCoupons: stateConfig.customCoupons,
    approvedFeedbacks: stateConfig.approvedFeedbacks,
    pushNotifications: stateConfig.pushNotifications,
    abTestConfig: stateConfig.abTestConfig,
    sidebarAdHtml: stateConfig.sidebarAdHtml,
    telegramUrl: stateConfig.telegramUrl,
    instagramUrl: stateConfig.instagramUrl,
    tiktokUrl: stateConfig.tiktokUrl,
    whatsappGroupUrl: stateConfig.whatsappGroupUrl,
    youtubeUrl: stateConfig.youtubeUrl,
    articles: stateConfig.articles,
    footerColumns: stateConfig.footerColumns,
    copyrightText: stateConfig.copyrightText,
    footerDisclaimerText: stateConfig.footerDisclaimerText,
    autoBlogSettings: stateConfig.autoBlogSettings
  };

  res.json({
    platforms: safePlatforms,
    config: safeConfig,
    fakeWinners: stateFakeWinners,
    geo
  });
});

// API: Get Full Admin State
app.get('/api/admin/data', verifyJwtToken, (req, res) => {
  const geo = getGeoFromRequest(req);
  res.json({
    platforms: statePlatforms,
    config: stateConfig,
    stats: stateStats,
    fakeWinners: stateFakeWinners,
    logs: stateTrackLogs,
    subPartners: stateSubPartners,
    customPages: stateCustomPages,
    geo
  });
});

// API: Submit Sub-Partner Application
app.post('/api/sub-partners', (req, res) => {
  const { fullName, email, whatsapp, platformId, platformName, trafficSource, estimatedMonthlyPlayers } = req.body;

  if (!fullName || !email || !whatsapp) {
    return res.status(400).json({ error: 'Name, email, and WhatsApp number are required' });
  }

  const newApp: SubPartnerApplication = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    fullName,
    email,
    whatsapp,
    platformId: platformId || '1win',
    platformName: platformName || '1Win Casino',
    trafficSource: trafficSource || 'Social Media',
    estimatedMonthlyPlayers: estimatedMonthlyPlayers || '50-100 Players',
    status: 'pending',
    appliedAt: new Date().toISOString()
  };

  stateSubPartners.unshift(newApp);
  stateStats.totalSubPartnerApps = (stateStats.totalSubPartnerApps || 0) + 1;

  res.json({ success: true, application: newApp });
});

// API: Update Sub-Partner Status (Protected)
app.patch('/api/admin/sub-partners/:id', verifyJwtToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const appItem = stateSubPartners.find(s => s.id === id);
  if (!appItem) {
    return res.status(404).json({ error: 'Sub-partner application not found' });
  }

  if (status) {
    appItem.status = status;
  }

  res.json({ success: true, application: appItem });
});

// API: Save Platforms (Protected)
app.post('/api/admin/platforms', verifyJwtToken, (req, res) => {
  const { platforms } = req.body;
  if (Array.isArray(platforms)) {
    statePlatforms = platforms; saveState();
    return res.json({ success: true, platforms: statePlatforms });
  }
  return res.status(400).json({ error: 'Invalid platform data array' });
});

// API: Save Config (Protected)

app.post('/api/admin/custom-pages', verifyJwtToken, express.json(), (req, res) => {
  const { pages } = req.body;
  if (Array.isArray(pages)) {
    stateCustomPages = pages;
  }
  res.json({ success: true });
});

app.post('/api/admin/config', verifyJwtToken, (req, res) => {
  const { config } = req.body;
  if (config) {
    stateConfig = { ...stateConfig, ...config };
    return res.json({ success: true, config: stateConfig });
  }
  return res.status(400).json({ error: 'Invalid config payload' });
});

// API: Track Conversion Events (Click / Copy / Spin)
app.post('/api/track', (req, res) => {
  const { eventType, platformId } = req.body;
  const geo = getGeoFromRequest(req);

  const platform = statePlatforms.find(p => p.id === platformId);

  if (eventType === 'click') {
    stateStats.totalClicks += 1;
    if (platform) platform.clicksCount = (platform.clicksCount || 0) + 1;
  } else if (eventType === 'copy') {
    stateStats.totalPromoCopies += 1;
    if (platform) platform.copiesCount = (platform.copiesCount || 0) + 1;
  } else if (eventType === 'wheel_spin') {
    stateStats.totalWheelSpins += 1;
  }

  const logEntry: TrackLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    eventType,
    platformId,
    platformName: platform ? platform.name : 'Wheel Spin',
    timestamp: new Date().toISOString(),
    country: geo.country,
    ip: geo.ip,
    userAgent: req.headers['user-agent'] || 'Unknown'
  };

  stateTrackLogs.unshift(logEntry);
  if (stateTrackLogs.length > 100) stateTrackLogs.pop();

  res.json({ success: true });
});

// CLOAKED LINK REDIRECTION ROUTE (/go/:slug)
app.get('/go/:slug', (req, res) => {
  const { slug } = req.params;
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOT_USER_AGENTS.test(userAgent);
  
  // Extract tracking parameters from query string
  const clickId = req.query.click_id || req.query.utm_source || '';
  const sub1 = req.query.sub1 || '';
  const sub2 = req.query.sub2 || '';

  const platform = statePlatforms.find(p => p.slug === slug || p.id === slug);

  if (!platform) {
    return res.redirect('/');
  }

  // Build the dynamic Affiliate URL with tracking parameters
  let targetUrl = platform.rawAffiliateUrl;
  if (clickId || sub1 || sub2) {
    const urlObj = new URL(targetUrl);
    if (clickId) urlObj.searchParams.set('click_id', clickId as string);
    if (sub1) urlObj.searchParams.set('sub1', sub1 as string);
    if (sub2) urlObj.searchParams.set('sub2', sub2 as string);
    targetUrl = urlObj.toString();
  }

  // Record click count
  platform.clicksCount = (platform.clicksCount || 0) + 1;
  stateStats.totalClicks += 1;

  // Tracking Pixels Helper
  const fbPixelId = platform.trackingPixels?.facebookPixelId || stateConfig.globalTrackingPixels?.facebookPixelId;
  const gaPixelId = platform.trackingPixels?.googleAnalyticsId || stateConfig.globalTrackingPixels?.googleAnalyticsId;
  const customScript = stateConfig.globalTrackingPixels?.customHeaderScript || '';

  const pixelScriptHeader = `
    ${fbPixelId ? `
      <script>
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${fbPixelId}');
        fbq('track', 'Lead');
      </script>
    ` : ''}
    ${gaPixelId ? `
      <script async src="https://www.googletagmanager.com/gtag/js?id=${gaPixelId}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaPixelId}');
        gtag('event', 'conversion', {'send_to': '${gaPixelId}'});
      </script>
    ` : ''}
    ${customScript ? customScript : ''}
  `;

  // Real user -> Serve High-Converting 10-Minute Registration Urgency Interstitial Page then auto-redirect
  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Activating 500% Bonus - ${platform.name}</title>
      ${pixelScriptHeader}
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-white font-sans min-h-screen flex items-center justify-center p-4">
      <div id="cardBox" class="max-w-md w-full bg-slate-900 border-2 border-emerald-500/70 rounded-3xl p-6 shadow-2xl text-center space-y-5 relative overflow-hidden transition-all duration-500">
        
        <!-- Glow accent -->
        <div id="glowAccent" class="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none transition-all duration-500"></div>
        <div class="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Header badge -->
        <div id="timerBadge" class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-black uppercase tracking-wider transition-all">
          <span>🟢 10-MINUTE REGISTRATION TIMER ACTIVATED</span>
        </div>

        <!-- Logo & Title -->
        <div class="flex flex-col items-center gap-2">
          <img src="${platform.logoUrl}" alt="${platform.name}" class="w-16 h-16 rounded-2xl border-2 border-amber-500/60 shadow-lg object-cover" />
          <h1 class="text-2xl font-black text-white">${platform.name} Welcome Bonus</h1>
          <p class="text-xs text-slate-300">Your 500% Deposit Bonus & 200 Free Spins are reserved for the next 10 minutes.</p>
        </div>

        <!-- 10 Minute Urgency Timer Box -->
        <div id="timerBox" class="bg-slate-950 border-2 border-emerald-500/50 rounded-2xl p-4 space-y-1 transition-all duration-500">
          <span id="timerLabel" class="text-[10px] uppercase font-black text-emerald-400 tracking-widest block">RESERVED BONUS COUNTDOWN</span>
          <div id="timer" class="font-mono text-4xl font-black text-emerald-300 tracking-wider">10:00</div>
          <span className="text-[11px] text-slate-400 block">Complete registration before timer expires to guarantee bonus</span>
        </div>

        <!-- Promo Code Box -->
        <div class="bg-purple-950/60 border border-purple-500/40 rounded-xl p-3 flex items-center justify-between">
          <div class="text-left">
            <span class="text-[9px] uppercase font-bold text-purple-300 block">REQUIRED PROMO CODE</span>
            <span class="font-mono font-black text-amber-300 text-base tracking-wider">${platform.promoCode || 'MAXBOOST500'}</span>
          </div>
          <button onclick="copyCode()" id="copyBtn" class="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors">
            COPY CODE
          </button>
        </div>

        <!-- CTA Direct Button -->
        <a id="redirectLink" href="${targetUrl}" class="block w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wide shadow-xl shadow-amber-500/20 transform active:scale-95 transition-all">
          PROCEED TO OFFICIAL REGISTRATION NOW (<span id="count">2</span>s)
        </a>

        <p class="text-[11px] text-slate-500">18+ Only • Safe Encrypted Redirect to Official Registration Page</p>
      </div>

      <script>
        // Copy Code Functionality
        function copyCode() {
          navigator.clipboard.writeText('${platform.promoCode || 'MAXBOOST500'}');
          const btn = document.getElementById('copyBtn');
          btn.innerText = 'COPIED! ✅';
          btn.classList.add('bg-emerald-400', 'text-slate-950');
        }

        // 10 Minute Urgency Timer Counter with Dynamic Visual Color Shift & Pulse Animation
        let totalSeconds = 600;
        const timerElem = document.getElementById('timer');
        const timerBox = document.getElementById('timerBox');
        const timerLabel = document.getElementById('timerLabel');
        const cardBox = document.getElementById('cardBox');
        const timerBadge = document.getElementById('timerBadge');

        setInterval(() => {
          if (totalSeconds > 0) {
            totalSeconds--;
            const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
            const s = (totalSeconds % 60).toString().padStart(2, '0');
            timerElem.innerText = m + ':' + s;

            // Phase 1: 10m to 6m (> 360s) -> Emerald Green
            if (totalSeconds > 360) {
              // Default Green
            } 
            // Phase 2: 6m to 3m (180s - 360s) -> Amber Yellow Pulse
            else if (totalSeconds <= 360 && totalSeconds > 180) {
              cardBox.className = "max-w-md w-full bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 shadow-2xl text-center space-y-5 relative overflow-hidden transition-all duration-500";
              timerBox.className = "bg-amber-950/80 border-2 border-amber-500 rounded-2xl p-4 space-y-1 animate-pulse transition-all duration-500";
              timerElem.className = "font-mono text-4xl font-black text-amber-300 tracking-wider";
              timerLabel.className = "text-[10px] uppercase font-black text-amber-400 tracking-widest block";
              timerLabel.innerText = "⚠️ OFFER EXPIRING SOON - REGISTER NOW";
              timerBadge.className = "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-950 border border-amber-500/60 text-amber-300 text-xs font-black uppercase tracking-wider";
              timerBadge.innerText = "⚠️ OFFER EXPIRING SOON";
            } 
            // Phase 3: < 3m (0s - 180s) -> Crimson Red Urgent Rapid Pulse / Bounce
            else if (totalSeconds <= 180) {
              cardBox.className = "max-w-md w-full bg-slate-900 border-4 border-red-500 rounded-3xl p-6 shadow-2xl shadow-red-900/50 text-center space-y-5 relative overflow-hidden transition-all duration-500";
              timerBox.className = "bg-red-950 border-4 border-red-500 rounded-2xl p-4 space-y-1 animate-bounce transition-all duration-500";
              timerElem.className = "font-mono text-4xl font-black text-red-400 tracking-wider";
              timerLabel.className = "text-[10px] uppercase font-black text-red-300 tracking-widest block animate-pulse";
              timerLabel.innerText = "🚨 CRITICAL WARNING - EXPIRING IN MINUTES!";
              timerBadge.className = "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-950 border border-red-500 text-red-400 text-xs font-black uppercase tracking-wider animate-pulse";
              timerBadge.innerText = "🚨 CRITICAL WARNING";
            }
          }
        }, 1000);

        // Auto Redirect Countdown
        let redirectSeconds = 2;
        const countElem = document.getElementById('count');
        const interval = setInterval(() => {
          redirectSeconds--;
          if (countElem) countElem.innerText = redirectSeconds;
          if (redirectSeconds <= 0) {
            clearInterval(interval);
            window.location.href = "${targetUrl}";
          }
        }, 1000);
      </script>
    </body>
    </html>
  `);
});


app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /go/
Disallow: /api/admin/

Sitemap: https://bonuspromocode.in/sitemap.xml
`);
});

// SEO Helper function
// to dynamically inject sitemap.xml route
function injectSitemapRoute(app: express.Application) {
  app.get('/sitemap.xml', (req, res) => {
    const host = `https://${req.get('host')}`;
    const now = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Homepage
    xml += `  <url>\n`;
    xml += `    <loc>${host}/</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // Active Gaming Platforms
    statePlatforms.filter(p => p.isActive).forEach(p => {


      // Review Route
      xml += `  <url>\n`;
      xml += `    <loc>${host}/review/${p.slug}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // Active Custom Standalone Coupons
    if (stateConfig.customCoupons) {
      stateConfig.customCoupons.filter(c => c.isActive).forEach(c => {
        xml += `  <url>\n`;
        xml += `    <loc>${host}/coupon/${c.id}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>0.85</priority>\n`;
        xml += `  </url>\n`;
      });
    }

    xml += `</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });
}

// Inject the sitemap route
injectSitemapRoute(app);

// Gemini SEO Generation API
app.post('/api/generate-seo', verifyJwtToken, async (req, res) => {
  try {
    const { platformName, existingDescription } = req.body;
    
    if (!platformName) {
      return res.status(400).json({ error: 'platformName is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are an expert iGaming SEO copywriter. Generate SEO metadata (title, description, keywords) and exactly 2 FAQ entries for the gaming platform "${platformName}". Make the content sound professional, trustworthy, and engaging for affiliates and players. Focus on bonuses, withdrawals, and reliability. IMPORTANT: Keep the title strictly under 60 characters and the description strictly under 160 characters to comply with Google SEO guidelines.${existingDescription ? ' Here is existing info to build on: ' + existingDescription : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'SEO optimized title strictly under 60 characters.',
            },
            description: {
              type: Type.STRING,
              description: 'SEO optimized description strictly under 160 characters.',
            },
            keywords: {
              type: Type.STRING,
              description: 'Comma separated list of 4-6 target keywords.',
            },
            faqs: {
              type: Type.ARRAY,
              description: 'Exactly 2 FAQ items about the platform.',
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                },
                required: ['question', 'answer']
              }
            }
          },
          required: ['title', 'description', 'keywords', 'faqs']
        }
      }
    });

    const output = JSON.parse(response.text || '{}');
    res.json({ success: true, data: output });
  } catch (error: any) {
    console.error('Error generating SEO content with Gemini:', error);
    res.status(500).json({ error: error.message || 'Failed to generate SEO content' });
  }
});

app.post('/api/generate-article', verifyJwtToken, async (req, res) => {
  try {
    const { topic, category, platformName, platformId } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are an expert SEO content writer and copywriter for a gaming/finance affiliate website. 
    Write a comprehensive, engaging, and highly SEO-optimized article about "${topic}" in the category of "${category}".
    ${platformName ? `The article should focus heavily on the brand/platform: ${platformName}.` : ''}
    
    Guidelines:
    - Use proper markdown formatting (H2, H3, bold text, bullet points).
    - Write an engaging introduction and a strong conclusion.
    - Naturally include relevant keywords related to the topic.
    - Return the response as JSON matching the schema precisely.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'A catchy, SEO-friendly H1 title' },
            metaTitle: { type: Type.STRING, description: 'SEO Meta Title (max 60 chars)' },
            metaDescription: { type: Type.STRING, description: 'SEO Meta Description (max 160 chars)' },
            content: { type: Type.STRING, description: 'The full article content in Markdown format' },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '5-7 relevant SEO tags/keywords' }
          },
          required: ['title', 'metaTitle', 'metaDescription', 'content', 'tags']
        },
        tools: [{ googleSearch: {} }] // Enable Google Search Grounding for trending info
      }
    });

    if (!response.text) {
      return res.status(500).json({ error: 'AI returned empty response' });
    }
    
    const generated = JSON.parse(response.text);
    res.json(generated);
  } catch (error: any) {
    console.error('Error generating AI article:', error);
    res.status(500).json({ error: 'Failed to generate article: ' + error.message });
  }
});

// Vite / Static Files Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const fs = await import('fs');
    
    // Find the correct dist directory regardless of working directory
    const candidates = [
      path.join(process.cwd(), 'dist'),
      path.join(__dirname, 'dist'),
      path.join(__dirname),
      process.cwd()
    ];
    const distPath = candidates.find(c => fs.existsSync(path.join(c, 'index.html')) && fs.existsSync(path.join(c, 'assets')))
      || candidates.find(c => fs.existsSync(path.join(c, 'index.html')))
      || path.join(process.cwd(), 'dist');

    console.log(`[Production] Serving static files from: ${distPath}`);

    // Serve static files with proper MIME types & cache headers
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
          res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        } else if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        } else if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      }
    }));

    // Explicitly serve assets folder if nested
    const assetsPath = path.join(distPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      app.use('/assets', express.static(assetsPath, {
        maxAge: '1y',
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
          } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=UTF-8');
          }
        }
      }));
    }

    // Explicitly return 404 for missing static assets so they never fall back to index.html
    app.use('/assets', (req, res) => {
      res.status(404).setHeader('Content-Type', 'text/plain').send('Asset not found');
    });

    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      const htmlFile = path.join(distPath, 'index.html');
      if (fs.existsSync(htmlFile)) {
        res.sendFile(htmlFile);
      } else {
        res.status(500).send('Production build not found. Run npm run build.');
      }
    });
  }


// ----------------------------------------------------------------------
// AUTOMATED AUTO-BLOGGER BACKGROUND SERVICE
// ----------------------------------------------------------------------
const autoblogInterval = setInterval(async () => {
  if (!stateConfig.autoBlogSettings?.enabled) return;
  if (!process.env.GEMINI_API_KEY) return;
  
  const { categories, topics } = stateConfig.autoBlogSettings;
  if (!categories || categories.length === 0) return;
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Pick random category and topic
    const defaultCategories = ['Gaming', 'Crypto', 'Finance', 'Loans', 'Virtual Cards'];
    const cats = categories && categories.length > 0 ? categories : defaultCategories;
    const category = cats[Math.floor(Math.random() * cats.length)];
    const defaultTopics = ['Best crypto wallets for gaming withdrawals', '1Win vs Mostbet: Which is better?', 'Best Casino Promo Codes 2026', 'No KYC Crypto Casinos', 'Instant Withdrawal Casinos in India', 'Stake vs BC.Game Comparison', 'Top 5 Casino Welcome Bonuses', 'How to claim 1Win 500% Bonus'];
    const tops = topics && topics.length > 0 ? topics : defaultTopics;
    const topic = tops[Math.floor(Math.random() * tops.length)];

    console.log(`[Auto-Blogger] Generating draft for: ${topic} in ${category}`);
    
    const prompt = `You are an expert iGaming SEO copywriter. Write a comprehensive, highly engaging, and highly converting article (800-1500 words) about: "${topic}".
    Category: ${category}.
    Make sure to include sections for:
    - Introduction and target audience
    - Detailed breakdown (Pros/Cons, Comparisons if applicable)
    - Payment methods and withdrawal speeds
    - Step-by-step guide on how to claim promo codes (mention code MAXBOOST500)
    - Responsible gambling disclaimer at the end
    
    Use rich Markdown formatting (H2, H3, bullet points, bold text).
    Return ONLY valid JSON in this exact format:
    {
      "title": "Catchy SEO Title",
      "content": "Markdown formatted content. At least 500 words.",
      "metaTitle": "SEO Meta Title under 60 chars",
      "metaDescription": "SEO Meta Description under 160 chars",
      "tags": ["tag1", "tag2", "tag3"]
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "content", "metaTitle", "metaDescription", "tags"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      const newArticle = {
        id: 'art_auto_' + Math.floor(Math.random() * 1000000),
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        title: data.title,
        content: data.content,
        category,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        publishedAt: new Date().toISOString(),
        author: 'AI Auto-Blogger',
        tags: data.tags || [],
        views: 0,
        status: 'draft' as const
      };

      if (!stateConfig.articles) stateConfig.articles = [];
      stateConfig.articles = [newArticle, ...stateConfig.articles];
      console.log(`[Auto-Blogger] Successfully created draft: ${data.title}`);
    }
  } catch (err) {
    console.error('[Auto-Blogger] Error generating article:', err);
  }
}, (stateConfig.autoBlogSettings?.intervalHours || 24) * 60 * 60 * 1000); // Default to checking daily, but interval updates when hours change.

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Affiliate Hub App listening on port ${PORT}`);
  });
}

startServer();
