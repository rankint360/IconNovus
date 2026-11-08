# IconNovus configuration guide

## Platform configuration

The project uses the following hosting declaration:

```json
{
  "project_id": "appgprj_6a993ab9d3748191a60f307e3216e49e",
  "d1": "DB",
  "r2": "BUCKET"
}
```

Keep the existing `project_id` only when publishing to the existing IconNovus ChatGPT Sites project. Remove or replace it when deliberately creating a separate deployment under a different hosting control plane.

## Runtime bindings

| Binding | Type | Required for | Notes |
|---|---|---|---|
| `DB` | Cloudflare D1 | Submissions, moderation, published submission feed | Schema is in `drizzle/0000_broken_hemingway.sql`. |
| `BUCKET` | Cloudflare R2 | Uploaded SVG, PNG, WEBP and ZIP files | Objects use `submissions/{userId}/...` keys. |
| `ASSETS` | Worker assets | Browser files | Supplied by the Cloudflare/Vinext build. |
| `IMAGES` | Cloudflare Images binding | Image optimization endpoint | Used by the Worker image handler. |

## Environment values

### Required for administration

`ICONAVIX_ADMIN_EMAIL`

Set this to the exact email address of the IconNovus administrator. Email comparison is case-insensitive. Treat it as a protected runtime value and do not commit it to Git or include it in downloadable source archives.

No `.env` file is included because the current project does not require a committed environment file. Local secret files are ignored by Git.

## Authentication

Creator submission and admin APIs call the supplied ChatGPT Sites authentication helper. It reads:

- `oai-authenticated-user-id`
- `oai-authenticated-user-email`
- optional full-name headers

Anonymous users can browse the catalogue. A signed-in user is required for `/api/submissions`. The admin API additionally requires the signed-in email to match `ICONAVIX_ADMIN_EMAIL`.

When moving away from ChatGPT Sites, replace `app/chatgpt-auth.ts` with a provider-specific server-side adapter that returns a stable user ID, verified email, display name, and null for anonymous requests.

## Database

The `marketplace_icons` table stores:

- identity, name and unique slug;
- category and style;
- price in cents and available formats;
- creator ID, email and optional portfolio URL;
- R2 object key, original filename and content type;
- review status: `pending`, `published` or `rejected`; and
- created/reviewed timestamps.

Run `npm run db:generate` only after editing `db/schema.ts`. Inspect new migrations before applying them. Never edit or reapply a migration that has already run in production; create a new migration.

## Upload configuration

Current limits are defined in `app/api/submissions/route.ts`:

- allowed types: SVG, PNG, WEBP and ZIP;
- maximum file size: 10 MB;
- price range: $0 to $100; and
- submitted SVG files are rejected when script tags, JavaScript URLs or inline event handlers are detected.

Changing limits requires updating the API validation and confirming the corresponding Cloudflare request and storage limits.

## Catalogue configuration

- Static catalogue data: `lib/icon-catalogue.ts`
- Illustration catalogue and categories: `app/illustrations/page.tsx`
- Brand-logo samples: `components/brand-assets.tsx`
- Shared product layout: `components/marketplace-product-page.tsx`
- Global design system: `app/globals.css`
- Logo and favicon assets: `public/iconnovus-*`

Current catalogue totals are 3,000 icons and 1,750 illustrations. Catalogue pages initially render a limited set and reveal more through “Load more” controls.

## Brand configuration

Current design tokens include:

- primary indigo: `#5B5FEF`
- mint accent: `#24D6A1`
- dark ink: `#11152A`

Use the IconNovus logo files in `public/`. The planned canonical domain is `iconnovus.com`; the current private Sites preview remains on the `iconavix.anjam1.chatgpt.site` address.

## Build configuration

- Minimum Node version: 22.13
- Framework: Vinext with Next.js 16 and React 19
- Build command: `npm run build`
- Production entry point: `dist/server/index.js`
- Browser assets: `dist/client`
- Cloudflare compatibility flag: `nodejs_compat`

The included install/build scripts target Linux. On Windows, use WSL2, a Linux CI runner, or a container rather than running the shell scripts directly in Command Prompt.

## Security checklist

- Keep administrator email and future payment/API credentials out of source control.
- Preserve server-side admin checks; hiding the admin page is not authorization.
- Add rate limiting, malware scanning and SVG sanitization before opening uploads to the public.
- Use signed or permission-checked R2 downloads for paid assets.
- Never expose raw creator emails in public catalogue APIs.
- Add payment webhook signature verification before recording sales or creator earnings.
- Back up D1 and define an R2 retention/versioning policy.
- Add marketplace terms, creator agreement, licensing, privacy, copyright/takedown and refund policies before launch.

## Production features still requiring external configuration

The current marketplace includes test purchase flows. A public paid launch still requires a payment provider, webhook processing, order/download entitlements, creator payout records, transactional email, tax handling, abuse controls, and legal policies. These are not supplied as secrets or enabled integrations in the release package.
