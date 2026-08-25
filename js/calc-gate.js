/* ============================================================
   Nausicaa Consulting — lead-capture gate for the indicative
   calculator. The calculator inputs are always visible; work
   email + organisation are compulsory before the RESULTS
   (#calc-results-body) are revealed. The submission — including
   the figures the visitor was looking at — is sent to the same
   Formspree endpoint as the contact form, tagged by form_name so
   it can be told apart in the inbox and followed up manually.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'nausicaaCalcUnlocked';
  var FORMSPREE_URL = 'https://formspree.io/f/mbdebkdw';

  var gate = document.getElementById('calc-gate');
  var resultsBody = document.getElementById('calc-results-body');
  if (!gate || !resultsBody) return;

  function unlock() {
    gate.style.display = 'none';
    resultsBody.classList.remove('is-locked');
  }

  var alreadyUnlocked = false;
  try {
    alreadyUnlocked = sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch (e) { /* storage unavailable — fall through to gate */ }

  if (alreadyUnlocked) {
    unlock();
    return;
  }

  var form = document.getElementById('calc-gate-form');
  if (!form) return;

  /* Snapshot the current on-page figures so the record kept for
     manual follow-up carries the same ranges the visitor saw. */
  function currentFigures() {
    var ids = ['r-var', 'r-supply', 'r-engage', 'r-exposure', 'r-fee'];
    var labels = {
      'r-var': 'Indicative variation cost difference',
      'r-supply': 'Indicative supply chain sourcing difference',
      'r-engage': 'On-ground vs remote engagement',
      'r-exposure': 'Security of payment — amount at risk',
      'r-fee': 'Indicative engagement cost'
    };
    return ids.map(function (id) {
      var el = document.getElementById(id);
      var value = el ? el.textContent : '—';
      return labels[id] + ': ' + value;
    }).join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Please wait…'; }

    var data = new FormData(form);
    data.append('form_name', 'Indicative calculator — lead capture');
    data.append('source_page', window.location.pathname);
    data.append('figures', currentFigures());

    function afterSubmit() {
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
      unlock();
    }

    fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    }).then(afterSubmit, afterSubmit);
  });
})();
