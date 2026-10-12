# Converglyph Research Frontend — Engineering & UI/UX Changelog

All component updates, bug fixes, and design system refinements are tracked below.

---

### [2026-10-12 18:48:43 UTC] [SECURITY] Account-scoped chart data isolation and Google OAuth exclusive authentication

- **Context & Problem:**
  Enforced that Google OAuth is the ONLY authentication pathway (removed all manual email/display name forms). Resolved cross-account chart data leakage by implementing getAccountProfileStorageKey() scoping stored charts to current user email, preventing different Google accounts on the same browser from viewing each other's Active Personal Charts. Scoped backend /api/profiles and /api/profile/check queries strictly to user_email.
- **Files Modified:**
  - `components/auth/GoogleAuth.tsx`
  - `app/personal/page.tsx`
  - `app/explore/page.tsx`
  - `app/page.tsx`
  - `lib/auth.ts`
  - `lib/api.ts`
  - `server.py`
- **Verification Evidence:**
  TypeScript compiled cleanly; unit tests passed (13/13). Tested /api/profiles scoping.
- **Engineering Insights & Risk Mitigation:**
  Scoping localStorage keys with normalized user account identifiers ensures true multi-tenant client-side data segregation without complex auth middleware.

---

### [2026-10-12 18:40:03 UTC] [FEAT] System diagnostic file logging, AI reasoning auto-persistence, and deletion controls

- **Context & Problem:**
  Added log_system_event() writing structured JSON logs to logs/system.log for bug investigation. Wired subjectName, method, aspect, aiLang, and timeHorizon from explore page into streamAiReasoning, ensuring reasoning runs are auto-saved into SQLite ai_reasoning_logs. Added DELETE endpoints on backend (/api/ai/history/delete/:id and /api/profile/delete/:id), and added interactive delete buttons in both the Reasoning Archive modal and the Personal Space chart manager.
- **Files Modified:**
  - `server.py`
  - `lib/ai.ts`
  - `lib/api.ts`
  - `components/report/AiReasoningStudio.tsx`
  - `app/personal/page.tsx`
- **Verification Evidence:**
  TypeScript compiled cleanly. Verified /api/logs, /api/ai/history, and delete endpoints.
- **Engineering Insights & Risk Mitigation:**
  Storing system diagnostics in an append-only JSONL log allows rapid bug diagnosis on headless servers while deletion controls empower users with full GDPR data sovereignty.

---

### [2026-10-12 18:32:06 UTC] [FEAT] Reasoning Archive modal dialog and SQLite persistence for all AI inference categories

- **Context & Problem:**
  Added ai_reasoning_logs table in backend SQLite database storing all generated AI reasoning runs categorized by subject_name, method, aspect, model, ai_lang, time_horizon, and timestamp. Added GET /api/ai/history endpoint and integrated an interactive '📚 Lịch Sử Luận Giải / Reasoning Archive' modal dialog into AiReasoningStudio on /explore.
- **Files Modified:**
  - `components/report/AiReasoningStudio.tsx`
  - `lib/api.ts`
  - `server.py`
- **Verification Evidence:**
  TypeScript compiled cleanly; verified /api/ai/history endpoint returning valid JSON logs.
- **Engineering Insights & Risk Mitigation:**
  Storing historical AI interpretations across individual categories allows users to re-examine reasoning runs across sessions without paying duplicate inference costs.

---

### [2026-10-12 18:20:22 UTC] [DOCS] Exhaustive technical calculation formulas documented on /documentation with KaTeX

- **Context & Problem:**
  Documented full mathematical formulations across all calculation engines: Meeus Julian Ephemeris Day equation, Local Mean Time (LMT), Equation of Time (EoT) trigonometric series, True Solar Time (LST), BaZi Sexagenary Modulo arithmetic, Tu Vi Lunisolar conjunctions, Palace branches, Emperor Star Bureau placement, Numerology dual-reduction equations, and the Consensus Index formula C = 1 - sigma/sigma_max with Brier Loss proper scoring rules.
- **Files Modified:**
  - `app/documentation/page.tsx`
  - `documents/TECHNICAL_CALCULATION_SPECIFICATIONS.md`
- **Verification Evidence:**
  TypeScript compiler passed with zero diagnostics. Built static export.

---

### [2026-10-12 17:57:21 UTC] [FEAT] Expandable Convergence Matrix methodology card with KaTeX formula and data source breakdown

- **Context & Problem:**
  Added an expandable accordion card into TimeSeriesConvergenceView explaining the exact ingested data sources across 4 traditions (Western Big Three & transits, Tu Vi 12 palaces & Dai Han, BaZi Day Master & Dai Van, Numerology Pinnacles) and rendering the formal mathematical Convergence Rate formula C = 1 - (sigma / sigma_max) via KaTeX.
- **Files Modified:**
  - `components/report/TimeSeriesConvergenceView.tsx`
- **Verification Evidence:**
  npx tsc --noEmit passed cleanly with 0 errors. Verified KaTeX formula markup.
- **Engineering Insights & Risk Mitigation:**
  Exposing the explicit mathematical formula and data inputs directly underneath the convergence wave ensures scientific transparency without overwhelming casual readers.

---

### [2026-10-12 17:55:23 UTC] [FEAT] LaTeX bracket delimiters, quick load previous run button, and convergence rate formula transparency

- **Context & Problem:**
  Added support for LaTeX bracket delimiters \[...\] and \(...\) with Unicode thin space sanitization in formatAiMarkdown, resolving math rendering on complex formulas like aligned elemental counts and derived fractions. Added '📥 Tải bản ghi gần nhất' button right beside the Profile Specimen dropdown on /explore. Documented Convergence Rate formula mechanics (C = 1 - σᵥ / 1.45) directly in TimeSeriesConvergenceView.
- **Files Modified:**
  - `components/report/AiReasoningStudio.tsx`
  - `components/report/TimeSeriesConvergenceView.tsx`
  - `app/explore/page.tsx`
- **Verification Evidence:**
  npx tsc --noEmit passed cleanly; tested LaTeX aligned formula in Node with KaTeX producing 14KB+ MathML spans.
- **Engineering Insights & Risk Mitigation:**
  Supporting both standard bracket syntax \[...\] alongside dollar delimiters 3080702...3080702 guarantees compatibility with all major LLMs emitting LaTeX math blocks.

---

### [2026-10-12 17:45:58 UTC] [FIX] Render saved database runs in specimen dropdown optgroups on explore page

- **Context & Problem:**
  Rendered savedDbProfiles into <optgroup label='Hồ sơ đã lưu trong CSDL / Saved Database Runs'> inside select.select-editorial on /explore. Selecting any saved run triggers handleSelectProfile('db-:id'), fetching the complete deterministic calculations and rehydrating the life map.
- **Files Modified:**
  - `app/explore/page.tsx`
- **Verification Evidence:**
  Browser evaluation verified optgroup rendered with db-1 (💾 Marie Curie Test (1867-11-7)).
- **Engineering Insights & Risk Mitigation:**
  Grouping options with HTML optgroups separates static benchmark exemplars from runtime user database runs clearly.

---

### [2026-10-12 17:42:26 UTC] [FEAT] Database profile persistence, load saved runs from dropdown or duplicate dialog, and overwrite protection

- **Context & Problem:**
  Added database persistence for calculations into subject_profiles in SQLite. When a user enters parameters for an already calculated profile, the duplicate dialog offers 'Load Saved Run' (loading the existing run without recalculating) or 'Overwrite & Run'. Implemented GET /api/profiles and GET /api/profile/load/:id on backend, and added 'Saved Database Runs' optgroup to the specimen dropdown on /explore.
- **Files Modified:**
  - `server.py`
  - `lib/api.ts`
  - `components/report/ProfileForm.tsx`
  - `app/explore/page.tsx`
- **Verification Evidence:**
  npx tsc --noEmit passed cleanly with zero type errors. Verified /api/profiles and /api/profile/load endpoints.
- **Engineering Insights & Risk Mitigation:**
  Caching completed runs in the database and exposing them through both duplicate prompts and specimen selectors eliminates unnecessary compute while keeping historical runs accessible.

---

### [2026-10-12 17:30:50 UTC] [REFACTOR] Collapsible technical calculations, single-tradition view mode, and localized monograph headings

- **Context & Problem:**
  Added collapsible toggle for technical calculation metrics in the East-West Laboratory so everyday users see an uncluttered summary while interested users can expand full data. When only 1 tradition is selected, the radar chart is replaced with an informative single-tradition state. Localized monograph comparison columns to 'TỬ VI ĐẨU SỐ (THẬP NHỊ CUNG)' and 'CHIÊM TINH TÂY PHƯƠNG (SWISS EPHEMERIS)'.
- **Files Modified:**
  - `app/explore/page.tsx`
- **Verification Evidence:**
  npm run build passed generating all 15 static HTML routes without error.
- **Engineering Insights & Risk Mitigation:**
  Progressive disclosure of complex calculation metrics reduces cognitive overload on first visit while keeping research-grade data easily inspectable.

---

### [2026-10-12 17:27:15 UTC] [FEAT] Database pre-check & overwrite confirmation dialog, isolated single-canon labs, and localized synthesis labels

- **Context & Problem:**
  Added database pre-check (/api/profile/check) before calculating. If a profile already exists, a confirmation modal prompts whether to overwrite or cancel. Updated laboratory tabs so standalone methods (Tu Vi 12 Palaces, Western Planetary Wheel) are directly accessible, while the East-West Synthesis Monograph is only presented when >= 2 traditions are active. Localized Unified Verdict to 'Nhận Định Hợp Nhất' for Vietnamese users.
- **Files Modified:**
  - `components/report/ProfileForm.tsx`
  - `app/explore/page.tsx`
  - `lib/api.ts`
  - `server.py`
- **Verification Evidence:**
  npm run build passed generating all 15 static HTML routes without error. Curl confirmed /api/profile/check returns valid existence states.
- **Engineering Insights & Risk Mitigation:**
  Checking database duplicates before execution prevents accidental erasure of customized chart notes and provides explicit user confirmation.

---

### [2026-10-12 17:10:29 UTC] [DOCS] Created frontend ARCHITECTURAL_MEMORY.md for UI/UX contracts and time-series rules

- **Context & Problem:**
  Documented UI/UX guidelines: Convergence Matrix top-level dedicated placement, minimum >= 2 active methods threshold, authentic method-specific temporal mapping, and KaTeX math processing order.
- **Files Modified:**
  - `ARCHITECTURAL_MEMORY.md`
- **Verification Evidence:**
  File created and verified

---

### [2026-10-12 17:04:44 UTC] [FEAT] Interactive Time-Series Convergence Stepper and strict default-to-free tier authorization

- **Context & Problem:**
  Added TimeSeriesConvergenceView component providing an interactive developmental epoch stepper (Foundational 0-25, Peak Zenith 26-40, Mastery 41-55, Harvest 56+) side-by-side comparing Western Astrodienst planetary cycles against Eastern Tu Vi/BaZi luck decades with consensus percentages. Tightened server.py tier authorization so unauthenticated calls strictly resolve to Free tier, blocking unauthorized AI inferences with HTTP 403 unless valid pro credentials or headers are present.
- **Files Modified:**
  - `components/report/TimeSeriesConvergenceView.tsx`
  - `app/explore/page.tsx`
  - `lib/ai.ts`
  - `server.py`
- **Verification Evidence:**
  npm run build passed generating all 15 static HTML routes without error. Curl confirmed unauthenticated requests default to free tier and require upgrade.
- **Engineering Insights & Risk Mitigation:**
  Visual stepper timelines offer immediate intuitive understanding of life phases before users engage LLM inference, reducing prompt ambiguity and making cross-tradition comparisons concrete.

---

### [2026-10-12 16:52:29 UTC] [FEAT] KaTeX mathematical rendering ($ and 3080702), Time-Series life horizon selector, and cross-tradition data integration

- **Context & Problem:**
  Resolved broken mathematical rendering by integrating KaTeX rendering engine for inline ($...$) and block (3080702...3080702) formulas (including multi-number additions and Life Path reductions). Enriched AI Reasoning Studio with a dedicated Time-Series selector (Entire Life, Youth 0-25, Middle Age 26-50, Senior 51+, Current Decade, Upcoming Year). Fed rich multi-system context data (Tu Vi 12 palaces, Western Big Three & aspects, BaZi Four Pillars, Numerology dual equations) directly to the prompt.
- **Files Modified:**
  - `components/report/AiReasoningStudio.tsx`
  - `app/explore/page.tsx`
  - `app/layout.tsx`
  - `package.json`
- **Verification Evidence:**
  node test verified KaTeX produces valid mathml and visual spans. npm run build passed generating all 15 static HTML routes without error.
- **Engineering Insights & Risk Mitigation:**
  Mathematical equations in numerology and ephemeris calculations must be parsed before generic HTML character escapes to prevent KaTeX syntax breakage.

---

### [2026-10-12 16:42:01 UTC] [REFACTOR] Reordered AiReasoningStudio below calculation lab, added model & language selectors, aspect drill-down, and markdown table rendering

- **Context & Problem:**
  Positioned AiReasoningStudio below the East-West Calculation Laboratory. Implemented multi-model selection (GPT-OSS 120B, GPT-OSS 20B, Qwen 3.8 27B) and language selection (vi/en). Restructured aspect drill-downs per method (Tu Vi, Western Astro, BaZi, Numerology) and added table rendering support to formatAiMarkdown.
- **Files Modified:**
  - `components/report/AiReasoningStudio.tsx`
  - `app/explore/page.tsx`
- **Verification Evidence:**
  npm run build passed generating all 15 static HTML routes without error.
- **Engineering Insights & Risk Mitigation:**
  Placing AI reasoning after the calculation laboratory matches user natural cognitive flow: users first inspect deterministic calculation baselines, then choose specific methods and aspects to synthesize with AI.

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

