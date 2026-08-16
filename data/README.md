# Active procurement data — maintenance notes

`tenders.json` drives the table at `/active-procurement.html`.

## Before you add anything, read this

**A stale procurement table is worse than no table.** If this file has not been
updated in three weeks, the page tells visitors so, and after six weeks it hides
the table entirely rather than presenting old data as current. That behaviour is
deliberate — do not remove it.

**Only add an opportunity you have sighted on the issuing body's own portal.**
Not a summary email, not a third-party aggregator. Title, issuing body,
category, location, close date and a link back to the source — nothing more.

**Do not reproduce tender documents or substantial descriptions.** Title, body,
category, close date and link only. The link does the work.

**Never scrape behind a login or a paywall**, and check `robots.txt` and the
terms of use on any source before automating anything against it. Several of the
sources below explicitly prohibit scraping. Where prohibited, manual entry or an
available feed is the only option.

## Schema

```json
{
  "lastUpdated": "2026-08-16",
  "opportunities": [
    {
      "title": "Fitzroy Crossing — road rehabilitation package",
      "issuer": "Shire of Derby/West Kimberley",
      "category": "Civil",
      "location": "Fitzroy Crossing",
      "closes": "2026-09-12",
      "source": "VendorPanel",
      "url": "https://...",
      "reference": "RFT 24/25-11",
      "notes": ""
    }
  ]
}
```

| Field | Required | Notes |
|---|---|---|
| `title` | yes | As published. Keep it short — do not paraphrase into a description. |
| `issuer` | yes | The buying body, not the portal. |
| `category` | yes | One of: Civil, Building, Services, Supplies, Plant &amp; Equipment, Professional, Other. Add to the list in `js/procurement.js` if a new one is genuinely needed. |
| `location` | yes | Town or region. |
| `closes` | yes | ISO date `YYYY-MM-DD`. Drives the closing-soon and closed styling. |
| `source` | yes | The portal it was sighted on. |
| `url` | yes | Direct link to the source listing. Every row must link out. |
| `reference` | no | Tender or RFQ number, where published. |
| `notes` | no | One short line, shown under the title. Never a substitute for the source. |

Set `lastUpdated` every time you edit the file.

## Sources

Public, pre-paywall data only.

| Source | Coverage |
|---|---|
| Tenders WA — tenders.wa.gov.au | WA state government |
| AusTender — tenders.gov.au | Federal |
| VendorPanel | Shire of Broome, Shire of Derby/West Kimberley |
| TenderLink — tenderlink.com/sdwk | Shire of Derby/West Kimberley |
| Tenders.net | WA local government portal |
| Shire of Halls Creek | Local government |
| Shire of Wyndham-East Kimberley | Local government |
| Rio Tinto Buy Local — riotintobuylocal.onlineprocurement.com.au | Resources |

## Automation, if it ever happens

The static site cannot poll these sources itself. The workable path is a Google
Apps Script running in the Nausicaa Workspace account, reading portal alert
emails from a dedicated Gmail label and committing an updated `tenders.json` via
the GitHub API. That uses OAuth against the account's own mailbox — it does not
require portal credentials, and it does not scrape a source that prohibits it.

**No credentials, API keys or service account details ever go in this
repository.** The repository is public.
