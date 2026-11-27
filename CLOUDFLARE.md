# Cloudflare hosting

The source targets Cloudflare Workers with D1 and R2. The account owner must provision resources and configure Access before production deployment.

## Install and verify

Use Node 22.13 or newer.

```sh
npm ci
npm run typecheck
npm test
```

The build and test commands work on Windows and Linux. Tests run the built application in Miniflare and exercise authentication rejection in the Workers runtime.

## Provision storage

```sh
npx wrangler login
npx wrangler d1 create iconnovus-db
npx wrangler r2 bucket create iconnovus-assets
```

Copy the returned D1 database ID into `wrangler.json`. Confirm the database and bucket names there match your account. Apply migrations before accepting submissions.

```sh
npm run db:migrate:local
npm run db:migrate:remote
```

## Configure identity

This deployment uses Cloudflare Access. Configure a self-hosted Access application on your custom domain with email one-time PIN or your identity provider. Cover `/signin-with-chatgpt`, `/admin`, `/api/admin/*`, and `/api/submissions` with the same application and audience. Allow the creator emails you intend to admit. Keep the catalog and download routes public. The existing sign-in route name is retained for existing callers.

Set these variables in `wrangler.json` before building.

- `ACCESS_TEAM_DOMAIN` is the exact issuer origin, such as `https://your-team.cloudflareaccess.com`.
- `ACCESS_AUD` is the Access application's audience tag.
- `ICONAVIX_ADMIN_EMAIL` is the verified email allowed to moderate submissions.

The application verifies RS256 signatures, issuer, audience, expiration, subject, and email. It rejects unsigned identity headers. Sign-out uses Access's logout endpoint. Existing creator IDs came from Sites. Before migrating a live database, map old creator IDs to Access subjects if ownership features depend on those IDs.

Workers subdomain and preview URLs are disabled to keep the configured custom domain as the production entry point. Add your custom domain under Workers settings after the first deployment, and ensure it is covered by your Access application.

## Deploy

```sh
npm run deploy
```

The deploy command rebuilds and validates the source configuration before uploading the generated `dist/server/wrangler.json`. It rejects the placeholder database ID and missing identity settings.

Verify public catalog search and an icon download, then sign in through Access and verify a creator upload and administrator review. Database migrations and identity provisioning require your Cloudflare account. The repository does not contain production account IDs or credentials.

Icons continue to load from the pinned upstream repositories. Creator uploads use R2. Paid checkout remains a sample flow.

References

- [Cloudflare Access JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)
- [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/)
- [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)
