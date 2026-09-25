# Website Restructure — Progress Ledger

Read this and `docs/WEBSITE_RESTRUCTURE_PLAN.md` before starting any session.
**Every session must update this file before it ends.** Newest entry at the top.

**Branch:** `claude/cool-einstein-3ex6a0`
**Decisions D-W1 to D-W7: all answered 2026-09-25.** Nothing is blocked.
**Campaign runs w/c 2026-09-28** — Sessions 1 and 7 are brought forward and run first. See plan §4.0.

## Status — run in this order

| Order | Session | Status | Date | Notes |
| --- | --- | --- | --- | --- |
| — | 0 — Stack audit & plan | ✅ Complete | 2026-09-25 | Stack audited, 23 pages inventoried, decisions answered |
| **1st** | **1 — Structure & plumbing** | 🟢 **Ready to start** | — | Target structure is fixed in plan §3.3 |
| **2nd** | **7 — Launch** | ⬜ Not started | — | Gate off, robots.txt restored, merge to `main`. Time-critical. |
| 3rd | 2 — Homepage | ⬜ Not started | — | |
| 4th | 3 — Audience pages | ⬜ Not started | — | |
| 5th | 4 — Service pages | ⬜ Not started | — | |
| 6th | 5 — How to engage + conflict | ⬜ Not started | — | |
| 7th | 6 — About | ⬜ Not started | — | |
| — | Work record (KDSF + Thunderbird) | ⏸ Separate workstream | — | Out of scope per D-W5 |

## Log

### 2026-09-25 — Session 0 (continued): decisions recorded

**Decisions answered by the user**
- D-W1 adopt structure · D-W2 fold multi-trade · D-W3 keep Upcoming Works (weekly update will be
  maintained) · D-W4 two section landing pages · D-W5 work record handled separately ·
  D-W6 keep existing profiles · D-W7 campaign w/c 2026-09-28.

**Consequences recorded**
- Page count is **16**, not the 13 first proposed — two section landing pages (D-W4) plus Upcoming
  Works retained (D-W3).
- Sessions re-sequenced: **1 → 7 → 2 → 3 → 4 → 5 → 6.** Structure and launch before copy, so URLs
  are final before Google indexes them.
- `project-profiles.html` and `/profiles/*` are untouched by this restructure. The corroboration gap
  in plan §3.2 stays open through the campaign — accepted position, not an oversight.

**Capability statement updated**
- A corrected PDF was issued. All three typos are fixed at source. Full text diff confirms those
  three corrections are the only changes. `docs/CAPABILITY_STATEMENT.md` re-extracted.

### 2026-09-25 — Session 0

**Done**
- Audited the tech stack: static HTML, no framework, no build step, GitHub Pages.
- Inventoried all 23 pages with word counts and mapped each to the capability statement.
- Extracted the capability statement PDF to `docs/CAPABILITY_STATEMENT.md`.
- Wrote `docs/WEBSITE_RESTRUCTURE_PLAN.md` — hard rules, target structure, session briefs.

**Found**
- The capability statement's two proof projects (WAPOL KDSF, Thunderbird TSF) have no profile pages
  on the site. All four existing profiles are from other roles. Carried to a separate workstream.
- `home.html` sets its canonical URL to `/`, which is currently the coming-soon gate.
- Nav, utility bar and footer are duplicated across 19 files — any nav change is a 19-file edit.

**Not done / carried**
- Drive `PROJECT_MD.md` and `CHANGELOG.md` could not be updated — the Drive connector cannot edit
  the body of an existing Google Doc. The 2026-09-25 Handoff in `00 - Project Control` is the
  current record; PROJECT_MD needs a manual edit.
- The Project Registry spreadsheet has no row for this project and cannot be edited from a session.
