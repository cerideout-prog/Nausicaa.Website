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
| — | 4 — Service pages | ✅ Complete | 2026-09-25 | Four service pages realigned to their capability statement cards; `local-content` merged into Service 4; all four stale eyebrows replaced; `what-we-do.html` given connective copy (166 → 304 words) with its four cards left verbatim. |
| — | 5 — How to engage + conflict | ✅ Complete | 2026-09-29 | Fee model on `how-to-engage.html` rebuilt to the capability statement's three stages, verbatim-identical to the homepage's. Fee-at-award added — it was missing sitewide. Body cross-links added both ways; there were none. `conflict-policy.html` cross-linked but **deliberately not trimmed** — see the entry. |
| — | 6 — About | ✅ Complete | 2026-10-06 | `about.html` bio aligned to the capability statement and now matches the homepage word-for-word; "Principal Consultant" corrected to "Commercial Manager" sitewide. `active-procurement.html` **unchanged — D-W3 was already satisfied** by existing code. **But its data is 56 days stale and the table is self-suppressing: the page renders empty.** See the entry. |
| — | 7 — Launch | ✅ Complete **on the branch** | 2026-10-06 | Gate removed from **31** files (27 root + 4 profiles — the plan's count missed the profiles, which would have been unreachable). `home.html` → `index.html` with a stub at the old URL. `robots.txt` restored, canonicals and OG swept, sitemap regenerated. **NOT yet merged to `main` — awaiting confirmation.** |
| — | Work record (KDSF + Thunderbird) | 🛑 Blocked | — | Separate workstream per D-W5. **Hard block — plan §5.1.** |

## Log

### 2026-10-06 — Terms reframed, and the procurement list refreshed

**`terms.html` banner reframed (option 3) — copy only, no clause touched**
It led with "DRAFT — NOT FOR USE", which read as an internal warning label on a page now linked
from every footer. It now leads with the reason: that since November 2023 an unfair term in a
standard-form small-business contract is unlawful to *propose*, not only to enforce, so the
exposed clauses are deliberately left open pending advice. Every protective statement is intact
and verified present — *not in force*, *not offered to any client*, *must not be relied on*, the
nine `[AWAITING ADVICE]` markers, and `noindex`. The `<title>`, meta description (which still said
"not published" — false since D-W10) and footer line were brought into line.

**Not changed, and worth a decision:** `.draft-banner` is still deep red (`#7f1d1d`) with a warning
triangle. That styling now reads at odds with the calmer copy. Changing it to navy is a one-line
CSS edit; it was left alone because option 3 was scoped to copy.

**`data/tenders.json` refreshed — Upcoming Works is live again**
Source: the KDC public weekly PDF for **30 September 2026**, supplied by the user. Note this is the
**public PDF, not the email** the documented routine expects, so `tools/parse-kdc-email.js` could
not be used directly. The data was generated with a script that **reuses the repo's own exported
helpers** — `KDC.parseDate`, `KDC.kdcPdfUrl`, `KDC.applyOverrides`, `KDC.build` and `KDC.scrub` —
so the output matches what the email routine would produce.

- **28 opportunities**: 15 with real closing dates (4 "new", 11 "current"), 13 KDC "future
  opportunities".
- **Future opportunities carry `closes: null`**, with the estimated advertising date in `notes`.
  The table column is headed *Closes*; putting an advertising date there would have rendered as
  "2 Oct 2026 (closed)" for a tender that has not been advertised yet. They render "—" and sort
  last, which is correct.
- **Nothing dropped.** The oldest closing date is 1 Oct, five days back, inside the README's
  7-day grace. Two entries render "(closed)" by design.
- **Scrub passed.** The source PDF contains three email addresses and a named KDC officer; none
  were carried across. Notes were rewritten to keep the actionable fact and drop the contact.
  Verified: no `@` anywhere in the file.
- All 28 entries link to the KDC public weekly PDF, never a personalised link.

**Verified in the browser:** no stale notice, "Last updated 30 Sept 2026" in the toolbar, table and
toolbar visible, 28 rows, closing badges rendering `(closed)` / `(today)` / `(1d)`, category filter
populated from the data, search working, 28 links to the KDC PDF, zero console errors.

**One possible source error, left as published:** *"Derby Main Roads Department - Bindara Donga -
Refurbishment"* is listed with location **Fitzroy Crossing**. That may be the issuer/location
transposition `data/README.md` warns about, but the correct value is not knowable from the PDF, so
it was reproduced faithfully. If Derby is right, the fix belongs in `data/overrides.json` under
`derby-main-roads-department-bindara-donga-refurbishment`.

**Also noted:** the PDF prints *"Provision of Occupational Vaccination Program … 7 Oct 2016"* — a
year typo. It is a future opportunity, so the date went into `notes` as 2026, which is plainly what
was meant.

### 2026-10-06 — Settlements (D-W10, D-W11) and Session 7: Launch

**Three open decisions settled first**
1. **Upcoming Works data** — user will supply the updated KDC list. `data/tenders.json` is untouched
   and still dated 11 Aug, so the table stays self-suppressed until that lands. **The site goes
   public with Upcoming Works showing its "not currently being maintained" notice.**
2. **D-W10 — `terms.html` is now linked** from the Company footer column on all 17 chrome-bearing
   pages. It keeps `noindex, nofollow`, stays out of `sitemap.xml`, and keeps `Disallow: /terms.html`.
   Its banner claimed the page "is not linked from the site" — corrected, since this decision made
   it false. The standing "do not link" comment was rewritten to record the reversal. **The draft
   banner and the [AWAITING ADVICE] markers stay.**
3. **D-W11 — conflict-policy duplication removed.** The pledge block is kept as the public
   commitment; Tier 1 now incorporates those four prohibitions by reference and lists only its two
   additional items. Nothing left the framework. 1199 → 1144 body words.

**Session 7 — launch, executed on the branch**
- **Gate removed from 31 files, not 27.** The plan counted root pages only. `profiles/*.html` carry
  the same inline gate, and all four are linked from `project-profiles.html` and `about.html` — left
  in, every profile would have bounced visitors to `/` and been unreachable. Verified: zero
  `nc_unlocked` references remain anywhere in the repo.
- **`home.html` → `index.html`** via `git mv`, old gate `index.html` deleted, and a redirect stub
  left at `home.html` so the pre-launch URL still resolves.
- **`robots.txt` restored** — `Allow: /`, `Disallow: /terms.html`, and the `Sitemap:` line.
- **Canonical and OG swept.** Canonicals were already right on the real pages; the sweep found and
  fixed what was missing rather than what was wrong:
  - `og:url` was absent from **every** page except the homepage — Session 1 built the subpage head
    from a template that never had one. Added to 16 pages.
  - `terms.html` had **no canonical at all**. Added.
  - The four profile pages had **no canonical and no OG tags**, despite being in the sitemap and
    therefore indexable. Added canonical, `og:type`, `og:url`, `og:title`, `og:image`,
    `og:description` and `twitter:card`, derived from each page's own title and description.
  - The nine redirect stubs keep canonicals pointing at their **targets** — correct for a stub, and
    deliberately left alone.
- **`sitemap.xml` regenerated** from the filesystem rather than by hand: 21 URLs, stubs and
  `terms.html` excluded, exclusions documented in the file.

**Verified as a first-time visitor with no `localStorage`** — the real post-launch condition:
- All 22 real pages return 200 with exactly one `<h1>` and **no redirect to the gate**.
- All 9 redirect stubs resolve correctly. The multi-trade stub lands on
  `kimberley-business.html#multi-trade`, the anchor Session 3 created.
- Zero console errors on any page.
- Nav and footer still hash identically across all 17 chrome-bearing pages.
- **Zero horizontal overflow** across 12 pages at 320, 360, 390, 414, 768, 900, 1024, 1140, 1280
  and 1440px.
- No broken internal links. All 27 root pages tag-balanced. `sitemap.xml` valid XML with every URL
  resolving to a file on disk.

**NOT DONE — the merge to `main`**
Everything above is on `claude/cool-einstein-3ex6a0`. The merge is the moment the site becomes
public and crawlable, and it was held back for explicit confirmation because two things are still
open at the time of writing: the Upcoming Works list has not arrived, so that nav item will launch
empty; and `terms.html` is now linked from every page while still carrying its DRAFT — NOT FOR USE
banner and unreviewed clauses. Neither blocks a merge — both are recorded decisions — but they are
the state the site will go live in.

### 2026-10-06 — Session 6: About

**Files touched:** `about.html`, `docs/PROGRESS.md`. `active-procurement.html` was deliberately
**not** changed — see below. No CSS written.

**`about.html` — the bio contradicted the capability statement and the homepage**
Session 2 put the capability statement's bio on the homepage verbatim. `about.html` still carried
the pre-restructure version, so the two pages disagreed about who Callum is:

| | Was | Now |
| --- | --- | --- |
| Role | Principal Consultant | **Commercial Manager** (capability statement's own title) |
| Career span | oil & gas, mining, earthworks, transport, government works | **mining, energy, civil and technology** — "technology" was missing entirely, despite a technology profile being published |
| Qualifications | "An MBA majoring in Innovation and Organisational Structure, a Business Degree majoring in Finance, and a love of science and research fostered through a Science Degree in Applied Geology" | **MBA, BCom (Finance), BSc (Geology)** |
| Kimberley time | *absent* | **Four years in the Kimberley with a focus on commercial risk and governance** |

Verified in the browser that the bio line on `about.html` is now word-for-word the one on
`home.html`. "Principal Consultant" is gone from the page, the meta description, the OG
description and the portrait alt text.

Two structural fixes while in there:
- **The MBA was listed under "Sector background"** — a degree in a list of industries. Qualifications
  now have their own grid; the sector grid lists sectors only, with Technology & data added.
- **A stale VERIFY comment** warned about a "16+ years" figure that Session 2 had already removed
  from the site. Reworded so it reads as a standing guard against reintroducing it, rather than
  implying the figure is present.

**Qualifications were trimmed, not just restyled.** The expanded majors ("Innovation &
Organisational Structure", "Applied Geology") are gone. §5 keeps *credential names* on the open
VERIFY list, and the capability statement — the approved source — states them as MBA, BCom
(Finance), BSc (Geology). Publishing less specificity than is verified is the safe direction.

Body copy 773 → 749 words.

**`active-procurement.html` — D-W3 is already satisfied, so nothing was changed**
The session brief says "add the 'as at' date". It is already there, and the existing mechanism in
`js/procurement.js` is more rigorous than D-W3 asked for. Verified in the browser in all three
states:

| Data age | Behaviour |
| --- | --- |
| Fresh | Toolbar shows "Last updated 2 Oct 2026". Table renders. |
| > 21 days | Date still shown, plus a visible staleness warning. |
| > 42 days | Table and toolbar hidden; the notice carries the date. |

To confirm the healthy state I temporarily set `lastUpdated` forward in `data/tenders.json`, took
the measurement, and **reverted the file** — confirmed byte-identical to its pre-test state and
absent from the commit. No fabricated currency date was committed.

The page also makes no false claim about its own refresh rate: the "weekly" references describe
the KDC's publication cadence, not Nausicaa's.

**🛑 But the page currently renders empty, and that blocks launch**
`data/tenders.json` was last updated **11 Aug 2026 — 56 days ago**, past the 42-day threshold. So
"Upcoming Works", one of five nav items, currently shows only:

> **THIS LIST IS NOT CURRENTLY BEING MAINTAINED** — It was last updated 56 days ago, on 11 Aug
> 2026. Rather than show you procurement data that may be out of date, the table is hidden.

All **five** listed opportunities have also closed (31 Aug, 3 Sep, 9 Sep ×2, 22 Sep). So even
with the threshold raised the table would show nothing but expired tenders.

**This contradicts the premise D-W3 was decided on** — "User confirmed the weekly KDC update will
be maintained." It has not been maintained since 11 August. The suppression logic is doing its job
and should not be touched; the data is the problem, and refreshing it needs the current KDC weekly
email, which a session does not have.

**Three options, for a decision before Session 7:**
1. **Refresh the data** from the current KDC weekly email (`tools/` has the parser; see
   `data/README.md`) and keep the page. Restores D-W3's premise.
2. **Keep the page, accept it launches empty.** The suppression notice is honest and points
   readers at the KDC. A nav item leading to an empty table is a poor first impression.
3. **Revisit D-W3** — drop Upcoming Works from the nav until the update cadence is real, leaving
   the page reachable but unadvertised.

**Verified**
- `about.html` 200, one `<h1>`, active nav "About", portrait loads, zero console errors.
- Insurance block correctly absent (`piCover`/`plCover` still null, per §5).
- Entity line still rendered from `js/config.js`; no contact detail hardcoded.
- Nav and footer blocks still hash identically across all 17 chrome-bearing pages.
- Zero horizontal overflow at 320, 390, 768, 1024 and 1280px.
- Both files tag-balanced.

### 2026-09-29 — Session 5: How to engage + conflict

**Files touched:** `how-to-engage.html`, `conflict-policy.html`, `docs/PROGRESS.md`. Nothing else.
No CSS written; every layout uses existing classes.

**The fee model now matches the capability statement**
`how-to-engage.html` is rebuilt around the capability statement's HOW TO ENGAGE table — three
stages with their fee bases, as `.stage-card`s in `region-grid`:

| Stage | Fee basis |
| --- | --- |
| Upfront commercial support *(before award)* | Fee-for-service, or Fee-at-award |
| Mobilisation and delivery *(after award)* | As a project cost |
| From variations to close *(through to close)* | As a project cost |

Verified in the browser that these three cards are **verbatim-identical** to the last three
`.stage-card`s on `home.html` — same headings, same fee bases. The homepage's first six
`.stage-card`s are the value chain, which is why a naive selector comparison shows nine.

**Two real alignment gaps closed**

1. **Fee-at-award did not exist anywhere on the site.** The capability statement offers upfront
   support as *"Fee-for-service, or Fee-at-award"*. The page described only the at-risk option
   ("Funded by the client, at risk"). The contingent option is now stated as a peer choice, in
   a two-card block before the deliverable list.
2. **The old three stages were not the capability statement's three stages.** The page had
   Stage 1 tender support → Stage 2 ongoing management → Stage 3 buy-out. Stage 3 is an
   *exception* — what declining Stage 2 costs — not a phase of the work. The capability
   statement's third stage is the claims-to-close phase, which the page had no stage for. The
   three stages are now the capability statement's; the buy-out is kept as an exception noted
   under "after award", where it belongs.

**Cross-links — there were none**
Neither page linked to the other in the body; the only connections were the shared footer.
Added: `how-to-engage` → conflict policy twice (in the capability statement's own "Either side
of the same contract" note, and on the conflict-check sentence in the fee box);
`conflict-policy` → how to engage twice (on the pre-engagement check, and on the
commission/disbursement terms that live on the fee page).

**Trimmed**
- The "What to include in your enquiry" bullet list. `contact.html` already collects project
  stage, location, contract value, duration and role as **structured form fields**. A prose list
  telling people to mention what the form already asks for is duplication; replaced with one
  sentence and a button.
- The day-rate row in the buy-side table, which restated the day-rate panel directly below it.
- The disbursements/GST/no-commissions sentence, which appeared twice.

**Word count, measured properly:** `how-to-engage` 889 → 920, `conflict-policy` 1160 → 1199
(`<main>` only, HTML comments stripped). Both are up slightly. The brief said "trim", and on
`how-to-engage` the duplication was removed but the capability statement's model and the
fee-at-award option are net additions, so the count is roughly flat for materially more content.
Stated rather than dressed up.

**`conflict-policy.html` was NOT trimmed, deliberately — this needs a decision**
The cross-links were added; no content was removed. This is a published conflict-management
framework, the full version is pending legal review (§18), and it is the page a probity officer
reads. Removing items from it is a legal call, not a copy call.

**The trim that is available, if you want it:** the "What Nausicaa will not do" pledge block
(four blockquotes) and the Tier 1 absolute-prohibitions list say the same thing twice. Four of
Tier 1's six bullets restate the four pledges in substance — roughly 90 words of duplication.
Collapsing them changes what a probity officer sees in the section headed "Absolute
prohibitions", so it is not a change to make unilaterally. Options: keep both (current), drop
the pledge block and rely on Tier 1, or keep the pledges and cut Tier 1 to the two unique items
(confidential-information use; acting against a former retained client).

**Already resolved before this session:** the dead `/docs/nausicaa-conflict-framework.pdf`
download button. It is commented out with a "Request the full framework" contact CTA in its
place, and the browser confirms zero rendered links to it. The PROGRESS note listing it as
outstanding for Session 5 was stale.

**Verified**
- Both pages 200, one `<h1>` each, zero console errors.
- Active nav resolves to "How to Engage" on `how-to-engage.html`. `conflict-policy.html` has no
  active nav — correct, it is footer-only per D-W4, not a nav item.
- Nav and footer blocks still hash identically across all 17 chrome-bearing pages; neither was
  touched.
- Zero horizontal overflow on both pages at 320, 360, 390, 768, 900, 1024 and 1280px.
- Both files tag-balanced. No broken internal links (the only regex hit is the PDF href inside
  the HTML comment, which does not render).

### 2026-09-25 — Session 4: Service pages

**Files touched:** `superintendents-representative.html`, `fractional-commercial-manager.html`,
`tendering-and-estimating.html`, `local-supply-chain.html`, `what-we-do.html`, `docs/PROGRESS.md`.
Nothing else. **No CSS written, `css/styles.css` never opened**, `index.html` and `home.html`
untouched, `local-content.html` verified only. Every layout reuses `roles-grid` / `role-card` /
`plain-note` / `segment-grid` / `container--narrow`, all already in use on sibling pages.

**Container note:** this session started on `claude/zen-ptolemy-hozkmh`, which carries none of
Sessions 0–3 — no `docs/`, no restructure. Same failure Session 3 hit. Checked out
`claude/cool-einstein-3ex6a0` from origin before reading anything.

#### Each page now leads with its card's promise, verbatim

| Page | `<h1>` | Lead | Words |
| --- | --- | --- | --- |
| `superintendents-representative.html` | Contract administration and Superintendent's Representative. | card promise verbatim + one clause | 1070 → **1645** |
| `fractional-commercial-manager.html` | Fractional commercial management. | card promise verbatim + one clause | 1039 → **1406** |
| `tendering-and-estimating.html` | Tendering and estimating. | card promise **verbatim** | 710 → **1376** |
| `local-supply-chain.html` | Regional mobilisation and local supply chain. | card promise **verbatim** | 820 → **1545** |
| `what-we-do.html` | *(unchanged)* | *(unchanged)* | 166 → **304** |

`<title>`, `meta description` and both OG tags were realigned on all four detail pages.

**Deviation, declared: the h1s are not byte-identical to the card `<h3>`s.** Session 3 made the
audience h1s byte-match their cards. Here they do not, deliberately. The card labels are verbatim
capability statement and use its abbreviations — "Contract Administration & Superintendent's Rep",
"&" for "and", title case. Those work as a label in a grid; as a sentence at the top of a page they
read clipped. The h1s carry the same words in the site's existing h1 convention (sentence case, "and"
for "&", "Representative" for "Rep", trailing full stop). **The cards were not changed to match** —
they are capability statement copy and moving them to fit a page would be the wrong way round. The
divergence is typographic, not substantive.

#### Service 1 — the two promises that were not argued

The card promises four things. Claims certified and variations tested were already argued well.
**Alternate pricing options and acquittal reporting for grants were not on the page at all.** Both
are now full sections, and both were added to the Scope of service list.

- **Alternate pricing options** — the argument is that accept/reject is a false binary, and the third
  response is to price the alternative on the same basis so the comparison is real. Methodology,
  buildability, rates vs lump sum vs dayworks, scope splits, and the assumptions recorded in writing.
- **Acquittal reporting for grants** — grant funding agreement and construction contract run side by
  side with different reporting categories. A claim is organised the way the works are built; an
  acquittal is organised the way the money was approved. Reconciling the two at close-out from
  records never kept for it is where funding gets clawed back.

Also added a cross-audience paragraph under "Two distinct roles", because this page is sold to
principals *and* to contractors — see the eyebrow note below.

#### Service 2 — restructured onto the card's own four words

The page argued pricing and quote-to-cash under other names; **margin and forecasting were absent.**
The opening section was an eight-bullet list of what a commercial manager does; it is now four
subsections headed **Pricing · Margin · Forecasting · Quote-to-cash**, which is the card's own
sequence. Forecasting is new copy (cash in/out mapped forward, work in hand against capacity,
forecast margin at completion). "How it works day to day" became "How the retainer works day to day",
since "on a retainer" is in the card and was only implied.

**Content moved out:** the "What's included in tender support" list is Service 3's subject matter and
now lives there. Stage 1 cross-links to it rather than restating it.

#### Service 3 — rebuilt; this was the furthest from its card

The page argued capability statements and supplier registrations. The card is about **pricing bids on
real regional cost**. Rebuilt around the card's four named drivers, one section each —
**Mobilisation · Seasonality · Haulage · Availability** — followed by market sounding, how the estimate
is built, and the submission itself. The registrations material is kept but demoted to a single
section ("Before you can price it, you have to be invited"), which is the honest relationship: it is
pre-tender work, not the service.

**Content moved in:** the rate-build and market-sounding argument from `local-supply-chain.html`
("The cost of pricing Kimberley rates from Perth", "Market sounding is not a desktop exercise") — that
is Service 3's card, not Service 4's — plus the tender-support inclusions list from Service 2.

#### Service 4 — the local-content merge

**The merge arithmetic, stated plainly.** 820 + 744 = 1,564 words of source. The page is now 1,545 —
but that includes roughly **500 words of new copy the card required and neither source had**: the
unbundling argument and the WAIPS/APP/IPP section. So about **1,045 words of the 1,564 source words
survive** — roughly a third consolidated away. It is not 1,564 words of two arguments bolted together.

**The card gave the spine and the page now follows it:** unbundle the scope → who can actually deliver
it → participation targets → what a credible plan contains → reporting.

- **"Unbundling the scope" is new.** It is the card's lead idea and *neither* source page argued it.
  Package size, boundaries, risk allocation, payment terms, sequencing, and what should stay bundled.
- **Overlap consolidated.** Both sources discussed the supplier market: supply-chain's directory-vs-register
  grid and local-content's genuine-depth/thin-or-absent grid now sit in one section, "Who can actually
  deliver it", as two halves of one point. Both sources had an engagement-models list and a conflict
  block; each is now one list and one block.
- **Cut:** local-content's 10-item "Scope of service" list. After 1,200 words of detail it restated the
  section headings above it, and the sidebar Deliverables list does the scanning job. Its two items not
  covered in prose (subcontract formation, ITT coordination) were moved into the sidebar so nothing is
  lost. Pre-qualification's five bullets became one paragraph for the same reason.
- **IPP is new to the site.** The card names WAIPS, APP and IPP; neither source page mentioned IPP.
  It is described as the Commonwealth Indigenous Procurement Policy, applying where the funding or
  contract is Commonwealth. **No threshold, percentage or target figure is published** — the section
  says explicitly that thresholds change and are confirmed against current published policy per
  engagement, rather than asserting numbers that are on nobody's verified list.
- **Kept deliberately:** the Capability Register IP block, the weekly-reporting callout ("the part most
  plans miss"), and the Traditional Owner / Ranger group engagement material, which is the most
  distinctive content either source held.
- Its fee link pointed at `/rates.html`, retired in Session 1; it now points at `/how-to-engage.html`.

**`local-content.html` stub verified, not changed.** Canonical, meta refresh, `noindex`, title, body
sentence and Continue button all already point at `/local-supply-chain.html`. Confirmed in the browser:
it lands on `/local-supply-chain.html`.

#### Eyebrows — the judgement call the brief asked for

All four carried pre-restructure audience labels. The format is now uniform (`label · Service N`), but
**the label is not an audience label on two of the four, and that is deliberate.**

| Page | Eyebrow now | Why |
| --- | --- | --- |
| Service 1 | **What we do** · Service 1 | **False pairing removed.** It read "Delivering in the Kimberley". This service is sold to principals *and* to contractors — the capability statement's own Audience 3 card is literally "Superintendent's Representative and contract administration", while contractor-side administration is half the page. No single audience label is true. |
| Service 2 | **Kimberley Businesses** · Service 2 | Correct as-is. The copy is written squarely for local businesses that need the function before they can carry the salary. |
| Service 3 | **What we do** · Service 3 | **False pairing removed.** It read "For Kimberley businesses". But Audience 1's card promises "Regional cost priced honestly" and Audience 2's promises "Estimating discipline" — both are this service. Either label would be half right. |
| Service 4 | **Entering the Kimberley** · Service 4 | Correct. Unbundling a head-contract scope is sold to whoever holds the head contract, and Audience 1's card promises "a subcontract panel that holds through a wet season". |

Where the eyebrow no longer names an audience, the page body carries the cross-links instead — Service 1
now has a paragraph naming both audiences and linking to both pages, which is more informative than a
single label was.

#### Carried item 1 — security of payment: DECIDED

**`superintendents-representative.html#security-of-payment` is the single canonical treatment.** An
HTML comment now says so at the anchor, so a later session does not re-split it.

The "three places" framing in Session 3's note overstates it. On inspection it is one treatment plus two
things that are not treatments:

| Where | What it actually is | Verdict |
| --- | --- | --- |
| `superintendents-representative.html#security-of-payment` | ~250 words: the Act, the payment-schedule mechanism, statutory debt, the exposure panel, the statutory "as at" date, the not-legal-advice disclaimer | **Canonical. Keep.** |
| `kimberley-business.html` "Did you know?" | ~110 words, plain English, no statute named, **no as-at date, no legal-advice disclaimer** | Legitimate audience explainer — but it must link to the canonical anchor and does not |
| `kimberley-business.html` `#multi-trade` "Commercial protection" card | one 18-word capability bullet | Fine as-is |

So the defect is not duplication of detail. It is that **the statutory currency date and the
not-legal-advice disclaimer exist on only one of the three**, and neither of the other two gives the
reader a path to them.

**Done here:** Service 2's quote-to-cash section refers to the payment legislation and links to the
canonical anchor rather than restating it.

**➡️ ACTION FOR A LATER SESSION (`kimberley-business.html` — this session may not touch it).** Add a
link to `/superintendents-representative.html#security-of-payment` from the "Did you know?" block. One
sentence at the end of it, e.g. *"The statutory position is set out in full on the contract
administration page."* Do **not** move the statute name, the day counts, the as-at date or the
disclaimer onto that page — that is what would create a second treatment to keep in sync.

#### Carried item 2 — day rate and travel disbursement: CLOSED, no gap

Session 3 asked this session to check. **`how-to-engage.html` carries both**, so nothing was lost when
the fee table came off `entering-the-kimberley.html`, and **nothing needs to be added in Session 5**:

- Day rate — line 63–65: *"Day and hourly rates … A day or hourly rate and any minimum commitment are
  agreed after a discussion about the project and its scope"*, applying to *"supervision, site
  attendance, project administration and discrete short-form assignments"*. There is also a "Day rate"
  row in the fee table at line 100.
- Travel — lines 65 and 165: *"Client travel and accommodation recovered as a disbursement at cost"*,
  and again *"not marked up"* in the fee notes.

`superintendents-representative.html` independently carries both in its Engagement models section and
its "Day rate" sidebar. **`how-to-engage.html` was not edited** — it is Session 5's file and needed
nothing.

#### `what-we-do.html` — cards unchanged, connective copy added

**The four cards were checked against the rewritten detail pages and not one needed to move.** Each
card's promise is now the detail page's lead, verbatim. The cards stay verbatim capability statement.

The brief allowed connective copy on a 166-word page. Added one `plain-note` mapping the four services
onto the capability statement's own value chain (estimate → tender → mobilise → deliver → claim and vary
→ bill and close), plus the one-line conflict statement with a link to `/conflict-policy.html`. 166 → 304
words. No card text touched, no new CSS, `container--narrow` and `plain-note` both already in use.

#### Verification — in Chromium against `python3 -m http.server 8000`, gate unlocked

- All five pages **HTTP 200**, **exactly one `<h1>`**, **five nav items**, active state resolving to
  **"What We Do"** on all five.
- **`config.js` substitutions all resolving — zero empty `data-entity` elements.** No contact detail
  hardcoded outside a `data-entity` attribute on any of the four service pages. `piCover` / `plCover`
  left null; the insurance block on Service 1 stays suppressed.
- **Zero console errors.** The `ERR_CERT_AUTHORITY_INVALID` for the Google Fonts CDN is filtered — this
  container's egress proxy blocks `fonts.googleapis.com`, it reproduces on untouched pages, and it is an
  environment artefact.
- **164 internal links and anchors checked, all resolve**, including `#security-of-payment`.
- `local-content.html` still lands on `/local-supply-chain.html`.
- **Zero horizontal overflow at 320 / 390 / 768 / 1024 / 1025 / 1180 / 1181 / 1440px** — both sides of
  every Session 2 breakpoint. Session 2's CSS is untouched and nothing added here reintroduces overflow.
- **Nav and footer byte-identical** — header `a124380a`, footer `f2b378a6` across all five pages and
  matching every other chrome-bearing page. (`contact.html` and `terms.html` differ as they did before,
  pre-existing and intentional.) Verified by hash before committing.
- All five files tag-balanced.

**Hard constraints checked, not assumed.** A scan of all five files **including HTML comments** finds no
WAPOL, KDSF, Thunderbird, Kaynar, Crothers, Kimberley Mineral Sands or Waterbank, and no package value,
tonnage, volume, duration or subcontractor count. **No Superintendent's Representative appointment is
claimed** — the "On appointments" note is unchanged and still says plainly that no register of prior
formal appointments is claimed. The only digits in body copy on the four pages are two pre-existing
strings: "2,000 kilometres away" (rhetorical, Service 1) and the "80% of it is used up" hours-cap rule
(Service 2), which matches `how-to-engage.html` exactly.

#### Found, not fixed

1. **`kimberley-business.html` needs a one-sentence link to the canonical security-of-payment anchor.**
   Full instruction above. Out of this session's files.
2. **Service 1 is now the longest page on the site at 1,645 words.** That is the cost of arguing all four
   of its card promises where only two were argued before. Flagged rather than trimmed, because trimming
   would mean dropping one of the four things the capability statement sells. Worth a look if page length
   becomes a campaign concern.
3. **Service 3's sell-side / Service 4's buy-side split is now load-bearing and should not be "tidied".**
   Helping a local business win work under WAIPS/APP/IPP (Service 3) and advising a head contractor on
   meeting those targets (Service 4) are opposite sides of the same requirement. Both pages say so and
   cross-link. Merging that material onto one page would describe a conflict of interest the conflict
   policy forbids.
4. **`what-we-do.html` uses `segment-grid` (2 → 1) for four cards, not `services-grid` (4 → 2 → 1).**
   Pre-existing from Session 1, renders fine at every width tested, left alone — changing it is a layout
   decision, not a copy fix.


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
