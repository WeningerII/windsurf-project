# Runbook: Sentry Alert Rules

Committed, reviewable definition of the Sentry **alert rules** for this app. This
file is the source of truth; the maintainer transcribes it into the Sentry UI (or
Sentry-as-code) when a project is provisioned. Nothing here requires a live secret
to review or merge — the rules go live the moment a DSN and Sentry project exist.

- Stack: Vite + React (browser SDK `@sentry/browser@^10`), Netlify hosting,
  Supabase backend, optional AI gateway as a Netlify Function.
- **These rules shipped before the code that feeds them.** Rules (b) and (c) were
  defined against paths that swallowed the very failures they describe; the
  reporting seams were wired on **2026-07-25** (`src/ai/gatewayClient.ts` and
  `src/hooks/useEntitySync.ts`, pinned by
  `src/__tests__/observability/failureReporting.test.tsx`). Every rule below now
  has a real signal source, with two standing conditions, both flagged in place:
  rule (b) only carries traffic when `VITE_AI_ENABLED = "true"` (default OFF),
  and rule (a′) needs release-health/session tracking enabled in the SDK.
- Status of signal wiring is called out per rule under **Signal source**. Do not
  assume a rule is firing just because it is defined here — check that line.

---

## 1. How Sentry is wired in this codebase

Read these before editing thresholds — the alert rules key off exactly what the
code emits.

### Initialization

`src/main.tsx:13-23` — Sentry initializes **only when a DSN is present**:

```
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,   // "production" for any `vite build`
    enabled: import.meta.env.PROD,       // events only leave PRODUCTION builds
    sendDefaultPii: false,               // no IPs / default PII
  });
}
```

Consequences that shape every rule below:

- **No DSN → no client, no events.** Dev and unit/e2e runs never emit.
- **`enabled: import.meta.env.PROD`** means only production Vite builds send. Local
  `npm run dev` is silent even with a DSN set.
- **`environment` is `import.meta.env.MODE`**, which is `"production"` for *every*
  `vite build` — so Netlify **production deploys and deploy previews both report as
  `environment:production`**. If you need to separate them, scope alerts by
  `release` or add a distinct Sentry environment (a `main.tsx` change — out of
  scope for this runbook; note it as a follow-up). Default alert scope below is
  `environment:production`.
- **No `release` is set** in `Sentry.init`. Regression / "new in release" alert
  conditions will not group by release until a `release` value is wired. Rules
  below avoid depending on release grouping; where it would help, it is noted.
- `sendDefaultPii: false` — events carry no IP or user identifiers by default.
  Alert routing therefore cannot segment by end user; use event volume and tags.

### What actually reaches Sentry

`src/utils/errorLogger.ts` is the single funnel to `Sentry.captureException`:

- Only **`HIGH` and `CRITICAL`** severities are forwarded
  (`sendToMonitoring`, `errorLogger.ts:91-105`). `LOW`/`MEDIUM` never reach Sentry.
- Each event is tagged: `tags: { category, severity }` and `extra: context`.
- **Tag `category`** is one of: `validation`, `storage`, `data_load`, `render`,
  `user_action`, `network`, `unknown` (`ErrorCategory`, `errorLogger.ts:17-25`).
- **Tag `severity`** is `high` or `critical` (only these two forward).
- The React error boundary (`src/components/ErrorBoundary.tsx:31`) logs render
  crashes through the same funnel, so uncaught render errors arrive as
  `category:render`.
- **Unhandled promise rejections** are captured automatically by the
  `@sentry/browser` default global handlers (no app code needed) — they arrive
  with `mechanism.type = "onunhandledrejection"`, **not** through `errorLogger`, so
  they carry no `category` tag.

### Env / DSN wiring (what the maintainer sets)

| Variable | Where read | Purpose | Exposure |
|---|---|---|---|
| `VITE_SENTRY_DSN` | `src/main.tsx:13`, doc'd `.env.example:2` | Client DSN; enables the SDK when set | **Public by design** — a DSN is a write-only ingest key, safe in the browser bundle |

- Set `VITE_SENTRY_DSN` in **Netlify → Site settings → Environment variables** for
  the production context, then trigger a deploy (Vite inlines it at build time).
- The DSN is the *only* Sentry env var. There is no server-side Sentry key today.
- CSP already permits Sentry ingest: `netlify.toml` `connect-src` includes
  `https://*.sentry.io https://*.ingest.sentry.io` (Content-Security-Policy header,
  `netlify.toml` line 100). If the DSN's ingest host differs, update `connect-src`.

### Secret-exposure guard (already enforced — no action needed)

`scripts/check-secret-exposure.mjs` runs inside `npm run verify` and **fails the
build** if any server secret is smuggled into the client via a `VITE_`-prefixed
name (rule `client-inlined-vite-secret` matches
`VITE_*(SECRET|PRIVATE|SERVICE_ROLE|PASSWORD|TOKEN|API_KEY)*`), or if a real
credential is committed. The public names `VITE_SENTRY_DSN`, `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY` cannot match it: the pattern is deliberately scoped
around them, and that scoping is documented in the rule comment
(`scripts/check-secret-exposure.mjs:80-87`). There is no separate allow-list to
edit — the safety comes from the pattern's shape.
**Therefore: never rename the DSN or add a Sentry auth token under a `VITE_` name** —
CI will block it, and correctly so (Vite inlines every `import.meta.env.VITE_*` into
the shipped JS).

### AI surfaces are default-off

The AI gateway is **off unless `VITE_AI_ENABLED === "true"`**
(`src/config/featureFlags.ts:33`, `isFeatureEnabled('ai')`). It ships default-off.
The provider key (`GOOGLE_GENERATIVE_AI_API_KEY`) is **server-side only** in the
Netlify Function and is never a `VITE_` var (`.env.example:16-19`). Rule (b) below is
therefore **dormant on a default deployment**.

---

## 2. Alert rules

Notification channels are placeholders — replace the `<...>` tokens with real
Sentry alert-integration targets when provisioning.

- `<CHAN_OPS>` — routine ops channel (e.g. Slack `#rpg-ops-alerts`)
- `<CHAN_ONCALL>` — paging target (e.g. PagerDuty service / Opsgenie)
- `<EMAIL_OPS>` — fallback email list

Default scope for all rules: `environment:production`.

### Summary table

| # | Rule | Trigger condition | Threshold | Window | Severity | Notify |
|---|---|---|---|---|---|---|
| a | Client error-rate spike | `event.type:error` count, all categories | warn ≥ 25 events; crit ≥ 100 events | 5 min (rolling) | warning → critical | `<CHAN_OPS>` → `<CHAN_ONCALL>` |
| a′ | Crash-free sessions drop | Crash-free session rate | < 99.0% | 1 hour | warning | `<CHAN_OPS>` |
| b | AI-gateway failure / 5xx | AI-flow failures reported to Sentry (`tags.category:network`, `extra.surface:ai`) **or** Netlify Function 5xx | warn ≥ 10% of AI calls failing; crit ≥ 25 events | 15 min | warning | `<CHAN_OPS>` |
| c | Supabase sync failures | Sync-path errors reported to Sentry (`tags.category:network`, `severity:high`, `extra.surface:sync`) | warn ≥ 15 events; crit ≥ 50 events | 10 min | warning → critical | `<CHAN_OPS>` → `<CHAN_ONCALL>` |
| d | Unhandled promise rejections | `mechanism.type:onunhandledrejection` | warn ≥ 10 events; also alert on first-seen new issue | 5 min | warning | `<CHAN_OPS>` |

### (a) Client error-rate spike — YAML-ish spec

```yaml
name: client-error-rate-spike
dataset: errors
environment: production
filter: event.type:error
conditions:
  - metric: event_count
    window: 5m
    warning:  { op: ">=", value: 25 }
    critical: { op: ">=", value: 100 }
severity_map: { warning: warning, critical: critical }
notify:
  warning:  <CHAN_OPS>
  critical: <CHAN_ONCALL>
notes: >
  Catch-all volume guard. Fires on the sum of everything errorLogger forwards
  (category in validation|storage|data_load|render|user_action|network|unknown at
  severity high|critical) plus render-boundary crashes and auto-captured
  exceptions. Tune the 25/5m warn floor to observed baseline after one week of data.
signal_source: LIVE (errorLogger -> Sentry.captureException; ErrorBoundary crashes).
```

```yaml
name: crash-free-sessions-drop
dataset: sessions
environment: production
condition:
  metric: crash_free_session_rate
  window: 1h
  warning: { op: "<", value: 99.0 }   # percent
notify: { warning: <CHAN_OPS> }
notes: >
  Session tracking must be enabled in the SDK to populate this dataset. If session
  data is absent, treat rule (a) as the primary client-health signal.
signal_source: LIVE only if release-health/session tracking is enabled.
```

### (b) AI-gateway failure rate / 5xx — YAML-ish spec

```yaml
name: ai-gateway-failure-rate
environment: production
filter: tags.category:network AND message:"ai gateway call failed"
conditions:
  - metric: failure_ratio      # failed AI calls / total AI calls
    window: 15m
    warning: { op: ">=", value: 0.10 }   # 10%
  - metric: event_count
    window: 15m
    critical: { op: ">=", value: 25 }
notify: { warning: <CHAN_OPS>, critical: <CHAN_OPS> }
status: LIVE (client-side seam wired 2026-07-25) — but only carries traffic when
  VITE_AI_ENABLED = "true" (default OFF).
signal_source: >
  src/ai/gatewayClient.ts calls errorLogger.log(NETWORK, HIGH, 'ai gateway call
  failed', undefined, { surface: 'ai', task, code, traceId? }) on every UNHEALTHY
  outcome: a transport throw ('transport-error'), an unreadable body
  ('unreadable-response'), a response that is not an AiResponse
  ('malformed-response'), and any server-returned failure code not on the
  by-design list. Wired + pinned by src/__tests__/observability/failureReporting.test.tsx.
  Sentry receives these as tags.category:network / tags.severity:high with the
  detail in `extra` (surface/task/code/traceId) — filter on `extra.surface:ai` if
  your Sentry plan indexes extras, else on the message above.
by_design_exclusions: >
  over-budget, budget-exceeded (the 429 cost controls), unauthorized,
  provider-not-configured, invalid-request, unsupported-task are NOT reported —
  they are the gateway working as designed and would drown this rule. This
  replaces the old "filter out status:429" advice: the exclusion now happens at
  the source, so no Sentry-side filter is required.
still_not_covered:
  - SERVER-side 5xx from the function itself (a crash before it can answer) are
    still invisible to the browser SDK. The function emits one structured JSON
    line per request (src/ai/gatewayLog.ts, createConsoleLogSink) to the Netlify
    function log — `traceId` there joins to the `traceId` on these client events.
    A Netlify log-drain or @sentry/node in the function remains the way to alert
    on that; not wired.
notes: >
  The browser gateway client still degrades every failure to a manual fallback,
  so users are not blocked; this alert is about provider/quota health, not UX
  breakage.
```

### (c) Supabase sync failures — YAML-ish spec

```yaml
name: supabase-sync-failures
environment: production
filter: tags.category:network AND tags.severity:high
conditions:
  - metric: event_count
    window: 10m
    warning:  { op: ">=", value: 15 }
    critical: { op: ">=", value: 50 }   # broad failure => suspect Supabase outage / RLS / expired anon key
notify: { warning: <CHAN_OPS>, critical: <CHAN_ONCALL> }
status: LIVE (seam wired 2026-07-25)
signal_source: >
  src/hooks/useEntitySync.ts reports every sync-path failure through
  errorLogger.log(NETWORK, HIGH, 'sync failed', err, { surface: 'sync', stage })
  where stage is 'push' (debounced local-change push), 'delete' (a rejected
  remote delete during reconciliation), or 'sync' (the full fetch/merge/push
  cycle). Reporting is ADDITIVE: each site still sets syncState:'error' and still
  queues the snapshot, so local-first behaviour is unchanged. Pinned by
  src/__tests__/observability/failureReporting.test.tsx. The payload is
  content-free by construction — no entities, names, or notes — so this rule
  cannot leak user content into Sentry.
prerequisites:
  - Note: retry.ts already short-circuits non-retryable errors (auth, RLS, schema,
    'invalid api key', 'jwt expired', ...). A spike here most often means the anon key
    or JWT config is wrong, or Supabase is down — check the Supabase status page and
    the project's API keys before assuming a client bug.
correlated_checks:
  - Supabase project health (dashboard) and connection to VITE_SUPABASE_URL.
  - netlify.toml connect-src still lists the current *.supabase.co project domain.
```

### (d) Unhandled promise rejections — YAML-ish spec

```yaml
name: unhandled-promise-rejections
environment: production
filter: mechanism.type:onunhandledrejection
conditions:
  - metric: event_count
    window: 5m
    warning: { op: ">=", value: 10 }
  - trigger: first_seen_issue     # any NEW unhandled-rejection issue
    action: notify_once
notify: { warning: <CHAN_OPS> }
signal_source: LIVE. Auto-captured by @sentry/browser default global handlers; no app
  wiring required. These carry no `category` tag (they bypass errorLogger), which is
  why they get their own rule rather than folding into (a).
notes: >
  A brand-new unhandled-rejection issue usually signals an un-awaited promise on a
  code path that changed in the last deploy. Wiring `release` into Sentry.init would
  let this rule attribute the regression to a specific build.
```

---

## 3. Provisioning checklist (maintainer)

Steps that need console/credential access are marked **[NEEDS ACCESS]**.

1. **[NEEDS ACCESS]** Create the Sentry project (platform: *React*). Copy its DSN.
2. **[NEEDS ACCESS]** Set `VITE_SENTRY_DSN` in Netlify production env vars; redeploy
   so Vite inlines it. Confirm `npm run verify` still passes (the secret-exposure
   guard tolerates the public DSN name).
3. **[NEEDS ACCESS]** In Sentry, create alert rules (a), (c) and (d) as
   specified — these are **live immediately** on the existing signal.
4. Create rules (a′) and (b) too; both are wired but conditional.
   - (a′) reads the `sessions` dataset, which stays empty until release-health /
     session tracking is enabled (step 6). Until then it cannot fire — treat (a)
     as the client-health signal, and do not read (a′)'s silence as health.
   - (b) only carries traffic once `VITE_AI_ENABLED = "true"`; on a default
     (AI-off) deployment it will simply never fire. Leave it enabled rather than
     muted — there is nothing left to wire.
5. **[NEEDS ACCESS]** Replace `<CHAN_OPS>` / `<CHAN_ONCALL>` / `<EMAIL_OPS>` with the
   real Sentry alert integrations (Slack app, PagerDuty service, email list).
6. Optional but recommended: enable release health / session tracking (populates
   rule a′) and wire a `release` identifier in `Sentry.init` (improves d).

## 4. Verifying an alert actually fires

- **Rule (a)/(d) smoke test:** on a production build with the DSN set, trigger a
  handled `HIGH` error (any `errorLogger.log(..., ErrorSeverity.HIGH, ...)` path) and
  a deliberate un-awaited rejecting promise. Confirm both appear in Sentry within a
  minute, tagged `severity:high`/`category:*` and `mechanism.type:onunhandledrejection`
  respectively, then confirm the alert routes to `<CHAN_OPS>`.
- **DSN reachability:** in the browser devtools Network tab, confirm the POST to
  `*.ingest.sentry.io` returns `200` and is not blocked by CSP (if blocked, the
  console shows a CSP `connect-src` violation — fix `netlify.toml`).
- **Environment scoping:** confirm the test event's `environment` is `production`
  (remember previews also report as `production` — see §1).

## 5. Known gaps (track as engineering follow-ups, not ops config)

**Closed 2026-07-25** (were the rule (b)/(c) prerequisites):

- ~~Sync failures are not reported to Sentry.~~ Wired in `src/hooks/useEntitySync.ts`.
- ~~AI-gateway failures are degraded silently by the browser client.~~ Wired in
  `src/ai/gatewayClient.ts`, with by-design outcomes excluded at the source.

**Still open:**

- **AI-gateway SERVER-side 5xx are not in Sentry.** The function's structured
  trace (`src/ai/gatewayLog.ts`) goes to the Netlify function log only. Its
  `traceId` joins to the client-side events above, so a client alert is
  debuggable — but a crash the client only sees as a transport error is not
  separately attributable. Needs a Netlify log drain or `@sentry/node` in the
  function.
- **No `release` wired** in `Sentry.init` → weaker regression grouping.
- **Preview and production deploys share `environment:production`** → alerts
  cannot distinguish them without extra wiring.

The last two are one-line `src/main.tsx` changes, deliberately **not** taken
here: `main.tsx` rides the eager first-paint chunk, which sits close enough to its
gzip ceiling that even a small addition can redden the gate. Run
`npm run check:bundle-size` for the current measurement and headroom; the ceilings
themselves are in `scripts/check-bundle-size.mjs`. See `docs/GAPS.md` §14.
