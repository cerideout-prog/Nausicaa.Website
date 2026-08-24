/* ============================================================
   Nausicaa Consulting — indicative project value calculator
   ------------------------------------------------------------
   COMPLIANCE NOTES — read before editing (brief §5).

   Under the Australian Consumer Law, a saving figure shown to a
   prospective customer is a representation. Misleading or
   deceptive conduct does not require intent. Accordingly:

   1. Security of payment produces an EXPOSURE STATEMENT ONLY.
      It must never output a dollar "saving". You cannot multiply
      an unknown probability by a consequence and call the result
      a saving.
   2. The variation comparison uses the markup the USER enters
      against Nausicaa's own stated 20–30% range. Do not hardcode
      a competitor markup — that is comparative advertising.
   3. Every assumption is a visible, user-adjustable input with a
      stated default. Nothing is asserted silently.
   4. Outputs are RANGES, never point estimates.
   5. The disclaimer renders adjacent to the results, not in the
      footer, and must not be removed.
   ============================================================ */

(function () {
  'use strict';

  /* Nausicaa's own stated variation markup range — our rate, not a
     claim about anyone else's. */
  var NAUSICAA_MARKUP_LOW  = 20;
  var NAUSICAA_MARKUP_HIGH = 30;

  /* Internal rate basis, not published in page copy (js/config.js is
     authoritative; these are fallbacks if config.js has not loaded). */
  function dayRate() {
    return (window.NAUSICAA && window.NAUSICAA.dayRate) || 1280;
  }

  var $ = function (id) { return document.getElementById(id); };

  function money(n) {
    return '$' + Math.round(n).toLocaleString('en-AU');
  }

  /* Round to a sensible magnitude so a range doesn't imply
     false precision. */
  function roundish(n) {
    var abs = Math.abs(n);
    if (abs >= 1000000) return Math.round(n / 50000) * 50000;
    if (abs >= 100000)  return Math.round(n / 5000) * 5000;
    if (abs >= 10000)   return Math.round(n / 500) * 500;
    if (abs >= 1000)    return Math.round(n / 100) * 100;
    return Math.round(n / 10) * 10;
  }

  function range(lo, hi) {
    lo = roundish(lo); hi = roundish(hi);
    if (lo > hi) { var t = lo; lo = hi; hi = t; }
    if (lo === hi) return money(lo);
    return money(lo) + ' – ' + money(hi);
  }

  function num(id, fallback) {
    var el = $(id);
    if (!el) return fallback;
    var v = parseFloat(String(el.value).replace(/[^0-9.\-]/g, ''));
    return isNaN(v) ? fallback : v;
  }

  function isBlank(id) {
    var el = $(id);
    return !el || String(el.value).trim() === '';
  }

  function set(id, value, note) {
    var el = $(id);
    if (!el) return;
    el.textContent = value;
    if (note !== undefined) {
      var noteEl = document.querySelector('[data-note-for="' + id + '"]');
      if (noteEl) noteEl.textContent = note;
    }
  }

  function calc() {
    var value     = num('c-value', 0);          // contract value $
    var duration  = num('c-duration', 12);      // months
    var varPct    = num('c-varpct', 8);         // variations as % of contract value
    var markup    = num('c-markup', 0);         // user's CURRENT variation markup %
    var premium   = num('c-premium', 22);       // Kimberley cost premium %
    var procShare = num('c-procshare', 60);     // % of contract value procured/subcontracted
    var addressable = num('c-addressable', 15); // % of premium addressable, user-adjustable
    var days      = num('c-days', 3);           // on-ground days per month
    var remoteDay = num('c-remoteday', 0);      // user's cost per site attendance day

    if (duration < 1) duration = 1;

    var blankOut = ['r-var', 'r-supply', 'r-engage', 'r-exposure', 'r-fee'];
    if (value <= 0) {
      blankOut.forEach(function (id) { set(id, '—', ''); });
      set('r-var', '—', 'Enter a contract value to see an indicative range.');
      return;
    }

    /* ── 1. Variations — user's markup vs Nausicaa's stated range ── */
    var varValue = value * (varPct / 100);
    if (isBlank('c-markup') || markup <= 0) {
      set('r-var', 'Enter your markup',
        'Enter the variation markup you are currently being charged to see the indicative difference against our stated ' +
        NAUSICAA_MARKUP_LOW + '–' + NAUSICAA_MARKUP_HIGH + '% range.');
    } else {
      var costAtUserMarkup = varValue * (1 + markup / 100);
      var costAtLow        = varValue * (1 + NAUSICAA_MARKUP_LOW / 100);
      var costAtHigh       = varValue * (1 + NAUSICAA_MARKUP_HIGH / 100);
      var diffLow  = costAtUserMarkup - costAtHigh;   // smaller difference
      var diffHigh = costAtUserMarkup - costAtLow;    // larger difference

      if (diffHigh <= 0) {
        set('r-var', 'No indicative difference',
          'The markup you entered (' + markup + '%) sits at or below our stated ' +
          NAUSICAA_MARKUP_LOW + '–' + NAUSICAA_MARKUP_HIGH + '% range. On this input there is no indicative difference.');
      } else {
        set('r-var', range(Math.max(0, diffLow), diffHigh),
          'On ' + money(varValue) + ' of variations, comparing the ' + markup +
          '% you entered against our stated ' + NAUSICAA_MARKUP_LOW + '–' + NAUSICAA_MARKUP_HIGH + '% range.');
      }
    }

    /* ── 2. Supply chain — premium exposure, user-set addressable share ── */
    var procured        = value * (procShare / 100);
    var premiumExposure = procured * (premium / 100);
    var addrLow  = premiumExposure * (addressable / 100) * 0.7;
    var addrHigh = premiumExposure * (addressable / 100) * 1.3;
    set('r-supply', range(addrLow, addrHigh),
      money(premiumExposure) + ' of Kimberley premium sits in ' + money(procured) +
      ' of procured value. This range is ' + addressable + '% of that (±30%), on the inputs you set.');

    /* ── 3. On-ground vs remote engagement cost ── */
    var onGroundCost = days * dayRate() * duration;
    if (isBlank('c-remoteday') || remoteDay <= 0) {
      set('r-engage', money(onGroundCost),
        days + ' days/month × our day rate × ' + duration +
        ' months. Day and hourly rates are available on request. Enter your current cost per site attendance day to compare.');
    } else {
      var remoteCost = days * remoteDay * duration;
      var delta = remoteCost - onGroundCost;
      if (delta > 0) {
        set('r-engage', range(delta * 0.85, delta * 1.15),
          'Your ' + money(remoteDay) + '/day × ' + days + ' days × ' + duration +
          ' months = ' + money(remoteCost) + ', against ' + money(onGroundCost) + ' on our day rate.');
      } else {
        set('r-engage', 'No indicative difference',
          'The day cost you entered (' + money(remoteDay) + ') is at or below our day rate. On this input the difference is in coverage, not cost.');
      }
    }

    /* ── 4. Security of payment — EXPOSURE STATEMENT, NOT A SAVING ──
       Do not convert this to a dollar saving. See compliance notes. */
    var monthlyClaim = value / duration;
    set('r-exposure', money(monthlyClaim),
      'Indicative value of a single monthly progress claim on a ' + money(value) +
      ' contract over ' + duration + ' months. If a payment schedule is not issued in time, the amount at risk is the full amount claimed — not the amount in dispute.');

    /* ── 5. Indicative engagement cost, for context ── */
    set('r-fee', money(onGroundCost),
      'On-ground engagement at our day rate for the inputs above. Retainer and project-fee structures are usually more economic — fee schedule and day/hourly rates provided on enquiry.');
  }

  /* Comma-format the contract value field as the user types */
  function formatValueInput(e) {
    var pos = e.target.selectionStart;
    var before = e.target.value.length;
    var raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') { e.target.value = ''; return; }
    e.target.value = parseInt(raw, 10).toLocaleString('en-AU');
    var after = e.target.value.length;
    if (pos !== null) e.target.setSelectionRange(pos + (after - before), pos + (after - before));
  }

  document.addEventListener('DOMContentLoaded', function () {
    var ids = ['c-value', 'c-duration', 'c-varpct', 'c-markup', 'c-premium',
               'c-procshare', 'c-addressable', 'c-days', 'c-remoteday'];
    ids.forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener('input', calc);
      el.addEventListener('change', calc);
    });

    var valueEl = $('c-value');
    if (valueEl) valueEl.addEventListener('input', formatValueInput);

    /* Range sliders mirror their value into an adjacent output */
    document.querySelectorAll('input[type="range"][data-mirror]').forEach(function (el) {
      var out = $(el.getAttribute('data-mirror'));
      var sync = function () { if (out) out.textContent = el.value + '%'; };
      el.addEventListener('input', sync);
      sync();
    });

    if ($('c-value')) calc();
  });
})();
