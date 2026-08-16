/* ============================================================
   Active procurement table — Nausicaa Consulting
   ------------------------------------------------------------
   Reads data/tenders.json and renders a sortable, filterable
   table. Manual data entry — see data/README.md.

   STALENESS BEHAVIOUR IS DELIBERATE (brief §7):
   a stale procurement table is worse than no table.
     · over 21 days since lastUpdated → visible staleness warning
     · over 42 days, or lastUpdated null → table suppressed entirely
   Do not remove this.
   ============================================================ */

(function () {
  'use strict';

  var STALE_WARN_DAYS = 21;
  var STALE_HIDE_DAYS = 42;

  var state = { rows: [], sortKey: 'closes', sortDir: 1, category: '', q: '' };

  var $ = function (id) { return document.getElementById(id); };

  function daysBetween(a, b) {
    return Math.floor((b - a) / 86400000);
  }

  function parseDate(s) {
    if (!s) return null;
    var p = String(s).split('-');
    if (p.length !== 3) return null;
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    return isNaN(d.getTime()) ? null : d;
  }

  function fmtDate(d) {
    if (!d) return '—';
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Only http(s) links are rendered, so a malformed data entry can't
     inject a javascript: URL into the page. */
  function safeUrl(u) {
    if (!u) return null;
    return /^https?:\/\//i.test(u) ? u : null;
  }

  function render() {
    var tbody = $('proc-body');
    if (!tbody) return;

    var today = new Date();
    today = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    var rows = state.rows.filter(function (r) {
      if (state.category && r.category !== state.category) return false;
      if (state.q) {
        var hay = (r.title + ' ' + r.issuer + ' ' + r.location + ' ' + (r.reference || '')).toLowerCase();
        if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
      }
      return true;
    });

    rows.sort(function (a, b) {
      var x = a[state.sortKey], y = b[state.sortKey];
      if (state.sortKey === 'closes') {
        x = parseDate(x) || new Date(8640000000000000);
        y = parseDate(y) || new Date(8640000000000000);
        return (x - y) * state.sortDir;
      }
      x = String(x || '').toLowerCase();
      y = String(y || '').toLowerCase();
      return (x < y ? -1 : x > y ? 1 : 0) * state.sortDir;
    });

    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="proc-empty">No opportunities match those filters.</td></tr>';
      return;
    }

    tbody.innerHTML = rows.map(function (r) {
      var close = parseDate(r.closes);
      var cls = '', label = fmtDate(close);
      if (close) {
        var d = daysBetween(today, close);
        if (d < 0) { cls = 'proc-closed'; label = fmtDate(close) + ' (closed)'; }
        else if (d <= 14) { cls = 'proc-closing-soon'; label = fmtDate(close) + (d === 0 ? ' (today)' : ' (' + d + 'd)'); }
      }
      var url = safeUrl(r.url);
      return '<tr>' +
        '<td><span class="proc-title">' + esc(r.title) + '</span>' +
          (r.reference ? '<br><span style="font-size:0.8rem;color:var(--ink-muted);">' + esc(r.reference) + '</span>' : '') +
          (r.notes ? '<br><span style="font-size:0.8rem;color:var(--ink-muted);">' + esc(r.notes) + '</span>' : '') +
        '</td>' +
        '<td>' + esc(r.issuer) + '</td>' +
        '<td>' + esc(r.category) + '</td>' +
        '<td>' + esc(r.location) + '</td>' +
        '<td class="' + cls + '">' + esc(label) + '</td>' +
        '<td>' + (url
            ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(r.source || 'View') + ' &nearr;</a>'
            : esc(r.source || '—')) + '</td>' +
        '</tr>';
    }).join('');
  }

  function wireSorting() {
    document.querySelectorAll('.proc-table th[data-key]').forEach(function (th) {
      th.addEventListener('click', function () {
        var key = th.getAttribute('data-key');
        if (state.sortKey === key) { state.sortDir *= -1; }
        else { state.sortKey = key; state.sortDir = 1; }
        document.querySelectorAll('.proc-table th .sort-ind').forEach(function (s) { s.textContent = ''; });
        var ind = th.querySelector('.sort-ind');
        if (ind) ind.textContent = state.sortDir === 1 ? '▲' : '▼';
        render();
      });
    });
  }

  function showNotice(html) {
    var el = $('proc-notice');
    if (el) el.innerHTML = html;
  }

  function suppressTable(reason) {
    var wrap = $('proc-table-wrap');
    var bar  = $('proc-toolbar');
    if (wrap) wrap.style.display = 'none';
    if (bar) bar.style.display = 'none';
    showNotice(
      '<div class="calc-disclaimer"><strong>This list is not currently being maintained</strong>' +
      '<p>' + reason + ' Rather than show you procurement data that may be out of date, the table is hidden. ' +
      'Check the issuing bodies directly, or <a href="/contact.html">get in touch</a> and we will point you at what is open.</p></div>'
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!$('proc-body')) return;

    fetch('data/tenders.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var updated = parseDate(data.lastUpdated);
        var today = new Date();
        today = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

        if (!updated) {
          suppressTable('No update date has been recorded against this list.');
          return;
        }

        var age = daysBetween(updated, today);
        if (age > STALE_HIDE_DAYS) {
          suppressTable('It was last updated ' + age + ' days ago, on ' + fmtDate(updated) + '.');
          return;
        }

        var upd = $('proc-updated');
        if (upd) upd.textContent = 'Last updated ' + fmtDate(updated);

        if (age > STALE_WARN_DAYS) {
          showNotice(
            '<div class="calc-disclaimer"><strong>This list may be out of date</strong>' +
            '<p>It was last updated ' + age + ' days ago, on ' + fmtDate(updated) +
            '. Verify anything here directly with the issuing body before relying on it.</p></div>'
          );
        }

        state.rows = Array.isArray(data.opportunities) ? data.opportunities : [];

        if (!state.rows.length) {
          var tbody = $('proc-body');
          if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" class="proc-empty">' +
              'No opportunities are currently listed. This list is compiled manually and only includes items sighted on the issuing body&rsquo;s own portal.' +
              '</td></tr>';
          }
          return;
        }

        /* Populate the category filter from the data itself */
        var cats = {};
        state.rows.forEach(function (r) { if (r.category) cats[r.category] = 1; });
        var sel = $('proc-category');
        if (sel) {
          Object.keys(cats).sort().forEach(function (c) {
            var o = document.createElement('option');
            o.value = c; o.textContent = c;
            sel.appendChild(o);
          });
        }

        render();
      })
      .catch(function () {
        suppressTable('The procurement list could not be loaded.');
      });

    var sel = $('proc-category');
    if (sel) sel.addEventListener('change', function () { state.category = sel.value; render(); });

    var q = $('proc-search');
    if (q) q.addEventListener('input', function () { state.q = q.value; render(); });

    wireSorting();
  });
})();
