import re

with open('server.ts', 'r') as f:
    content = f.read()

# Add imports
imports = """import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import * as admin from 'firebase-admin';"""

content = re.sub(r"import express, \{ Request, Response \} from 'express';\nimport path from 'path';", imports, content)

# Add Firebase initialization
firebase_init = """
// Initialize Firebase
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firestoreDb: admin.firestore.Firestore | null = null;
try {
  if (fs.existsSync(firebaseConfigPath)) {
    const config = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
    const appInfo = admin.initializeApp({
      projectId: config.projectId,
    });
    if (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') {
      firestoreDb = admin.firestore(appInfo, config.firestoreDatabaseId);
    } else {
      firestoreDb = admin.firestore();
    }
  } else {
    admin.initializeApp();
    firestoreDb = admin.firestore();
  }
  console.log("Firebase initialized successfully");
} catch (e) {
  console.error("Firebase init error:", e);
}
"""

content = content.replace("app.use(express.json());", "app.use(express.json());\n" + firebase_init)

# Add S2S Postback Route
s2s_route = """
// API: S2S Postback (Webhook) Route for Affiliate Networks
app.get('/api/postback/:platform', async (req, res) => {
  const { platform } = req.params;
  const { click_id, event, player, sum, currency, ...otherParams } = req.query;

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
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Saved S2S postback for ${platform} to Firestore.`);
    } else {
      console.log("Firestore DB not initialized, postback only in memory");
    }
    
    // Also push to local state for temporary viewing in admin
    stateTrackLogs.unshift({
      id: `pb_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      eventType: `postback_${event}`,
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
"""

content = content.replace("// API: Get Full Public & Admin State", s2s_route + "\n// API: Get Full Public & Admin State")

with open('server.ts', 'w') as f:
    f.write(content)

print("Updated server.ts with Firebase & Postback route")
