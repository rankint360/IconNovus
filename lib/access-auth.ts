import { createRemoteJWKSet, jwtVerify } from "jose";

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

export async function verifyAccessUser(token: string | null, issuer?: string, audience?: string) {
  if (!token || !issuer || !audience) return null;
  try {
    const url = new URL(issuer);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".cloudflareaccess.com") || url.origin !== issuer) return null;
    let keys = keySets.get(issuer);
    if (!keys) {
      keys = createRemoteJWKSet(new URL("/cdn-cgi/access/certs", issuer));
      keySets.set(issuer, keys);
    }
    const { payload } = await jwtVerify(token, keys, {
      issuer, audience, algorithms: ["RS256"], requiredClaims: ["exp", "sub", "email"],
    });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return { id: payload.sub, email: payload.email, displayName: payload.email, fullName: null };
  } catch {
    return null;
  }
}
