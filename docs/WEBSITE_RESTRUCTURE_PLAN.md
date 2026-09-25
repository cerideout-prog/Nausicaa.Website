# Website Restructure — Session Plan

**Project:** Nausicaa Capability Statement 2026 → Stage 4, Web implementation
**Classification:** NAUSICAA
**Canonical project record:** Google Drive → Nausicaa → `06. Marketing Collateral` →
`Capability Statement 2026` → <https://drive.google.com/drive/folders/1JmtlcxKJWng0ZAe7BIIBWehB5Y7p_VBT>
**Master Document:** `00 - Project Control / PROJECT_MD.md`
**This file:** the operational working copy, kept in the repo because Claude Code sessions run in a
container that has the repo but may not have the Drive connector. Drive remains the system of record.

**Created:** 2026-09-25 · **Branch:** `claude/cool-einstein-3ex6a0`

---

## 1. Purpose

Simplify the website structure and align it to the approved capability statement
(`docs/CAPABILITY_STATEMENT.md`) ahead of a marketing campaign.

The work is split across multiple short sessions to cap token usage and prevent duplicated effort.
**Every session reads only this file and `docs/PROGRESS.md` before touching code.** Do not re-audit
the whole site; the audit is in §3 below.

---

## 2. Tech stack (audited 2026-09-25)

**There is no framework.** Hand-written static HTML, no build step.

| Layer | What it is |
| --- | --- |
| Markup | 19 hand-authored `.html` at repo root + 4 in `/profiles` |
| CSS | One file, `css/styles.css` (~48 KB, 302 CSS custom properties as `:root` design tokens). No preprocessor, no utility framework. |
| JS | 5 vanilla files in `/js`, zero dependencies, no modules, no bundler |
| Fonts | Jost via Google Fonts CDN — the only external runtime dependency |
| Icons | Inline SVG |
| Data | `data/tenders.json` + `data/overrides.json`, fetched client-side by `js/procurement.js` |
| Tooling | `/tools` — Node + Python scripts that regenerate `tenders.json` from the KDC weekly email. Maintenance scripts, not a build system. |
| Hosting | GitHub Pages, custom domain via `CNAME` → nausicaaconsulting.com.au. No `.github/workflows`. (Inferred from `CNAME` + absence of build config; the Pages setting itself has not been verified.) |
| Deploy | Push to `main` = live. No staging, no preview build. |

### 2.1 Hard rules for every session

1. **Do not introduce a framework, build step, bundler, `package.json`, or CSS preprocessor.**
   The whole value of this repo is that it is editable by hand and deploys by push.
2. **`js/config.js` is the single source of truth** for ABN, email, phone, address, entity type and
   insurance. Pages use `data-entity="email"` and `data-entity-href="phoneHref"` attributes;
   `config.js` substitutes at runtime. **Never hardcode contact details into HTML.**
3. **`js/main.js` holds a nav `SECTION` map** that maps top-level service pages to their parent nav
   item for active-link state. Any page rename, merge or deletion **must** update this map.
4. **Brand colours and type are fixed by Nausicaa Brand Guide v1.0** — `--navy #14243c`,
   `--off-white #f7f5f0` (paper), `--ink-soft #4a5568`, `--ink-muted #5a6779`, Jost throughout.
   Do not change these. `--blue` is a functional accent outside the guide and may be adjusted.
5. **`/profiles/*.html` are self-contained** — their own inline `<style>`, no link to
   `css/styles.css`, and 58–295 KB of base64 data-URI images each. Sitewide restyling does **not**
   reach them. Treat them as separate artefacts.
6. **Nav, utility bar and footer are copy-pasted into all 19 pages.** A nav change is a 19-file edit.
   Do this mechanically in one dedicated session (Session 1), never piecemeal.
7. **`sitemap.xml` is hand-maintained.** Update it in the same session as any page add/remove.
8. Preview locally with `python3 -m http.server 8000`.

### 2.2 Live-state warnings

- The site is **gated**. `index.html` is a coming-soon page with a localStorage gate
  (`nc_unlocked`, code `nausicaa`); `home.html` is the real homepage and redirects back if not
  unlocked. `robots.txt` is currently `Disallow: /`.
  **All three must be reversed at launch (Session 7, now LAST per D-W8).** The gate script is
  inline in the `<head>` of **all 27** HTML files — it is not in `js/`, so removing it is a 27-file
  edit, not a bundle change.
- `contract-administration.html` and `business-capability.html` are ~50-word redirect stubs for
  pre-v2 URLs.
- `terms.html` is marked **DRAFT — NOT FOR USE**, excluded from the sitemap, pending legal review.
- `home.html` currently sets `<link rel="canonical">` to `https://nausicaaconsulting.com.au/` —
  which is `index.html`, the gate. Canonical URLs need a sweep at launch.

---

## 3. Page audit and target structure

### 3.1 Current inventory (23 pages)

| File | Words | Cap statement home | Proposed action |
| --- | --- | --- | --- |
| `index.html` | 127 | — | REPLACE at launch with real homepage |
| `home.html` | 1576 | Hero + all sections | BECOMES `index.html` |
| `delivering-in-the-kimberley.html` | 826 | Audience 1 — Entering the Kimberley | KEEP, realign |
| `kimberley-business.html` | 1075 | Audience 2 — Kimberley Businesses | KEEP, realign |
| *(none)* | — | **Audience 3 — Principals & Asset Owners** | **NEW PAGE** |
| `superintendents-representative.html` | 1230 | Service 1 — Contract Admin & Sup Rep | KEEP, realign |
| `contract-administration.html` | 53 | Service 1 | CUT (redirect stub) |
| `fractional-commercial-manager.html` | 1119 | Service 2 — Fractional Commercial Mgmt | KEEP, realign |
| `business-support.html` | 795 | Service 3 — Tendering & Estimating | REFOCUS + RENAME |
| `business-capability.html` | 52 | — | CUT (redirect stub) |
| `local-content.html` | 814 | Service 4 — Regional Mobilisation & Local Supply Chain | MERGE → Service 4 |
| `supply-chain.html` | 891 | Service 4 | MERGE TARGET → Service 4 |
| `multi-trade-commercial-coordination.html` | 534 | *not in cap statement* | CUT or fold into Audience 1 |
| `rates.html` | 1491 | HOW TO ENGAGE | KEEP, heavy trim to 3-stage model |
| `conflict-policy.html` | 1265 | Conflict paragraph | KEEP (differentiator; cap statement references it) |
| `about.html` | 910 | Callum bio | KEEP, trim to cap statement bio |
| `contact.html` | 447 | Contact block | KEEP |
| `project-profiles.html` | 391 | RECENT PROJECT WORK RECORD | KEEP as index |
| `profiles/micromine-pitram.html` | 2667 | — | KEEP (not cited in cap statement) |
| `profiles/pitram-prominent-hill.html` | 2882 | — | KEEP (not cited) |
| `profiles/ministry-of-data.html` | 2624 | — | KEEP (not cited) |
| `profiles/governance-community-volunteer.html` | 3404 | — | KEEP (not cited) |
| `active-procurement.html` | 1358 | *not in cap statement* | DECISION — campaign lead magnet, or cut |
| `terms.html` | 1422 | — | LEAVE (draft, unlinked) |

### 3.2 Critical misalignment found

**The capability statement's two proof projects — WAPOL Kimberley District Support Facility and
Thunderbird Tailings Storage Facility — have no profile pages on the website.** All four existing
profiles are from earlier or unrelated roles (Micromine, Prominent Hill, Ministry of Data,
governance/volunteer). A campaign that drives traffic from the capability statement to the site
currently lands visitors on a project record that does not corroborate the statement.

This is a content gap, not a code gap. It blocks Session 6 and is subject to the Kaynar clearance
constraint already recorded in the project (ALT-A named vs ALT-B anonymised).

### 3.3 Target structure — DECIDED 2026-09-25

**16 top-level pages** (from 19), plus the 4 profile pages, plus `terms.html` (unlinked) and
redirect stubs for retired URLs. Two section landing pages per D-W4, and Upcoming Works retained
per D-W3, so the count is 16 rather than the 13 first proposed.

```
index.html                                  Home — capability statement on one page
who-we-work-with.html                       Section landing                        NEW
├─ entering-the-kimberley.html              Audience 1 (was delivering-in-the-kimberley,
│                                             with multi-trade folded in per D-W2)
├─ kimberley-business.html                  Audience 2
└─ principals-and-asset-owners.html         Audience 3                             NEW
what-we-do.html                             Section landing                        NEW
├─ superintendents-representative.html      Service 1 — Contract Admin & Sup Rep
├─ fractional-commercial-manager.html       Service 2 — Fractional Commercial Mgmt
├─ tendering-and-estimating.html            Service 3 (was business-support)
└─ local-supply-chain.html                  Service 4 (local-content + supply-chain merged)
how-to-engage.html                          (was rates.html, trimmed to the 3-stage model)
project-profiles.html                       + /profiles/* — see D-W5/D-W6
active-procurement.html                     Upcoming Works — KEPT per D-W3
about.html
conflict-policy.html
contact.html
```

**Retired URLs needing redirect stubs:** `home.html`, `delivering-in-the-kimberley.html`,
`multi-trade-commercial-coordination.html`, `business-support.html`, `local-content.html`,
`supply-chain.html`, `rates.html`. Plus the two existing stubs `contract-administration.html`
and `business-capability.html`, which stay.

**Nav — 5 items plus CTA:**
`Who We Work With · What We Do · How to Engage · Upcoming Works · About` + **Contact Us** button.
Project Record is linked prominently from the homepage and About rather than the nav.
Conflict Policy and Terms sit in the footer. Session 1 may adjust this if it does not fit.

### 3.4 Decisions — ANSWERED 2026-09-25

| ID | Decision | Answer |
| --- | --- | --- |
| D-W1 | Adopt the target structure | **Yes**, as §3.3 |
| D-W2 | `multi-trade-commercial-coordination.html` | **Fold** into `entering-the-kimberley.html`, redirect stub at the old URL |
| D-W3 | Keep `active-procurement.html` | **Keep.** User confirmed the weekly KDC update will be maintained. Add a visible "as at" date. |
| D-W4 | Nav shape | **Two section landing pages** as nav items — no dropdowns |
| D-W5 | KDSF + Thunderbird work record | **Handled as a separate workstream**, outside Sessions 1–7. Not built in this restructure. |
| D-W6 | The four existing profiles | **Keep.** They remain the content of `project-profiles.html` for now; presented as earlier-career work, not in the nav. |
| D-W7 | Launch timing | **Campaign runs the week commencing 2026-09-28.** ~~Gate must come off before then.~~ **Ordering superseded by D-W8** — the campaign date stands, the gate timing does not. |
| D-W8 | Gate timing, revised 2026-09-25 | **Gate comes off LAST**, after all copy is aligned — superseding D-W7's ordering. Session 1 has shipped, so URLs are final and the churn risk that drove gate-second is gone. Accepted consequence: the site is not crawlable during the campaign, so organic search contributes nothing to it. See §4.0. |

**Consequence of D-W5 + D-W6:** `project-profiles.html` and `/profiles/*` are unchanged by this
restructure. The corroboration gap identified in §3.2 — the capability statement's two proof
projects having no presence on the site — **remains open** and is carried to the separate
workstream. The campaign will launch with it open. This is a recorded, accepted position, not an
oversight.

---

## 4. Session breakdown

Each session is scoped to be completable without reading the whole site. **Every session must end by
updating `docs/PROGRESS.md`.** Do not start a session until the previous one is marked complete there.

**Re-sequenced 2026-09-25 (D-W8): the gate now comes off LAST, not second.** See §4.0.

| Order | # | Session | Scope | Files touched | Done when |
| --- | --- | --- | --- | --- | --- |
| — | 0 | **Stack audit & plan** | This document | `docs/` | ✅ complete 2026-09-25 |
| — | 1 | **Structure & plumbing** | Renames, section landings, Audience 3, redirect stubs, nav + footer sweep, SECTION map, sitemap. Calculator extracted to `calculator.html`. | all `*.html`, `js/main.js`, `sitemap.xml` | ✅ complete 2026-09-25 |
| **1st** | 2 | **Homepage + mobile fix** | Rewrite the homepage to the capability statement structure: hero, value chain, 3 audiences, 4 services, how to engage, work record teaser. Drop the testimonial placeholders. Replace the long conflict paragraph with the one-line version. **Plus the one sitewide CSS fix** — see §4.2. | **`home.html`** (not `index.html` — see below), `css/styles.css` **for the `.nav-cta` fix only** | Homepage reads as the capability statement on one page, and no page overflows horizontally at 390px |
| 2nd | 3 | **Audience pages** | Realign the 3 WHO WE WORK WITH pages to their capability statement cards. Lead each with the quoted buyer question. Fold multi-trade content into Audience 1. | 3 audience pages + `who-we-work-with.html` | Each page opens on its capability statement quote and promise |
| 3rd | 4 | **Service pages** | Realign the 4 WHAT WE DO pages. Merge the retired `local-content` content into Service 4. | 4 service pages + `what-we-do.html` | Four services, one page each, wording matches the capability statement |
| 4th | 5 | **How to engage + conflict** | Trim `how-to-engage.html` to the capability statement's 3-stage fee model. Cross-link and trim `conflict-policy.html`. | `how-to-engage.html`, `conflict-policy.html` | Fee model matches the capability statement table |
| 5th | 6 | **About** | Trim `about.html` to the capability statement bio. Add the "as at" date to `active-procurement.html`. | `about.html`, `active-procurement.html` | Bio matches the capability statement; Upcoming Works shows its currency date |
| **LAST** | 7 | **Launch** | Remove the gate: `home.html` → `index.html`, delete the inline gate script from **all 27** HTML files, restore `robots.txt`, sweep canonical + OG tags, regenerate `sitemap.xml`, full link check. Merge to `main`. | `index.html`, `robots.txt`, all `*.html` heads, `sitemap.xml` | Site is public and crawlable, no dead links, no gate code remaining |
| — | — | *Work record* | KDSF + Thunderbird — **separate workstream per D-W5**, not scheduled here. **Blocked on Kaynar clearance — see §5.1.** | — | — |

### 4.0 Re-sequencing — the gate now comes off last (D-W8, 2026-09-25)

The original plan ran Session 7 second, so that URLs were final before Google indexed them. **Session 1
has now shipped, so that reason is spent:** the URLs are final, the redirect stubs are in place, and
the gate can come off at any point without churn.

The user has decided the gate comes off **last**, after all copy is aligned. Recorded as **D-W8**.

**Consequence, stated plainly.** The campaign runs w/c 2026-09-28. Gate-last means the site is not
crawlable for the duration of the campaign, so **organic search contributes nothing to it** and paid
and direct traffic carry it entirely. This is a deliberate trade — a fully aligned site at launch,
against no organic contribution — not an oversight.

Two things this does **not** require, and which should not be bundled into Session 7 by reflex:

- **Merging to `main` is not the same as un-gating.** `main` is already live and gated. Merging this
  branch at any time puts the new structure on the real domain, still behind the gate — useful for
  real-domain preview with no exposure. Nothing from Session 1 is live yet.
- **If organic search later turns out to matter**, the gate can come off after any session from
  Session 2 onward. The homepage is where campaign traffic lands, so after Session 2 is the first
  sensible point. Copy can land incrementally afterwards: static site, push-to-deploy, no build step.

### 4.1 Session prompt template

> Read `docs/WEBSITE_RESTRUCTURE_PLAN.md` and `docs/PROGRESS.md` first — do not re-audit the site.
> Execute **Session N** only. Stay inside the "Files touched" column; do not touch any other file.
> Obey the hard rules in §2.1 and the standing constraints in §5. Align all copy to
> `docs/CAPABILITY_STATEMENT.md`.
> Commit to `claude/cool-einstein-3ex6a0`, then update `docs/PROGRESS.md` and stop.

### 4.2 Two standing corrections for every remaining session

**1. The homepage is `home.html`, not `index.html`, until Session 7.** Session 2's file was listed as
`index.html` on the assumption that Session 7 had already run. It has not. `index.html` is the
coming-soon gate. Do not edit it before Session 7.

**2. Use the existing responsive grid classes. Do not write new ones.** `css/styles.css` already
carries grids that do exactly what the audience and service layouts need, with breakpoints already
set:

| Class | Desktop | ≤960px | ≤640px |
| --- | --- | --- | --- |
| `region-grid` | 3 cols | 2 | 1 |
| `services-grid` | 4 cols | 2 | 1 |
| `segment-grid` | 2 cols | 1 | 1 |

Pair them with `segment-card`. Writing parallel grid rules creates a second source of truth for the
same layout.

**The one CSS change that IS needed** — and it is a real, measured defect, not a refinement. Every
page overflows horizontally by **129px at 390px viewport width**, because the header `.nav-cta`
"Contact Us" button is never hidden or reflowed at phone width. Verified against commit `8000eb7`,
so it predates the restructure. It is scoped to Session 2 because that is the session that looks at
mobile. Fix it with the existing `:root` custom properties and existing breakpoints, and verify at
390px on `home.html` plus at least two other pages. A campaign lands mostly on phones.

### 4.3 Reconciliation with the alternate 6-session plan (2026-09-25)

A separate 6-session plan was drafted outside this repo and supplied alongside it. It is **not** a
second plan to follow — it is reconciled into §4 above and recorded here so no session re-runs work
that is already done, or runs work that is blocked. If that plan is pasted into a session again,
this table governs.

| Its session | Disposition |
| --- | --- |
| 1 — Calculator extraction & analytics | **Done** (Session 1). Its analytics step is void: there is no `gtag.js`, Meta Pixel or any other tracking on any page, and §6 rules analytics out of scope. Nothing was added. |
| 2 — Audience architecture | **Absorbed into Session 2.** The 3 audiences already exist on `who-we-work-with.html`; what remains is the homepage, which still carries the old 2-card selector. Its CSS step is superseded by §4.2 — do not write new grid rules. |
| 3 — Service consolidation & conflict line | **Absorbed into Session 2.** Same reasoning: the 4 pillars already exist on `what-we-do.html`; the homepage still says "Two service lines, two audiences." Its one-line conflict replacement is kept. |
| 4 — Social proof / work record | **BLOCKED — do not run.** It instructs hardcoding WAPOL and Thunderbird detail, which §5.1 prohibits on three independent grounds. |
| 5 — Redirect stubs & navigation | **Done** (Session 1), and more completely: 8 stubs rather than the 5 it lists — it missed `multi-trade-commercial-coordination.html` and the two pre-existing stubs whose targets had gone stale. Pages were `git mv`'d rather than recreated, so history follows. Note it calls the nav map `navSections`; the actual identifier in `js/main.js` is `SECTION`. |
| 6 — Un-gating | **Becomes Session 7, now LAST per D-W8.** Three corrections: the gate is inline in the `<head>` of all 27 HTML files, not in a JS bundle; the only remaining `home.html` link is inside the gate page itself, which is deleted anyway; and the sitemap is already rebuilt apart from the `index.html` rename. |

**What that plan does not cover**, and this one does: the audience detail pages (Session 3), the four
service detail pages (Session 4), `how-to-engage` (Session 5) and `about` (Session 6). Following it
alone would launch sixteen pages of which roughly ten still carry pre-restructure copy.

---

## 5. Constraints carried from the parent project

From `PROJECT_MD.md` and the 2026-09-21 Handoff — these apply to website copy too:

- **All published proof is attributable to Callum's previous roles, never to Nausicaa.** The
  attribution footnote is mandatory wherever the work record appears.
- **Kaynar written clearance** is required before publishing Kaynar-referencing content. It decides
  ALT-A (named) vs ALT-B (anonymised). Unresolved as at 2026-09-21.
- **PI / public liability cover must be bound** before any insurance block is published.
  `js/config.js` keeps `piCover` and `plCover` as `null`, which suppresses every insurance block
  sitewide. Leave them null.
- **The Kaynar role ended 3 Sep 2026** — use the past tense.
- **Do not publish a Pty Ltd name, ACN or "Pty Ltd" suffix** until the company is registered.
- **Superintendent's Representative is offered as a service; no past appointment is claimed.**
- The Stage 2 VERIFY list is still open: KDSF package value, KDSF seven-week recovery claim, haulage
  unit status, Micromine figures, credential names, AS contract forms, entity type, business email.
  **Do not publish an unverified figure on the website.**

---

### 5.1 HARD BLOCK — the work record and Kaynar clearance

**No session in this restructure publishes the work record.** This is a standing constraint, not a
preference, and it overrides any session brief that says otherwise.

Do **not** publish, anywhere on the site:

- **WAPOL Kimberley District Support Facility** / **KDSF**
- **Thunderbird Tailings Storage Facility** / Waterbank
- **Kaynar Group**, or any Kaynar-attributed project detail
- **Crothers**, **Kimberley Mineral Sands**, or any other client or head-contractor name
- Package values, tonnages, volumes or durations tied to the above

Three separate reasons, each sufficient on its own:

1. **Kaynar written clearance is unresolved** (§5). It decides ALT-A (named) vs ALT-B (anonymised).
   Until it lands, neither form is cleared.
2. **D-W5 puts the work record in a separate workstream**, outside Sessions 1–7.
3. **These names were deliberately removed from the site already** — commits `46f7f4e` and `608c9a0`.
   Reinstating them would undo a decision that was taken on purpose.

Where a session brief calls for a "work record teaser" or "social proof" — the homepage session
does — the only two acceptable outcomes are a **fully anonymised** teaser that names nothing above,
or a **marked placeholder** with the gap flagged in `PROGRESS.md`. Do not improvise a third option.

The mandatory attribution footnote (§5) applies wherever the work record is eventually published:

> Recent work record described above was delivered by Callum Rideout in a recent role.
> It does not represent work delivered by Nausicaa.

**Related:** testimonials are also blocked. The three `home.html` placeholders read "Awaiting written
permission". Each real testimonial needs a name, role, organisation and written permission held
before publication. Do not generate, pad or composite them. The homepage session removes the
placeholders; it does not fill them.

## 6. Out of scope

- Any change to `/tools` or the weekly KDC procurement parsing routine.
- Rebuilding `/profiles/*.html` to use the shared stylesheet.
- Image optimisation of the base64 data URIs in the profile pages.
- `terms.html` — remains draft, pending legal review.
- Analytics, forms backend, or any third-party script.
