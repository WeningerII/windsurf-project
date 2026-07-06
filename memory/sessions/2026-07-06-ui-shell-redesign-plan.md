# 2026-07-06 — UI shell redesign plan (design workflow)

**Deliverable:** `docs/design/ui-shell-redesign-plan.md` — phased, file-grounded plan
turning the Owlbear Rodeo research brief into buildable work.

**Method:** Workflow `ui-shell-redesign-plan` (11 agents on opus-4-8): 5 code-mappers →
4 surface designs → synthesis → adversarial critique. All grounded in real file:line
anchors via the graphify graph.

**Target shell:** `h-dvh` frame; one ~52px rail with a [Library|Sheet|Scene] switcher;
keepalive SurfaceStage (3 peer surfaces, one visible ~90% pixels, others hidden+quiesced
but mounted); ONE shell-mounted summonable typed-tab dock (src/dock/*) shared by Sheet
and Scene; portaled drag layer with drop-time classifier. **Load-bearing invariant:
every gesture emits existing controller handlers / 12 SceneActionIntents — the
deterministic event-sourced core (src/scene/runtime.ts) is never touched.**

**Phases:** 0 instrument+tokens · 1 shell frame + ShellContext · 2 dock shell (+ the
SheetDispatchContext seam the critique demanded) · 3a/3b/3c drag engine + classifiers
(the greenfield keystone, split) · 4 sheet eviction (delete ~12 browser adapters to the
dock; onUpdate/canUpdate = the read-only GM seam) · 5a/5b/5c SceneManager decomposition
+ pan/zoom · 6 hardening (role source-of-truth, deep-link, latency CI gate).

**First prototype:** monster-from-dock → scene token (slice through Phases 1–3b).
Caveat the critique caught: emitSceneAction is private to SceneManager, so the prototype
must expose it upward first — a named modification, not free reuse.

**Four UNMADE product decisions surfaced for the user (with recommended defaults):**
character creation home, campaign first-class home, scene authoring home, drag form
factor. The bare [Library|Sheet|Scene] switcher silently drops the first three (they
live in the deleted landing scroll today).

**Critique verdict:** "Not buildable exactly as written, but the spine is sound and the
load-bearing safety constraint holds." Its four fixes are folded into the committed doc.

**Status:** plan only, no code changed. Branch restarted from post-#29 main
(3a25560); doc committed after the research brief. Awaiting user's read + the four
decisions before any implementation.
