/* Benefits calculator — Nausicaa Consulting
   Helps contractors estimate the value of outsourced CA on a Kimberley project */

(function () {
  'use strict';

  const fmt = (n) =>
    '$' + Math.round(n).toLocaleString('en-AU');

  // Risk of missing the 15-business-day payment schedule window, by team location
  const locationRisk = { local: 0.07, perth: 0.22, interstate: 0.40 };

  // Average Kimberley rate premium for blind procurement vs verified local rate builds
  const RATE_PREMIUM = 0.08;

  // Variation leakage in unmanaged subcontracts as % of scope
  const VAR_LEAKAGE = 0.04;

  // Nausicaa contractor-side CA monthly fee (from engagement model)
  const CA_MONTHLY_FEE = 6500;

  function calc() {
    const scope      = parseFloat(document.getElementById('c-scope').value.replace(/,/g, '')) || 0;
    const duration   = parseInt(document.getElementById('c-duration').value) || 12;
    const subs       = parseInt(document.getElementById('c-subs').value) || 3;
    const location   = document.getElementById('c-location').value || 'interstate';
    const remoteRate = parseFloat(document.getElementById('c-rate').value) || 1800;
    const remoteDays = parseFloat(document.getElementById('c-days').value) || 2.5;

    if (scope <= 0) {
      ['r-sop','r-rates','r-var','r-admin','r-fee','r-total'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '—';
      });
      const net = document.getElementById('r-net');
      if (net) net.textContent = '—';
      return;
    }

    const risk = locationRisk[location] || 0.25;

    // 1. Security of payment protection
    //    Each subcontractor submits roughly one claim per month.
    //    If the respondent misses the 15-business-day window, the full claimed amount
    //    becomes a statutory debt. Exposure per claim ≈ scope/(duration×subs).
    const avgClaimValue = scope / (duration * subs);
    const totalClaims   = duration * subs;
    // Expected exposure = claims × avg value × risk factor × severity weight (60%)
    const sopProtection = totalClaims * avgClaimValue * risk * 0.6;

    // 2. Rate intelligence & estimation savings
    const rateSaving = scope * RATE_PREMIUM;

    // 3. Variation recovery
    const varSaving = scope * VAR_LEAKAGE;

    // 4. Admin cost saving (remote cost vs Nausicaa fee)
    const remoteCost   = remoteDays * remoteRate * duration;
    const nausicaaFee  = CA_MONTHLY_FEE * duration;
    const adminSaving  = Math.max(0, remoteCost - nausicaaFee);

    // Totals
    const totalBenefit = sopProtection + rateSaving + varSaving + adminSaving;
    const netBenefit   = totalBenefit - nausicaaFee;

    set('r-sop',   fmt(sopProtection), 'SoP exposure protected over ' + duration + ' months');
    set('r-rates', fmt(rateSaving),    'Based on typical ' + Math.round(RATE_PREMIUM*100) + '% Kimberley rate premium');
    set('r-var',   fmt(varSaving),     'Contemporaneous variation documentation');
    set('r-admin', fmt(adminSaving),   remoteCost <= nausicaaFee
      ? 'Your remote cost ($' + Math.round(remoteCost/1000) + 'k) is lower than Nausicaa fee — value is in risk reduction'
      : 'vs remote CA at ' + fmt(remoteCost));
    set('r-fee',   fmt(nausicaaFee),   'Contractor-side CA — ' + duration + ' months (indicative)');
    set('r-total', fmt(totalBenefit),  'Gross quantified benefit');

    const netEl = document.getElementById('r-net');
    if (netEl) {
      netEl.textContent = fmt(Math.max(0, netBenefit));
    }
  }

  function set(id, value, note) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value;
    const noteEl = el.nextElementSibling;
    if (noteEl && noteEl.classList.contains('result-note')) {
      noteEl.textContent = note;
    }
  }

  // Comma-format the scope input as the user types
  function formatScopeInput(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') { e.target.value = ''; return; }
    e.target.value = parseInt(raw, 10).toLocaleString('en-AU');
  }

  document.addEventListener('DOMContentLoaded', function () {
    const inputs = ['c-scope','c-duration','c-subs','c-location','c-rate','c-days'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', calc);
      el.addEventListener('change', calc);
    });

    const scopeEl = document.getElementById('c-scope');
    if (scopeEl) scopeEl.addEventListener('input', formatScopeInput);

    calc(); // run on load with defaults
  });
})();
