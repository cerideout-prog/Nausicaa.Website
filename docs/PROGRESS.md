# Website Restructure — Progress Ledger

Read this and `docs/WEBSITE_RESTRUCTURE_PLAN.md` before starting any session.
**Every session must update this file before it ends.** Newest entry at the top.

**Branch:** `claude/cool-einstein-3ex6a0`
**Decisions D-W1 to D-W9: all answered 2026-09-25.**
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
| — | 2 — Homepage + mobile fix | ✅ Complete | 2026-09-25 | `home.html` rewritten to the capability statement structure. Responsive layout fixed sitewide: **zero horizontal overflow on all 27 HTML files at 25 viewport widths from 320px to 1440px**, including the tablet/laptop band and the 320px residuals. |
| — | 3 — Audience pages | ✅ Complete | 2026-09-25 | Three audience pages realigned to their capability statement cards and led by the quoted buyer question. Multi-trade folded into `kimberley-business.html#multi-trade` per D-W9; its service card and its redirect stub both repointed. `principals-and-asset-owners.html` shell replaced with real copy, 455 → 879 words. `who-we-work-with.html` checked, no drift, unchanged. |
| **1st** | **4 — Service pages** | ⬜ Not started | — | `local-content` content to merge in: `git show 8000eb7:local-content.html` |
| 2nd | 5 — How to engage + conflict | ⬜ Not started | — | Note: `how-to-engage.html` no longer holds the calculator. Dead PDF link to resolve. |
| 3rd | 6 — About | ⬜ Not started | — | Plus the "as at" date on `active-procurement.html` |
| **LAST** | **7 — Launch** | ⬜ Not started | — | Gate off, `home.html` → `index.html`, robots.txt, canonical sweep, merge to `main`. Gate script is inline in **all 27** HTML files, not in `js/`. Also owed: the `home.html` redirect stub, and the `terms.html` footer decision. |
| — | Work record (KDSF + Thunderbird) | 🛑 Blocked | — | Separate workstream per D-W5. **Hard block — plan §5.1.** |

## Log

### 2026-09-25 — Capability statement verified against the source PDF

The user supplied the source PDF (`Nausicaa Capability Statement_A4L_2026-09-21.pdf`,
`sha256:a84c4d20…`, 1 page, text layer intact). Extracted it and checked it fragment-by-fragment
against `docs/CAPABILITY_STATEMENT.md` and against the homepage copy, in both directions.

**The repo's "verbatim extract" was not verbatim.** One substantive insertion and one
punctuation change, neither of them in the PDF:

| | Source PDF | `CAPABILITY_STATEMENT.md` (was) |
| --- | --- | --- |
| Positioning | "commercial and project-delivery **across** the Kimberley" | "commercial and project-delivery **working across** the Kimberley" |
| Credentials | "…Commercial Risk and Governance" | "…Commercial Risk and Governance**.**" |

**This matters beyond the two words.** Sessions 3, 4, 5 and 6 are all instructed to align copy
to that file, so an error in it propagates to every remaining page. It had also already
propagated once: Session 2 read "project-delivery working across the Kimberley", correctly
judged it ungrammatical, and wrote around it on the homepage with an added "support" — a
declared deviation from a source that never said it. The withdrawn note is struck below rather
than deleted.

**Corrected**
- `docs/CAPABILITY_STATEMENT.md` — both errors fixed; the revision note replaced, since it had
  asserted that a full text diff confirmed the extract was clean, which did not hold; and a
  **"Known quirks in the source"** list added so nobody re-introduces an error by tidying the
  PDF's own punctuation (no space in "supervision— estimating", no full stop after
  "Governance", `●` bullets, the HOW TO ENGAGE flow rendered as a table).
- `home.html` — positioning statement and meta description now read "Broome-based commercial
  and project-delivery across the Kimberley"; fee basis corrected to "Fee-at-award" to match
  the source's capitalisation.

**One intentional divergence, recorded in both files.** The PDF has no space before the em dash
in "your supervision— estimating". The extract preserves that, because the extract's job is
fidelity. `home.html` sets it properly as "supervision — estimating", because prose on a web
page is typeset, not transcribed.

**Verified after correcting:** every content fragment of the PDF now appears in the extract,
and all 15 checked homepage fragments — hero, three audience quotes and promises, four service
descriptions, the value chain, the fee basis, the conflict line and the attribution note —
match the source exactly. The only remaining PDF-to-extract differences are the four documented
rendering conventions.

**Not changed:** nothing in the work record. The PDF carries the blocked names and figures in
full; plan §5.1 still governs, and none of it has gone anywhere near the site.

### 2026-09-25 — Session 2 follow-up: the two carried defects, fixed

User asked for both defects recorded in the Session 2 entry below to be fixed. **`css/styles.css`
is the only file touched.** No HTML changed; nav and footer blocks re-verified byte-identical.

**1. The 781–1135px tablet / small-laptop overflow — fixed by making the nav three-tier.**

The cause was a mismatch between two numbers. The drawer engaged at ≤780px, but laid out
horizontally the row needs **1163px** (measured: brand 273 + links 648 + CTA 138 + 2×24 gap +
56 container padding). Everything between those two numbers got a desktop nav in a viewport
too narrow to hold it.

| Tier | Nav | Why |
| --- | --- | --- |
| ≤1024px | Burger drawer | Was ≤780px. Covers phones, tablets, iPad landscape at 1024. |
| 1025–1180px | Tightened row | Wordmark 1.15rem, nav gap 16px, link gap 10px, link padding 6/8px. Brings the required width from 1163px down to ~996px, so it fits from 1025px. |
| ≥1181px | Full row unchanged | 1163px needed, 1181px available. |

Typeface, weight, tracking and every brand colour are untouched — only sizes and spacing move,
per Brand Guide v1.0 §04.

Also grouped the burger with the Contact Us button (`margin-left: auto`). With three items and
`space-between`, the burger was being stranded in the middle of the header across the whole
641–1024px band. Below 640px the button is hidden and it resolves to the same right edge as
before, so nothing changes on phones.

**2. The 320px residuals — fixed, and they turned out to be one bug, not three.**

`home.html` 37px, `calculator.html` 33px and `contact.html` 4px all traced to the same string:
`callum.rideout@nausicaaconsulting.com.au` renders 335px wide with nothing able to break it.
On the contact page it was doing something less obvious — setting a **306px min-content floor on
a grid track inside a 284px grid**, which is why that page overflowed by 4px with no visibly
long text anywhere.

Fixed with two rules keyed off the `data-entity` hooks `js/config.js` already fills, so they
follow the address and the number wherever those appear:

- `[data-entity="email"] { overflow-wrap: anywhere; }` — **`anywhere`, not `break-word`,
  deliberately.** Only `anywhere` is taken into account when intrinsic min-content widths are
  computed, and that is exactly what the contact-page grid case needed. `break-word` would have
  fixed the two visible overflows and left the contact page broken.
- `[data-entity="phone"] { white-space: nowrap; }` — the number was breaking across three lines
  in the utility bar at 320px.

Scoping to the two attribute selectors rather than `body` keeps intrinsic sizing unchanged
everywhere else on the site.

**Verification**

Every one of the **27 HTML files** — 17 live pages, 8 redirect stubs, the gate and the draft
terms page — measured at **25 viewport widths** (320, 360, 375, 390, 414, 480, 520, 560, 640,
641, 700, 768, 800, 900, 1000, 1024, 1025, 1100, 1133, 1180, 1181, 1194, 1280, 1366, 1440).
**675 measurements, zero horizontal overflow.** Breakpoint boundaries checked individually at
640/641, 1024/1025 and 1180/1181: the handover is clean in both directions, the row fits inside
the container at every one, and the drawer opens with all five items at 1024px. `home.html`
re-checked for console errors (none), `config.js` substitutions and burger toggle.

**Still open, unchanged by this follow-up:** canonical and OG URLs point at `/` pending the
Session 7 sweep; `terms.html` remains unlinked pending the footer decision; the dead
conflict-framework PDF link on `conflict-policy.html` is Session 5's.

### 2026-09-25 — Session 3: Audience pages

**Files touched:** `entering-the-kimberley.html`, `kimberley-business.html`,
`principals-and-asset-owners.html`, `multi-trade-commercial-coordination.html` (stub target),
`docs/PROGRESS.md`. **`who-we-work-with.html` was checked and needed no change** — see below.
Nothing else. No CSS written, `css/styles.css` never opened, `index.html` and `home.html`
untouched.

**Each page now opens on its capability statement quote and promise**

| Page | `<h1>` | Lead |
| --- | --- | --- |
| `entering-the-kimberley.html` | *"We can win the work. Who runs it up there?"* | the card promise, verbatim |
| `kimberley-business.html` | *"The commercial skills are the constraint."* | the card promise, verbatim |
| `principals-and-asset-owners.html` | *"Who can see what a contractor is claiming?"* (already correct) | card promise + one explanatory clause |

Each page's eyebrow now carries the capability statement's own audience label
("Entering the Kimberley", "Kimberley Businesses", "Principals & Asset Owners") rather than the
prose descriptors that were there before. `<title>`, `meta description` and both OG tags were
realigned on the two pages whose h1 changed; the principals page's head was already correct from
Session 1 and was left alone.

**`entering-the-kimberley.html` — 837 → 851 words**
The "structural problem" section was rebuilt as **the three parts of that answer**, so the page
body now argues the three things the capability statement card actually promises — regional cost
priced honestly, a subcontract panel that holds through a wet season, a commercial lead in Broome
— instead of three loosely related exposures. The service cards were re-labelled to the
capability statement's own four service names where they correspond, and the second card was
repointed from a duplicate `/local-supply-chain.html` link to `/tendering-and-estimating.html`,
which is what it describes. **Two cards previously pointed at the same page**; now all four
destinations are distinct. The on-ground scoping section is unchanged — it was already the
strongest thing on the page.

**Fee detail removed in favour of a cross-link (brief instruction, plan §4 Session 5).**
The "How buy-side engagements are structured" section carried a four-row rates table. That is
`how-to-engage.html`'s content and Session 5 owns it, so the table is gone and the section is now
a short prose summary in capability statement terms (fee-for-service or fee-at-award upfront;
project cost thereafter) plus a link to `/how-to-engage.html`. **Nothing was deleted that does
not already live there or is not Session 5's to write.** Worth knowing: the day-rate row and the
"client travel recovered as a disbursement at cost" line existed only here, so **Session 5 should
confirm `how-to-engage.html` carries both.**

**`kimberley-business.html` — 1086 → 1332 words, multi-trade folded in per D-W9**
The retired page's content is recovered from `8000eb7` and now sits as a `#multi-trade` section
between the services grid and the security-of-payment block. All of its substance is carried:
why the work gets left on the table, what we bring, the four things we manage, the plain-note
call to action, what it costs, and the good-fit / not-a-fit lists. Rebuilt from `roles-grid` +
`role-card` + `plain-note` — classes already in use on this page and its siblings — because the
original's `page-content` / `page-content-sidebar` two-column layout has no equivalent in this
page's structure.

Three things from the original were **deliberately not carried**:
- the **insurance sidebar block**, because plan §5 keeps `piCover` / `plCover` null until cover is
  bound, and the block is suppressed sitewide anyway;
- the **entity sidebar block** (trading name, ABN, address) — it duplicates the footer on a page
  that already has one;
- its fee link pointed at `/rates.html`, a URL retired in Session 1. It now points at
  `/how-to-engage.html`.

**The live mis-target from Session 1 is fixed.** The Multi-Trade Commercial Coordination service
card at line ~106 pointed at `/entering-the-kimberley.html` — a Kimberley-business service linking
to the page for interstate contractors. It now points at `#multi-trade` on its own page. The hero
note for the same service also gained an anchor link. `entering-the-kimberley.html` is now
referenced from this page **only** from the footer, which is correct.

**`principals-and-asset-owners.html` — 455 → 879 words, shell replaced**
The `STRUCTURAL SHELL` comment is deleted and the placeholder copy replaced. The page now argues
**the asymmetry** — a claim prepared monthly by people who do it professionally, read by someone
with a dozen other responsibilities — and lists the five predictable ways that shows up. The four
`role-card`s became six `segment-card`s in `region-grid` (3 → 2 → 1), covering claims, variations,
statutory time, reporting, contract review and market pricing. A dedicated Superintendent's
Representative section states the impartiality duty plainly and says engagement is **not**
conditional on the appointment. Now at parity with its siblings: **851 / 1332 / 879** body words.

**`who-we-work-with.html` — checked, unchanged.** All three cards were compared against the
detail pages after the rewrite. Every card `<h3>` is now byte-identical to its detail page's
`<h1>`, and cards 1 and 2 carry the detail leads verbatim. Card 3's promise is the capability
statement text and the detail lead extends it with one clause — that is the detail page adding
explanation, not the card drifting. **No edit was made**, per the brief's "do not rewrite it
wholesale". The cards are capability statement copy; changing them to advertise the new
`#multi-trade` section would trade alignment for cross-promotion, which is the wrong way round.

**Deviation from the brief, declared.** The brief scoped the stub to "2 lines — meta refresh AND
canonical". The file actually names the old target in **five** places: title, canonical, meta
refresh, body sentence and the Continue button's `href`. Changing only the two named would have
left a stub whose visible button still sent the reader to the wrong audience page. **All five were
changed.** The refresh and the button also carry the `#multi-trade` fragment, so the reader lands
on the folded content rather than the top of a 1,332-word page.

**Verified in Chromium against `python3 -m http.server 8000`**, gate unlocked via
`localStorage.nc_unlocked='1'`:
- all four pages HTTP 200, **exactly one `<h1>`**, five nav items, active state resolving to
  **"Who We Work With"** on all four;
- `config.js` substitutions all resolving — phone, `phoneHref`, email and ABN populated, **zero
  empty `data-entity` elements**; no contact detail hardcoded outside a `data-entity` attribute;
- **zero console errors.** The one error Chromium does report on every page is
  `ERR_CERT_AUTHORITY_INVALID` for the Google Fonts CDN, which this container's egress proxy
  blocks. It is an environment artefact, not a page defect — it reproduces on untouched pages;
- **87 internal links and anchors checked, all resolve**, including `#multi-trade` and `#scoping`;
- the stub lands on `/kimberley-business.html#multi-trade`;
- **nav and footer byte-identical** — header `ab55eecc`, footer `802eb5c1` on all four pages,
  matching their pre-session hashes and each other;
- all five files tag-balanced;
- **zero horizontal overflow at 360 / 390 / 414 / 768px** on all four pages — Session 2's fix
  holds and nothing added here reintroduces it.

**Hard constraints checked, not assumed.** A scan of all five files including HTML comments finds
**no** WAPOL, KDSF, Thunderbird, Kaynar, Crothers, Kimberley Mineral Sands or Waterbank, and no
package value, tonnage, volume, duration or subcontractor count. No unverified figure was
published — no years-of-experience claim, no volume. **No past Superintendent's Representative
appointment is claimed anywhere**; the principals page says "offers … as a service" and the
entering page says "where the appointment is made".

**Found, not fixed**
1. ~~The 781–1135px overflow band and the 320px residuals.~~ **Both were fixed by the Session 2
   follow-up above**, which landed on the branch while this session was running and is merged in
   here. This session's pages were re-verified against that new CSS after the merge — see the
   note at the end of this entry. The two items originally recorded here are closed.
2. **Session 5 input:** `entering-the-kimberley.html` no longer publishes a day rate or the travel
   disbursement line. Confirm `how-to-engage.html` covers both, or they are lost from the site.
3. **The security-of-payment treatment now appears in three places** — `kimberley-business.html`'s
   "Did you know?" block, the new `#multi-trade` commercial-protection card, and
   `superintendents-representative.html#security-of-payment`. Not consolidated, because two of the
   three are on pages this session could not touch. **Session 4 should decide whether the detail
   lives once and is linked to.**

**Post-merge re-verification.** The Session 2 follow-up (three-tier nav, drawer moved to ≤1024px)
landed on the branch while this session was running, so this session's pages were checked again
against that CSS after merging. All four pages: **zero horizontal overflow at 16 widths** — 320,
360, 390, 414, 600, 640, 641, 768, 900, 1024, 1025, 1100, 1180, 1181, 1280 and 1440px, including
both sides of every new breakpoint. Active nav state still resolves to "Who We Work With", still
five nav items, still exactly one `<h1>`, at both 1280px (full row) and 1024px (drawer).

### 2026-09-25 — D-W9: multi-trade folds into Audience 2, not Audience 1 (no code change)

**D-W2 was wrong about the target.** It said fold
`multi-trade-commercial-coordination.html` into `entering-the-kimberley.html` (Audience 1). The
content is Audience 2. Corrected as **D-W9** before Session 3 runs, so the session reads one
consistent instruction instead of a prompt contradicting a recorded decision.

**Evidence**
- The retired page's own eyebrow: *"For Kimberley businesses · Service"*.
- Its copy: *"Local single-trade businesses often pass on lucrative multi-trade packages…"* —
  written for local businesses stepping up to head contract, not for contractors bringing work
  into the region.
- The pre-restructure `home.html` filed it under the "Based in the Kimberley" segment card; the
  old footer filed it under the "Kimberley Business" column.
- `kimberley-business.html` already carries a Multi-Trade Commercial Coordination service card.

**Live symptom this leaves behind.** Session 1 rewrote internal links faithfully to D-W2, so
`kimberley-business.html` line ~106 has its Multi-Trade service card pointing at
`/entering-the-kimberley.html` — a Kimberley-business service linking to the page for interstate
contractors. Session 3 fixes it.

**Changed in the plan:** §3.1 audit row, §3.3 structure tree, §3.4 (D-W2 struck and D-W9 added
with the evidence), §4 Session 3 scope and files-touched column. The fold itself was never in
doubt — only its destination.

**Consequence for Session 3:** it also edits
`multi-trade-commercial-coordination.html`, changing the redirect from
`/entering-the-kimberley.html` to `/kimberley-business.html`. That is a one-line change, and it
is the only file outside the four audience pages that the session may touch.

### 2026-09-25 — Session 2: Homepage + mobile fix

**Files touched:** `home.html`, `css/styles.css` (one change), `docs/PROGRESS.md`. Nothing else.

**Homepage rewritten to the capability statement structure**
Six sections, in the order the brief set: hero · value chain · 3 audiences · 4 services ·
how to engage · work record teaser. Verified in the browser as exactly those six, one `<h1>`.

- **Hero** — the capability statement's own hero line as the `<h1>`, the positioning statement
  as the lead, and the credential line (MBA, BCom, BSc, four years in the Kimberley) as body
  copy so it survives at phone width. The right-hand panel uses `.hero-art` / `.hero-art-stat`,
  two classes that were already in the stylesheet and used by no page. It is hidden ≤960px by
  the existing breakpoint, so all three points in it are restated in the page body.
- **Value chain** — the six stages, as six `.stage-card`s in `.region-grid` (3 → 2 → 1).
- **3 audiences** — `.region-grid` + `.segment-card`, copy mirroring `who-we-work-with.html`.
- **4 services** — `.services-grid` (4 → 2 → 1) + `.segment-card`, copy mirroring
  `what-we-do.html`.
- **How to engage** — the capability statement's three fee stages as `.stage-card`s, with the
  fee basis in `.stage-meta`.
- **Work record teaser** — see the block below.

**No new grid rules were written** (plan §4.2). Every layout uses `region-grid`,
`services-grid`, `segment-grid` or an existing card class.

**Removed, and why**
- **The three testimonial placeholders** — as instructed. Not filled, not composited.
- **The long "structural separation" conflict paragraph** — replaced by the single line
  *"Conflicts are declared and managed in writing before work starts."*, linked to
  `/conflict-policy.html`, sitting in the How to Engage section where the capability statement
  puts it.
- **The credibility strip** — it carried the `16+ years, resources and civil` figure, which is
  on the §5 VERIFY list and therefore unpublishable. Its verified content (Broome-based,
  either side of the contract, conflicts in writing) is now in the hero panel.
- **The "Did you know?" security-of-payment section** — not in the brief's six-section
  structure. **No content is lost:** the full treatment already lives at
  `superintendents-representative.html#security-of-payment`, which is where its link pointed.
- **The three hero quick-link buttons** (added in `f0d8a34` / PR #9) — superseded by the
  3-audience section, which does the same 5-second-orientation job with capability statement
  copy and correct destinations. The old buttons pointed "Multi-Contractor Projects" at
  `kimberley-business.html` and "Win Kimberley Tenders" at `active-procurement.html`.
  **Flagged because this removes a previously user-requested feature** — say if it should come
  back.

**Kept, deliberately, though not in the brief's six sections**
- **The calculator CTA.** Session 1 extracted the calculator to `calculator.html` with the
  user's approval and left a CTA in both former locations. Dropping the homepage CTA would
  orphan the campaign's only lead-capture page from its landing page, so it was folded into
  the How to Engage section as a secondary button rather than given a section of its own. The
  "indicative only" disclaimer travels with it.

**Work record teaser — the anonymised option (plan §5.1)**
Plan §5.1 allows exactly two outcomes. **The fully anonymised one was taken**, not the
placeholder. The teaser:
- names no client, head contractor, principal, project, asset or former employer;
- carries no package value, tonnage, volume, duration or subcontractor count;
- carries the mandatory §5 attribution note verbatim;
- links to `project-profiles.html` under a label that says plainly those records are from
  **earlier roles in mining, technology and governance** — so the reader is not sent looking
  for corroboration that is not there.

**One thing worth knowing for future sessions:** the warning comment in that section was first
written enumerating the blocked names so nobody would re-add them. That is self-defeating — an
HTML comment is served with the page, so it would have published the very names §5.1 forbids.
It now points at plan §5.1 instead of repeating them. **A scan confirms no blocked name appears
anywhere in `home.html`, comments included, and none appears on any other page of the site.**

**The corroboration gap in plan §3.2 remains open**, as D-W5 intends. The campaign launches
with it open.

**The one CSS change — measured, not asserted**
`css/styles.css`, a single block added inside the **existing** `@media (max-width: 640px)`
rule. Three declarations: `.nav-cta { display: none }`, `.nav { gap: 12px }`,
`.brand { font-size: 1.1rem }`. No new breakpoint, no new custom property, no change to brand
colour, weight, tracking or family.

| Viewport | Before | After |
| --- | --- | --- |
| 320px | 199px over | 0 (see residual note) |
| 360px | 159px over | **0** |
| 375px | 144px over | **0** |
| 390px | **129px over** | **0** |
| 414px | 105px over | **0** |

Verified at 360/390/414 on **all 25 chrome-bearing files**, not just the three required —
every one now reports zero horizontal overflow. `home.html` additionally checked for console
errors (none), `config.js` substitutions (all resolving), burger-menu open/close (works) and
internal links (19, all resolve).

**Consequence, stated plainly:** the header "Contact Us" button is gone below 640px. Contact
is still one tap away in the utility bar directly above it (phone and email, both live links),
in the hero, and in the footer. It cannot be moved into the burger drawer from CSS, because
the nav block is byte-identical across 17 pages and this session must not touch it. **If the
button is wanted on phones, Session 7 can add a Contact item to the drawer** as part of its
sweep — that is a nav change, so it belongs in a nav session.

**Nav and footer are untouched.** Verified by hash: `home.html`'s header and footer blocks are
byte-identical to their pre-session state and to the other pages'. (`contact.html`'s nav
differs by the `active` class on its own CTA — pre-existing and intentional.)

**Two real defects found while verifying.** Both were recorded here as needing a decision, then **fixed on request in the follow-up entry above** (2026-09-25, Session 2 follow-up). Kept below for the diagnosis.

1. **Every page overflows between 781px and ~1135px, by up to 354px.** This is the tablet and
   small-laptop band. It is **pre-existing** — measured at the same magnitude before this
   session's CSS change — and has a **different cause** from the phone defect: the mobile
   drawer only engages at ≤780px, but the full horizontal nav (brand 273px + links 648px +
   CTA 138px + gaps) needs about 1163px. So between those two widths the desktop nav is laid
   out in a viewport too narrow to hold it. Measured: 781px → 354 over, 900px → 235,
   1000px → 135, 1100px → 35, 1150px → 0.
   **Not fixed because** this session was scoped to one CSS change and the phone defect, and
   the sensible fix — raising the drawer breakpoint from 780px to ~1140px — puts a burger menu
   on small laptops. That is a design call, not a bug fix. **Recommend it be taken before
   launch**; it is a worse defect than the one just fixed and affects iPads in landscape.
2. **320px residuals.** `home.html` 37px, `calculator.html` 33px, `contact.html` 4px. Cause is
   not the nav: it is the unbreakable email address string
   (`callum.rideout@nausicaaconsulting.com.au`) in body copy, plus contact-card padding maths.
   Pre-existing — `calculator.html` was not touched this session and shows it. The utility bar
   also wraps the phone number across three lines at 320px. All 320px-only; 360px and up are
   clean. Fixing needs `overflow-wrap` on the affected links, which would be a second CSS
   change.

**Left alone on purpose**
- **Canonical and OG URLs still point at `/`**, which is the gate. Plan §2.2 assigns the
  canonical sweep to Session 7; changing it here would leave the site half-swept.
- `index.html` not touched. The gate script at the top of `home.html` is intact.

**One wording deviation from the capability statement, declared.** ~~The positioning statement
reads "commercial and project-delivery working across the Kimberley" in the source PDF, which
is missing a noun, so the homepage says "project-delivery **support**, working across".~~
**Withdrawn 2026-09-25 — this was wrong, and wrong in a way worth reading.** The source PDF
does not say "working" at all; that word had been inserted by the repo's extract. The PDF
reads "Broome-based commercial and project-delivery across the Kimberley", which needs no
noun added. The homepage and the extract are both corrected. See the verification entry at
the top of this log.

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
  - **Session 3** — the multi-trade content is **not yet folded** in. ~~Into
    `entering-the-kimberley.html` per D-W2.~~ **Corrected 2026-09-25 by D-W9: it folds into
    `kimberley-business.html`** (Audience 2), and the stub target changes with it.
- **Copy oddity for Session 2/3:** `home.html`'s "Based in the Kimberley" card still lists
  "Multi-Trade Commercial Coordination", which the link rewrite now points at
  `entering-the-kimberley.html`. **Resolved on the homepage by Session 2**, which rewrote it. The
  same mis-target survives on `kimberley-business.html` and is Session 3's to fix — see D-W9.
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
