# Branch cleanup — August 2026

## Why

The repository's default branch (`claude/peaceful-gauss-2n5sab`) and its published
branch (`main`) had diverged. New branches and pull requests were cut against the
default, so work was starting 16 commits behind what was actually live and changes
were not flowing through to the site.

At the time of the comparison:

- `main` was **16 commits ahead** of `claude/peaceful-gauss-2n5sab` and 4 behind.
- The 4 commits unique to gauss were the Kaynar Group profile takedown. `main`
  reached the same outcome independently, and more completely — gauss still named
  Kaynar in an `index.html` source comment; `main` does not.
- Everything else unique to gauss was superseded content: the pre-gate-change
  calculator, the pre-update about-page bio, and the absence of both the
  Multi-Trade Commercial Coordination page and the Project Profiles restructure.

`main` was therefore a superset of the gauss line's intent. The resolution was to
make `main` the default branch and retire the gauss line rather than merge it —
merging would have reintroduced the older calculator and bio as conflicts, along
with the un-anonymised comment.

## Archive refs

Branches carrying commits not reachable from `main` were preserved as `archive/*`
branches before deletion. Every retired branch tip is reachable from either `main`
or one of these refs.

| Archive ref | Preserves | Notes |
|---|---|---|
| `archive/kaynar-profile-rephrase` | `claude/nausicaa-projects-restructure-1mrr2s` | Reframed Kaynar profile — see caveat below |
| `archive/peaceful-gauss-line` | `claude/peaceful-gauss-2n5sab` | Tip of the retired default-branch line |
| `archive/kaynar-takedown-gauss-line` | `claude/remove-kaynar-review-copy`, `claude/pull-kaynar-profile-from-live` | Takedown as performed on the gauss line |
| `archive/calculator-email-org-gate` | `claude/calculator-email-org-gate-edjrvw` | Superseded by PR #1 on `main` |
| `archive/local-kimberley-business-offers` | `claude/local-kimberley-business-offers-tkfo84` | Equivalent content on `main` via `f5f34b3` (PR #3) |

## Caveat on the Kaynar Group profile

`archive/kaynar-profile-rephrase` holds commit `80c8601`, a rephrasing of the
Kaynar Group profile toward company credit. It sits on the unpublished line off
`claude/peaceful-gauss-2n5sab` and predates the anonymisation pass on `main`.

**If the profile is ever reinstated, rebuild it from `main`'s anonymised version,
not from this archive ref.** The two have drifted apart.

## Preventing a recurrence

The default branch is now `main`. Keep it that way: the divergence above was a
direct consequence of the default and the published branch being different refs.
