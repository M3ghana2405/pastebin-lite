import { redis } from "@/lib/redis";
import { getNowMs } from "@/lib/time";
import { notFound } from "@/lib/errors";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // 🔹 Next.js 16 fix — unwrap params
  const { id } = await context.params;
  const cleanId = id.trim();

  const key = `paste:${cleanId}`;
  const data = await redis.hgetall<Record<string, string>>(key);

  if (!data || !data.content) return notFound();

  const now = getNowMs(req);
  const expiresAt = data.expires_at_ms ? Number(data.expires_at_ms) : null;
  const maxViews = data.max_views ? Number(data.max_views) : null;

  // ⏳ TTL check
  if (expiresAt !== null && now > expiresAt) return notFound();

  // 👁 Increment views
  const views = await redis.hincrby(key, "views", 1);

  // 🚫 Max views check
  if (maxViews !== null && views > maxViews) return notFound();

  return new Response(
    JSON.stringify({
      content: data.content,
      remaining_views: maxViews !== null ? Math.max(0, maxViews - views) : null,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
