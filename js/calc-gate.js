/* ============================================================
   Nausicaa Consulting — lead-capture gate for the indicative
   calculator. The calculator inputs are always visible; work
   email + organisation are compulsory before the RESULTS
   (#calc-results-body) are revealed. The user picks how they
   want the figures: revealed inline now, or emailed to them as
   a non-binding estimate they can forward on. Submissions are
   sent to the same Formspree endpoint as the contact form,
   tagged by form_name so they can be told apart in the inbox.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'nausicaaCalcUnlocked';
  var FORMSPREE_URL = 'https://formspree.io/f/mbdebkdw';

  var gate = document.getElementById('calc-gate');
  var resultsBody = document.getElementById('calc-results-body');
  if (!gate || !resultsBody) return;

  var form = document.getElementById('calc-gate-form');
  var sentNotice = document.getElementById('calc-gate-sent');

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

  if (!form) return;

  /* Snapshot the current on-page figures so an "email me" request
     carries the same ranges the visitor was looking at. */
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

    var mode = (e.submitter && e.submitter.value) || 'view';
    var buttons = form.querySelectorAll('button[type="submit"]');
    buttons.forEach(function (b) { b.disabled = true; });
    if (e.submitter) e.submitter.textContent = 'Please wait…';

    var data = new FormData(form);
    data.delete('delivery');

    if (mode === 'email') {
      data.append('form_name', 'Indicative calculator — email me my figures');
      data.append('requested_delivery', 'Email the figures below to the submitter as a non-binding estimate.');
      data.append('figures', currentFigures());
    } else {
      data.append('form_name', 'Indicative calculator — lead capture');
    }
    data.append('source_page', window.location.pathname);

    function afterSubmit() {
      if (mode === 'email') {
        form.style.display = 'none';
        if (sentNotice) sentNotice.hidden = false;
        /* Figures stay locked on-page for an email request — nothing
           to unlock here, this is a delivery choice, not a view choice. */
      } else {
        try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
        unlock();
      }
    }

    fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    }).then(afterSubmit, afterSubmit);
  });
})();
