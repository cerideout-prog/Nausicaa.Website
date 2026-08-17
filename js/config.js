/* ============================================================
   Nausicaa Consulting — entity configuration
   ------------------------------------------------------------
   SINGLE SOURCE OF TRUTH for entity details across the site.

   To switch to the Pty Ltd structure once the company is
   registered, change ONLY the values in this file:
     1. set `legalName` to the registered company name
     2. set `acn` to the ACN (currently null — suppressed)
     3. set `entityType` to 'company'
   Nothing else on the site needs editing.

   DO NOT publish a Pty Ltd name, ACN or "Pty Ltd" suffix
   until the company is actually registered (brief §15.3).
   ============================================================ */

window.NAUSICAA = {

  /* ── Entity ────────────────────────────────────────────── */
  tradingName: 'Nausicaa Consulting',
  legalName:   'Callum Edward Rideout',
  entityType:  'sole-trader',        // 'sole-trader' | 'company'
  abn:         '45 773 440 451',
  acn:         null,                 // set once Pty Ltd registered

  /* ── Contact ───────────────────────────────────────────── */
  /* Switch to callum@nausicaaconsulting.com.au once the Workspace
     mailbox is live and MX/SPF/DKIM/DMARC are verified. Changing it
     here updates the header bar, contact page, footer and schema in
     one go. Don't switch until mail actually delivers to it. */
  email:       'cerideout@gmail.com',
  phone:       '0450 137 044',
  phoneHref:   'tel:+61450137044',
  linkedin:    'https://www.linkedin.com/in/callum-rideout/',

  /* ── Location ──────────────────────────────────────────── */
  suburb:      'Djugun (Broome)',
  locality:    'Broome',
  state:       'WA',
  postcode:    '6725',

  /* ── Published rate basis (brief §5.2, §10.1) ──────────── */
  hourlyRate:  160,
  dayRate:     1280,
  dayHours:    8,

  /* ── Insurance — DO NOT POPULATE UNTIL COVER IS BOUND ──── */
  /* Leave both null. When null, every insurance block on the
     site stays hidden. Populating them reveals the blocks.   */
  piCover:     null,                 // e.g. '$5,000,000'
  plCover:     null,                 // e.g. '$20,000,000'

  /* ── Site ──────────────────────────────────────────────── */
  domain:      'nausicaaconsulting.com.au'
};

(function () {
  'use strict';
  var C = window.NAUSICAA;

  /* Entity line — switches automatically on entityType */
  C.entityLine = (C.entityType === 'company' && C.acn)
    ? C.legalName + ' ACN ' + C.acn
    : C.tradingName + ' trades as ' + C.legalName + '. ABN ' + C.abn + '.';

  C.abnLine  = 'ABN ' + C.abn + ' · ' + C.locality + ' ' + C.state;
  C.address  = C.suburb + ', Western Australia ' + C.postcode;
  C.insured  = !!(C.piCover && C.plCover);

  function fill() {
    /* Text substitution: <span data-entity="abn"></span> */
    document.querySelectorAll('[data-entity]').forEach(function (el) {
      var key = el.getAttribute('data-entity');
      if (C[key] !== null && C[key] !== undefined) el.textContent = C[key];
    });

    /* Href substitution: <a data-entity-href="phoneHref"> */
    document.querySelectorAll('[data-entity-href]').forEach(function (el) {
      var key = el.getAttribute('data-entity-href');
      if (C[key]) el.setAttribute('href', C[key]);
    });

    /* Insurance blocks stay hidden until cover is bound */
    document.querySelectorAll('[data-requires="insurance"]').forEach(function (el) {
      if (!C.insured) el.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fill);
  } else {
    fill();
  }
})();
