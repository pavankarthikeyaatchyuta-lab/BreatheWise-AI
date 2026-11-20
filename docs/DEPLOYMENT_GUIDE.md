# BREATHEWISE AI — PRODUCTION DEPLOYMENT GUIDE
**Project:** BreatheWise AI  
**Repository:** `https://github.com/pavankarthikeyaatchyuta-lab/BreatheWise-AI`  
**Platform:** Next.js 15.1.7 (React 19, TypeScript)  
**Target Host:** Vercel (Optimized for `bom1` [Mumbai] and `sin1` [Singapore])  

---

## 1. Prerequisites & Environment Setup

### 1.1 System Requirements
- **Node.js**: `v18.18.0` or higher (`v20.x` or `v24.x` recommended).
- **Package Manager**: `npm` v9 or higher.
- **Git**: Installed and configured.

### 1.2 Environment Variables
Create a `.env.local` file in the project root:

```ini
# Google Gemini API Configuration (Server-Side Only - Never Prefix with NEXT_PUBLIC_)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Optional: Ground-truth Station Provider Key (OpenAQ v3)
OPENAQ_API_KEY=your_openaq_api_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=production
```

> [!IMPORTANT]
> BreatheWise AI features a **Deterministic Offline AI Fallback Engine**. If `GEMINI_API_KEY` is omitted or quota is exhausted, the application operates with 100% functionality using deterministic rule-based guidance grounded in official CPCB breakpoints and CAQM GRAP directives.

---

## 2. Local Verification Commands

Before deploying to production, verify all engineering checks locally:

```bash
# 1. Install dependencies
npm install

# 2. Run the complete automated test suite (72/72 tests)
npm run test -- --run

# 3. Run ESLint code quality analysis
npm run lint

# 4. Run TypeScript strict type verification
npx tsc --noEmit

# 5. Run the production build
npm run build

# 6. Test the production server locally
npm run start -p 3000
```

---

## 3. Vercel Deployment Options

### Option A: One-Click GitHub Integration (Recommended)

1. Open your browser and navigate to [https://vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and select repository:
   `pavankarthikeyaatchyuta-lab/BreatheWise-AI`
3. Configure the Project:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
4. Add Environment Variables:
   - Name: `GEMINI_API_KEY` | Value: `<Your Google Gemini API Key>`
   - Name: `GEMINI_MODEL` | Value: `gemini-2.5-flash`
5. Click **Deploy**. Vercel will build and provision the application using the configuration in `vercel.json` (deployed to Mumbai `bom1` and Singapore `sin1` regions for minimal latency across India).

---

### Option B: Vercel CLI Deployment

1. Authenticate with the Vercel CLI:
   ```bash
   npx vercel login
   ```
2. Link the repository to your Vercel team/project:
   ```bash
   npx vercel link
   ```
3. Set your production secrets securely:
   ```bash
   npx vercel env add GEMINI_API_KEY production
   ```
4. Deploy directly to production:
   ```bash
   npx vercel --prod
   ```

---

## 4. Post-Deployment Verification Checklist

Once deployed, verify the live deployment endpoints:

| Route | Expected Status | Verification Check |
|---|---|---|
| `/` | `HTTP 200` | Current AQI score card, 8 pollutants grid, 24-hr spline wave chart renders. |
| `/planner` | `HTTP 200` | Schedule timeline renders with morning/evening shifts and anti-idling card. |
| `/indoor-coach` | `HTTP 200` | Living room illustration loads, ventilation advisor pill shows status, DIY modal opens. |
| `/alternatives` | `HTTP 200` | Distance slider interacts, comparison table computes travel cost & emissions. |
| `/impact` | `HTTP 200` | 3 large metric cards render; "View Calculation Proof" modal displays formulas & CEA citations. |
| `/community` | `HTTP 200` | GRAP Stage II card displays; "Share on WhatsApp" button opens valid WhatsApp URL. |
| `/assistant` | `HTTP 200` | Interactive grounded chat responds accurately with structured recommendations. |
| `/api/aqi?city=Delhi` | `HTTP 200` | Returns valid CPCB 8-pollutant JSON state with provenance metadata. |
| `/api/chat` | `HTTP 200` | Accepts JSON POST payload and returns grounded `AIAssistantResponse`. |

---

## 5. Security & Data Privacy Compliance

- **No Secret Leakage**: API keys remain strictly on the server-side.
- **Sanitized Inputs**: All user inputs are sanitized against prompt injections and script tags before reaching any downstream handler.
- **Zero Tracker Bloat**: BreatheWise AI contains no third-party behavioral trackers or privacy-invasive telemetry.
