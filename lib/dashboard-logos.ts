import catalog from "./dashboard-logos.json";
import partners from "./partner-logos.json";

export const mediaTypes = {
  svg: "image/svg+xml", png: "image/png", webp: "image/webp",
  avif: "image/avif", ico: "image/x-icon", jpg: "image/jpeg",
};
type Format = keyof typeof mediaTypes;
type Source = "dashicon" | "dashiconMain" | "homarr";

export const providers = {
  selfhst: { name: "selfh.st", site: "https://selfh.st/icons/", repo: "selfhst/icons", revision: "87a5dfd901a341e271eb453ffebce6c5a88c308e" },
  lobehub: { name: "LobeHub", site: "https://icons.lobehub.com/", repo: "lobehub/lobe-icons", revision: "ea434b96e75813517b377825e01c0df61dee8836" },
  simpleicons: { name: "Simple Icons", site: "https://simpleicons.org/", repo: "simple-icons/simple-icons", revision: "1bb2f6e6ea50f920de8d2f3d273ae48564a5eaee" },
};

type Asset = {
  slug: string;
  formats: readonly string[];
  sources?: Partial<Record<string, string>>;
  files?: Partial<Record<string, string>>;
  provider?: string;
};

export type DashboardLogo = Asset & {
  name?: string;
  aliases: string[];
  categories: string[];
  colors?: { light?: Asset; dark?: Asset };
  variants?: (Asset & { label: string; theme?: string })[];
};

export const logos: DashboardLogo[] = [...catalog, ...partners];
export const logosBySlug = new Map(logos.map((logo) => [logo.slug, logo]));
const sources = {
  dashicon: { repo: "anjamjaved/dashicon", revision: "eb2d0d87e74412234c6082a36f4830aa690892b9" },
  dashiconMain: { repo: "anjamjaved/dashicon", revision: "d84d00eef4b14084963d5996397b76f9fe22f0c7" },
  homarr: { repo: "homarr-labs/dashboard-icons", revision: "59f1e9a4108f4f510f41e9588f078631de1e1405" },
} satisfies Record<Source, { repo: string; revision: string }>;

export const sourceRepo = `https://github.com/${sources.dashicon.repo}`;
export const upstreamRepo = `https://github.com/${sources.homarr.repo}`;

export function logoLabel(slug: string) {
  return slug.replace(/[-_]/g, " ").replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

export function getProvider(id?: string) {
  return id && Object.hasOwn(providers, id) ? providers[id as keyof typeof providers] : undefined;
}

export function logoName(logo: DashboardLogo) {
  return logo.name ?? logoLabel(logo.provider ? logo.slug.slice(logo.provider.length + 1) : logo.slug);
}

export function logoUrl(asset: Asset, format: string = asset.formats[0]) {
  const provider = getProvider(asset.provider);
  const file = asset.files?.[format];
  if (provider && file) {
    return `https://raw.githubusercontent.com/${provider.repo}/${provider.revision}/${file.split("/").map(encodeURIComponent).join("/")}`;
  }
  const selected = asset.sources?.[format];
  const source = selected === "dashiconMain" || selected === "homarr" ? sources[selected] : sources.dashicon;
  return `https://raw.githubusercontent.com/${source.repo}/${source.revision}/${format}/${asset.slug}.${format}`;
}

export function isLogoFormat(format: string): format is Format {
  return Object.hasOwn(mediaTypes, format);
}
