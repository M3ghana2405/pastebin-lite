import { redis } from "@/lib/redis";
import { getNowMs } from "@/lib/time";
import { jsonError } from "@/lib/errors";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return jsonError(400, "Invalid JSON");

  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string" || content.trim() === "")
    return jsonError(400, "content required");

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1))
    return jsonError(400, "invalid ttl_seconds");

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1))
    return jsonError(400, "invalid max_views");

  const id = crypto.randomUUID().slice(0, 8);
  const now = getNowMs(req);
  const expiresAt = ttl_seconds ? now + ttl_seconds * 1000 : null;

  await redis.hset(`paste:${id}`, {
    content,
    created_at_ms: now.toString(),
    expires_at_ms: expiresAt ? expiresAt.toString() : "",
    max_views: max_views ? max_views.toString() : "",
    views: "0",
  });

 const base =
  process.env.NEXT_PUBLIC_BASE_URL ||
  new URL(req.url).origin;

return new Response(
  JSON.stringify({ id, url: `${base}/p/${id}` }),
  { status: 201, headers: { "Content-Type": "application/json" } }
);
}
