"use client";

import { useMemo, useState } from "react";
import { Menu, Moon, Search, Sparkles, Sun, Upload, X } from "lucide-react";
import { getProvider, logoName, logos, logoUrl, providers, sourceRepo } from "@/lib/dashboard-logos";
import { AiBrands } from "./ai-brands";

const pageSize = 48;
const categories = [...new Set(logos.flatMap((logo) => logo.categories))].sort();

function SiteLogo() {
  return <span className="brand"><img className="brand-logo" src="/iconnovus-logo.png" alt="IconNovus" /></span>;
}

export default function BrandLogosPage() {
  const [category, setCategory] = useState("");
  const [provider, setProvider] = useState("");
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [page, setPage] = useState(1);
  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/);
    return logos.filter((logo) => {
      if (provider && (logo.provider ?? "dashboard") !== provider) return false;
      if (category && !logo.categories.includes(category)) return false;
      const searchable = [logo.slug, logoName(logo), ...logo.aliases, ...logo.categories].join(" ").toLowerCase();
      return terms.every((term) => searchable.includes(term));
    });
  }, [category, provider, query]);
  const pageCount = Math.ceil(results.length / pageSize);

  return <main className={dark ? "dark-ui asset-page" : "asset-page"}>
    <header className="topbar">
      <a href="/"><SiteLogo /></a>
      <nav className={menu ? "open" : ""}>
        <a href="/icons">Icons</a><a className="active" href="/brand-logos" aria-current="page">Brand Logos</a>
        <a href="/illustrations">Illustrations</a><a href="/#sell">Creators</a>
      </nav>
      <div className="top-actions">
        <a className="header-submit" href="/#sell"><Upload /> Submit work</a>
        <button className="plain-icon" type="button" aria-label="Toggle dark mode" aria-pressed={dark} onClick={() => setDark(!dark)}>{dark ? <Sun /> : <Moon />}</button>
        <button className="plain-icon mobile-menu" type="button" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
      </div>
    </header>
    <section className="asset-hero logo-hero">
      <span className="overline"><Sparkles /> BRAND LOGO LIBRARY</span>
      <h1>Find a logo for your dashboard</h1>
      <p>{logos.length.toLocaleString("en-US")} listings from Dashboard Icons, selfh.st, LobeHub, and Simple Icons.</p>
      <div className="asset-search">
        <Search aria-hidden="true" />
        <input type="search" aria-label="Search brand logos" placeholder="Search logos by name, alias, or category" value={query}
          onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
      </div>
    </section>
    <section className="dashboard-logo-library">
      {!query.trim() && !provider && !category && page === 1 && <AiBrands />}
      <div className="dashboard-logo-toolbar">
        <div><h2>Brand logos</h2><p aria-live="polite">{results.length.toLocaleString("en-US")} results</p></div>
        <label>Collection
          <select value={provider} onChange={(event) => { setProvider(event.target.value); setCategory(""); setPage(1); }}>
            <option value="">All collections</option>
            <option value="dashboard">Dashboard Icons</option>
            {Object.entries(providers).map(([id, source]) => <option key={id} value={id}>{source.name}</option>)}
          </select>
        </label>
        <label>Category
          <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}>
            <option value="">All categories</option>
            {categories.map((value) => <option key={value} value={value}>{value.replace(/-/g, " ")}</option>)}
          </select>
        </label>
      </div>
      {results.length === 0 && <p>No logos match your search.</p>}
      <div className="brand-logo-grid dashboard-logo-grid">
        {results.slice((page - 1) * pageSize, page * pageSize).map((logo) => {
          const name = logoName(logo);
          const source = getProvider(logo.provider);
          const theme = dark ? "light" : "dark";
          const preview = logo.colors?.[theme] ?? logo.variants?.find((asset) => asset.theme === theme) ?? logo;
          return <article key={logo.slug}>
            <a href={`/brand-logos/${logo.slug}`}>
              <div className="logo-art"><img src={logoUrl(preview)} alt="" loading="lazy" width={64} height={64} /></div>
              <div className="illustration-meta"><div><b>{name}</b><small>{source?.name ?? "Dashboard Icons"} · {logo.formats.map((format) => format.toUpperCase()).join(" · ")}</small></div></div>
            </a>
          </article>;
        })}
      </div>
      {pageCount > 1 && <nav className="dashboard-logo-pagination" aria-label="Logo results pages">
        <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span aria-live="polite">Page {page} of {pageCount}</span>
        <button type="button" disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</button>
      </nav>}
    </section>
    <footer><SiteLogo /><p>Logos from <a href={sourceRepo}>Dashboard Icons</a>.</p><nav><a href="/icons">Icons</a><a href="/brand-logos">Brand Logos</a><a href="/illustrations">Illustrations</a></nav><small>© 2026 IconNovus</small></footer>
  </main>;
}
