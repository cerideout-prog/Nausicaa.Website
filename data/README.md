# Active procurement data — maintenance notes

`tenders.json` drives the table at `/active-procurement.html`. It is generated
from the **Kimberley Weekly Tender Opportunities** email published by the
Kimberley Development Commission (KDC).

## The weekly routine

```bash
# 1. Save the KDC email. In Outlook: File > Save As > .msg
# 2. Convert it to HTML
python3 tools/msg-to-html.py ~/Downloads/kdc-week.msg > /tmp/kdc.html

# 3. Preview what would change — writes nothing
node tools/parse-kdc-email.js /tmp/kdc.html --dry

# 4. Happy? Run it for real
node tools/parse-kdc-email.js /tmp/kdc.html

# 5. Check the diff, then publish
git diff data/tenders.json
git add data/ && git commit -m "Procurement list — week of 11 Aug 2026" && git push
```

If you already have the email as HTML (Gmail: ⋮ > Show original, or forward it
somewhere that gives you the raw body), skip step 2.

The issue date is read from the email subject. Override it with
`--date 2026-08-11` if it can't be found.

## Fixing errors in the source list

The KDC list contains occasional mistakes — a transposed issuer and location, a
typo'd department name. **Do not hand-edit `tenders.json`**; it is regenerated
every run and your edit will vanish.

Put corrections in `overrides.json`, keyed by the slugified title. The parser
prints the exact key for every entry, so copy it from the run output:

```
* 2026-09-03  Statewide  Panel Contract for the Provision of Driver Training…
    override key: panel-contract-for-the-provision-of-driver-training-services
```

```json
{
  "panel-contract-for-the-provision-of-driver-training-services": {
    "issuer": "Main Roads WA",
    "location": "Statewide",
    "category": "Professional",
    "_why": "KDC's list has the issuer and location transposed in this row."
  }
}
```

Overrides always win, survive regeneration, and any field can be overridden.
Corrected rows are marked `*` in the run output.

## Why the parser rewrites every link

**Every href in the KDC email carries personal identifiers in plain text.** They
are Outlook SafeLinks wrappers around Mailchimp click-tracking redirects, and
they contain:

- the recipient's email address, in the SafeLinks `data` parameter
- the Mailchimp subscriber id, as `?e=<id>`

Copying those onto a public web page would publish a personal email address and
subscriber id to the internet, and the links would break the moment the
subscription changed.

So the parser **discards every href in the email** and links each entry to the
KDC's own public weekly PDF instead:

```
https://www.kdc.wa.gov.au/wp-content/uploads/YYYY/MM/Kimberley-Tender-Opportunities-DD.MM.YYYY.pdf
```

That link is public, non-personalised, and correctly attributes the source.

`scrub()` in the parser is a hard backstop. If an email address, a SafeLinks
URL, a list-manage.com URL or a Mailchimp subscriber id reaches the output, the
script aborts with exit 1 and writes nothing. **Do not relax it.**

## Staleness behaviour

Built into `js/procurement.js`, and deliberate — a stale procurement table is
worse than no table:

| Age of `lastUpdated` | Behaviour |
|---|---|
| under 21 days | Normal. "Last updated" shown in the toolbar. |
| 21–42 days | Visible warning above the table. |
| over 42 days, or `null` | **Table hidden entirely**, replaced by a notice. |

So if the routine lapses, the page degrades honestly rather than presenting old
data as current. Entries whose closing date passed more than 7 days ago are
dropped automatically on the next run.

## Attribution

The KDC compiles this list; we reproduce a subset of the facts in it. The page
credits them prominently and points readers at their free subscription. Keep
that block in place — if the value of this page ever comes at the KDC's expense,
the right answer is to send people to them, not to compete with them.

Reproduced per entry: title, issuing body, category, location, closing date, and
a short note. **Never** reproduce tender documents or substantial descriptions.

## Schema

```json
{
  "lastUpdated": "2026-08-11",
  "source": "Kimberley Development Commission — Kimberley Weekly Tender Opportunities",
  "sourceUrl": "https://www.kdc.wa.gov.au/",
  "opportunities": [
    {
      "title": "Bayulu Remote Community School - CCTV Upgrade",
      "issuer": "Dept. Housing & Works",
      "category": "Plant & Equipment",
      "categoryInferred": true,
      "location": "Bayulu",
      "closes": "2026-09-09",
      "notes": "Site visit: Wednesday 19 August 2026, 11am.",
      "source": "KDC weekly list",
      "url": "https://www.kdc.wa.gov.au/wp-content/uploads/2026/08/...pdf",
      "firstSeen": "2026-08-11",
      "lastSeen": "2026-08-11"
    }
  ]
}
```

`category` is inferred from keywords and `categoryInferred: true` records that it
was a guess. Setting a category in `overrides.json` clears the flag.

Adding an entry by hand is fine — give it the same fields and a `url`. It will
survive regeneration as long as no incoming entry shares its title.

## Automating it later

The manual routine above is the fallback. The end state is a **Google Apps
Script** in the Nausicaa Workspace account:

1. A Gmail filter labels the KDC email on arrival
2. A weekly trigger reads the labelled message with `GmailApp.getBody()` — which
   returns the same HTML this parser already handles
3. The parsing logic from `tools/parse-kdc-email.js` runs unchanged (it is
   plain JavaScript with no Node dependencies in `parseEmail`/`merge`)
4. The result is committed to this repo via the GitHub API, which redeploys Pages

That uses OAuth against your own mailbox. It needs no portal credentials, no
scraping, and no password sharing.

**No credentials, API keys or tokens ever go in this repository. It is public.**

## Other sources

If you add entries from elsewhere, only public, pre-paywall listings, and check
`robots.txt` and the terms of use first — several of these prohibit scraping.

| Source | Coverage |
|---|---|
| KDC weekly list — kdc.wa.gov.au | **Primary.** Kimberley-wide |
| Tenders WA — tenders.wa.gov.au | WA state government |
| AusTender — tenders.gov.au | Federal |
| VendorPanel | Shire of Broome, Shire of Derby/West Kimberley |
| TenderLink — tenderlink.com/sdwk | Shire of Derby/West Kimberley |
| Tenders.net | WA local government |
| Shire of Halls Creek | Local government |
| Shire of Wyndham-East Kimberley | Local government |
| Rio Tinto Buy Local | Resources |
