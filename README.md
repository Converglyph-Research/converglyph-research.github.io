# 🌌 Converglyph Research — Frontend Application

Modern static web platform for **Converglyph Research** ([https://converglyph-research.github.io](https://converglyph-research.github.io)).

Built with Next.js 14 App Router, TypeScript, and Tailwind CSS using the **Celestial Pop Editorial** design system.

---

## 🏗️ Technical Architecture

### 1. Framework & Stack
- **Framework:** Next.js 14 (Static HTML Export `output: 'export'`)
- **Language:** TypeScript 5 with strict type definitions
- **Styling:** Tailwind CSS with custom editorial themes (Ink Plum `#171321`, Astral Violet `#26213A`, Moon Ivory `#F5F0E8`, Astral Lilac `#B9A3FF`, Soft Celestial Gold `#D9C18F`)
- **Visual Canvas:** Custom lightweight interactive starfield canvas rendering real-time celestial particle mechanics
- **Internationalization:** Full bilingual support (`en` English / `vi` Vietnamese) managed via `LocaleContext`
- **Identity & Auth:** Google Identity Services (`@react-oauth/google`) client integration with privacy-first session handling

### 2. Directory Structure

```
aetheria-frontend/
├── app/
│   ├── layout.tsx             # Root layout with LocaleProvider & GoogleOAuthProvider
│   ├── page.tsx               # Landing page with interactive birth chart input & system overview
│   ├── explore/page.tsx       # Multi-tradition side-by-side life map (Western, Tu Vi, BaZi, Numerology)
│   ├── research/page.tsx      # Empirical Prediction Ledger, Brier calibration curves & cryptographic audit
│   ├── articles/page.tsx      # Bilingual scientific monographs repository
│   └── documentation/page.tsx # Platform architecture, calculation specifications & API documentation
├── components/
│   ├── Navigation.tsx         # Responsive navigation bar with locale switcher & login modal
│   ├── StarfieldCanvas.tsx    # Hardware-accelerated canvas background
│   └── ...                    # Modular chart views & comparison widgets
├── lib/
│   ├── LocaleContext.tsx      # Bilingual localization provider & dictionary
│   └── api.ts                 # Backend API integration layer with fallback mock handlers
├── public/                    # Static assets & icons
└── out/                       # Pre-rendered static HTML/CSS/JS export for GitHub Pages
```

---

## 🛠️ Build & Deployment Workflow

### 1. Local Development
```bash
npm install
npm run dev
# Serves development server at http://localhost:3000
```

### 2. Static Production Build
```bash
# Clean previous builds
rm -rf out .next

# Compile static HTML/JS export
npm run build

# Mirror export artifacts to repository root for GitHub Pages
cp -r out/* .
touch .nojekyll
```

### 3. Deploy to GitHub Pages
```bash
git add .
git commit -m "Deploy fresh static bundle"
git push origin main
```

---

## 🔌 API Gateway Configuration

The frontend dynamically queries the Converglyph backend API:
- Local Development: `http://127.0.0.1:8089`
- Production Gateway: Configured through environment variables or secure reverse proxy
- Graceful Fallback: Built-in deterministic calculation fallback when offline or during air-gapped evaluation.
