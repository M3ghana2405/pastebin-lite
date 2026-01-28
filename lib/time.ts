export function getNowMs(req?: Request) {
  // Support TEST_MODE with x-test-now-ms
  if (process.env.TEST_MODE === "1" && req) {
    const header = req.headers.get("x-test-now-ms");
    if (header) return Number(header);
  }
  return Date.now();
}
