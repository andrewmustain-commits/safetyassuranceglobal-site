# Public Visual Cutover — 2026-09-16

Status: OWNER APPROVED — PRODUCTION CANDIDATE

## Scope

This change applies the approved Safety Assurance Global visual refresh to the ten primary corporate-site surfaces while preserving the existing Astro application, governed Insights publishing, inquiry/proposal workflows, policy routes, and Cloudflare Pages deployment path.

Primary surfaces:

1. Home
2. Maritime
3. Services
4. Capabilities
5. Industries
6. Government
7. Institute
8. About
9. Insights
10. Contact

## Implementation boundary

- Existing production copy remains authoritative unless changed through the governed content process.
- Existing inquiry, proposal, Turnstile, privacy, and terms behavior is retained.
- No SAG Command runtime or Institute protected authority is modified by this visual change.
- Photography is representational brand imagery and does not establish a client, project, vessel, agency, workforce, or endorsement relationship.
- Government imagery does not imply agency endorsement, award, contract vehicle, or customer status.
- Institute imagery does not imply open enrollment, external accreditation, automatic credential issuance, certificate issuance, or unrestricted commerce.
- The repository's official brand assets remain the authoritative source for the SAG mark.

## Provenance

Owner-approved visual package reference:
`SAG_Public_Site_Production_Candidate_2026-09-16.zip`

Approved package SHA-256:
`74a69bdc8fed5cda3022a9bab60facf45045e488f256589a7e0d896b07e90518`

Prior governance record:
- Safety-Assurance-Global/sag-command PR #747
- Merge commit `5097d000856babdc0cbe5968c5c8b65f51a045b1`

The website copies are optimized WebP derivatives of the approved hero assets. Their production hashes are:

| Asset | Bytes | SHA-256 |
| --- | ---: | --- |
| about-hero.webp | 52,870 | `8d2d0c05975efe63581a594359ca5d0323a671fcb3947a3a624cb1bacebcfa1c` |
| capabilities-hero.webp | 47,908 | `535f1a40849929fbc3a7681946f625f15776a241ab3c10703e0f7c52165beff5` |
| contact-hero.webp | 58,396 | `ee4e1fc452827fa21850129ea1d0a882a6094b486c9d50832bbda66a229ce381` |
| government-hero.webp | 79,724 | `3889711993c56f17d4f32675a3dc3cf7456d5bd6d414d3b303511f6a2779be96` |
| home-hero.webp | 58,484 | `cd4a58f64c2c15fe1533a15cff9d5325d6c9b580793a2356f0413491a8819b2c` |
| industries-hero.webp | 38,000 | `d7b9f9c181954ddbd33da0296860d742c92a85fb265c92b5a6836ea331f470cf` |
| insights-hero.webp | 61,208 | `58c5f856f095a8c915fe1b292682e31dcb1e816e1281e39e4331ee834b012218` |
| institute-hero.webp | 35,542 | `fec29fcd3e453facb4b70116d3126d76cf5199463a30af3ee2c5af09f9cefebd` |
| maritime-hero.webp | 49,274 | `4ce60ae339f290e50ea4687abd43d1a66b5e2728bbc5bc6170751c8cead87dea` |
| services-hero.webp | 56,990 | `59bf65ee625ec2ab6fb0e0c816ff380676ba6911c1f411d2673f1ee2d140a224` |

## Release gate

The production branch must pass the repository's standard PR build/validation checks before merge. Merge to `main` invokes the existing Cloudflare Pages production workflow, which builds, validates, deploys the `dist` output to project `safetyassuranceglobal`, and then verifies hosted production routes.
