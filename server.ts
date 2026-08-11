import express, { Request, Response } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import { GoogleGenAI, Type } from '@google/genai';
import { initialGlobalConfig, initialPlatforms, initialFakeWinners } from './src/data';
import { GamingPlatform, GlobalConfig, AnalyticsStats, TrackLog, SubPartnerApplication } from './src/types';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-affiliate-key-2026';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin123';

app.use(express.json());

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
    const token = jwt.sign({ role: 'admin', authAt: Date.now() }, JWT_SECRET, { expiresIn: '7d' });
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
  const { email, platformId, forceMarkRegistered } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const platform = statePlatforms.find(p => p.id === platformId) || statePlatforms[0];

  const registeredList = stateConfig.registeredEmailsList || [
    "lokeshrao050@gmail.com",
    "user@example.com",
    "test@gmail.com",
    "admin@1win.com"
  ];

  if (forceMarkRegistered) {
    if (!registeredList.includes(cleanEmail)) {
      registeredList.push(cleanEmail);
      stateConfig.registeredEmailsList = registeredList;
    }
    checkedEmails.add(cleanEmail);
    return res.json({
      email: cleanEmail,
      hasExistingAccount: true,
      platformName: platform?.name || 'Gaming Platform',
      message: `Account '${cleanEmail}' marked as registered on ${platform?.name || 'this platform'}.`,
      recommendedAction: `To guarantee your 500% Welcome Bonus & 200 Free Spins, please create your account using a NEW EMAIL ADDRESS.`
    });
  }

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

// API: Get Full Public & Admin State
app.get('/api/data', (req, res) => {
  stateStats.totalVisits += 1;
  const geo = getGeoFromRequest(req);

  res.json({
    platforms: statePlatforms,
    config: stateConfig,
    stats: stateStats,
    fakeWinners: stateFakeWinners,
    logs: stateTrackLogs,
    subPartners: stateSubPartners,
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
    statePlatforms = platforms;
    return res.json({ success: true, platforms: statePlatforms });
  }
  return res.status(400).json({ error: 'Invalid platform data array' });
});

// API: Save Config (Protected)
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

  const platform = statePlatforms.find(p => p.slug === slug || p.id === slug);

  if (!platform) {
    return res.redirect('/');
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

  // CLOAKING LOGIC: If an Ad Bot / Crawler is detected and cloaking is ON -> Serve safe educational review page with FAQ Schema
  if (isBot && stateConfig.enableBotCloaking) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Is ${platform.name} legit and safe to play?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Yes, ${platform.name} is an officially licensed and verified platform featuring SSL security encryption and fair RNG gaming certifications.`
          }
        },
        {
          "@type": "Question",
          "name": `What is the verified promo code for ${platform.name}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The verified official promo code for ${platform.name} is ${platform.promoCode || 'MAXBOOST500'}, granting 500% welcome deposit bonus + 200 free spins.`
          }
        }
      ]
    };

    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${platform.name} - Official Review, Legit Status & Promo Code 2026</title>
        <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #333; }
          h1 { color: #111; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          .badge { background: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .card { background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .faq-item { margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ddd; }
        </style>
      </head>
      <body>
        <h1>${platform.name} Overview, Legit Status & Compliance</h1>
        <p><span class="badge">Verified Official Brand Review</span></p>
        <div class="card">
          <h2>About ${platform.name}</h2>
          <p>This is an official informational summary page regarding ${platform.name}. It provides software details, security compliance credentials, and customer assistance channels.</p>
          <p><strong>Is ${platform.name} Legit?</strong> Yes, ${platform.name} operates with valid international gaming certification, instant local withdrawals (UPI, Pix, Crypto), and 24/7 support.</p>
          <p><strong>Official Promo Code:</strong> <code>${platform.promoCode || 'MAXBOOST500'}</code></p>
          <p><strong>Rating:</strong> ${platform.rating} / 10</p>
          <p><strong>Features:</strong> ${platform.badges.join(', ')}</p>
        </div>

        <div class="card">
          <h3>Frequently Asked Questions (FAQ)</h3>
          <div class="faq-item">
            <h4>Is ${platform.name} legit and safe?</h4>
            <p>Yes, ${platform.name} is fully verified and licensed, ensuring fair gameplay and secure encrypted transactions.</p>
          </div>
          <div class="faq-item">
            <h4>How to activate the 500% deposit bonus on ${platform.name}?</h4>
            <p>Register with promo code <code>${platform.promoCode || 'MAXBOOST500'}</code> during sign-up to claim your welcome bonus.</p>
          </div>
        </div>

        <footer>
          <p><small>&copy; 2026 Gaming Reviews & Regulatory Compliance Portal. 18+ Responsible Gaming.</small></p>
        </footer>
      </body>
      </html>
    `);
  }

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
        <a id="redirectLink" href="${platform.rawAffiliateUrl}" class="block w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wide shadow-xl shadow-amber-500/20 transform active:scale-95 transition-all">
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
            window.location.href = "${platform.rawAffiliateUrl}";
          }
        }, 1000);
      </script>
    </body>
    </html>
  `);
});

// Dynamic Sitemap.xml Generator Route
app.get('/sitemap.xml', (req, res) => {
  const host = `${req.protocol}://${req.get('host')}`;
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
    // Redirect Route
    xml += `  <url>\n`;
    xml += `    <loc>${host}/go/${p.slug}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;

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

    const prompt = `You are an expert iGaming SEO copywriter. Generate an SEO-optimized description and exactly 2 FAQ entries for the gaming platform "${platformName}". Make the content sound professional, trustworthy, and engaging for affiliates and players. Do NOT use markdown formatting outside of the JSON structure. Focus on bonuses, withdrawals, and reliability.${existingDescription ? ' Here is existing info to build on: ' + existingDescription : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: 'A 2-3 sentence highly SEO-optimized description of the platform.',
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
          required: ['description', 'faqs']
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Affiliate Hub App listening on port ${PORT}`);
  });
}

startServer();
