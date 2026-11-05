# Terms of Engagement — version archive

Each version of the Terms of Engagement continues to apply to engagements signed
while that version was in force. A superseded version is therefore never
overwritten or deleted.

## Convention

| Item | Rule |
|---|---|
| Version label | `YYYY-MM` of the month the version comes into force (e.g. `2026-11`) |
| Live page | `/terms.html` — always the version currently in force; indexable |
| Archived page | `/terms-archive/<version>.html` — frozen snapshot; `noindex, nofollow` |
| Sitemap | Live page only. Archived versions are excluded from `sitemap.xml` |
| robots.txt | No `Disallow` — archived pages are crawlable so the `noindex` is seen |

## Procedure when amending the terms

1. Copy the current `/terms.html` to `/terms-archive/<outgoing version>.html`.
2. In the archived copy: add `<meta name="robots" content="noindex, nofollow">`,
   set the canonical to its own archive URL, add the superseded banner
   (`.archive-banner`), and change the hero eyebrow to read
   `Superseded — version <label>, in force <month> to <month>`.
3. Amend `/terms.html` with the new clauses, bump the version label in the
   `<title>` comment block, the hero eyebrow, the closing dateline and the
   footer copyright line.
4. Add a row to the **Version history** table on `/terms.html`, linking the
   now-archived previous version.
5. Commit both files in the same commit, with the version label in the message.

## Versions

| Version | In force from | File |
|---|---|---|
| 2026-11 | November 2026 | current — `/terms.html` (first published set; nothing superseded) |

## Pending amendment — triggered by insurance

Version 2026-11 is drafted around per-engagement cover with no standing
annual policy. When annual insurance is bound, the following need redrafting
together, as one new version:

| Clause | Why it changes |
|---|---|
| 11.1 | "arranged on a per-engagement basis" becomes standing cover at stated limits |
| 11.2 | PI/PL cost is no longer per-engagement; specialist on-charge may still stand |
| 11.3 | the pre-award carve-out exists only because cover is bound at award — it falls away under an annual policy with a continuous retroactive date |
| 11.4 | certificate of currency ceases to be engagement-specific |
| 12.1 | the fee floor was added to cover the case where no policy responds; revisit the cap and the floor once cover is continuous |

Open questions for the broker, to be answered before that redraft:

- Retroactive date — does the policy reach back to pre-award tender work?
- Run-off — the WA limitation period for contract is six years; a project
  policy that lapses at practical completion will not answer a later claim.
