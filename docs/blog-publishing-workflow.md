<<<<<<< HEAD
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
=======
# Blog Publishing Workflow

Safety Assurance Global uses a governed markdown workflow in `content/blog`.

## Required frontmatter

Each post must include:

- `title`
- `description`
- `pubDate`
- `status` (`draft` or `approved`)

## Publishing governance

- `status: draft` keeps a post out of public routes.
- `status: approved` allows a post to appear on `/blog` and `/blog/[slug]`.
- Promotion from draft to approved requires review and merge approval.

## Validation

CI runs:

1. `npm run blog:validate` for frontmatter status compliance.
2. `npm run build` to ensure the approved-only route generation succeeds.

### Validator behaviour

`scripts/validate-blog-status.mjs` validates each Markdown file in `content/blog`:

- Confirms the file opens with a `---` frontmatter delimiter.
- Locates the closing `---` to extract only the YAML frontmatter block.
- Splits on `/\r?\n/` to handle both LF and CRLF line endings.
- Searches for `status:` only within frontmatter lines (not the Markdown body).
- Rejects any value other than `approved` or `draft`.
>>>>>>> origin/main
