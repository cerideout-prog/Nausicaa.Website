#!/usr/bin/env node
/* Regenerates tools/apps-script/Parser.gs from tools/kdc-parser.js.

   Apps Script cannot import from the repo, so the shared parser has
   to exist as a second physical file. Generating it — rather than
   copying by hand — is what stops the two drifting apart.

   Run after any change to kdc-parser.js:
     node tools/build-parser-gs.js

   --check exits non-zero if the generated file is out of date,
   so it can be wired into CI later. */

'use strict';

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'kdc-parser.js');
const OUT = path.join(__dirname, 'apps-script', 'Parser.gs');

const HEADER = `/* ============================================================
   GENERATED FILE — DO NOT EDIT HERE
   ------------------------------------------------------------
   Generated from tools/kdc-parser.js by tools/build-parser-gs.js.

   Edit the source file, then run:
       node tools/build-parser-gs.js

   Editing this copy directly means the Node CLI and the Apps
   Script automation quietly disagree about how to parse the
   email — which is exactly the bug this generation step exists
   to prevent.
   ============================================================ */

`;

function generate() {
  const src = fs.readFileSync(SRC, 'utf8')
    // The Node interop line is meaningless in Apps Script; drop it.
    .replace(/\n\/\* Node interop\.[\s\S]*$/, '\n');
  return HEADER + src;
}

const wanted = generate();

if (process.argv.includes('--check')) {
  let actual = '';
  try { actual = fs.readFileSync(OUT, 'utf8'); } catch (_) {}
  if (actual !== wanted) {
    console.error('Parser.gs is out of date. Run: node tools/build-parser-gs.js');
    process.exit(1);
  }
  console.log('Parser.gs is up to date.');
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, wanted);
console.log('Wrote ' + path.relative(path.join(__dirname, '..'), OUT));
