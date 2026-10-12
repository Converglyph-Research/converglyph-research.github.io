# Converglyph Research Frontend — Engineering & UI/UX Changelog

All component updates, bug fixes, and design system refinements are tracked below.

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

