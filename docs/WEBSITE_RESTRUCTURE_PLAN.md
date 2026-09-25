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
  **All three must be reversed before the campaign — hard launch blocker (Session 7).**
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
| D-W7 | Launch timing | **Campaign runs the week commencing 2026-09-28.** Gate must come off before then — see §4 re-sequencing. |

**Consequence of D-W5 + D-W6:** `project-profiles.html` and `/profiles/*` are unchanged by this
restructure. The corroboration gap identified in §3.2 — the capability statement's two proof
projects having no presence on the site — **remains open** and is carried to the separate
workstream. The campaign will launch with it open. This is a recorded, accepted position, not an
oversight.

---

## 4. Session breakdown

Each session is scoped to be completable without reading the whole site. **Every session must end by
updating `docs/PROGRESS.md`.** Do not start a session until the previous one is marked complete there.

| Order | # | Session | Scope | Files touched | Done when |
| --- | --- | --- | --- | --- | --- |
| — | 0 | **Stack audit & plan** | This document | `docs/` | ✅ complete 2026-09-25 |
| 1st | 1 | **Structure & plumbing** | No copywriting. Create/rename/delete page files per §3.3. Write the two section landing pages. Rewrite nav + footer across every page. Update `js/main.js` SECTION map, `sitemap.xml`, and redirect stubs for all retired URLs. | all `*.html`, `js/main.js`, `sitemap.xml` | Every page loads, nav identical everywhere, no 404 from any retired URL, active-link state correct |
| 2nd | 7 | **Launch** | Remove the gate: `home.html` → `index.html`, delete the localStorage gate, restore `robots.txt` (`Allow: /`, `Disallow: /terms.html`, `Sitemap:` line), sweep canonical + OG tags, regenerate `sitemap.xml`, full link check. Merge to `main`. | `index.html`, `robots.txt`, all `*.html` heads | Site is public and crawlable, no dead links, no gate code remaining |
| 3rd | 2 | **Homepage** | Rewrite the homepage to the capability statement structure: hero, value chain, 3 audiences, 4 services, how to engage, work record teaser. | `index.html` | Homepage reads as the capability statement on one page |
| 4th | 3 | **Audience pages** | Realign the 3 WHO WE WORK WITH pages to their capability statement cards. Lead each with the quoted buyer question. Fold multi-trade content into Audience 1. | 3 audience pages + `who-we-work-with.html` | Each page opens on its capability statement quote and promise |
| 5th | 4 | **Service pages** | Realign 4 WHAT WE DO pages. Merge `local-content` + `supply-chain` into Service 4. Refocus `business-support` → Tendering & Estimating. | 4 service pages + `what-we-do.html` | Four services, one page each, wording matches the capability statement |
| 6th | 5 | **How to engage + conflict** | Trim `rates.html` → `how-to-engage.html`, matching the capability statement's 3-stage fee model. Cross-link and trim `conflict-policy.html`. | `how-to-engage.html`, `conflict-policy.html` | Fee model matches the capability statement table |
| 7th | 6 | **About** | Trim `about.html` to the capability statement bio. Add the "as at" date to `active-procurement.html`. | `about.html`, `active-procurement.html` | Bio matches the capability statement; Upcoming Works shows its currency date |
| — | — | *Work record* | KDSF + Thunderbird — **separate workstream per D-W5**, not scheduled here | — | — |

### 4.0 Re-sequencing — why Session 7 runs second

The campaign runs the week commencing 2026-09-28, so the site must be public and indexable within
days. Sessions 1 and 7 are therefore brought forward and run **before** any copywriting.

The order matters: structure first, then gate removal. If the gate came off before Session 1, the
first crawl would index the old 23-page structure and the URLs would then change underneath it.
Running Session 1 first means the URLs are final before indexing begins, with redirect stubs
catching anything that slips through.

Sessions 2–6 are copy-only. Because this is a static site with push-to-deploy and no build step,
that copy can land incrementally after the campaign starts without breaking anything.

**Risk, stated plainly:** even on this order there is roughly a week between the gate coming off and
the campaign running. That is thin for Google to crawl and index sixteen pages, several of them new
URLs. Expect paid and direct traffic to carry the campaign initially, and organic search to lag by
two to four weeks. If organic search matters to the campaign, the gate should come off immediately
after Session 1 — do not wait for the copy.

### 4.1 Session prompt template

> Read `docs/WEBSITE_RESTRUCTURE_PLAN.md` and `docs/PROGRESS.md` first — do not re-audit the site.
> Execute **Session N** only. Stay inside the "Files touched" column; do not touch any other file.
> Obey the hard rules in §2.1. Align all copy to `docs/CAPABILITY_STATEMENT.md`.
> Commit to `claude/cool-einstein-3ex6a0`, then update `docs/PROGRESS.md` and stop.

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

## 6. Out of scope

- Any change to `/tools` or the weekly KDC procurement parsing routine.
- Rebuilding `/profiles/*.html` to use the shared stylesheet.
- Image optimisation of the base64 data URIs in the profile pages.
- `terms.html` — remains draft, pending legal review.
- Analytics, forms backend, or any third-party script.
