#!/usr/bin/env bash
# Retire the stale branch line documented in docs/branch-cleanup.md.
#
# Run from a clone with push rights, AFTER switching the default branch to
# main (Settings -> General -> Default branch). Deleting the default branch
# is refused by GitHub, so the switch has to happen first.
#
# Safe to re-run: branches already gone are skipped.

set -uo pipefail

REMOTE="${REMOTE:-origin}"

MERGED=(
  claude/about-page-bio-update-voxufw
  claude/contact-us-text-updates-27bv9a
  claude/merge-peaceful-grass-main-15nkt4
  claude/mobile-hero-photo-framing-jbfo1d
  claude/remove-direct-numbers-moqdqa
  claude/remove-kaynar-group-refs-sd5npb
  claude/remove-scaling-profile-from-main
  claude/session-3un6h1
  claude/website-content-adjustments-tmxhig
)

ARCHIVED=(
  claude/peaceful-gauss-2n5sab
  claude/calculator-email-org-gate-edjrvw
  claude/local-kimberley-business-offers-tkfo84
  claude/nausicaa-projects-restructure-1mrr2s
  claude/pull-kaynar-profile-from-live
  claude/remove-kaynar-review-copy
  claude/archive-kaynar-profile-rephrase
)

echo "==> Fetching $REMOTE"
git fetch --prune "$REMOTE" || exit 1

DEFAULT=$(git symbolic-ref --short "refs/remotes/$REMOTE/HEAD" 2>/dev/null | sed "s|^$REMOTE/||")
if [ "$DEFAULT" != "main" ]; then
  echo "REFUSING: default branch is '${DEFAULT:-unknown}', not 'main'."
  echo "Switch it in repo settings first, then re-run (git remote set-head $REMOTE -a to refresh)."
  exit 1
fi

# Every branch tip must be reachable from main or an archive ref before anything is deleted.
echo "==> Verifying preservation"
COVER=("$REMOTE/main")
while read -r r; do COVER+=("$r"); done < <(git for-each-ref --format='%(refname:short)' "refs/remotes/$REMOTE/archive")

fail=0
for b in "${MERGED[@]}" "${ARCHIVED[@]}"; do
  git show-ref --verify --quiet "refs/remotes/$REMOTE/$b" || continue
  sha=$(git rev-parse "$REMOTE/$b")
  ok=0
  for ref in "${COVER[@]}"; do
    if git merge-base --is-ancestor "$sha" "$ref" 2>/dev/null; then ok=1; break; fi
  done
  if [ "$ok" -eq 0 ]; then echo "  UNCOVERED: $b ($sha)"; fail=1; fi
done

if [ "$fail" -ne 0 ]; then
  echo "REFUSING: the branches above are not reachable from main or any archive/* ref."
  exit 1
fi
echo "  all branch tips reachable from main or archive/* — safe to delete"

echo "==> Deleting"
for b in "${MERGED[@]}" "${ARCHIVED[@]}"; do
  if git show-ref --verify --quiet "refs/remotes/$REMOTE/$b"; then
    git push "$REMOTE" --delete "$b" && echo "  deleted $b" || echo "  FAILED  $b"
  else
    echo "  skipped $b (already gone)"
  fi
done

git fetch --prune "$REMOTE" >/dev/null 2>&1
echo "==> Remaining branches"
git ls-remote --heads "$REMOTE" | awk '{sub("refs/heads/","",$2); print "  " $2}'
