/* ============================================================
   Nausicaa Consulting — lead-capture gate for the indicative
   calculator. Work email + organisation are compulsory before
   the calculator (#calc-wrap) is revealed. Submissions are sent
   to the same Formspree endpoint as the contact form, tagged by
   form_name so they can be told apart in the inbox.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'nausicaaCalcUnlocked';
  var FORMSPREE_URL = 'https://formspree.io/f/mbdebkdw';

  var gate = document.getElementById('calc-gate');
  var wrap = document.getElementById('calc-wrap');
  if (!gate || !wrap) return;

  function unlock() {
    gate.style.display = 'none';
    wrap.classList.remove('is-locked');
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

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Please wait…'; }

    var data = new FormData(form);
    data.append('form_name', 'Indicative calculator — lead capture');
    data.append('source_page', window.location.pathname);

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
