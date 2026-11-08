# IconNovus release package

Prepared: 28 September 2026  
Source revision: `fedf971f9b44aad69081f6efb9b17c59d76c14fa`  
Current hosted preview: https://iconavix.anjam1.chatgpt.site  
Planned production domain: `iconnovus.com`

## Included downloads

- `IconNovus-source-v23.zip` — editable project source, lockfile, database migration, assets, tests, and documentation. It excludes `.git`, `node_modules`, build output, local runtime state, and secret files.
- `IconNovus-cloudflare-web-v23.tar.gz` — validated production bundle containing the Cloudflare Worker, browser assets, hosting metadata, and D1 migration.
- `IconNovus-deployment-guide.md` — deployment procedures and portability notes.
- `IconNovus-configuration-guide.md` — bindings, environment values, database, storage, authentication, upload limits, and domain configuration.

## Verified application shape

- Vinext/Next.js application on React 19
- Cloudflare Worker runtime
- Cloudflare D1 binding: `DB`
- Cloudflare R2 binding: `BUCKET`
- Optional administrative variable: `ICONAVIX_ADMIN_EMAIL`
- 3,000 icons, 1,750 illustrations, brand-logo catalogue, creator submissions, moderation APIs, and permanent product routes

Read the configuration guide before deploying. The browser catalogue can be viewed without the database, but creator uploads, moderation, and the live submitted-icon feed require D1 and R2. The existing sign-in flow is supplied by ChatGPT Sites; other hosting platforms need a replacement authentication adapter.
