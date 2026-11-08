import { Claude, DeepSeek, Gemini, Mistral, OpenAI, Perplexity } from "@lobehub/icons";

const brands = [
  { name: "OpenAI", slug: "openai", Icon: OpenAI },
  { name: "Claude", slug: "claude", Icon: Claude.Color },
  { name: "Gemini", slug: "gemini", Icon: Gemini.Color },
  { name: "DeepSeek", slug: "deepseek", Icon: DeepSeek.Color },
  { name: "Mistral", slug: "mistral", Icon: Mistral.Color },
  { name: "Perplexity", slug: "perplexity", Icon: Perplexity.Color },
];

export function AiBrands() {
  return <section className="dashboard-ai-brands" aria-labelledby="ai-brands-heading">
    <h2 id="ai-brands-heading">AI brand icons</h2>
    <div className="brand-logo-grid dashboard-logo-grid">
      {brands.map(({ name, slug, Icon }) => <article key={slug}>
        <a href={`/brand-logos/lobehub-${slug}`}>
          <div className="logo-art" aria-hidden="true"><Icon size={40} /></div>
          <div className="illustration-meta"><div><b>{name}</b><small>LobeHub</small></div></div>
        </a>
      </article>)}
    </div>
  </section>;
}
