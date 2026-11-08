import { env } from "cloudflare:workers";

export async function GET() {
  try {
    const result = await env.DB.prepare(
      `SELECT id, name, slug, category, style, price_cents AS priceCents,
              formats, creator_email AS creatorEmail, content_type AS contentType,
              created_at AS createdAt
       FROM marketplace_icons
       WHERE status = 'published'
       ORDER BY created_at DESC, id DESC
       LIMIT 100`,
    ).all();
    return Response.json({ icons: result.results });
  } catch (error) {
    console.error("Unable to load marketplace icons", error);
    return Response.json({ error: "The live catalogue is temporarily unavailable." }, { status: 503 });
  }
}
