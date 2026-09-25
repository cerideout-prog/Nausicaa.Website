# Website Restructure — Progress Ledger

Read this and `docs/WEBSITE_RESTRUCTURE_PLAN.md` before starting any session.
**Every session must update this file before it ends.** Newest entry at the top.

**Branch:** `claude/cool-einstein-3ex6a0`
**Decisions D-W1 to D-W8: all answered 2026-09-25.**
**Campaign runs w/c 2026-09-28.**
**D-W8 (2026-09-25): the gate comes off LAST**, not second — superseding D-W7's ordering. Session 1
has shipped, so URLs are final and the churn risk that drove gate-second is gone. Accepted
consequence: the site is not crawlable during the campaign, so organic search contributes nothing
to it. See plan §4.0.

**Two standing blocks — read before any copy session:**
- **Plan §5.1** — the work record is a HARD BLOCK. No WAPOL/KDSF, Thunderbird, Kaynar, Crothers or
  Kimberley Mineral Sands anywhere on the site. Kaynar clearance unresolved; D-W5 puts it in a
  separate workstream; those names were already deliberately removed in `46f7f4e` / `608c9a0`.
- **Testimonials** need a real name, role, organisation and written permission. Never generated,
  padded or composited.

## Status — run in this order

| Order | Session | Status | Date | Notes |
| --- | --- | --- | --- | --- |
| — | 0 — Stack audit & plan | ✅ Complete | 2026-09-25 | Stack audited, 23 pages inventoried, decisions answered |
| — | 1 — Structure & plumbing | ✅ Complete | 2026-09-25 | 17 live pages, 8 redirect stubs, nav/footer identical everywhere |
| **1st** | **2 — Homepage + mobile fix** | 🟢 **Ready to start** | — | **Edit `home.html`, NOT `index.html`** (plan §4.2). Absorbs the alternate plan's sessions 2 and 3. Includes the one sitewide CSS fix: 129px horizontal overflow from `.nav-cta` at 390px. |
| 2nd | 3 — Audience pages | ⬜ Not started | — | Multi-trade content to fold in: `git show 8000eb7:multi-trade-commercial-coordination.html` |
| 3rd | 4 — Service pages | ⬜ Not started | — | `local-content` content to merge in: `git show 8000eb7:local-content.html` |
| 4th | 5 — How to engage + conflict | ⬜ Not started | — | Note: `how-to-engage.html` no longer holds the calculator. Dead PDF link to resolve. |
| 5th | 6 — About | ⬜ Not started | — | Plus the "as at" date on `active-procurement.html` |
| **LAST** | **7 — Launch** | ⬜ Not started | — | Gate off, `home.html` → `index.html`, robots.txt, canonical sweep, merge to `main`. Gate script is inline in **all 27** HTML files, not in `js/`. Also owed: the `home.html` redirect stub, and the `terms.html` footer decision. |
| — | Work record (KDSF + Thunderbird) | 🛑 Blocked | — | Separate workstream per D-W5. **Hard block — plan §5.1.** |

## Log

### 2026-09-25 — Re-sequencing and plan reconciliation (no code change)

**Decided**
- **D-W8: the gate comes off last.** Session 7 moves from 2nd to LAST. Recorded in plan §4.0 and
  §3.4 with the consequence stated: no organic search contribution to the campaign.

**Reconciled**
- A separate 6-session plan drafted outside the repo was folded into plan §4. Two of its sessions
  are already complete (calculator extraction; redirect stubs and nav), two are absorbed into
  Session 2 (homepage audiences and services), one becomes Session 7, and **one is blocked**.
  Full disposition table at plan §4.3, so no future session re-runs or re-litigates it.

**Written into the plan as standing constraints**
- **§5.1 — HARD BLOCK on the work record.** The alternate plan's session 4 instructed hardcoding
  WAPOL and Thunderbird detail. That is prohibited on three independent grounds: Kaynar clearance
  unresolved (§5), D-W5 putting the work record in a separate workstream, and those names having
  already been deliberately removed from the site. Where a session calls for a work-record teaser,
  the only outcomes are fully anonymised or a marked placeholder.
- **§4.2 — two corrections that apply to every remaining session.** The homepage is `home.html`
  until Session 7, not `index.html`. And the existing responsive grid classes (`region-grid`,
  `services-grid`, `segment-grid`) already cover every layout the remaining sessions need — writing
  parallel grid rules would create a second source of truth.
- **§2.2 corrected** — the gate script is inline in the `<head>` of all 27 HTML files, not in a JS
  bundle. Removing it is a 27-file edit.

**Carried, unchanged**
- The 129px mobile overflow is now scoped into Session 2 rather than left floating.
- `terms.html` footer decision and the dead conflict-framework PDF link remain open.

### 2026-09-25 — Session 1: Structure & plumbing

**Done**
- **Renamed four pages** with `git mv`, so history follows:
  `delivering-in-the-kimberley` → `entering-the-kimberley`,
  `business-support` → `tendering-and-estimating`,
  `supply-chain` → `local-supply-chain`,
  `rates` → `how-to-engage`.
- **Created three pages:** `who-we-work-with.html` and `what-we-do.html` (the two section
  landings per D-W4) and `principals-and-asset-owners.html` (Audience 3). Built from existing
  CSS classes only — `region-grid`, `segment-grid`, `segment-card`, `roles-grid`, `page-hero` —
  so `css/styles.css` was not touched and all three are responsive already.
- **Eight redirect stubs** now cover every retired URL: the six retired this session plus the two
  pre-existing ones, whose targets were repointed at the renamed pages.
- **Rewrote nav and footer across all 17 chrome-bearing pages.** Nav is the five items per §3.3
  plus the Contact Us button; the footer is rebuilt to the new IA. Both blocks now hash
  identically on every page. `project-profiles.html` had silently drifted from the others (its
  nav was missing Conflict Policy, its footer missing two Company entries) — the sweep
  normalised it.
- **Rewrote every internal link to its final URL**, so no internal navigation passes through a
  redirect stub. 99 link replacements across 16 files, canonical and OG URLs included.
- **`js/main.js` SECTION map** rebuilt for the new structure (plan §2.1 rule 3).
- **`sitemap.xml`** rebuilt: 21 URLs, stubs and `terms.html` excluded, with the exclusions
  documented in the file.

**Calculator — kept, and de-duplicated (user-approved addition to §3.3)**
The indicative calculator was inlined in `home.html` **and** again, byte-identically, in
`rates.html`. It now lives once, at `calculator.html`, with a CTA in both former locations. The
user approved carrying this page in addition to the 16 in §3.3, so the live count is **17**.
`js/calculator.js` and `js/calc-gate.js` needed no edits — every element ID was preserved. The
lead-capture gate travels with it, so results still sit behind work email + organisation and
still post to the same Formspree endpoint; `source_page` now reads `/calculator.html`.
De-duplicating `how-to-engage.html` went slightly beyond the brief: it is Session 5's file. It
was done now because leaving two live copies of a compliance-sensitive calculator through the
launch was the worse option. **Session 5 should be aware `how-to-engage.html` no longer contains
the calculator.**

**Verified** (Chromium against a local static server)
- All 18 live pages: HTTP 200, exactly one `<h1>`, five nav items, `config.js` substitutions
  resolving, **zero console errors**.
- Active-link state correct on all 13 pages that should have one.
- All 8 redirect stubs land on the right page.
- Calculator: gate locks and unlocks, all five results compute and recompute on input and slider
  changes, disclaimer and all four workings blocks present.
- No broken internal links except one pre-existing (below). No live page still references a
  retired URL. All 27 HTML files tag-balanced; `sitemap.xml` valid XML; `js/main.js` syntax-clean.

**Two things needing a decision before Session 7 puts this in front of Google**

1. **`terms.html` is still not linked, deliberately.** Plan §3.3 says "Conflict Policy and Terms
   sit in the footer", but §6 keeps `terms.html` out of scope, it is marked **DRAFT — NOT FOR
   USE**, it is excluded from the sitemap, and the file's own header comment says "Do not link to
   it … until a legal review". Linking a draft legal document from every page of a live campaign
   site is not a call to make silently, so **Terms was left out of the footer**. Either clear the
   draft or confirm it stays unlinked.
2. **Mobile layout is broken sitewide, and it predates this session.** Every page overflows
   horizontally by **129px at 390px width**. Verified against the pre-Session-1 commit (`8000eb7`)
   — the same 129px, so this session did not cause it. The culprit is the header `.nav-cta`
   "Contact Us" button, which is never hidden or reflowed at phone width. The fix is in
   `css/styles.css`, which is outside Session 1's "files touched", so it was left alone. **This
   should be fixed before launch** — a campaign lands mostly on phones.

**Also carried**
- **Pre-existing broken link:** `conflict-policy.html` has a "Download the full framework (PDF)"
  button pointing at `/docs/nausicaa-conflict-framework.pdf`, which does not exist. Either supply
  the PDF or drop the button — a dead download on a live page is worse than no button. Removing
  a CTA is a content decision, so it was left in place. Session 5 owns this file.
- **Content recovery for later sessions.** `local-content.html` and
  `multi-trade-commercial-coordination.html` are now stubs, so their prose lives only in git.
  Recover it with `git show 8000eb7:local-content.html` and
  `git show 8000eb7:multi-trade-commercial-coordination.html`.
  - **Session 4** — `local-supply-chain.html` currently holds *only* the old `supply-chain.html`
    content. The `local-content.html` material is **not yet merged in**; that merge is Session 4's
    job, as planned.
  - **Session 3** — the multi-trade content is **not yet folded** into
    `entering-the-kimberley.html`; D-W2's fold is Session 3's job. The stub redirects there now so
    the URL does not 404 in the meantime.
- **Copy oddity for Session 2/3:** `home.html`'s "Based in the Kimberley" card still lists
  "Multi-Trade Commercial Coordination", which the link rewrite now points at
  `entering-the-kimberley.html`. Correct plumbing, odd copy. It resolves when Session 3 folds
  that content in.
- **No analytics exists on this site** — no `gtag.js`, no Meta Pixel, nothing, on any page. Noted
  because a competing session brief assumed there was tracking to preserve. Plan §6 puts
  analytics out of scope, so nothing was added. If the campaign needs to measure anything, that
  is a decision to take before launch, and it interacts with the calculator already collecting
  work email and organisation.

**Live page inventory after this session** — 17 live + `index.html` (gate) + `terms.html`
(draft, unlinked) + 8 redirect stubs = 27 files at the repo root.

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
