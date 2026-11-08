# IconNovus record register

This register tracks project changes, audits, build results, and release activity. The earliest entry describes the supplied release. Later entries are ordered by the work in this chat.

| ID | Date | Update | Evidence or outcome |
| --- | --- | --- | --- |
| IN-001 | 2026-09-28 | Supplied IconNovus v23 baseline | The source archive documented revision `fedf971f9b44aad69081f6efb9b17c59d76c14fa`, icon and illustration catalogs, 24 sample brand logos, creator submissions, and admin review. The original release included a Cloudflare bundle. |
| IN-002 | 2026-11-08 | Reviewed Dashicon and the IconNovus source | Identified the native SVG, PNG, and WebP inventory and the existing `/brand-logos` routes. The user chose to replace the fictional listings. |
| IN-003 | 2026-11-08 | Replaced the fictional listings | Added 2,561 Dashboard Icons entries with search, category filtering, attribution, and format downloads. Catalog checks and mocked download checks passed. Packaged as `IconNovus-source-dashboard-logos.zip`. |
| IN-004 | 2026-11-08 | Expanded the native file inventory | Indexed 4,808 listings and 13,411 files from pinned Dashicon default and main revisions and the Homarr Labs upstream revision. Verified filename coverage and mocked downloads. Packaged as `IconNovus-source-full-logo-catalog.zip`. |
| IN-005 | 2026-11-08 | Audited the live Dashboard Icons directory | Matched all 3,521 native listings and 13,325 native files from the live sitemaps. Identified 6,192 partner listings and 212 native pages whose extra variants were listed separately in IconNovus. Recorded details in `IconNovus-dashboard-icons-gap-audit.json`. |
| IN-006 | 2026-11-08 | Verified Shelly coverage | Confirmed the base icon, two color variants, and two wordmarks in SVG, PNG, and WebP. The wordmarks had separate IconNovus pages. |
| IN-007 | 2026-11-08 | Imported provider catalogs | Added 7,824 listings and 55,419 file references from selfh.st, LobeHub, and Simple Icons. Added collection filtering and source labels. The production build and live sample downloads passed. The standalone type check and two existing tests reported errors. The Sites connector returned project not found. Packaged as `IconNovus-source-partner-catalogs.zip`. |
| IN-008 | 2026-11-08 | Established project tracking | Created this register and `STATUS.md`, backfilled the known project history, and recorded the update procedure. |
| IN-009 | 2026-11-08 | Added AI brand icons with LobeHub React components | Added a featured section for OpenAI, Claude, Gemini, DeepSeek, Mistral, and Perplexity with `@lobehub/icons` 6.15.0. The production build passed, and all six icons rendered as SVG and linked to existing downloads. npm reported a React peer warning in a transitive dependency. Packaged as `IconNovus-source-ai-brand-icons.zip`. |
| IN-010 | 2026-11-08 | Prepared the GitHub source transfer | Staged the source in an isolated Git checkout and checked the staged files for conflict markers and local runtime files. GitHub returned Not Found for `rankint360/IconNovus`. Remote comparison and push remain pending repository access. |
| IN-011 | 2026-11-08 | Retried the GitHub push | Confirmed that `rankint360/IconNovus` was accessible and had no branches. GitHub rejected writes from the connector with HTTP 403, and command-line Git had no usable credentials. |
| IN-012 | 2026-11-08 | Imported the project into GitHub | GitHub accepted writes. The import targets `main` in `rankint360/IconNovus` and includes the verified source, catalogs, lockfile, and project records. |

For each future IconNovus update, append a dated row with the next ID, the change, and its verification or release outcome. Update [STATUS.md](STATUS.md) in the same change. Keep previous rows as history and record any corrections in a new row.
