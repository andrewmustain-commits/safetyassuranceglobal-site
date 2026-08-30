#!/usr/bin/env bash
set -euo pipefail

OWNER="${OWNER:-andrewmustain-commits}"
REPO="${REPO:-safetyassuranceglobal-site}"
BRANCH="${BRANCH:-main}"
REQUIRED_APPROVALS="${REQUIRED_APPROVALS:-0}"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required." >&2
  exit 1
fi

gh auth status >/dev/null

if ! [[ "${REQUIRED_APPROVALS}" =~ ^[0-6]$ ]]; then
  echo "REQUIRED_APPROVALS must be an integer from 0 through 6." >&2
  exit 1
fi

read -r -d '' PAYLOAD <<JSON || true
{
  "required_status_checks": {
    "strict": true,
    "checks": [
      {"context": "Build Validation", "app_id": 15368},
      {"context": "PR Build Validation", "app_id": 15368},
      {"context": "Analyze (actions)", "app_id": 15368},
      {"context": "Analyze (javascript-typescript)", "app_id": 15368}
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": ${REQUIRED_APPROVALS},
    "require_last_push_approval": false
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
JSON

echo "Applying protection to ${OWNER}/${REPO}:${BRANCH}..."
printf '%s' "${PAYLOAD}" | gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "repos/${OWNER}/${REPO}/branches/${BRANCH}/protection" \
  --input - >/dev/null

echo "Protection applied. Verifying..."
gh api \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "repos/${OWNER}/${REPO}/branches/${BRANCH}/protection" \
  --jq '{required_checks: [.required_status_checks.checks[].context], enforce_admins: .enforce_admins.enabled, required_approvals: .required_pull_request_reviews.required_approving_review_count, dismiss_stale_reviews: .required_pull_request_reviews.dismiss_stale_reviews, conversation_resolution: .required_conversation_resolution.enabled, force_pushes: .allow_force_pushes.enabled, deletions: .allow_deletions.enabled}'

echo
if [[ "${REQUIRED_APPROVALS}" == "0" ]]; then
  echo "Note: PRs are required, but no approving review is required. This avoids deadlocking a single-maintainer repository."
  echo "When a second authorized reviewer is available, rerun with REQUIRED_APPROVALS=1."
fi
