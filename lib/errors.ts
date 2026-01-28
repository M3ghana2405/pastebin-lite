export function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function notFound() {
  return new Response(JSON.stringify({ error: "Paste not found or expired" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
