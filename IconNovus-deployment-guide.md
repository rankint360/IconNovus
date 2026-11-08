# IconNovus deployment guide

## 1. Recommended deployment

IconNovus is currently designed for Cloudflare Workers through ChatGPT Sites. This is the lowest-risk production path because the application already uses:

- a Cloudflare Worker entry point;
- D1 for submitted icon metadata;
- R2 for uploaded icon packages;
- Cloudflare assets and image handling; and
- ChatGPT Sites identity headers for creator and administrator access.

The validated web package is `IconNovus-cloudflare-web-v23.tar.gz`.

## 2. Requirements

- Node.js 22.13 or newer
- npm with the supplied `package-lock.json`
- Linux when using the included bounded build scripts (`flock` and GNU `timeout` are required)
- A D1 database bound as `DB`
- An R2 bucket bound as `BUCKET`
- `ICONAVIX_ADMIN_EMAIL` set to the administrator's email address
- An identity provider that supplies the authenticated user ID and email

## 3. Build from source

From the extracted source directory:

```bash
npm ci
npm run build
```

The deployable output is created in `dist/`:

- `dist/server/index.js` — Worker entry point
- `dist/client/` — browser assets
- `dist/.openai/hosting.json` — binding declarations
- `dist/.openai/drizzle/` — D1 migrations

The verified build may report a large JavaScript chunk warning because the catalogue contains thousands of records. This warning does not fail the build; progressive loading limits how many catalogue cards initially render.

## 4. Deploy with ChatGPT Sites

1. Keep `.openai/hosting.json` in the project root.
2. Confirm the binding names remain `DB` and `BUCKET`.
3. Configure `ICONAVIX_ADMIN_EMAIL` as a protected runtime value.
4. Save and deploy the production build through the existing IconNovus Sites project.
5. Keep the current audience private while testing, then deliberately change access only when the marketplace is ready for public visitors.
6. Connect `iconnovus.com` after the production audience and marketplace policies are approved.

ChatGPT Sites owns the real D1/R2 resources and injects the bindings declared in `.openai/hosting.json`.

## 5. Direct Cloudflare Workers deployment

For a standalone Cloudflare account deployment:

1. Create a D1 database and an R2 bucket.
2. Apply `drizzle/0000_broken_hemingway.sql` to D1.
3. Build the project.
4. Replace the placeholder D1 ID and development resource names in the generated Worker configuration with the real Cloudflare resource IDs/names.
5. Bind the database as `DB` and the bucket as `BUCKET`.
6. Store `ICONAVIX_ADMIN_EMAIL` as a Worker secret or protected variable.
7. Deploy `dist/server/index.js` with `dist/client` as its asset directory.
8. Add a production authentication adapter before enabling creator uploads or `/admin`.

Do not rely on `oai-authenticated-user-*` headers outside ChatGPT Sites. Those headers are platform supplied and will not exist on an ordinary Cloudflare Worker domain.

## 6. Database initialization

Apply the included migration before testing submissions:

```bash
npx wrangler d1 execute YOUR_DATABASE_NAME --remote --file=drizzle/0000_broken_hemingway.sql
```

Then verify that `marketplace_icons` and its indexes exist. Apply migrations once per environment and retain database backups before future schema changes.

## 7. Domain and DNS

For `iconnovus.com`:

1. Add the domain to the chosen hosting project.
2. Copy the exact DNS records supplied by the host into the domain's DNS zone.
3. Wait for certificate and domain verification to complete.
4. Redirect `www.iconnovus.com` to the preferred canonical hostname.
5. Update canonical, Open Graph, sitemap, payment callback, and email links when those production features are added.

Do not remove the current preview URL until the custom domain is verified and tested.

## 8. Vercel deployment

The supplied web package is not a Vercel bundle. A Vercel migration requires:

- converting the Vinext/Cloudflare entry point to a standard Next.js deployment;
- replacing D1 with PostgreSQL or another Vercel-compatible database;
- replacing R2 access through `cloudflare:workers` with an S3-compatible SDK or Vercel Blob;
- replacing ChatGPT Sites identity headers with Auth.js, Clerk, Supabase Auth, or another provider; and
- retesting upload streaming, API routes, admin authorization, and migrations.

Use the source package—not the Cloudflare web package—as the migration starting point.

## 9. Hostinger deployment

Shared hosting is not sufficient for the current dynamic marketplace. Use a Hostinger VPS or a Node-capable plan only after converting the runtime from Vinext/Cloudflare Workers to standard Next.js/Node.js.

The migration also needs an external database, S3-compatible object storage, authentication, a Node process manager, reverse proxy, TLS, backups, and monitoring. A static export would show catalogue pages but would remove creator uploads, moderation APIs, dynamic identity, and server-backed marketplace functions.

## 10. Post-deployment checklist

- Homepage, icon, brand-logo, illustration, product, and admin routes load.
- Search, filters, dark mode, and “Load more” controls work.
- D1 migration is applied.
- SVG, PNG, WEBP, and ZIP uploads up to 10 MB reach R2.
- Anonymous upload requests receive `401`.
- The configured administrator can load and review pending submissions.
- Non-admin users receive `403` from admin APIs.
- Published submissions appear in `/api/icons`.
- HTTPS and custom-domain redirects work.
- Backups, logs, privacy policy, creator terms, licensing terms, refund rules, and payment handling are ready before public launch.
