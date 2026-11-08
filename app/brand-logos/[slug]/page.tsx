import { notFound } from "next/navigation";
import { getProvider, logoName, logosBySlug, logoUrl, sourceRepo, upstreamRepo } from "@/lib/dashboard-logos";

export default async function BrandLogoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const logo = logosBySlug.get(slug);
  if (!logo) notFound();

  const name = logoName(logo);
  const provider = getProvider(logo.provider);
  const variants = [
    { label: "Default", asset: logo },
    { label: "For dark backgrounds", asset: logo.colors?.light, theme: "light" },
    { label: "For light backgrounds", asset: logo.colors?.dark },
    ...(logo.variants ?? []).map((asset) => ({ label: asset.label, asset, theme: asset.theme })),
  ];

  return <main className="asset-page">
    <section className="asset-hero logo-hero">
      <a href="/brand-logos">← All brand logos</a>
      <h1>{name}</h1>
      <p>{provider ? <>From <a href={provider.site}>{provider.name}</a></> : <>From the <a href={sourceRepo}>Dashicon</a> and <a href={upstreamRepo}>Dashboard Icons</a> collection</>}</p>
    </section>
    <section className="dashboard-logo-library" aria-label={`${name} logo files`}>
      <div className="brand-logo-grid dashboard-logo-variants">
        {variants.map(({ label, asset, theme }) => asset && <article key={asset.slug}>
          <div className="logo-art" data-background={theme === "light" ? "dark" : "light"}>
            <img src={logoUrl(asset)} alt={`${name} logo`} width={96} height={96} />
          </div>
          <div className="dashboard-logo-files">
            <h2>{label}</h2>
            <ul>{asset.formats.map((format) => <li key={format}>
              <a href={`/api/brand-logos/${slug}?asset=${asset.slug}&format=${format}`} download={`${asset.slug}.${format}`}>
                {format.toUpperCase()}
              </a>
            </li>)}</ul>
          </div>
        </article>)}
      </div>
      <p className="dashboard-logo-credit">
        Product names and logos belong to their respective owners and are shown for identification.
        {provider ? <> See the <a href={`https://github.com/${provider.repo}/tree/${provider.revision}`}>{provider.name} source repository</a>.</> : <> See the repository licenses for <a href={`${sourceRepo}/blob/eb2d0d87e74412234c6082a36f4830aa690892b9/LICENSE`}>Dashicon</a> and <a href={`${upstreamRepo}/blob/59f1e9a4108f4f510f41e9588f078631de1e1405/LICENSE`}>Dashboard Icons</a>.</>}
      </p>
    </section>
  </main>;
}
