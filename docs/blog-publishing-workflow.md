# SAG Insights Publishing Workflow

This workflow governs publication of Markdown insights articles exported from Marblism/Penny.

For the full internal governance standards, authority hierarchy, and required reading order, see `docs/content/CONTENT-INDEX.md`.

## 1. Export and prepare content

1. Export the article from Marblism/Penny as Markdown.
2. Save the file in `content/intake/`.
3. Ensure frontmatter includes the required fields for import:
   - `title`
   - `description`
   - `publishedAt` (or `date` for import normalization)
   - `author`
   - `category`
   - `tags`
   - `status` (must not be `published`)
   - `source`
   - `slug`
4. Run `npm run blog:import -- <path-to-intake-markdown-or-folder>`.
5. Imported files are normalized into `src/content/blog/` with non-public status (`draft` by default).

## 2. Submit via Git workflow

1. Create a feature branch.
2. Commit imported draft article(s) and import report artifact.
3. Open a pull request for editorial and governance review.
4. Reviewers verify factual accuracy, quality, compliance, claim safety, and brand standards.

## 3. Approval and publication gate

1. Run governance checks: `npm run blog:status`, `npm run blog:claims`, `npm run blog:validate`.
2. After required review gates are complete, promote status to `published`.
3. Merge reviewed changes into the production branch.
4. Cloudflare Pages deploys the static site.
5. Public pages render **only** posts with `status: published`.

## 4. Important governance rules

- Draft and review-state posts remain in Git history but are never listed publicly.
- `approved` alone does not make content public; explicit promotion to `published` is required.
- Claims-sensitive content must complete the claims-review block before publication.
- Any editorial changes after publication require a new PR review cycle.
