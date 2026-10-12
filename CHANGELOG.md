# Converglyph Research Frontend — Engineering & UI/UX Changelog

All component updates, bug fixes, and design system refinements are tracked below.

---

### [2026-10-12 16:32:31 UTC] [FEAT] AI Reasoning Studio with multi-tradition aspect switching, Markdown CoT rendering, and multi-system convergence synthesis

- **Context & Problem:**
  Upgraded explore page with AiReasoningStudio component supporting 5 specialized modes: Unified Convergence & Divergence, Tu Vi 12 Palaces, Western Planetary Wheel, BaZi Four Pillars, and Quantitative Consensus/Conflict. Implemented formatAiMarkdown parser converting headers, bold text, blockquotes, codeblocks, and comparison tables into styled editorial HTML.
- **Files Modified:**
  - `components/report/AiReasoningStudio.tsx`
  - `app/explore/page.tsx`
- **Verification Evidence:**
  npm run build passed generating all 15 static HTML routes without error.
- **Engineering Insights & Risk Mitigation:**
  Splitting general AI reasoning into canonical checking modes (Tu Vi, Western Astro, BaZi) and an integrated convergence synthesizer mirrors expert metaphysical consultation and makes doctrinal agreement vs disagreement transparent to users.

---

### [2026-10-12 16:24:08 UTC] [FEAT] Live global typeahead location search and real reverse geocoding (City, Country)

- **Context & Problem:**
  Implemented Open-Meteo Geocoding API integration coupled with BigDataCloud and local regex database. Users get live typeahead suggestions showing 'City, Admin Region, Country' with exact 4-decimal lat/lon. Browser GPS button now reverse geocodes exact coordinates into real city/country strings.
- **Files Modified:**
  - `components/report/ProfileForm.tsx`
  - `lib/validation.ts`
- **Verification Evidence:**
  npm run build passed generating all 15 static HTML pages without syntax or type errors.
- **Engineering Insights & Risk Mitigation:**
  Using debounced live geocoding with instant offline regex fallback ensures high-quality coordinate resolution for any location globally while avoiding network failure blockage.

---

### [2026-10-12 16:15:03 UTC] [FEAT] Modernized ProfileForm UI/UX with native date/time pickers and Geolocation API

- **Context & Problem:**
  Replaced 3 separate numeric text inputs for YYYY/MM/DD with native HTML5 input[type='date'] and input[type='time'], eliminating validation friction. Implemented navigator.geolocation browser API ('Use Current Location' / 'Lấy vị trí hiện tại') auto-populating sub-arcsecond latitude and longitude coordinates. Extended Vietnamese and international city lookup dictionary.
- **Files Modified:**
  - `components/report/ProfileForm.tsx`
  - `lib/validation.ts`
- **Verification Evidence:**
  npm run build passed generating all 15 static HTML pages without syntax or type errors.
- **Engineering Insights & Risk Mitigation:**
  Native HTML5 date and time pickers provide superior mobile ergonomics and built-in calendar widgets across iOS, Android, and desktop browsers, preventing invalid day-of-month entries before submission.

---

### [2026-10-12 16:10:16 UTC] [FEAT] Dedicated Personal Research Space (/personal), direct profile management, and GSI removeChild elimination

- **Context & Problem:**
  Implemented independent Personal Space route (/personal) separating user chart management, Google session control, and quick navigation shortcuts from landing page. Connected header session pill directly to /personal with clear Sign Out action. Completely detached dynamic GSI iframe DOM insertions to eliminate NotFoundError removeChild React crashes.
- **Files Modified:**
  - `app/personal/page.tsx`
  - `components/auth/GoogleAuth.tsx`
  - `components/layout/Navbar.tsx`
- **Verification Evidence:**
  npm run build passed generating 15/15 static HTML routes; verified /personal renders independently.
- **Engineering Insights & Risk Mitigation:**
  Splitting personal profile configuration from marketing/landing space drastically improves user flow, eliminates cluttered forms on home, and allows dedicated session synchronization.

---

### [2026-10-12 16:02:01 UTC] [FIX] Google OAuth GSI popup integration, removeChild React crash fix, aspects table mapping, and bilingual translation completeness

- **Context & Problem:**
  Fixed React removeChild DOM crash by wrapping Google Identity Services inside a global init guard and using google.accounts.oauth2.initTokenClient with standard React button, preventing unmounted iframe collisions. Mapped backend aspect properties (body1_name, actual_angle, orb) in explore page. Added full Vietnamese localization to documentation and theme cards. Restored missing CSS classes.
- **Files Modified:**
  - `components/auth/GoogleAuth.tsx`
  - `app/explore/page.tsx`
  - `app/documentation/page.tsx`
  - `components/report/ThemeCards.tsx`
  - `styles/globals.css`
  - `.env.local`
- **Verification Evidence:**
  npm run build passed generating 14/14 static HTML pages. Chromium browser test verified zero console errors and successful modal open.
- **Engineering Insights & Risk Mitigation:**
  Google GSI iframes should never be mounted directly inside frequently re-rendered or conditional React dialogs; using google.accounts.oauth2 popup or global initialize guards prevents DOM removeChild mismatch exceptions.

---

