/* ============================================================
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

/* ============================================================
   KDC weekly tender email — shared parsing logic
   ------------------------------------------------------------
   ONE SOURCE OF TRUTH, TWO RUNTIMES.

   This file is plain ES5-compatible JavaScript with no Node
   dependencies, so the same code runs in both places:

     · Node  — tools/parse-kdc-email.js requires it
     · Apps Script — paste this file's contents into a script
                     file named Parser.gs (see tools/apps-script/)

   The export at the bottom is guarded, so Apps Script (where
   `module` is undefined) simply ignores it.

   Do not add require() calls or Node globals to this file. If you
   need filesystem or network access, do it in the caller.
   ------------------------------------------------------------
   SECURITY — WHY LINKS ARE REWRITTEN, NOT COPIED

   Every href in the KDC email is an Outlook SafeLinks wrapper
   around a Mailchimp click-tracking redirect. Both carry personal
   identifiers in plain text:

     · the recipient's email address, in the SafeLinks `data` param
     · the Mailchimp subscriber id, as `?e=<id>`

   Publishing those to a public web page would expose a personal
   email address and subscriber id, and the links would rot as soon
   as the subscription changed. So every href in the email is
   DISCARDED and each entry links to the KDC's own public weekly
   PDF instead — authoritative, non-personalised, correctly
   attributed.

   scrub() is a hard backstop. If any identifier survives into the
   output, callers must abort rather than publish. Do not weaken
   FORBIDDEN.
   ============================================================ */

var KDC = (function () {
  'use strict';

  var MONTHS = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5,
                 jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };

  /* Entries whose close date passed more than this many days ago are dropped. */
  var KEEP_CLOSED_DAYS = 7;

  /* ── helpers ───────────────────────────────────────────── */

  function decode(s) {
    return String(s)
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, '’').replace(/&ndash;/g, '–')
      .replace(/&mdash;/g, '—')
      .replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(+n); });
  }

  function strip(s) {
    return decode(String(s).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  }

  function slug(s) {
    return String(s).toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  }

  function parseDate(text) {
    var m = String(text).match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})/);
    if (!m) return null;
    var mo = MONTHS[m[2].toLowerCase()];
    if (mo === undefined) return null;
    var d = new Date(Date.UTC(+m[3], mo, +m[1]));
    return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  }

  /* Category inference. Flagged categoryInferred in the output so a
     maintainer can see it was guessed rather than published by KDC. */
  var RULES = [
    [/\broad|bridge|drainage|earthwork|civil|pavement|kerb|footpath|culvert/i, 'Civil'],
    [/\bpaint|refurb|refresh|building|construct|roof|fit-?out|accommodation|housing|ablution/i, 'Building'],
    [/\bcctv|security|electrical|solar|power|air ?condition|hvac|plumb|fire\b/i, 'Plant & Equipment'],
    [/\btraining|consult|audit|design|study|plan\b|advisory|assessment|program\b/i, 'Professional'],
    [/\bsupply|provision of|purchase|procure|hire\b/i, 'Supplies'],
    [/\bservices?\b|maintenance|cleaning|catering|waste|transport/i, 'Services']
  ];

  function inferCategory(text) {
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(text)) return RULES[i][1];
    }
    return 'Other';
  }

  /* ── security backstop ─────────────────────────────────── */

  var FORBIDDEN = [
    /[\w.+-]+@[\w.-]+\.\w{2,}/,        // any email address
    /safelinks\.protection/i,
    /list-manage\.com/i,
    /mailchi\.mp/i,
    /[?&]e=[a-f0-9]{8,}/i              // mailchimp subscriber id
  ];

  /* Returns null if clean, or the offending substring if not.
     Callers MUST abort on a non-null result. */
  function scrub(obj) {
    var json = JSON.stringify(obj);
    for (var i = 0; i < FORBIDDEN.length; i++) {
      var hit = json.match(FORBIDDEN[i]);
      if (hit) return hit[0];
    }
    return null;
  }

  /* The KDC publishes each week's list as a public PDF at a
     predictable path. That is the link we publish. */
  function kdcPdfUrl(isoDate) {
    var p = isoDate.split('-');
    return 'https://www.kdc.wa.gov.au/wp-content/uploads/' + p[0] + '/' + p[1] +
           '/Kimberley-Tender-Opportunities-' + p[2] + '.' + p[1] + '.' + p[0] + '.pdf';
  }

  /* ── parser ────────────────────────────────────────────── */
  /*
     Each tender in the email is its own single-row <table> with
     three cells:

       td[0]  <a><strong>TITLE</strong></a><br>
              <em>Issued by ISSUER</em><br>
              description / site visit notes
       td[1]  location
       td[2]  closing date, e.g. "31 Aug 2026"

     Matching on that shape — three cells, third one a date —
     rather than on section headings, so the parser survives KDC
     adding or renaming sections between weeks.
  */
  function parseEmail(html) {
    var entries = [];
    var tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];

    for (var t = 0; t < tables.length; t++) {
      var rows = tables[t].match(/<tr[\s\S]*?<\/tr>/gi) || [];
      for (var r = 0; r < rows.length; r++) {
        var cells = rows[r].match(/<td[\s\S]*?<\/td>/gi) || [];
        if (cells.length !== 3) continue;

        var closes = parseDate(strip(cells[2]));
        if (!closes) continue;                     // header row, or not a tender

        // Title: anchor text, falling back to the first bold run.
        var title = '';
        var a = cells[0].match(/<a\b[^>]*>([\s\S]*?)<\/a>/i);
        if (a) title = strip(a[1]);
        if (!title) {
          var b = cells[0].match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
          if (b) title = strip(b[1]);
        }
        if (!title) continue;

        // Issuer sits in the <em> immediately after the title.
        var issuer = '';
        var em = cells[0].match(/<em[^>]*>([\s\S]*?)<\/em>/i);
        if (em) issuer = strip(em[1]).replace(/^Issued by\s*/i, '').trim();

        // Notes: text remaining in the cell after title and issuer.
        var notes = strip(cells[0]);
        if (title) notes = notes.replace(title, '');
        if (issuer) {
          var esc = issuer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          notes = notes.replace(new RegExp('Issued by\\s*' + esc, 'i'), '');
        }
        // Drop stray addresses from site-visit contact lines.
        notes = notes.replace(/[\w.+-]+@[\w.-]+\.\w{2,}/g, '').replace(/\s+/g, ' ').trim();
        if (notes.length > 240) notes = notes.slice(0, 237).replace(/\s+$/, '') + '…';

        entries.push({
          title: title,
          issuer: issuer || 'Not stated',
          category: inferCategory(title + ' ' + notes),
          categoryInferred: true,
          location: strip(cells[1]) || 'Not stated',
          closes: closes,
          notes: notes
        });
      }
    }
    return entries;
  }

  /* Issue date from the email subject or heading. */
  function findIssueDate(html) {
    var m = html.match(/Tender Opportunities[^<]*?(\d{1,2}\s+[A-Za-z]+\s+\d{4})/i);
    return m ? parseDate(m[1]) : null;
  }

  /* ── merge ─────────────────────────────────────────────── */

  /* Keyed on the title alone, deliberately. An earlier version keyed
     on title + issuer, which broke as soon as an override corrected
     an issuer: the next run's incoming entry no longer matched the
     stored corrected one and the tender was published twice. The
     title is the field overrides never change, so it is the only
     stable key — and it is the same key overrides.json uses. */
  function keyOf(e) { return slug(e.title); }

  function merge(existing, incoming, issueDate) {
    var byKey = {}, order = [], i, k;

    for (i = 0; i < existing.length; i++) {
      k = keyOf(existing[i]);
      if (!(k in byKey)) order.push(k);
      byKey[k] = existing[i];
    }

    var added = 0, updated = 0;
    for (i = 0; i < incoming.length; i++) {
      var e = incoming[i];
      k = keyOf(e);
      var prior = byKey[k];
      if (prior) {
        prior.closes = e.closes;
        if (!prior.corrected) {
          prior.location = e.location;
          prior.category = e.category;
        }
        prior.notes = e.notes || prior.notes;
        prior.lastSeen = issueDate;
        prior.url = kdcPdfUrl(issueDate);
        updated++;
      } else {
        e.source = 'KDC weekly list';
        e.url = kdcPdfUrl(issueDate);
        e.firstSeen = issueDate;
        e.lastSeen = issueDate;
        byKey[k] = e;
        order.push(k);
        added++;
      }
    }

    // Expire entries whose close date is well past.
    var cutoff = new Date(Date.parse(issueDate + 'T00:00:00Z') - KEEP_CLOSED_DAYS * 86400000)
      .toISOString().slice(0, 10);

    var kept = [], expired = 0;
    for (i = 0; i < order.length; i++) {
      var it = byKey[order[i]];
      if (!it.closes || it.closes >= cutoff) kept.push(it); else expired++;
    }

    kept.sort(function (x, y) { return String(x.closes).localeCompare(String(y.closes)); });
    return { entries: kept, added: added, updated: updated, expired: expired };
  }

  /* Corrections from overrides.json, applied last. The KDC list
     contains occasional errors — a transposed issuer and location, a
     typo'd department. Fixed here rather than by hand-editing the
     generated file, which the next run would overwrite. */
  function applyOverrides(entries, overrides) {
    if (!overrides) return 0;
    var n = 0;
    for (var i = 0; i < entries.length; i++) {
      var o = overrides[slug(entries[i].title)];
      if (!o) continue;
      for (var f in o) {
        if (Object.prototype.hasOwnProperty.call(o, f) && f.charAt(0) !== '_') {
          entries[i][f] = o[f];
        }
      }
      entries[i].categoryInferred = false;
      entries[i].corrected = true;
      n++;
    }
    return n;
  }

  /* Assemble the final data file payload. */
  function build(entries, issueDate) {
    return {
      lastUpdated: issueDate,
      source: 'Kimberley Development Commission — Kimberley Weekly Tender Opportunities',
      sourceUrl: 'https://www.kdc.wa.gov.au/',
      maintainerNote: 'Generated from the KDC weekly email. See data/README.md. Entry links point at the KDC public weekly PDF, never at the personalised tracking links in the email.',
      opportunities: entries
    };
  }

  return {
    parseEmail: parseEmail,
    findIssueDate: findIssueDate,
    merge: merge,
    applyOverrides: applyOverrides,
    build: build,
    scrub: scrub,
    slug: slug,
    kdcPdfUrl: kdcPdfUrl,
    parseDate: parseDate
  };
})();

