# @mappa-ai/conduit

Behavioral intelligence for your app. Type-safe and webhook-first.

## Install

```bash
npm install @mappa-ai/conduit
```

## Scope

Stable SDK scope is intentionally small:

- `reports.create(...)`
- `reports.get(...)`
- `matching.create(...)`
- `matching.get(...)`
- `webhooks.verifySignature(...)`
- `webhooks.parseEvent(...)`

Use webhooks as your default completion path. Report generation can take ~150s.

Advanced stable primitives are available under `conduit.primitives.entities`, `conduit.primitives.media`, and `conduit.primitives.jobs`.

Stable primitive methods:

- `conduitClient.primitives.entities.get(...)`
- `conduitClient.primitives.entities.list(...)`
- `conduitClient.primitives.entities.update(...)`
- `conduitClient.primitives.media.upload(...)`
- `conduitClient.primitives.media.get(...)`
- `conduitClient.primitives.media.list(...)`
- `conduitClient.primitives.media.delete(...)`
- `conduitClient.primitives.media.setRetentionLock(...)`
- `conduitClient.primitives.jobs.get(...)`
- `conduitClient.primitives.jobs.cancel(...)`

## Quickstart

```ts
import { Conduit } from "@mappa-ai/conduit"

const conduitClient = new Conduit({ apiKey: process.env.CONDUIT_API_KEY! })

await conduitClient.reports.create({
  output: { template: "general_report" },
  source: { url: "https://example.com/recording.wav" },
  target: { strategy: "dominant" },
  webhook: { url: "https://your-app.com/api/webhooks/conduit" },
})

export async function handleConduitWebhook(req: Request) {
  const payload = await req.text()

  await conduitClient.webhooks.verifySignature({
    payload,
    headers: Object.fromEntries(req.headers),
    secret: process.env.CONDUIT_WEBHOOK_SECRET!,
  })

  const event = conduitClient.webhooks.parseEvent(payload)
  if (event.type !== "report.completed") return

  const report = await conduitClient.reports.get(event.data.reportId)
  console.log(report.id, report.output.template)
}
```

`reports.create(...)` returns only after source materialization/upload succeeds and the job is accepted.

## Create Sources

```ts
type ReportSource =
  | { mediaId: string }
  | { file: Blob | ArrayBuffer | Uint8Array | ReadableStream<Uint8Array>; label?: string }
  | { url: string; label?: string }
  | { path: string; label?: string }
```

- `source.url` makes the SDK host runtime fetch the remote media and then upload it to Conduit.
- `source.path` resolves relative to the current working directory in filesystem-capable runtimes.
- The client timeout budget applies to remote fetch, upload, and API create unless you provide narrower controls around your own calls.
- `source.url`, `source.path`, and `ReadableStream` uploads may buffer in memory in JavaScript runtimes before upload when streaming is not available end-to-end.

## Stable primitives

Use `primitives` for advanced workflows, not onboarding.

### Entities

- `get(entityId)` fetches one stable speaker identity.
- `list({ limit, cursor })` uses cursor pagination. Default limit is `20`, max limit is `100`, ordering is latests first, and deleted entities are not included.
- `update(entityId, { label })` sets or clears the optional entity label.

### Media

- `upload({ file | url | path, label? })` materializes the same official source shapes as `reports.create(...)` in supported runtimes.
- `list({ limit, cursor, includeDeleted })` uses cursor pagination. Default limit is `20`, max limit is `100`, ordering is latests first, and deleted media is excluded unless `includeDeleted: true`.
- `get(mediaId)`, `delete(mediaId)`, and `setRetentionLock(mediaId, locked)` manage uploaded media.

### Jobs

- `get(jobId)` fetches the canonical job shape.
- `cancel(jobId)` requests cancellation for an in-flight job.

## Handle webhooks

```ts
import { Conduit } from "@mappa-ai/conduit"

const conduitClient = new Conduit({ apiKey: process.env.CONDUIT_API_KEY! })

export async function POST(req: Request): Promise<Response> {
  const payload = await req.text()

  await conduitClient.webhooks.verifySignature({
    payload,
    headers: Object.fromEntries(req.headers),
    secret: process.env.CONDUIT_WEBHOOK_SECRET!,
  })

  const event = conduitClient.webhooks.parseEvent(payload)
  const seen = await hasProcessedWebhookEvent(event.id)
  if (seen) return new Response("ok", { status: 200 })

  if (event.type !== "report.completed") return new Response("ok", { status: 200 })

  const report = await conduitClient.reports.get(event.data.reportId)
  await markWebhookEventProcessed(event.id)
  console.log(report.id)
  return new Response("ok", { status: 200 })
}
```

## Fallback polling/streaming

Webhook flow is preferred. If you need synchronous control, use receipt handles.

```ts
const receipt = await conduitClient.reports.create({
  output: { template: "general_report" },
  source: { file: audioBytes, label: "call" },
  target: { strategy: "dominant" },
})

const report = await receipt.handle?.wait({ timeoutMs: 5 * 60_000 })
```

## Error handling

The SDK throws typed errors with stable `code` values.

```ts
import {
  isConduitError,
  isRateLimitError,
  isRemoteFetchTimeoutError,
  isTimeoutError,
} from "@mappa-ai/conduit"

try {
  await conduitClient.reports.create({
    output: { template: "general_report" },
    source: { url: "https://example.com/recording.wav" },
    target: { strategy: "dominant" },
  })
} catch (err) {
  if (isRateLimitError(err)) console.error(err.retryAfterMs)
  if (isRemoteFetchTimeoutError(err)) console.error(err.url)
  if (isTimeoutError(err)) console.error(err.message)
  if (isConduitError(err)) console.error(err.code, err.requestId)
  throw err
}
```

## Matching

```ts
import { Conduit } from "@mappa-ai/conduit"

const conduitClient = new Conduit({ apiKey: process.env.CONDUIT_API_KEY! })
const receipt = await conduitClient.matching.create({
  context: "hiring_team_fit",
  target: { entityId: "entity_1" },
  group: [{ entityId: "entity_2" }],
  webhook: { url: "https://your-app.com/api/webhooks/conduit" },
})

const matching = await receipt.handle?.wait({ timeoutMs: 5 * 60_000 })
console.log(matching?.id, matching?.output.markdown)
```

## Runtime matrix

| Runtime | `source.file` | `source.url` | `source.path` | `receipt.handle.wait()` | `receipt.handle.stream()` | `webhooks.verifySignature()` |
| --- | --- | --- | --- | --- | --- | --- |
| Node | Yes | Yes | Yes | Yes | Yes | Yes |
| Bun | Yes | Yes | Yes | Yes | Yes | Yes |
| Deno | Yes | Yes | No - throws `UnsupportedRuntimeError` | Yes | Yes | Yes |
| Edge/worker runtime | Yes | Yes | No - throws `UnsupportedRuntimeError` | Yes | Yes | Yes |
| Browser | Blocked by default unless `dangerouslyAllowBrowser: true`; if enabled, `source.path` throws `UnsupportedRuntimeError` | Blocked by default unless `dangerouslyAllowBrowser: true` | No - throws `UnsupportedRuntimeError` | Yes | Yes | Yes |

Questions? [api-docs.mappa.ai](https://api-docs.mappa.ai)
