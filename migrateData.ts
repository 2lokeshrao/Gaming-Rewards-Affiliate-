import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
  console.error('Firebase environment variables are missing.');
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey
  })
});

const db = getFirestore();

async function run() {
  const dbFile = path.join(process.cwd(), 'database.json');
  if (!fs.existsSync(dbFile)) {
    console.error('database.json not found!');
    return;
  }

  const raw = fs.readFileSync(dbFile, 'utf8');
  const data = JSON.parse(raw);

  console.log('Starting migration...');

  // 1. Platforms
  const platforms = data.statePlatforms || [];
  for (const p of platforms) {
    await db.collection('platforms').doc(p.id).set(p);
    console.log(`Migrated platform: ${p.id}`);
  }

  // 2. Custom Coupons (from stateConfig)
  const coupons = data.stateConfig?.customCoupons || [];
  for (const c of coupons) {
    await db.collection('coupons').doc(c.id).set(c);
    console.log(`Migrated coupon: ${c.id}`);
  }

  // 3. Sub Partners
  const subPartners = data.stateSubPartners || [];
  for (const s of subPartners) {
    await db.collection('sub_partners').doc(s.id).set(s);
    console.log(`Migrated sub-partner: ${s.id}`);
  }

  // 4. Custom Pages
  const customPages = data.stateCustomPages || [];
  for (const cp of customPages) {
    await db.collection('custom_pages').doc(cp.id).set(cp);
    console.log(`Migrated custom page: ${cp.id}`);
  }

  // 5. Settings / Config
  const config = { ...data.stateConfig };
  delete config.customCoupons; // move to its own collection
  await db.collection('settings').doc('globalConfig').set(config);
  console.log(`Migrated global settings`);

  console.log('Migration complete!');
}

run().catch(console.error);
