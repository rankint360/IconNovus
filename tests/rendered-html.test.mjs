import assert from "node:assert/strict";
import test from "node:test";
import { Miniflare } from "miniflare";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

test("renders the production homepage in the Workers runtime", async () => {
  const runtime = new Miniflare({
    modules: true,
    scriptPath: fileURLToPath(new URL("../dist/server/index.js", import.meta.url)),
    modulesRules: [{ type: "ESModule", include: ["**/*.js"], fallthrough: true }],
    compatibilityDate: "2026-05-15",
    compatibilityFlags: ["nodejs_compat"],
    d1Databases: ["DB"],
    r2Buckets: ["BUCKET"],
  });
  try {
    const database = await runtime.getD1Database("DB");
    const migration = await readFile(new URL("../drizzle/0000_broken_hemingway.sql", import.meta.url), "utf8");
    for (const statement of migration.split("--> statement-breakpoint").filter((value) => value.trim())) {
      await database.exec(statement.replace(/\r?\n/g, " "));
    }
    const response = await runtime.dispatchFetch("http://localhost/", { headers: { accept: "text/html" } });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    const html = await response.text();
    assert.match(html, /IconNovus/);
    assert.doesNotMatch(html, /name=["']codex-preview["']/);
    const catalog = await runtime.dispatchFetch("http://localhost/api/icons");
    assert.equal(catalog.status, 200);
    assert.deepEqual(await catalog.json(), { icons: [] });
    const admin = await runtime.dispatchFetch("http://localhost/api/admin/icons", {
      headers: { "oai-authenticated-user-email": "admin@example.com", "oai-authenticated-user-id": "spoofed" },
    });
    assert.equal(admin.status, 403);
    const upload = await runtime.dispatchFetch("http://localhost/api/submissions", { method: "POST" });
    assert.equal(upload.status, 401);
  } finally {
    await runtime.dispose();
  }
});
