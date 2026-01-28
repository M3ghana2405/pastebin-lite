import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const pong = await redis.ping();
    return new Response(JSON.stringify({ ok: true, pong }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
