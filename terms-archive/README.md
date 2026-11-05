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
