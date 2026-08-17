#!/usr/bin/env node
/* ============================================================
   KDC weekly tender email → data/tenders.json  (Node CLI)
   ------------------------------------------------------------
   Usage:
     node tools/parse-kdc-email.js <email.html> [--date YYYY-MM-DD] [--dry]

   .msg files: convert first with
     python3 tools/msg-to-html.py <email.msg> > email.html

   All parsing and merge logic lives in tools/kdc-parser.js, which
   is shared verbatim with the Apps Script automation. This file
   only does the filesystem and console work Apps Script does
   differently. Keep it that way — logic changes belong in the
   shared file so both runtimes stay in step.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const KDC = require('./kdc-parser.js');

const DATA = path.join(__dirname, '..', 'data');

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (_) { return fallback; }
}

function main() {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith('--'));
  const dry = args.includes('--dry');
  const dateArg = (args.find((a) => a.startsWith('--date=')) || '').split('=')[1]
    || (args.includes('--date') ? args[args.indexOf('--date') + 1] : null);

  if (!file) {
    console.error('Usage: node tools/parse-kdc-email.js <email.html> [--date YYYY-MM-DD] [--dry]');
    process.exit(2);
  }

  const html = fs.readFileSync(file, 'utf8');
  const issueDate = dateArg || KDC.findIssueDate(html);
  if (!issueDate) {
    console.error('Could not determine the issue date. Pass it with --date YYYY-MM-DD.');
    process.exit(2);
  }

  const incoming = KDC.parseEmail(html);
  if (!incoming.length) {
    console.error('No tender rows found. The email format may have changed —');
    console.error('check the three-cell table structure before editing the parser.');
    process.exit(1);
  }

  const outFile = path.join(DATA, 'tenders.json');
  const prev = readJson(outFile, {});
  const existing = Array.isArray(prev.opportunities) ? prev.opportunities : [];

  const result = KDC.merge(existing, incoming, issueDate);
  const overrides = readJson(path.join(DATA, 'overrides.json'), null);
  const corrected = KDC.applyOverrides(result.entries, overrides);
  const payload = KDC.build(result.entries, issueDate);

  const leak = KDC.scrub(payload);
  if (leak) {
    console.error('\nABORTED: a personal identifier or tracking link reached the output.');
    console.error(`  matched: ${leak}`);
    console.error('\nNothing was written. Fix the parser before retrying — do not');
    console.error('relax the FORBIDDEN list in tools/kdc-parser.js.\n');
    process.exit(1);
  }

  console.log(`\nKDC weekly list — ${issueDate}`);
  console.log(`  parsed from email : ${incoming.length}`);
  console.log(`  new               : ${result.added}`);
  console.log(`  updated           : ${result.updated}`);
  console.log(`  expired & dropped : ${result.expired}`);
  console.log(`  corrected         : ${corrected}`);
  console.log(`  total published   : ${result.entries.length}\n`);

  for (const e of result.entries) {
    console.log(`${e.corrected ? '*' : ' '} ${e.closes}  ${(e.location || '').padEnd(16).slice(0, 16)}  ${e.title.slice(0, 58)}`);
    console.log(`    override key: ${KDC.slug(e.title)}`);
  }
  console.log('\n  * = corrected via data/overrides.json');

  if (dry) {
    console.log('\n--dry: nothing written.\n');
    return;
  }

  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2) + '\n');
  console.log(`\nWrote ${path.relative(process.cwd(), outFile)}`);
  console.log('Review the diff, then commit and push to publish.\n');
}

if (require.main === module) main();
