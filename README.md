# Pastebin Lite

A simple Pastebin-like web application built with **Next.js 16** and **TypeScript**.
Users can create text pastes with optional TTL (time-to-live) and max views, and share a link to view them.

---

## Features

* Create pastes containing arbitrary text
* Optional TTL (expires after N seconds)
* Optional max views (paste becomes unavailable after N views)
* Safe rendering (no script execution)
* Deterministic testing via `x-test-now-ms` header

---

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Create a `.env.local` file in the project root and add your Upstash Redis credentials:

```bash
UPSTASH_REDIS_REST_URL=<your-upstash-redis-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-redis-token>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
TEST_MODE=1
```

---

## Persistence Layer

* **Upstash Redis** (serverless Redis)
* Each paste is stored as a Redis hash with the following fields:

  * `content`
  * `created_at_ms`
  * `expires_at_ms`
  * `max_views`
  * `views`

---

## Design Decisions

* Redis hash per paste for easy TTL and max views tracking
* Atomic `hincrby` for view count to prevent race conditions
* TTL handled manually using `expires_at_ms`
* Server-side rendering reads Redis directly, no additional fetch needed
* Supports deterministic expiry testing via `x-test-now-ms` request header

---

## Deployment

* Deployed on **Vercel**
* Make sure the following environment variables are set for production:

```bash
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_BASE_URL
TEST_MODE=1
```

* Once deployed, your application URL will be the shareable base for pastes.

---

## Usage Example

1. Create a paste via `POST /api/pastes` with JSON body:

```json
{
  "content": "Hello World",
  "ttl_seconds": 60,
  "max_views": 5
}
```

2. Receive a JSON response with:

```json
{
  "id": "abcd1234",
  "url": "https://your-app.vercel.app/p/abcd1234"
}
```

3. Open the URL to view the paste. The paste respects TTL and max view limits.
