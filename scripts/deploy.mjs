import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const config = JSON.parse(readFileSync("wrangler.json", "utf8"));
if (config.d1_databases.some((db) => db.database_id === "00000000-0000-4000-8000-000000000000")) {
  throw new Error("Set the real D1 database_id in wrangler.json before deployment.");
}
if (!config.vars.ACCESS_TEAM_DOMAIN || !config.vars.ACCESS_AUD || !config.vars.ICONAVIX_ADMIN_EMAIL) {
  throw new Error("Configure Cloudflare Access and the administrator email in wrangler.json before deployment.");
}
const result = spawnSync(process.execPath, ["node_modules/wrangler/bin/wrangler.js", "deploy", "--config", "dist/server/wrangler.json"], { stdio: "inherit" });
process.exit(result.status ?? 1);
