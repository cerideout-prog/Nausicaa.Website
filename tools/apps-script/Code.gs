/* ============================================================
   Nausicaa Consulting — KDC tender list automation
   Google Apps Script, runs in the Workspace account
   ------------------------------------------------------------
   Reads the weekly Kimberley Development Commission tender email
   from a Gmail label, parses it, and commits data/tenders.json to
   GitHub. GitHub Pages redeploys and the site is current.

   SETUP: see README.md in this folder. Nothing here will run
   until the Script Properties are set.

   NO SECRETS IN THIS FILE. The GitHub token lives in Script
   Properties, which are not part of the repository. If you ever
   find yourself pasting a token below, stop — the repo is public.
   ============================================================ */

/* Script Property keys. Set these under
   Project Settings > Script Properties. */
var PROP = {
  TOKEN:  'GITHUB_TOKEN',    // fine-grained PAT, contents:write, this repo only
  REPO:   'GITHUB_REPO',     // e.g. cerideout-prog/Nausicaa.Website
  BRANCH: 'GITHUB_BRANCH',   // e.g. main
  LABEL:  'GMAIL_LABEL',     // e.g. KDC Tenders
  NOTIFY: 'NOTIFY_EMAIL'     // optional — where to send failure notices
};

var PATHS = {
  tenders:   'data/tenders.json',
  overrides: 'data/overrides.json'
};

/* ── entry point — attach the weekly trigger to this ────── */

function updateTenderList() {
  var cfg = getConfig_();

  var html = fetchLatestKdcEmail_(cfg.label);
  if (!html) {
    Logger.log('No message found under label "' + cfg.label + '". Nothing to do.');
    return;
  }

  var issueDate = KDC.findIssueDate(html);
  if (!issueDate) {
    fail_(cfg, 'Could not determine the issue date from the newest KDC email. ' +
               'The subject line format may have changed.');
    return;
  }

  var incoming = KDC.parseEmail(html);
  if (!incoming.length) {
    fail_(cfg, 'Parsed the KDC email for ' + issueDate + ' but found no tender rows. ' +
               'The email layout has probably changed — the parser expects each tender ' +
               'in a single-row table of three cells with a date in the third.');
    return;
  }

  var current = getJsonFile_(cfg, PATHS.tenders);
  var existing = (current.json && current.json.opportunities) || [];

  if (current.json && current.json.lastUpdated === issueDate) {
    Logger.log('Already up to date for ' + issueDate + '. Nothing committed.');
    return;
  }

  var overrides = getJsonFile_(cfg, PATHS.overrides).json;

  var result    = KDC.merge(existing, incoming, issueDate);
  var corrected = KDC.applyOverrides(result.entries, overrides);
  var payload   = KDC.build(result.entries, issueDate);

  /* Hard stop: never publish a personal identifier or tracking link. */
  var leak = KDC.scrub(payload);
  if (leak) {
    fail_(cfg, 'ABORTED before committing: a personal identifier or tracking link ' +
               'reached the output ("' + leak + '"). Nothing was published. Do not ' +
               'relax the FORBIDDEN list in Parser.gs — fix the parser.');
    return;
  }

  var summary = issueDate +
    ' — ' + result.added + ' new, ' + result.updated + ' updated, ' +
    result.expired + ' expired, ' + corrected + ' corrected, ' +
    result.entries.length + ' published';

  putJsonFile_(cfg, PATHS.tenders, payload, current.sha,
               'Procurement list — KDC week of ' + issueDate +
               '\n\n' + summary + '\n\nCommitted automatically from the KDC weekly email.');

  Logger.log('Committed: ' + summary);
}

/* ── Gmail ───────────────────────────────────────────────── */

function fetchLatestKdcEmail_(labelName) {
  var label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    throw new Error('Gmail label "' + labelName + '" does not exist. Create it and ' +
                    'add a filter that applies it to the KDC weekly email.');
  }
  var threads = label.getThreads(0, 5);
  if (!threads.length) return null;

  /* Newest message across the newest few threads. */
  var newest = null;
  for (var t = 0; t < threads.length; t++) {
    var msgs = threads[t].getMessages();
    for (var m = 0; m < msgs.length; m++) {
      if (!newest || msgs[m].getDate() > newest.getDate()) newest = msgs[m];
    }
  }
  return newest ? newest.getBody() : null;
}

/* ── GitHub contents API ─────────────────────────────────── */

function getConfig_() {
  var p = PropertiesService.getScriptProperties();
  var cfg = {
    token:  p.getProperty(PROP.TOKEN),
    repo:   p.getProperty(PROP.REPO),
    branch: p.getProperty(PROP.BRANCH) || 'main',
    label:  p.getProperty(PROP.LABEL) || 'KDC Tenders',
    notify: p.getProperty(PROP.NOTIFY) || Session.getEffectiveUser().getEmail()
  };
  if (!cfg.token || !cfg.repo) {
    throw new Error('Missing Script Properties. Set ' + PROP.TOKEN + ' and ' + PROP.REPO +
                    ' under Project Settings > Script Properties.');
  }
  return cfg;
}

function ghHeaders_(cfg) {
  return {
    Authorization: 'Bearer ' + cfg.token,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };
}

function getJsonFile_(cfg, filePath) {
  var url = 'https://api.github.com/repos/' + cfg.repo + '/contents/' + filePath +
            '?ref=' + encodeURIComponent(cfg.branch);
  var res = UrlFetchApp.fetch(url, {
    headers: ghHeaders_(cfg),
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  if (code === 404) return { json: null, sha: null };
  if (code !== 200) {
    throw new Error('GitHub GET ' + filePath + ' failed (' + code + '): ' + res.getContentText());
  }
  var body = JSON.parse(res.getContentText());
  var text = Utilities.newBlob(Utilities.base64Decode(body.content)).getDataAsString();
  var json = null;
  try { json = JSON.parse(text); } catch (e) {
    throw new Error(filePath + ' in the repo is not valid JSON. Fix it before rerunning.');
  }
  return { json: json, sha: body.sha };
}

function putJsonFile_(cfg, filePath, obj, sha, message) {
  var text = JSON.stringify(obj, null, 2) + '\n';
  var payload = {
    message: message,
    content: Utilities.base64Encode(text, Utilities.Charset.UTF_8),
    branch: cfg.branch
  };
  if (sha) payload.sha = sha;

  var res = UrlFetchApp.fetch('https://api.github.com/repos/' + cfg.repo + '/contents/' + filePath, {
    method: 'put',
    headers: ghHeaders_(cfg),
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  if (code !== 200 && code !== 201) {
    throw new Error('GitHub PUT ' + filePath + ' failed (' + code + '): ' + res.getContentText());
  }
}

/* ── failure handling ────────────────────────────────────── */
/*
   A silent failure is the dangerous one: the page keeps showing an
   older list while looking maintained. The staleness guard in
   js/procurement.js is the safety net — it warns after 21 days and
   hides the table after 42 — but a mail now is better than a
   visitor noticing later.
*/
function fail_(cfg, message) {
  Logger.log('FAILED: ' + message);
  try {
    MailApp.sendEmail(cfg.notify,
      'Nausicaa — tender list update failed',
      message + '\n\nThe website still shows the previous list. It will warn ' +
      'visitors after 21 days and hide the table after 42.\n\n' +
      'Fallback: run it by hand —\n' +
      '  python3 tools/msg-to-html.py email.msg > /tmp/kdc.html\n' +
      '  node tools/parse-kdc-email.js /tmp/kdc.html\n');
  } catch (e) {
    Logger.log('Could not send the failure notice: ' + e);
  }
}

/* ── one-off helpers, run manually from the editor ───────── */

/* Creates the weekly trigger. Run once. */
function installTrigger() {
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === 'updateTenderList') {
      ScriptApp.deleteTrigger(existing[i]);
    }
  }
  ScriptApp.newTrigger('updateTenderList')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.TUESDAY)
    .atHour(7)
    .create();
  Logger.log('Weekly trigger installed — Tuesdays around 7am.');
}

/* Parses the newest email and logs what WOULD change, without
   committing anything. Run this first. */
function dryRun() {
  var cfg = getConfig_();
  var html = fetchLatestKdcEmail_(cfg.label);
  if (!html) { Logger.log('No message under label "' + cfg.label + '".'); return; }

  var issueDate = KDC.findIssueDate(html);
  var incoming = KDC.parseEmail(html);
  Logger.log('Issue date: ' + issueDate);
  Logger.log('Parsed ' + incoming.length + ' tender(s):');
  for (var i = 0; i < incoming.length; i++) {
    Logger.log('  ' + incoming[i].closes + '  ' + incoming[i].location +
               '  ' + incoming[i].title);
    Logger.log('     override key: ' + KDC.slug(incoming[i].title));
  }

  var current = getJsonFile_(cfg, PATHS.tenders);
  Logger.log('Repo currently has ' +
    ((current.json && current.json.opportunities || []).length) + ' entries, lastUpdated ' +
    ((current.json && current.json.lastUpdated) || 'never'));
  Logger.log('Nothing was committed.');
}

/* Confirms the token works and has the access it needs. */
function testGitHubAccess() {
  var cfg = getConfig_();
  var f = getJsonFile_(cfg, PATHS.tenders);
  Logger.log('Read ' + PATHS.tenders + ' OK — ' +
    ((f.json && f.json.opportunities || []).length) + ' entries, sha ' + f.sha);
  Logger.log('Write access is not tested here. Run dryRun(), then updateTenderList().');
}
