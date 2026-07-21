# AI gateway (Netlify functions)

Server-only glue for the AI control plane (RFC 002). The browser never talks to a
provider directly: it POSTs a task to `ai-gateway.mts`, which resolves a provider
adapter, runs the pure/tested core (`src/ai/gatewayHttp` → `gatewayCore`), and
returns a typed `AiResponse`. All AI is **default-off**: with no provider key the
core returns `provider-not-configured` and the client falls back to manual tools.

Provider SDKs are confined to their adapter file — `@ai-sdk/google` is imported
**only** by `geminiAdapter.mts`. `src/**`, the browser bundle, the provider
registry, and the rate-limit store stay SDK-free; SDK-bound builders are injected.

## Files

| File | Role |
| --- | --- |
| `ai-gateway.mts` | Netlify entry. Reads env, injects the Gemini builder, resolves adapter + limiter, delegates to the core. |
| `providerRegistry.mts` | Provider-agnostic registry: maps a provider id (from `AI_PROVIDER`) to an adapter builder. |
| `geminiAdapter.mts` | The Google/Gemini `AiProviderAdapter` (the only file importing `@ai-sdk/google`). |
| `rateLimitStore.mts` | Pluggable rate-limit store: in-memory default + durable-backend stub. |

## Provider adapter contract

An adapter is the seam where a real provider lives. Interface
(`AiProviderAdapter`, defined in `src/ai/gatewayCore.ts`):

```ts
interface AiProviderAdapter {
  readonly id: string;    // provenance tag, echoed in AiResponse.usage.provider (e.g. 'google', 'mock')
  readonly model: string; // echoed in AiResponse.usage.model
  generate(task: AiTask, payload: unknown): Promise<unknown>;
}
```

Semantics `generate` MUST honor:

- **Input.** `task` is one of the `AiTask` ids (`encounter-draft`,
  `scene-narration`, `identify-creature`, `illustrate-scene`). `payload` is the
  request body already validated by `parseAiRequest`; treat it as opaque.
- **Output is untrusted.** Return the raw structured result. The core
  **re-validates** it with `parseTaskData` regardless of provider — shaping output
  to look valid does not bypass the gate (the mock adapter is deliberately
  re-validated too). Structured-text tasks return the task's object; image tasks
  (`illustrate-scene`) return `{ dataUrl, mediaType }`.
- **Errors throw.** On any provider/transport failure, throw (any `Error`). The
  core normalizes: a timeout → `timeout` (HTTP 504), anything else →
  `provider-error` (502). Do **not** return a sentinel error object.
- **No ambient secrets.** Build the adapter from an explicitly passed key; never
  read `process.env` inside the adapter. The entry point owns env.
- **Timeouts.** The core wraps `generate` in a timeout (`GatewayContext.timeoutMs`,
  default 20 s); adapters need not implement their own.

### Registering / selecting an adapter

`providerRegistry.mts` keys entries by a canonical id plus aliases and resolves
one from env at request time:

- `AI_PROVIDER` selects the entry. **Default `gemini`** when unset/blank.
- Lookup is case-insensitive; unrecognized values fall back to the default
  (`DEFAULT_AI_PROVIDER`), so a typo degrades gracefully.
- Built-ins: `gemini` (alias `google`) and `mock`. Each entry's `build(env, deps)`
  returns an `AiProviderAdapter` or `undefined` when the provider is selected but
  unusable (e.g. no key) — which the core maps to `provider-not-configured`.

Add a provider by appending a `ProviderRegistration` (`{ id, aliases?, build }`)
via `createProviderRegistry([...])`. SDK-bound builders are injected through
`ProviderRegistryDeps` (today: `createGoogleAdapter`) so the registry stays pure
and unit-testable without loading any SDK. Selection never throws.

## Rate-limit store contract

Rate limiting is **off by default** and only engages when `AI_RATE_LIMIT` is set.
The gateway core consumes a synchronous `RateLimiter` (`check(key) → { ok,
remaining, resetAt }`); `rateLimitStore.mts` factors the *counting* out of it into
a swappable store so the counter can be durable later without touching the core.

```ts
interface RateLimitRecord { count: number; resetAt: number /* epoch ms; also the TTL deadline */ }

interface RateLimitStore {
  get(key: string): RateLimitRecord | undefined;          // live record, or undefined if none/expired
  increment(key: string, windowMs: number): RateLimitRecord; // count one hit; opens a fresh window on expiry
  reset(key: string): void;                                // drop the key
}
```

Semantics: fixed window. `increment` opens a new `windowMs` window when the key is
absent or its `resetAt` has passed, otherwise bumps the count; `resetAt` is the
rollover/TTL deadline. The seam is **synchronous** to match the core's synchronous
`check`; an async backend fronts it with a synchronous `RateLimitStoreDriver`
(`read`/`write`/`remove`).

- **Default:** `createInMemoryRateLimitStore()` — process-memory fixed-window
  counting, identical to the previous in-memory limiter (a unit test asserts
  byte-for-byte parity with `createRateLimiter`).
- **Durable (stub):** `createDurableRateLimitStore(env, driver?)` reads its target
  from `RATE_LIMIT_STORE_URL` and is **inert** — returns `undefined`, so
  `resolveRateLimitStore` falls back to in-memory — whenever the URL is unset **or**
  no driver is wired. It does no network I/O and needs no secret. When a backend is
  provisioned, pass its `RateLimitStoreDriver` as the second arg to
  `resolveRateLimitStore` in `ai-gateway.mts`; nothing else changes.

## Environment variables

All optional. With **none** set, behavior is exactly as before: default provider,
no rate limiting, in-memory counting.

| Var | Default | Effect when unset (inert behavior) |
| --- | --- | --- |
| `AI_PROVIDER` | `gemini` | Default provider selected; unrecognized values also fall back to it. |
| `GOOGLE_GENERATIVE_AI_API_KEY` / `GEMINI_API_KEY` | — | No key → default provider yields no adapter → `provider-not-configured` (client uses manual tools). |
| `AI_GATEWAY_MODEL` | adapter default | Gemini adapter's built-in model id. |
| `AI_IMAGE_MODEL` | adapter default | Gemini adapter's built-in image model id. |
| `AI_RATE_LIMIT` | — (off) | Unset/≤0 → **no** rate limiting (today's behavior). |
| `AI_RATE_LIMIT_WINDOW_MS` | `60000` | Window length; only used when `AI_RATE_LIMIT` is set. |
| `RATE_LIMIT_STORE_URL` | — | Unset → durable store disabled; counting stays in-memory. Set + a wired driver → durable store. |
