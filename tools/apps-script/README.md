# Apps Script — automatic tender list updates

Runs inside the Nausicaa Google Workspace account. Reads the weekly Kimberley
Development Commission tender email from a Gmail label, parses it, and commits
`data/tenders.json` to GitHub. Pages redeploys and the site is current.

No portal logins. No scraping. No password sharing. The script reads one label
in your own mailbox, using your own account's authorisation.

---

## Before you start

You need:

- The Workspace account active, receiving the KDC weekly email
- A GitHub account with write access to `cerideout-prog/Nausicaa.Website`

Takes about 20 minutes.

---

## 1. Label the email in Gmail

Gmail → Settings → **Filters and Blocked Addresses** → *Create a new filter*.

| Field | Value |
|---|---|
| From | the KDC sender address |
| Subject | `Kimberley Weekly Tender Opportunities` |

Then *Create filter* → tick **Apply the label** → *New label* → `KDC Tenders`.

Tick **Also apply filter to matching conversations** so existing emails get
labelled too. Check at least one message now carries the label — the script does
nothing without it.

---

## 2. Create the GitHub token

GitHub → Settings → Developer settings → **Personal access tokens** →
*Fine-grained tokens* → **Generate new token**.

| Setting | Value |
|---|---|
| Name | `nausicaa-tender-bot` |
| Expiration | 1 year — diarise the renewal |
| Repository access | **Only select repositories** → `Nausicaa.Website` |
| Permissions | Repository permissions → **Contents: Read and write** |

Nothing else. Contents-write on one repository is all it needs. Copy the token —
GitHub shows it once.

> **The repository is public.** The token goes in Script Properties, never in a
> file. If a token is ever committed, revoke it immediately — assume it is
> compromised the moment it is pushed.

---

## 3. Create the script

[script.google.com](https://script.google.com) → **New project** → name it
*Nausicaa — Tender List*.

Create two script files:

| Script file | Paste in the contents of |
|---|---|
| `Code.gs` | `tools/apps-script/Code.gs` |
| `Parser.gs` | `tools/apps-script/Parser.gs` |

`Parser.gs` is generated from `tools/kdc-parser.js` — the same code the Node CLI
uses, so both runtimes parse identically. Don't edit it in the Apps Script
editor; edit the source and regenerate:

```bash
node tools/build-parser-gs.js
```

---

## 4. Set the Script Properties

Project Settings → **Script Properties** → *Add script property*:

| Property | Value |
|---|---|
| `GITHUB_TOKEN` | the token from step 2 |
| `GITHUB_REPO` | `cerideout-prog/Nausicaa.Website` |
| `GITHUB_BRANCH` | `main` |
| `GMAIL_LABEL` | `KDC Tenders` |
| `NOTIFY_EMAIL` | where failure notices go (optional — defaults to you) |

---

## 5. Test before automating

Run these from the editor's function dropdown, in order. The first run asks for
authorisation — Gmail read and external requests. Approve it.

| Run | Expect |
|---|---|
| `testGitHubAccess` | Logs the current entry count and a file sha |
| `dryRun` | Logs the parsed tenders and their override keys. **Commits nothing.** |
| `updateTenderList` | Commits. Check the repo for a new commit and the live page. |

View → **Logs** after each.

If `dryRun` finds no tenders, the email layout has changed. Don't patch it in
the Apps Script editor — fix `tools/kdc-parser.js`, verify against a saved copy
with the Node CLI, regenerate `Parser.gs`, and paste it back.

---

## 6. Install the trigger

Run `installTrigger` once. It schedules `updateTenderList` weekly on Tuesday
morning and removes any duplicate it finds first, so it is safe to re-run.

Adjust the day in `installTrigger` if KDC's send day moves.

---

## What it does on each run

1. Reads the newest message under the label
2. Finds the issue date in the subject; **stops if that date is already published**
3. Parses the tender rows
4. Reads the current `tenders.json` and `overrides.json` from GitHub
5. Merges — new entries added, existing ones refreshed, entries more than 7 days
   past their closing date dropped
6. Applies corrections from `overrides.json`
7. **Runs the scrub. Aborts without committing if any personal identifier or
   tracking link is present**
8. Commits with a summary in the message

It is idempotent. Running it twice on the same email changes nothing.

---

## When it breaks

It emails `NOTIFY_EMAIL` and commits nothing. The site keeps showing the last
good list, then degrades honestly on its own: a visible warning after 21 days,
and the table hidden entirely after 42.

The manual routine in `data/README.md` always works as a fallback:

```bash
python3 tools/msg-to-html.py email.msg > /tmp/kdc.html
node tools/parse-kdc-email.js /tmp/kdc.html
```

Common causes:

| Symptom | Cause |
|---|---|
| `Gmail label ... does not exist` | Label renamed, or the filter never applied |
| `GitHub GET failed (401)` | Token expired or revoked — reissue, update the property |
| `GitHub GET failed (404)` | Wrong `GITHUB_REPO`, or the token lost repo access |
| `found no tender rows` | KDC changed the email layout — fix the parser at source |
| `ABORTED ... identifier` | A tracking link reached the output. **Do not relax the check.** Fix the parser. |

---

## Why links are rewritten, not copied

Every href in the KDC email is an Outlook SafeLinks wrapper around a Mailchimp
tracking redirect, and both carry personal identifiers in plain text — the
recipient's email address, and the Mailchimp subscriber id as `?e=<id>`.

Publishing those would put a personal email address on a public web page, and
the links would break as soon as the subscription changed. So every href is
discarded, and entries link to the KDC's own public weekly PDF instead.

`scrub()` in `Parser.gs` is the backstop. Leave it alone.
