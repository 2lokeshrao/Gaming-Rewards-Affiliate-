import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import * as admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import jwt from 'jsonwebtoken';
import { GoogleGenAI, Type } from '@google/genai';
import { initialGlobalConfig, initialPlatforms, initialFakeWinners } from './src/data';
import { GamingPlatform, GlobalConfig, AnalyticsStats, TrackLog, SubPartnerApplication } from './src/types';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE;

if (!JWT_SECRET || !ADMIN_PASSCODE) {
  console.error("FATAL ERROR: JWT_SECRET or ADMIN_PASSCODE is missing in environment variables. Server shutting down to prevent unauthorized access.");
  process.exit(1);
}

app.use(express.json());

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


// API: S2S Postback (Webhook) Route for Affiliate Networks
app.get('/api/postback/:platform', async (req, res) => {
  const { platform } = req.params;
  const { click_id, event, player, sum, currency, token, ...otherParams } = req.query;

  // STRICT SECURITY: Verify Postback Token
  const EXPECTED_TOKEN = process.env.POSTBACK_SECRET_TOKEN;
  if (!EXPECTED_TOKEN || token !== EXPECTED_TOKEN) {
    console.warn(`[SECURITY ALERT] Fake postback attempt for ${platform} from IP: ${req.ip}`);
    return res.status(403).json({ error: 'Unauthorized: Invalid Postback Token' });
  }

  const postbackData = {
    platform,
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
      console.log(`Saved S2S postback for ${platform} to Firestore.`);
    } else {
      console.log("Firestore DB not initialized, postback only in memory");
    }
    
    // Also push to local state for temporary viewing in admin
    stateTrackLogs.unshift({
      id: `pb_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      eventType: 'visit' as any,
      platformId: platform,
      platformName: platform,
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
    statePlatforms = platforms;
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

// CLEAN LINK REDIRECTION ROUTE (/go/:slug)
app.get('/go/:slug', (req, res) => {
  const { slug } = req.params;

  // 1. Extract tracking parameters from query string
  const clickId = req.query.click_id || req.query.utm_source || '';
  const sub1 = req.query.sub1 || '';
  const sub2 = req.query.sub2 || '';

  // 2. Find the requested platform
  const platform = statePlatforms.find(p => p.slug === slug || p.id === slug);

  if (!platform) {
    return res.redirect('/'); //
  }

  // 3. Smart Geo-Targeting: Identify user location and pick the correct link
  const geo = getGeoFromRequest(req);
  let targetUrl = platform.rawAffiliateUrl; // Default global fallback link
  
  if (platform.geoLinks && platform.geoLinks[geo.countryCode]) {
    targetUrl = platform.geoLinks[geo.countryCode]; // Country-specific affiliate link
  }
  if (clickId || sub1 || sub2) {
    try {
      const urlObj = new URL(targetUrl);
      if (clickId) urlObj.searchParams.set('click_id', clickId as string);
      if (sub1) urlObj.searchParams.set('sub1', sub1 as string);
      if (sub2) urlObj.searchParams.set('sub2', sub2 as string);
      targetUrl = urlObj.toString();
    } catch (e) {
      
    }
  }

  // 4. Record click count for your Analytics Dashboard
  platform.clicksCount = (platform.clicksCount || 0) + 1;
  stateStats.totalClicks += 1;

  // 5. Clean, transparent redirect without deceptive cloaking
  return res.redirect(targetUrl);
});

// SEO Helper function to dynamically inject sitemap.xml route
function injectSitemapRoute(app: express.Application) {
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

  
app.post('/api/generate-article', verifyJwtToken, adminLoginRateLimiter, async (req, res) => {
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
    const defaultTopics = ['Best crypto wallets for gaming withdrawals', 'Top virtual cards for instant cashout', 'Best instant loan apps', 'Gaming platform reviews and promo codes'];
    const tops = topics && topics.length > 0 ? topics : defaultTopics;
    const topic = tops[Math.floor(Math.random() * tops.length)];

    console.log(`[Auto-Blogger] Generating draft for: ${topic} in ${category}`);
    
    const prompt = `You are an expert SEO copywriter. Write a comprehensive, highly engaging article about: "${topic}".
    Category: ${category}.
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
// ----------------------------------------------------------------------
  // FIRESTORE DATABASE SYNC ON BOOT
  // ----------------------------------------------------------------------
  if (firestoreDb) {
    try {
      console.log("Syncing persistent data from Firestore...");
      
      const configDoc = await firestoreDb.collection('system').doc('globalConfig').get();
      if (configDoc.exists) {
        stateConfig = { ...stateConfig, ...configDoc.data() };
      }

      const platformsSnapshot = await firestoreDb.collection('platforms').get();
      if (!platformsSnapshot.empty) {
        statePlatforms = platformsSnapshot.docs.map(doc => doc.data() as GamingPlatform);
      }
      
      console.log("✅ Database synced successfully.");
    } catch (err) {
      console.error("❌ Firestore sync failed, falling back to local memory:", err);
    }
  }
  
startServer();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Affiliate Hub App listening on port ${PORT}`);
  });
}