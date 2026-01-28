"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState<any>(null);

  const createPaste = async () => {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: maxViews ? Number(maxViews) : undefined,
      }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <main className="container">
      <h1>🔥 PasteBin Lite</h1>

      <textarea
        placeholder="Write your secret paste here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="row">
        <input
          type="number"
          placeholder="TTL (seconds)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Views"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
        />
      </div>

      <button onClick={createPaste}>Create Paste</button>

      {result?.url && (
        <div className="result">
          <p>✅ Paste created!</p>
          <a href={result.url} target="_blank">{result.url}</a>
        </div>
      )}
    </main>
  );
}
