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
| `ai-gateway.mts` | Netlify entry. Reads env, injects the Gemini builder, resolves adapter + limiter + session budget + latency budgets, delegates to the core. |
| `providerRegistry.mts` | Provider-agnostic registry: maps a provider id (from `AI_PROVIDER`) to an adapter builder. |
| `geminiAdapter.mts` | The Google/Gemini `AiProviderAdapter` (the only file importing `@ai-sdk/google`). |
| `rateLimitStore.mts` | Pluggable counter store: in-memory default + durable-backend stub. Backs request rate limiting AND the session cost budget (`sessionBudgetFromStore`). |
| `supabaseJwt.mts` | Supabase-JWT (HS256) request auth: verifier + env resolver, plain `node:crypto`. Surfaces the verified `sub` as the session-budget key. |

## Authentication (Supabase JWT)

Auth is **off by default** and engages only when there is something to protect:
requests must carry `Authorization: Bearer <supabase access token>` **iff** a
real provider adapter resolved (a key is set) **and** `SUPABASE_JWT_SECRET` is
set. `supabaseJwt.mts` verifies the token with plain `node:crypto` (HS256 HMAC —
the algorithm Supabase signs access tokens with): algorithm pin (anything but
`HS256`, including `none`, is rejected), constant-time signature comparison,
then `exp` (required) and `nbf`. A missing/expired/forged token is answered
`401` with the typed failure code `unauthorized` **before** the body is parsed;
the browser client falls back to the manual tools like any other failure.

Degradation matrix (the local-first guarantee):

| Provider key | `SUPABASE_JWT_SECRET` | Behavior |
| --- | --- | --- |
| unset | either | `provider-not-configured` (503), exactly as before — never 401. |
| set | unset | Open gateway, today's behavior (rate limit only). Set the secret on any deploy with a real key. |
| set | set | Valid Supabase JWT required; signed-in clients attach it automatically (`gatewayClient.ts`). |

The verification secret is the Supabase project's **JWT secret** (dashboard →
Settings → API). It is server-only: never expose it via a `VITE_` name (the
`check:secret-exposure` gate hunts for that).

## Provider adapter contract

An adapter is the seam where a real provider lives. Interface
(`AiProviderAdapter`, defined in `src/ai/gatewayCore.ts`):

```ts
interface AiProviderAdapter {
  readonly id: string;    // provenance tag, echoed in AiResponse.usage.provider (e.g. 'google', 'mock')
  readonly model: string; // default model id, echoed in AiResponse.usage.model
  modelFor?(task: AiTask): string; // per-task model, when it differs (e.g. the image model)
  generate(task: AiTask, payload: unknown): Promise<unknown>;
}
```

Semantics `generate` MUST honor:

- **Input.** `task` is one of the `AiTask` ids (`encounter-draft`,
  `scene-narration`, `identify-creature`, `illustrate-scene`, `character-draft`).
  `payload` is the request body already validated by `parseAiRequest`; treat it
  as opaque.
- **Output is untrusted.** Return the raw structured result. The core
  **re-validates** it with `parseTaskData` regardless of provider — shaping output
  to look valid does not bypass the gate (the mock adapter is deliberately
  re-validated too). Structured-text tasks return the task's object (e.g.
  `character-draft` returns `{ name, classId?, ancestryId?, backgroundId?,
  featIds?, spellIds? }` — ids the client validates against the candidate pools
  and applies through the existing template/creation path); image tasks
  (`illustrate-scene`) return `{ dataUrl, mediaType }`.
- **Errors throw.** On any provider/transport failure, throw (any `Error`). The
  core normalizes: a timeout → `timeout` (HTTP 504), anything else →
  `provider-error` (502). Do **not** return a sentinel error object.
- **No ambient secrets.** Build the adapter from an explicitly passed key; never
  read `process.env` inside the adapter. The entry point owns env.
- **Timeouts.** The core wraps `generate` in the task-class latency budget
  (text 10 s / vision 15 s / image 25 s by default, env-overridable below;
  `GatewayContext.timeoutMs` is a single-knob override of all three); adapters
  need not implement their own.
- **Metadata normalization.** `usage.model` and the trace log carry
  `modelFor(task)` when implemented, else `model` — so an adapter that routes
  tasks to different models (the Gemini adapter's image tasks run on
  `AI_IMAGE_MODEL`) reports the model that actually served.

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

## Session cost budget (Phase 14)

A per-session cost cap, **off by default**, engaging only when
`AI_SESSION_BUDGET_UNITS` is set positive. Each adapter-bound request is charged
its task's **deterministic unit cost** (`AI_TASK_UNIT_COST` in
`src/ai/contracts.ts`: text 1, vision 2, image 5 — relative provider cost, not
post-hoc token counts) just before the provider call. Semantics:

- **Session key.** The verified Supabase user id (JWT `sub`) when auth is on,
  else the client ip. The pure HTTP layer performs the upgrade, so the cap
  follows the user across connections once they sign in.
- **Charge-then-check.** The crossing request's units stay counted and the
  verdict fails once cumulative spend exceeds the cap, so a tripped cap stays
  tripped — deterministically — until the fixed window resets
  (`AI_SESSION_BUDGET_WINDOW_MS`, default 6 h). Spend that lands exactly on the
  cap is still served.
- **Typed degradation.** A tripped cap answers the typed `budget-exceeded`
  failure (HTTP 429) — never a throw — and the client falls back to the manual
  tools. Fixture replay is never charged (it costs no provider spend).
- **Counting.** `sessionBudgetFromStore` adapts the same pluggable
  `RateLimitStore` used for rate limiting (weighted `increment`; keys namespaced
  `ai-budget:`), and the entry holds **one module-scope store** so both counters
  survive warm invocations and would move to a durable backend together.

## Per-task-class latency budgets (Phase 14)

Each task class has a latency budget that is BOTH the hard cap on the provider
call (exceeding it is the typed `timeout` failure, HTTP 504) and the threshold
for the `latencyBudgetExceeded` flag in the structured trace log: `text` 10 s,
`vision` 15 s, `image` 25 s, individually overridable via
`AI_LATENCY_BUDGET_*_MS` below. Task→class assignments live in `AI_TASK_CLASS`
(`src/ai/contracts.ts`).

## Environment variables

All optional. With **none** set, behavior is exactly as before: default provider,
no rate limiting, no session cap, in-memory counting.

| Var | Default | Effect when unset (inert behavior) |
| --- | --- | --- |
| `AI_PROVIDER` | `gemini` | Default provider selected; unrecognized values also fall back to it. |
| `GOOGLE_GENERATIVE_AI_API_KEY` / `GEMINI_API_KEY` | — | No key → default provider yields no adapter → `provider-not-configured` (client uses manual tools). |
| `AI_GATEWAY_MODEL` | adapter default | Gemini adapter's built-in model id. |
| `AI_IMAGE_MODEL` | adapter default | Gemini adapter's built-in image model id. |
| `SUPABASE_JWT_SECRET` | — (off) | Unset → no auth check (local-first deploys unchanged). Set + a provider key → valid Supabase JWT required (401 otherwise). |
| `AI_RATE_LIMIT` | — (off) | Unset/≤0 → **no** rate limiting (today's behavior). |
| `AI_RATE_LIMIT_WINDOW_MS` | `60000` | Window length; only used when `AI_RATE_LIMIT` is set. |
| `AI_SESSION_BUDGET_UNITS` | — (off) | Unset/≤0 → **no** session cost cap. Set → per-session unit budget (see above). |
| `AI_SESSION_BUDGET_WINDOW_MS` | `21600000` (6 h) | Budget window; only used when `AI_SESSION_BUDGET_UNITS` is set. |
| `AI_LATENCY_BUDGET_TEXT_MS` | `10000` | Latency budget for text tasks (provider-call cap + trace flag threshold). |
| `AI_LATENCY_BUDGET_VISION_MS` | `15000` | Latency budget for vision tasks. |
| `AI_LATENCY_BUDGET_IMAGE_MS` | `25000` | Latency budget for image-generation tasks. |
| `RATE_LIMIT_STORE_URL` | — | Unset → durable store disabled; counting stays in-memory. Set + a wired driver → durable store (rate limit + session budget). |
