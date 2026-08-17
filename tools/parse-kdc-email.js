#!/usr/bin/env node
/* ============================================================
   KDC weekly tender email → data/tenders.json
   ------------------------------------------------------------
   Parses the "Kimberley Weekly Tender Opportunities" email issued
   by the Kimberley Development Commission and merges it into the
   procurement table's data file.

   Usage:
     node tools/parse-kdc-email.js <email.html> [--date YYYY-MM-DD] [--dry]

   .msg files: convert first with
     python3 tools/msg-to-html.py <email.msg> > email.html

   ------------------------------------------------------------
   SECURITY — WHY LINKS ARE REWRITTEN, NOT COPIED

   Every href in the KDC email is an Outlook SafeLinks wrapper
   around a Mailchimp click-tracking redirect. Both carry personal
   identifiers in plain text:

     · the recipient's email address, in the SafeLinks `data` param
     · the Mailchimp subscriber id, as `?e=<id>`

   Copying those URLs onto a public web page would publish the
   recipient's email address and subscriber id to the internet, and
   the links would rot as soon as the subscription changed. So this
   parser DISCARDS every href in the email and links each entry to
   the KDC's own public weekly PDF instead — which is authoritative,
   non-personalised, and correctly attributes the source.

   scrub() below is a hard backstop: if any personal identifier
   survives into the output, the script aborts rather than writing.
   Do not weaken it.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

const MONTHS = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5,
                 jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };

/* Entries whose close date passed more than this many days ago are dropped. */
const KEEP_CLOSED_DAYS = 7;

/* ── helpers ─────────────────────────────────────────────── */

const decode = (s) => String(s)
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&rsquo;/g, '’').replace(/&ndash;/g, '–')
  .replace(/&mdash;/g, '—').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

const strip = (s) => decode(String(s).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const slug = (s) => String(s).toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

function parseDate(text) {
  const m = String(text).match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})/);
  if (!m) return null;
  const mo = MONTHS[m[2].toLowerCase()];
  if (mo === undefined) return null;
  const d = new Date(Date.UTC(+m[3], mo, +m[1]));
  return isNaN(d) ? null : d.toISOString().slice(0, 10);
}

/* Category inference. Marked `categoryInferred` in the output so a
   maintainer knows it was guessed rather than published by KDC. */
const RULES = [
  [/\broad|bridge|drainage|earthwork|civil|pavement|kerb|footpath|culvert/i, 'Civil'],
  [/\bpaint|refurb|refresh|building|construct|roof|fit-?out|accommodation|housing|ablution/i, 'Building'],
  [/\bcctv|security|electrical|solar|power|air ?condition|hvac|plumb|fire\b/i, 'Plant & Equipment'],
  [/\btraining|consult|audit|design|study|plan\b|advisory|assessment|program\b/i, 'Professional'],
  [/\bsupply|provision of|purchase|procure|hire\b/i, 'Supplies'],
  [/\bservices?\b|maintenance|cleaning|catering|waste|transport/i, 'Services'],
];
const inferCategory = (t) => (RULES.find(([re]) => re.test(t)) || [null, 'Other'])[1];

/* Hard backstop against leaking personal identifiers. */
const FORBIDDEN = [
  /[\w.+-]+@[\w.-]+\.\w{2,}/,        // any email address
  /safelinks\.protection/i,
  /list-manage\.com/i,
  /mailchi\.mp/i,
  /[?&]e=[a-f0-9]{8,}/i,             // mailchimp subscriber id
];
function scrub(obj, where) {
  const json = JSON.stringify(obj);
  for (const re of FORBIDDEN) {
    const hit = json.match(re);
    if (hit) {
      console.error(`\nABORTED: a personal identifier or tracking link reached the output.`);
      console.error(`  matched: ${hit[0]}`);
      console.error(`  in:      ${where}`);
      console.error(`\nNothing was written. Fix the parser before retrying — do not`);
      console.error(`relax the check in FORBIDDEN.\n`);
      process.exit(1);
    }
  }
}

/* The KDC publishes each week's list as a public PDF at a predictable
   path. That is the link we publish: public, non-personalised, and
   correct attribution to the compiler. */
function kdcPdfUrl(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `https://www.kdc.wa.gov.au/wp-content/uploads/${y}/${m}/Kimberley-Tender-Opportunities-${d}.${m}.${y}.pdf`;
}

/* ── parser ──────────────────────────────────────────────── */
/*
   Each tender in the email is its own single-row <table> with three
   cells:

     td[0]  <a><strong>TITLE</strong></a><br>
            <em>Issued by ISSUER</em><br>
            description / site visit notes
     td[1]  location
     td[2]  closing date, e.g. "31 Aug 2026"

   Matching on that shape — three cells, third one a date — rather
   than on section headings, so the parser survives KDC adding or
   renaming sections between weeks.
*/
function parseEmail(html) {
  const entries = [];
  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];

  for (const table of tables) {
    const rows = table.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    for (const row of rows) {
      const cells = row.match(/<td[\s\S]*?<\/td>/gi) || [];
      if (cells.length !== 3) continue;

      const closes = parseDate(strip(cells[2]));
      if (!closes) continue;                       // header row, or not a tender

      // Title: the anchor text, falling back to the first bold run.
      let title = '';
      const a = cells[0].match(/<a\b[^>]*>([\s\S]*?)<\/a>/i);
      if (a) title = strip(a[1]);
      if (!title) {
        const b = cells[0].match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
        if (b) title = strip(b[1]);
      }
      if (!title) continue;

      // Issuer sits in the <em> immediately after the title.
      let issuer = '';
      const em = cells[0].match(/<em[^>]*>([\s\S]*?)<\/em>/i);
      if (em) issuer = strip(em[1]).replace(/^Issued by\s*/i, '').trim();

      // Notes: whatever text remains in the cell after title and issuer.
      let notes = strip(cells[0]);
      if (title)  notes = notes.replace(title, '');
      if (issuer) notes = notes.replace(new RegExp('Issued by\\s*' + issuer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '');
      notes = notes.replace(/\s+/g, ' ').trim();
      // Drop any stray mail addresses from site-visit contact lines.
      notes = notes.replace(/[\w.+-]+@[\w.-]+\.\w{2,}/g, '').replace(/\s+/g, ' ').trim();
      if (notes.length > 240) notes = notes.slice(0, 237).trimEnd() + '…';

      entries.push({
        title,
        issuer: issuer || 'Not stated',
        category: inferCategory(title + ' ' + notes),
        categoryInferred: true,
        location: strip(cells[1]) || 'Not stated',
        closes,
        notes,
      });
    }
  }
  return entries;
}

/* ── merge ───────────────────────────────────────────────── */

/* Corrections applied after the merge, from data/overrides.json.
   The KDC list contains occasional errors — a swapped issuer and
   location, a typo'd department name. Those are fixed here rather
   than by hand-editing tenders.json, because the next run would
   overwrite a hand edit. Overrides always win. */
function applyOverrides(entries, overrides) {
  if (!overrides) return 0;
  let n = 0;
  for (const e of entries) {
    const o = overrides[slug(e.title)];
    if (!o) continue;
    Object.assign(e, o);
    e.categoryInferred = false;
    e.corrected = true;
    n++;
  }
  return n;
}

function merge(existing, incoming, issueDate) {
  const byKey = new Map();
  /* Keyed on the title alone, deliberately. An earlier version keyed on
     title + issuer, which broke as soon as an override corrected an
     issuer: the next run's incoming entry no longer matched the stored
     corrected one and the tender was published twice. The title is the
     field overrides never change, so it is the only stable key — and it
     is the same key data/overrides.json uses. */
  const key = (e) => slug(e.title);

  for (const e of existing) byKey.set(key(e), e);

  let added = 0, updated = 0;
  for (const e of incoming) {
    const k = key(e);
    const prior = byKey.get(k);
    if (prior) {
      // Refresh the volatile fields; keep any manual corrections.
      const wasCorrected = prior.categoryInferred === false;
      byKey.set(k, {
        ...prior,
        closes: e.closes,
        location: prior.locationCorrected ? prior.location : e.location,
        notes: e.notes || prior.notes,
        category: wasCorrected ? prior.category : e.category,
        lastSeen: issueDate,
        url: kdcPdfUrl(issueDate),
      });
      updated++;
    } else {
      byKey.set(k, {
        ...e,
        source: 'KDC weekly list',
        url: kdcPdfUrl(issueDate),
        firstSeen: issueDate,
        lastSeen: issueDate,
      });
      added++;
    }
  }

  // Expire entries whose close date is well past.
  const cutoff = new Date(Date.parse(issueDate + 'T00:00:00Z') - KEEP_CLOSED_DAYS * 86400000)
    .toISOString().slice(0, 10);
  const all = [...byKey.values()];
  const kept = all.filter((e) => !e.closes || e.closes >= cutoff);
  const expired = all.length - kept.length;

  kept.sort((a, b) => String(a.closes).localeCompare(String(b.closes)));
  return { entries: kept, added, updated, expired };
}

/* ── main ────────────────────────────────────────────────── */

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

  // Issue date: --date wins, else the date in the email subject/heading.
  let issueDate = dateArg;
  if (!issueDate) {
    const m = html.match(/Tender Opportunities[^<]*?(\d{1,2}\s+[A-Za-z]+\s+\d{4})/i);
    if (m) issueDate = parseDate(m[1].replace(/([A-Za-z]{3})[a-z]*/, '$1'));
  }
  if (!issueDate) {
    console.error('Could not determine the issue date. Pass it with --date YYYY-MM-DD.');
    process.exit(2);
  }

  const incoming = parseEmail(html);
  if (!incoming.length) {
    console.error('No tender rows found. The email format may have changed —');
    console.error('check the three-cell table structure before editing the parser.');
    process.exit(1);
  }

  const out = path.join(__dirname, '..', 'data', 'tenders.json');
  let existing = [];
  try {
    const prev = JSON.parse(fs.readFileSync(out, 'utf8'));
    existing = Array.isArray(prev.opportunities) ? prev.opportunities : [];
  } catch (_) { /* first run */ }

  const { entries, added, updated, expired } = merge(existing, incoming, issueDate);

  let overrides = null;
  const ovPath = path.join(__dirname, '..', 'data', 'overrides.json');
  try { overrides = JSON.parse(fs.readFileSync(ovPath, 'utf8')); } catch (_) { /* optional */ }
  const corrected = applyOverrides(entries, overrides);

  const payload = {
    lastUpdated: issueDate,
    source: 'Kimberley Development Commission — Kimberley Weekly Tender Opportunities',
    sourceUrl: 'https://www.kdc.wa.gov.au/',
    maintainerNote: 'Generated by tools/parse-kdc-email.js. See data/README.md. Entry links point at the KDC public weekly PDF, never at the personalised tracking links in the email.',
    opportunities: entries,
  };

  scrub(payload, out);

  console.log(`\nKDC weekly list — ${issueDate}`);
  console.log(`  parsed from email : ${incoming.length}`);
  console.log(`  new               : ${added}`);
  console.log(`  updated           : ${updated}`);
  console.log(`  expired & dropped : ${expired}`);
  console.log(`  corrected         : ${corrected}`);
  console.log(`  total published   : ${entries.length}\n`);

  for (const e of entries) {
    const flag = e.corrected ? '*' : ' ';
    console.log(`${flag} ${e.closes}  ${(e.location || '').padEnd(16).slice(0, 16)}  ${e.title.slice(0, 58)}`);
    console.log(`    override key: ${slug(e.title)}`);
  }
  console.log('\n  * = corrected via data/overrides.json');

  if (dry) {
    console.log('\n--dry: nothing written.\n');
    return;
  }

  fs.writeFileSync(out, JSON.stringify(payload, null, 2) + '\n');
  console.log(`\nWrote ${path.relative(process.cwd(), out)}`);
  console.log('Review the diff, then commit and push to publish.\n');
}

if (require.main === module) main();
module.exports = { parseEmail, merge, scrub, kdcPdfUrl };
