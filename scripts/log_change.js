#!/usr/bin/env node
/**
 * Automated Skill Change Logger for Frontend Repository.
 * Usage:
 *   node scripts/log_change.js --category <fix|feat|refactor|docs> --summary "..." --details "..." --files "file1,file2" --verification "..."
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const CHANGELOG_PATH = path.join(BASE_DIR, 'CHANGELOG.md');
const SKILL_DIR = path.join(BASE_DIR, '.agents', 'skills', 'change-logger');
const SKILL_MD = path.join(SKILL_DIR, 'SKILL.md');

const SKILL_TEMPLATE = `---
name: frontend-change-logger
description: Log every frontend fix, UI/UX refinement, and verification into repo CHANGELOG.md.
---

# Frontend Change Logger Protocol

Whenever implementing a UI/UX update, bugfix, or component refactor:
1. Run: \`node scripts/log_change.js --category <category> --summary "<summary>" --details "<details>" --files "<files>" --verification "<verification>"\`
2. Document problem, technical decision, files, and verification proofs.
`;

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : 'true';
      parsed[key] = val;
    }
  }
  return parsed;
}

function initSkillAndChangelog() {
  fs.mkdirSync(SKILL_DIR, { recursive: true });
  if (!fs.existsSync(SKILL_MD)) {
    fs.writeFileSync(SKILL_MD, SKILL_TEMPLATE, 'utf8');
  }
  if (!fs.existsSync(CHANGELOG_PATH)) {
    fs.writeFileSync(
      CHANGELOG_PATH,
      '# Converglyph Research Frontend — Engineering & UI/UX Changelog\n\nAll component updates, bug fixes, and design system refinements are tracked below.\n\n---\n\n',
      'utf8'
    );
  }
}

function recordChange() {
  const args = parseArgs();
  if (!args.category || !args.summary || !args.details || !args.verification) {
    console.error('Error: Required arguments: --category, --summary, --details, --verification');
    process.exit(1);
  }

  initSkillAndChangelog();
  const nowUtc = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  const fileList = (args.files || '').split(',').map(f => f.trim()).filter(Boolean);
  const filesFormatted = fileList.length > 0 ? fileList.map(f => `  - \`${f}\``).join('\n') : '  - None specified';

  let entry = `### [${nowUtc}] [${args.category.toUpperCase()}] ${args.summary}\n\n` +
    `- **Context & Problem:**\n  ${args.details}\n` +
    `- **Files Modified:**\n${filesFormatted}\n` +
    `- **Verification Evidence:**\n  ${args.verification}\n`;

  if (args.insights) {
    entry += `- **Engineering Insights & Risk Mitigation:**\n  ${args.insights}\n`;
  }
  entry += '\n---\n\n';

  const existing = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  const headerEnd = existing.indexOf('---\n\n');
  let updated;
  if (headerEnd !== -1) {
    updated = existing.substring(0, headerEnd + 5) + entry + existing.substring(headerEnd + 5);
  } else {
    updated = existing + '\n' + entry;
  }

  fs.writeFileSync(CHANGELOG_PATH, updated, 'utf8');
  console.log(`[*] Change logged to ${CHANGELOG_PATH}`);
}

recordChange();
