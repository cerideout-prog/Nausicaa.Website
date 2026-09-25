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

### 3.3 Proposed target structure — 13 pages (from 23)

```
index.html                              Home (cap statement on one page)
├─ WHO WE WORK WITH
│  ├─ entering-the-kimberley.html       Audience 1 (was delivering-in-the-kimberley)
│  ├─ kimberley-business.html           Audience 2
│  └─ principals-and-asset-owners.html  Audience 3  ← NEW
├─ WHAT WE DO
│  ├─ superintendents-representative.html   Service 1
│  ├─ fractional-commercial-manager.html    Service 2
│  ├─ tendering-and-estimating.html         Service 3 (was business-support)
│  └─ local-supply-chain.html               Service 4 (local-content + supply-chain merged)
├─ how-to-engage.html                   HOW TO ENGAGE (was rates.html, trimmed)
├─ project-profiles.html                RECENT PROJECT WORK RECORD + /profiles/*
├─ about.html
├─ conflict-policy.html
└─ contact.html
```

Proposed nav — 5 items, down from 7: **Who We Work With · What We Do · Project Record · About · Contact**,
with Contact Us as the CTA button. Three audiences and four services are too many for a flat nav;
either use two dropdowns or make the two section landing pages the nav items.

### 3.4 Decisions required before Session 1

These are blocking. They follow the D1–D10 convention already used in this project.

- **D-W1** Adopt the 13-page target structure in §3.3? (Y / amend)
- **D-W2** Cut `multi-trade-commercial-coordination.html`, or fold its content into Audience 1?
- **D-W3** Keep `active-procurement.html`? It is not in the capability statement but is the site's
  only recurring-value page and a plausible campaign lead magnet. Keeping it means keeping the
  weekly KDC parsing routine running.
- **D-W4** Flat nav with dropdowns, or two section landing pages as nav items?
- **D-W5** Commission KDSF + Thunderbird profile pages (subject to Kaynar clearance), or publish
  the work record only as cards on `project-profiles.html` with the mandatory attribution footnote?
- **D-W6** Retire the four existing profiles from the nav path, or keep them as a secondary
  "earlier career" section?
- **D-W7** Launch date for removing the coming-soon gate and restoring `robots.txt`.

---

## 4. Session breakdown

Each session is scoped to be completable without reading the whole site. **Every session must end by
updating `docs/PROGRESS.md`.** Do not start a session until the previous one is marked complete there.

| # | Session | Scope | Files touched | Done when |
| --- | --- | --- | --- | --- |
| 0 | **Stack audit & plan** | This document | `docs/` | ✅ complete 2026-09-25 |
| 1 | **Structure & plumbing** | No copywriting. Create/rename/delete page files per D-W1. Rewrite nav + footer across all pages. Update `js/main.js` SECTION map, `sitemap.xml`, redirect stubs for retired URLs. | all `*.html`, `js/main.js`, `sitemap.xml` | Every page loads, nav is identical everywhere, no 404 from an old URL, active-link state correct |
| 2 | **Homepage** | Rewrite `home.html` to the capability statement structure: hero, value chain, 3 audiences, 4 services, how to engage, work record teaser. | `home.html` | Homepage reads as the capability statement on one page |
| 3 | **Audience pages** | Realign the 3 WHO WE WORK WITH pages to their cap statement cards. Lead each with the quoted buyer question. | 3 audience pages | Each page opens on its cap statement quote and promise |
| 4 | **Service pages** | Realign 4 WHAT WE DO pages. Merge `local-content` + `supply-chain` into Service 4. Refocus `business-support` → Tendering & Estimating. | 4 service pages | Four services, one page each, wording matches the cap statement |
| 5 | **How to engage + conflict** | Trim `rates.html` to the 3-stage fee model. Cross-link the conflict statement; trim `conflict-policy.html`. | `rates.html` → `how-to-engage.html`, `conflict-policy.html` | Fee model matches the cap statement table |
| 6 | **Work record + about** | Per D-W5/D-W6: KDSF + Thunderbird cards or profiles with the mandatory attribution footnote. Trim `about.html` to the cap statement bio. | `project-profiles.html`, `profiles/`, `about.html` | Work record corroborates the capability statement; attribution footnote present on every instance |
| 7 | **Launch** | Remove the gate: `home.html` → `index.html`, delete the localStorage gate, restore `robots.txt` (`Allow: /`, `Disallow: /terms.html`, `Sitemap:` line), sweep canonical URLs and OG tags, regenerate `sitemap.xml`, full link check. | `index.html`, `robots.txt`, all `*.html` heads | Site is public, crawlable, no dead links, no gate code remaining |

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
