# 🚀 High-Converting iGaming Affiliate Portal & Partner Management System

An enterprise-grade, high-converting iGaming Affiliate Platform designed for promoting casino and sports betting brands, affiliate link redirection, promo code tracking, sub-partner onboarding, and real-time commission analytics.

---

## 📌 Feature Summary & Core Capabilities

- **High-Converting Landing Experience**:
  - Top announcement banner with urgency timer & direct claim triggers.
  - Interactive **Top 3 Platforms Carousel** and high-contrast **Gaming Offers Grid**.
  - Custom filtering by category (All, Sportsbook, Casino, Poker, Crypto, Crash Games).
  - Copy-to-clipboard promo codes with instant feedback toast notifications.
  - Interactive **Lucky Wheel Spin Modal** and **Email Verification Offer Checker**.

- **Dynamic SEO Engine**:
  - Automatically generates and injects dynamic `FAQPage` JSON-LD schema into the document `<head>` (`src/utils/seo.ts`).
  - Search engine crawler friendly with platform-specific promo code and payout speed metadata.

- **Admin Control Center**:
  - Protected by a dedicated passcode dialog (Default: `admin123`).
  - Full CRUD operations for Gaming Platforms (add, edit, toggle active status, adjust min deposit, promo codes, and affiliate URLs).
  - Sub-partner application review system (approve/reject sub-affiliates).
  - Custom coupon manager, global site announcement controls, and live analytics dashboard.

- **Partner API Integration & Postback Engine**:
  - Dedicated **Partner API Sync** panel in the Admin Center.
  - Configure unique API keys, partner tracking tokens, and server-to-server (S2S) postback webhook URLs for platforms like **1Win, Mostbet, Pin-Up, 1xBet, Stake**, and more.

- **Responsive Mobile First Design**:
  - Mobile drawer navigation with hamburger toggle.
  - Responsive single-row flex-wrap social media bar (`src/components/SocialMediaBar.tsx`).

---

## ⚙️ Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Motion animations.
- **Backend**: Express.js server (`server.ts`) with Vite dev middleware and bundled CommonJS (`dist/server.cjs`) via `esbuild`.
- **Data Persistence**: Local JSON state persistence with API route endpoints (`/api/platforms`, `/api/config`, `/api/sub-partners`, `/api/track`).

---

## 🔑 Admin Security & Password Change Guide

### How to Access the Admin Center
1. Click the lock icon in the header or footer of the application.
2. Enter the passcode in the prompt (Default passcode: `admin123`).

### How to Change the Admin Password
To update the admin password:
1. Open file `src/components/AdminLoginModal.tsx`.
2. Locate line 22:
   ```typescript
   if (passcode === 'admin123') {
   ```
3. Replace `'admin123'` with your desired new password (e.g., `'MySecurePass2026!'`).
4. Save the file. The new passcode will take effect immediately.

---

## 🔐 Environment Variable Setup Instructions

Create a `.env` file in the root directory or configure environment variables in your hosting provider's dashboard using `.env.example` as a template:

```env
# GEMINI_API_KEY: Required for AI-assisted promo text or content generation
GEMINI_API_KEY="your_gemini_api_key_here"

# APP_URL: Base URL of your deployed application (used for redirects and S2S postbacks)
APP_URL="https://your-domain.com"

# Optional: Supabase Database Integration Credentials (If using external Supabase DB)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key_here"
```

---

## 🛠️ Step-by-Step Deployment Guide

### Option 1: Vercel + Supabase Deployment

#### 1. Database & Backend Setup (Supabase)
If you wish to host your data on Supabase instead of local file persistence:
1. Sign in to [Supabase](https://supabase.com) and create a new project.
2. Copy your **Project URL** and **Anon Key** from `Settings -> API`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your environment settings.

#### 2. Deploying to Vercel
1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your GitHub repository.
4. Configure the Build & Development Settings:
   - **Framework Preset**: Vite / Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add your **Environment Variables** (`GEMINI_API_KEY`, `APP_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
6. Click **Deploy**. Vercel will build and launch your application globally.

---

### Option 2: Cloud Run / AI Studio Deployment (Default)
1. Click **Deploy / Share** in the top menu bar.
2. Select **Deploy to Cloud Run**.
3. The platform automatically builds `npm run build` (`vite build && esbuild server.ts ...`) and deploys the container running on port 3000.

---

### Option 3: Render / Railway / Heroku (Node.js Server)
1. Set Environment: `NODE_ENV=production`.
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. The server binds to `0.0.0.0:3000` or the platform `PORT` automatically.

---

## 🧪 Verification & Build Commands

Before pushing or deploying:
```bash
# 1. Run TypeScript check & linter
npm run lint

# 2. Test full production build
npm run build

# 3. Test production execution locally
npm start
```

---
*Built with Google AI Studio Build.*
