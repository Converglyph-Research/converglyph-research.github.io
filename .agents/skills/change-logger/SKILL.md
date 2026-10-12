---
name: frontend-change-logger
description: Log every frontend fix, UI/UX refinement, and verification into repo CHANGELOG.md.
---

# Frontend Change Logger Protocol

Whenever implementing a UI/UX update, bugfix, or component refactor:
1. Run: `node scripts/log_change.js --category <category> --summary "<summary>" --details "<details>" --files "<files>" --verification "<verification>"`
2. Document problem, technical decision, files, and verification proofs.
