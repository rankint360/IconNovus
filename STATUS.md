# IconNovus status

Last updated 2026-11-08. Latest register entry [IN-012](RECORD_REGISTER.md).

| Area | Current state |
| --- | --- |
| Brand logo library | The latest source has 12,632 listings in `/brand-logos`. Visitors can search and filter by collection. Listings show available formats and source labels. |
| Native inventory | 4,808 listings reference 13,411 files across pinned Dashicon and Homarr Labs revisions. The live-site audit matched all 13,325 native files listed on Dashboard Icons. |
| Provider inventory | 7,824 listings reference 55,419 files from pinned revisions of selfh.st, LobeHub, and Simple Icons. The app retrieves the images from the provider repositories when requested. |
| AI brand icons | The brand logo library features six documented `@lobehub/icons` React components that link to the existing catalog downloads. |
| Latest source package | `IconNovus-source-ai-brand-icons.zip` includes the AI brand section, catalog data, package lock, and both tracking files. |
| Verification | The Vinext production build passed for the AI brand update. All six icons rendered as SVG and linked to catalog entries. The earlier live sample downloads passed against all three partner providers and a native Shelly asset. |
| Deployment | The latest changes are in the working source and source package. The Sites connector returned project not found for the ID in `.openai/hosting.json`. |
| GitHub transfer | The source import targets the `main` branch of [rankint360/IconNovus](https://github.com/rankint360/IconNovus). |

- The standalone TypeScript check reports missing Cloudflare Workers types. Two existing tests report errors involving the Cloudflare runtime import and a CSS scrollbar assertion.
- npm reported a React peer dependency warning for a transitive LobeHub UI dependency. The featured icons passed rendering and build checks.
- The native audit found 212 logo pages where some variants were available as separate listings. Shelly’s wordmarks are one example.
- The partner download verification sampled each provider. The full inventory was verified against the repository file trees.

Update this file whenever IconNovus changes. Record the current source or release, verification results, deployment state, and any remaining work. Append the corresponding entry to the [record register](RECORD_REGISTER.md) in the same change.
