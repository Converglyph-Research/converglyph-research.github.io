# Converglyph Frontend Architecture & UX Guidelines

> **UI/UX Contracts, Memory, and Architectural Guardrails**

---

## 🏛️ 1. Convergence Matrix Dedicated Placement

- The **Convergence Matrix** is a dedicated top-level analytical section on `/explore` and `/research`.
- **Preconditions**:
  - `activeMethodsCount >= 2`: The convergence matrix displays active comparison models, agreement scores, and consensus vs. tension tables.
  - `activeMethodsCount < 2`: Displays an informative prompt inviting the user to enable at least two traditions to unlock cross-system synthesis.

---

## ⏳ 2. Life Stage & Time-Series Methodology Restrictions

When presenting temporal or developmental lifespans:
1. **Tử Vi Đẩu Số**: Must map to authentic **Đại Hạn 10 năm** and **Tiểu Hạn 1 năm**, rooted in the elemental Bureau (*Cục*).
2. **Western Astrology**: Must map to planetary transit cycles (Saturn returns at 29.5/59 years, Jupiter returns every 12 years, Uranus opposition at 42).
3. **Bát Tự (BaZi)**: Must map to **Đại Vận 10 năm** and **Lưu Niên 1 năm**.
4. **Numerology**: Must map to **4 Pinnacles (Đỉnh cao)**, Challenges, and **Personal Year Cycles 1–9**.
5. Traditions lacking native time constructs (e.g. single hexagram I Ching) must **never** be forced into arbitrary annual timelines.

---

## 📐 3. Mathematical Formula & Table Rendering Standards

1. **KaTeX Integration**:
   - Math equations must always render via KaTeX (`katex.renderToString`).
   - Formulas must be processed prior to string sanitization to avoid mangling `\text{}`, `\sum`, or exponents.
2. **Table Parsing**:
   - Markdown table rows must always compile into styled responsive HTML `<table style="...">` elements.
   - Raw pipes `|` must never be displayed as plain text.

---

## 🔒 4. Tier & Permissions Guard

- Unauthenticated requests default to `UserPlanTier.FREE`.
- The frontend passes `tier`, `allowed_traditions`, and filtered `context` in all requests to `/api/calculate` and `/api/ai/reasoning`.
- The backend purges unpermitted traditions, preventing hallucinated comparisons.
