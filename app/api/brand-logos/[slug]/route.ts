import { isLogoFormat, logosBySlug, logoUrl, mediaTypes } from "@/lib/dashboard-logos";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "";
  const assetSlug = searchParams.get("asset") ?? slug;
  const logo = logosBySlug.get(slug);
  const asset = [logo, logo?.colors?.light, logo?.colors?.dark, ...(logo?.variants ?? [])].find((item) => item?.slug === assetSlug);
  if (!asset || !isLogoFormat(format) || !asset.formats.includes(format)) {
    return new Response("Logo file not found", { status: 404 });
  }

  try {
    const upstream = await fetch(logoUrl(asset, format), { redirect: "error" });
    if (upstream.ok && upstream.body) {
      return new Response(upstream.body, {
        headers: {
          "Content-Type": mediaTypes[format],
          "Content-Disposition": `attachment; filename="${asset.slug}.${format}"`,
          "Cache-Control": "public, max-age=86400",
          "Content-Security-Policy": "default-src 'none'; sandbox",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  } catch {
    // Treat connection failures the same as other upstream errors.
  }
  return new Response("Logo download is temporarily unavailable", { status: 502 });
}
