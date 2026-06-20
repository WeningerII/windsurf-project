# RFC 002: AI Control Plane For Frictionless Creation And Play

**Status:** Active — foundation and four task surfaces shipped (2026-06-19). Sections below describe the target design; see "Implementation status" for exactly what has landed versus what remains.
**Author:** product/engineering planning
**Consolidated:** May 1, 2026

## Implementation status (2026-06-19)

The provider-agnostic control plane and its first four task surfaces are live. What shipped, mapped to this design:

- **Gateway foundation** (`src/ai/`): typed, dependency-free task contracts (`contracts.ts`) with hand-written parse-don't-cast validators; a pure, injectable gateway core (`gatewayCore.ts`) with fixture replay, a request timeout, and normalized typed failures; a browser client (`gatewayClient.ts`) gated behind `VITE_AI_ENABLED` that degrades every transport error to a manual fallback; pure prompt builders (`prompts.ts`) and HTTP glue (`gatewayHttp.ts`).
- **Server gateway** (`netlify/functions/`): a Netlify Function holding the provider key in the server environment only (never the browser bundle), delegating to the pure core; a single Gemini adapter (Vercel AI SDK) is the only provider-bound code, behind the `AiProviderAdapter` seam. Task allowlist, request validation, and key-less degradation are enforced; per-task structured output schemas (or image routing) live in the adapter.
- **Candidate pools + deterministic handshake**: encounter drafting and creature identification build loader-backed candidate pools and the model must return ids from them; an invented id is rejected deterministically. Encounter drafting reuses the shipped `validateEncounterSpec` budget gate with one bounded repair.
- **Review-and-apply UI + local-first**: every surface is human-in-the-loop (selections reviewed before the deterministic builder applies them; narration edited before logging; identified statblock selected, not placed; imagery viewed/downloaded, never written to scene state). Default OFF; CI exercises the full path via fixtures without a key.

Four task surfaces, one per modality:

1. **encounter-draft** — prompt → structured selections, gated by the encounter-spec validator (structured output).
2. **scene-narration** — deterministic recap → prose, grounded in those facts only (free text).
3. **identify-creature** — image → a catalog id, validated against the candidate pool (vision / image input).
4. **illustrate-scene** — prompt → an image via Imagen, a human-judged creative aid kept out of deterministic state (image output).

Still target design, not yet built: AI character-concept draft and draft repair (await deterministic guided creation), rule/provenance explanation, tactical intent hints, and the observability/cost-control layer (trace ids, latency, cost buckets, per-session ceilings) — only a per-request timeout and key-less/error degradation are implemented so far. The task allowlist grows one entry at a time as each remaining surface lands with its tests.

## Summary

This RFC defines how AI features enter the app without replacing the deterministic automation already shipped in the character sheets, loaders, template applicators, and future scene runtime.

The product goal is to make creating, preparing, playing, and experiencing tabletop sessions feel low-friction: describe what you want, get a useful draft, review it in normal app surfaces, and let deterministic rules decide what can actually be applied.

AI is an orchestration and drafting layer. It can propose character choices, encounter specs, map metadata, tactical intent hints, narration, summaries, and repair suggestions. It does not own rules legality, persisted state, source eligibility, or mechanical resolution.

## Motivation

The repo already has meaningful automation:

- Loader-backed SRD content and source filtering.
- System engines and template applicators.
- 5e subclass, multiclass, feat ASI/proficiency, feature-option, and spell-preparation support.
- PF2e, legacy d20, M&M, and Daggerheart system-specific automation and manual-boundary surfaces.
- Local-first persistence, import/export, campaigns, optional Supabase sync, and Netlify deployment.

That foundation should become the execution surface for AI. The AI expansion should not create a second rules engine, second content registry, second document schema, or provider-dependent product path.

The intended user experience is:

1. The user describes intent in natural language.
2. The app builds loader-derived candidate pools and current document or scene context.
3. A server-side AI gateway returns structured draft output.
4. The client validates the draft with deterministic TypeScript validators.
5. The user reviews differences, warnings, and provenance.
6. Accepted output is applied through normal template handlers or typed scene actions.
7. Mechanics remain replayable, auditable, and usable when AI is unavailable.

## Scope

In scope:

- AI-assisted character draft creation after deterministic guided creation exists.
- AI repair loops that consume machine-readable validation issues.
- AI-assisted encounter specification using loader-backed candidate pools.
- AI narration based on deterministic event/result artifacts.
- AI strategy hints that feed local tactical executors without blocking turns.
- Optional map/image/vision assistance that produces reviewable geometry proposals.
- A server-side provider gateway using environment-held credentials.
- Fixture replay, cost caps, timeout fallbacks, and trace metadata.

Out of scope:

- Browser-bundled provider secrets.
- Direct model writes to character, campaign, scene, or sync storage.
- LLMs deciding RAW legality.
- LLMs in per-move mechanical hot paths.
- Provider/model lock-in in planning docs.
- Generated closed-content additions to shipped data catalogs.
- Generated homebrew/fusion as a default path.

## Design Principles

### Existing automation is the authority

AI output must flow into existing deterministic surfaces:

- Character creation drafts become normal `CharacterDocument` data only after template application and validation.
- Rules legality comes from validators and source-policy checks, not model confidence.
- Derived values come from engines and contribution ledgers, not model arithmetic.
- Scene changes, once scene runtime exists, become typed actions/events and fold through deterministic reducers.

### Local-first remains the product baseline

AI improves speed and presentation, but absence of provider keys must never break:

- Manual sheets.
- Guided creation.
- Deterministic validation.
- Import/export.
- Campaigns.
- Scene tools and encounter building once those ship.

Missing provider configuration should produce a disabled AI affordance or deterministic fallback, not a broken workflow.

### AI drafts, users approve

AI can produce drafts and explanations. The user remains the approval point before any durable mutation. Accepted changes use the same code path as non-AI edits.

### Provider details are implementation details

The app should define task contracts and structured inputs/outputs first. Provider SDKs, model names, prices, routing, and observability tools are selected inside implementation phases and can change without changing user-facing contracts.

## Architecture

### Client task surfaces

The client exposes AI only at task-specific surfaces, not as an unconstrained repo-wide chat box.

Initial task surfaces:

- Character concept to draft choices.
- Character draft repair from validation issues.
- Rule/provenance explanation from validators, ledgers, and loaded data.
- Encounter prompt to structured encounter spec.
- Event result to narration.
- Scene snapshot to tactical intent hints.
- Map image to proposed grid and geometry metadata.

Each task has an explicit request and response contract. The client sends only the data needed for that task: selected system id, loaded candidate ids/labels, current document or scene summary, constraints, user prompt, and budget metadata.

### Server-side AI gateway

Provider calls run through a Netlify Function or equivalent server endpoint, never from the browser bundle.

Responsibilities:

- Hold provider credentials in environment variables.
- Normalize provider errors into typed failures.
- Enforce task allowlists.
- Enforce request size limits and timeout budgets.
- Enforce per-session or per-request cost ceilings.
- Add trace ids and prompt/template versions.
- Support recorded fixture replay in tests.
- Return structured JSON for every task.

The first gateway should be intentionally narrow: one or two task classes, one provider adapter, no long-term memory, and no background jobs. Additional providers or orchestration libraries should enter only when a phase consumes them.

### Candidate pools

The client builds candidate pools from loader-backed data before calling AI.

Examples:

- Valid 5e classes, species, backgrounds, feats, spells, and equipment for a character creation step.
- Valid monster ids and encounter constraints for an encounter draft.
- Valid action ids or maneuver options for a scene state.

The model should choose from explicit ids rather than invent names. If an id is absent from the candidate pool, deterministic validation rejects it.

### Validation and repair loop

The client validates every structured AI draft locally.

If validation fails:

1. The client displays the issues when the user needs to see them.
2. For repairable AI drafts, the client sends the structured `ValidationIssue[]` back to the gateway.
3. The gateway has a strict repair-attempt limit.
4. If repair still fails, the user keeps the partial draft as reviewable suggestions or falls back to manual editing.

Repair is a convenience loop, not a bypass around validators.

### Application boundaries

Accepted AI output maps to normal app mutations:

- Character drafts apply through template applicators and document handlers.
- Character edits use the same sheet update handlers as manual edits.
- Encounter drafts initialize scenes through the deterministic encounter builder.
- Tactical suggestions become action intents, then validated scene events.
- Narration attaches to event/result artifacts as read-only presentation.

No task may write directly to storage, sync tables, or future scene state.

### Observability and cost controls

AI phases need lightweight but real observability before broad use:

- Task name.
- Trace id.
- Prompt/template version.
- Provider adapter id.
- Input/output size.
- Latency.
- Failure kind.
- Repair count.
- Estimated cost bucket.

CI must be able to run without live provider calls by replaying fixtures. Production must degrade to deterministic/manual behavior on timeout, missing key, provider error, or exhausted budget.

## First Integration Sequence

### 1. AI task contracts

Define task-level request and response shapes before adding a provider SDK. Start with the character draft adapter because it depends on the guided creation and validation program already planned.

Minimum contracts:

- Character concept draft request.
- Character concept draft response.
- Validation repair request.
- Validation repair response.
- Normalized AI gateway failure.

### 2. Server gateway skeleton

Add a Netlify Function with:

- Task allowlist.
- Environment-key detection.
- Request validation.
- Fixture mode for tests.
- Stub response path when no provider is configured.

No browser secrets and no direct document mutation.

### 3. Candidate-pool builder

Build candidate pools from existing loaders for the first supported system. The initial pool should favor ids, labels, source metadata, prerequisites, and brief descriptions over large raw text payloads.

### 4. Deterministic validation handshake

Connect AI drafts to the validation registry. The gateway can propose; the client validates; repair loops receive only structured validation issues and the original candidate pools.

### 5. Review and apply UI

AI output appears as a draft review state. The user can accept, edit, or discard. Accepting uses normal template/document handlers.

### 6. Extend to play

After scene runtime exists, reuse the same pattern:

- Prompt to encounter spec.
- Encounter spec to validated scene initialization.
- Scene result to narration.
- Scene snapshot to strategy hints.
- Strategy hints to local tactical executor.

## Acceptance Criteria

The first AI integration is acceptable only when:

- The app still works fully with no provider keys.
- Provider keys are not present in the browser bundle.
- AI responses are structured and validated before application.
- Invalid ids or unsupported rules are rejected deterministically.
- Repair loops are bounded.
- User approval is required before durable state mutation.
- Recorded fixtures cover CI without live provider calls.
- Cost and timeout fallbacks are visible and deterministic.

## Open Questions

- Which first character creation system should be exposed to AI after deterministic guided creation lands: 5e 2024 only, or both 5e 2024 and 5e 2014?
- Should AI traces be local-only at first, or synced for signed-in users as part of future campaign collaboration?
- What is the minimum useful narration surface before full scene runtime exists?
- How much source text can be sent safely and economically, versus ids plus compact summaries?
- Do we need a shared prompt/template registry immediately, or can task-local templates remain sufficient for the first gateway?
