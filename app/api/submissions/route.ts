import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

const allowedTypes = new Set(["image/svg+xml", "image/png", "image/webp", "application/zip", "application/x-zip-compressed"]);
const maxBytes = 10 * 1024 * 1024;
const clean = (value: string) => value.trim().replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in is required to submit icons." }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    const name = String(form.get("name") ?? "").trim();
    const category = String(form.get("category") ?? "").trim();
    const style = String(form.get("style") ?? "").trim();
    const portfolioUrl = String(form.get("portfolioUrl") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const priceCents = Number(form.get("priceCents") ?? 100);

    if (!(file instanceof File) || !name || !category || !style) {
      return Response.json({ error: "Name, category, style and an icon file are required." }, { status: 400 });
    }
    if (!allowedTypes.has(file.type) || file.size > maxBytes) {
      return Response.json({ error: "Upload an SVG, PNG, WEBP or ZIP file up to 10 MB." }, { status: 400 });
    }
    if (!Number.isInteger(priceCents) || priceCents < 0 || priceCents > 10000) {
      return Response.json({ error: "Choose a valid price between $0 and $100." }, { status: 400 });
    }
    if (file.type === "image/svg+xml") {
      const source = await file.text();
      if (/<script|javascript:|on\w+\s*=/i.test(source)) {
        return Response.json({ error: "The SVG contains unsafe embedded code." }, { status: 400 });
      }
    }

    const slugBase = clean(name.toLowerCase()) || "icon";
    const slug = `${slugBase}-${crypto.randomUUID().slice(0, 8)}`;
    const filename = clean(file.name) || "icon-file";
    const objectKey = `submissions/${user.id}/${crypto.randomUUID()}-${filename}`;
    await env.BUCKET.put(objectKey, file.stream(), { httpMetadata: { contentType: file.type } });

    const result = await env.DB.prepare(
      `INSERT INTO marketplace_icons
       (name, slug, category, style, price_cents, formats, creator_id, creator_email,
        portfolio_url, description, object_key, original_filename, content_type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
       RETURNING id, name, slug, status, created_at AS createdAt`,
    ).bind(name, slug, category, style, priceCents, filename.split(".").pop()?.toUpperCase() || "FILE",
      user.id, user.email, portfolioUrl || null, description || null, objectKey, filename, file.type).first();

    return Response.json({ submission: result }, { status: 201 });
  } catch (error) {
    console.error("Icon submission failed", error);
    return Response.json({ error: "The upload could not be saved. Please try again." }, { status: 500 });
  }
}
