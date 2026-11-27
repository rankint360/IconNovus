import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../../chatgpt-auth";

async function requireAdmin() {
  const user = await getChatGPTUser();
  const adminEmail = (env as unknown as { ICONAVIX_ADMIN_EMAIL?: string }).ICONAVIX_ADMIN_EMAIL;
  return user && adminEmail && user.email.toLowerCase() === adminEmail.toLowerCase() ? user : null;
}

export async function GET() {
  if (!(await requireAdmin())) return Response.json({ error: "Administrator access required." }, { status: 403 });
  const result = await env.DB.prepare(
    `SELECT id, name, slug, category, style, price_cents AS priceCents, formats,
            creator_email AS creatorEmail, original_filename AS originalFilename,
            status, created_at AS createdAt
     FROM marketplace_icons
     ORDER BY CASE status WHEN 'pending' THEN 0 ELSE 1 END, created_at DESC
     LIMIT 200`,
  ).all();
  return Response.json({ icons: result.results });
}

export async function PATCH(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Cross-origin changes are not allowed." }, { status: 403 });
  }
  if (!(await requireAdmin())) return Response.json({ error: "Administrator access required." }, { status: 403 });
  const payload = await request.json().catch(() => null) as { id?: number; status?: string } | null;
  if (!payload || !Number.isSafeInteger(payload.id) || Number(payload.id) <= 0 || !["published", "rejected"].includes(payload.status ?? "")) {
    return Response.json({ error: "A valid submission and review decision are required." }, { status: 400 });
  }
  const row = await env.DB.prepare(
    `UPDATE marketplace_icons SET status = ?, reviewed_at = CURRENT_TIMESTAMP
     WHERE id = ? AND status = 'pending'
     RETURNING id, name, status`,
  ).bind(payload.status, payload.id).first();
  if (!row) return Response.json({ error: "The pending submission was not found." }, { status: 404 });
  return Response.json({ icon: row });
}
