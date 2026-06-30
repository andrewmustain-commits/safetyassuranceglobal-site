# SAG Blog Publishing Workflow

This workflow governs publication of Markdown blog articles exported from Marblism/Penny.

## 1. Export and prepare content

1. Export the article from Marblism/Penny as Markdown.
2. Save the file in `src/content/blog/`.
3. Ensure frontmatter includes all required fields:
   - `title`
   - `date`
   - `author`
   - `category`
   - `tags`
   - `summary`
   - `status`
   - `source`
   - `slug`
4. Set `source: Marblism/Penny export` (or equivalent export source details).
5. Set `status: draft` for all new submissions.

## 2. Submit via Git workflow

1. Create a feature branch.
2. Commit draft article(s) with `status: draft`.
3. Open a pull request for editorial and governance review.
4. Reviewers verify factual accuracy, quality, compliance, and brand standards.

## 3. Approval and publication gate

1. Only after review approval, update frontmatter from `status: draft` to `status: approved` in the same PR (or a follow-up approval PR).
2. Merge approved changes into the main branch.
3. Cloudflare Pages deploys the static site.
4. Public pages render **only** posts with `status: approved`.

## 4. Important governance rules

- Draft posts remain in Git history and repository content but are never listed publicly.
- Unapproved posts must not be linked from navigation, index pages, or other public content.
- Any editorial changes after approval require a new PR review cycle.
