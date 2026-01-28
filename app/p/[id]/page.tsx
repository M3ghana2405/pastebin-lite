import { redis } from "@/lib/redis";
import { getNowMs } from "@/lib/time";

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // unwrap promise
  const key = `paste:${id}`;
  const data = await redis.hgetall<Record<string, string>>(key);

  if (!data?.content) return <p style={{ textAlign: "center", marginTop: 50 }}>❌ Paste not found or expired</p>;

  const now = getNowMs();
  const expiresAt = data.expires_at_ms ? Number(data.expires_at_ms) : null;
  const maxViews = data.max_views ? Number(data.max_views) : null;
  const views = await redis.hincrby(key, "views", 1); // increment views here

  // Check TTL or max views
  if ((expiresAt && now > expiresAt) || (maxViews !== null && views > maxViews)) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>❌ Paste not found or expired</p>;
  }

  return (
    <main style={{
      maxWidth: "800px",
      margin: "50px auto",
      padding: "20px",
      background: "#1e293b",
      borderRadius: "12px",
      color: "white"
    }}>
      <h2>📄 Your Paste</h2>
      <pre style={{
        whiteSpace: "pre-wrap",
        background: "#0f172a",
        padding: "15px",
        borderRadius: "8px",
      }}>
        {data.content}
      </pre>
      {maxViews !== null && <p>👁 Remaining Views: {Math.max(0, maxViews - views)}</p>}
      {expiresAt && <p>⏳ Expires At: {new Date(expiresAt).toLocaleString()}</p>}
    </main>
  );
}
