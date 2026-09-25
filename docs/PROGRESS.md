# Website Restructure — Progress Ledger

Read this and `docs/WEBSITE_RESTRUCTURE_PLAN.md` before starting any session.
**Every session must update this file before it ends.** Newest entry at the top.

**Branch:** `claude/cool-einstein-3ex6a0`
**Blocking:** decisions D-W1 to D-W7 (plan §3.4) are unanswered. **Session 1 cannot start until
D-W1, D-W2, D-W3 and D-W4 are answered.**

## Status

| Session | Status | Date | Notes |
| --- | --- | --- | --- |
| 0 — Stack audit & plan | ✅ Complete | 2026-09-25 | Tech stack audited, 23 pages inventoried, target structure proposed |
| 1 — Structure & plumbing | ⛔ Blocked | — | Needs D-W1, D-W2, D-W3, D-W4 |
| 2 — Homepage | ⬜ Not started | — | |
| 3 — Audience pages | ⬜ Not started | — | |
| 4 — Service pages | ⬜ Not started | — | |
| 5 — How to engage + conflict | ⬜ Not started | — | |
| 6 — Work record + about | ⛔ Blocked | — | Needs D-W5, D-W6 and Kaynar clearance |
| 7 — Launch | ⛔ Blocked | — | Needs D-W7 |

## Log

### 2026-09-25 — Session 0

**Done**
- Audited the tech stack: static HTML, no framework, no build step, GitHub Pages.
- Inventoried all 23 pages with word counts and mapped each to the capability statement.
- Extracted the capability statement PDF to `docs/CAPABILITY_STATEMENT.md`.
- Wrote `docs/WEBSITE_RESTRUCTURE_PLAN.md` — hard rules, target structure, 7 session briefs.

**Found**
- The capability statement's two proof projects (WAPOL KDSF, Thunderbird TSF) have **no profile
  pages on the site**. All four existing profiles are from other roles. Content gap, blocks Session 6.
- Three typos in the source capability statement PDF: "across across", "with a focusing on",
  "userful reporting". Fix in the PDF before the campaign.
- `home.html` sets its canonical URL to `/`, which is currently the coming-soon gate.
- Nav, utility bar and footer are duplicated across 19 files — any nav change is a 19-file edit.

**Not done / carried**
- Drive `PROJECT_MD.md` and `CHANGELOG.md` could not be updated — the Drive connector cannot edit
  the body of an existing Google Doc. Same limitation the 2026-09-21 session hit. The 2026-09-25
  Handoff in `00 - Project Control` is the current record; PROJECT_MD needs a manual edit.
- The Project Registry spreadsheet has no row for this project and cannot be edited from a session.
