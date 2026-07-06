# VTT UI/UX research: who wins, why, and what we take from it

**Date:** 2026-07-06 · **Method:** deep-research harness (101 agents, adversarially
verified claims, 3-vote kill rule) + docs-derived UI reconstruction of the winner.
Full verified claim set lives in the session transcript; this doc is the distilled
design brief. Hands-on browser navigation of the winner was blocked by this
environment's network policy (all VTT domains 403 at the gateway) — the UI anatomy
below is reconstructed from official documentation and release notes, and should be
upgraded with a firsthand pass when a session has open egress.

## Verdict

**Owlbear Rodeo (v2.2–2.4) is the consensus UI/UX winner** among 2025–2026 VTTs.
Every surviving cross-platform comparison names it the winner on simplicity, speed,
and setup friction: a brand-new GM goes from map upload to a running encounter with
fog of war in **under 15 minutes**. Critically, the research confirmed that "most
powerful" and "best UX" have different champions: **Foundry VTT** wins power,
automation, and value everywhere it is compared, and *also* carries the steepest
learning curve of any compared platform (hours-to-days before a first session).
Power is not what makes an interface loved. Focus is.

Sources (strongest): Black Lantern Forge, ScriptoriumGM, GM Craft Tavern, Czepeku,
kennygoff.com, sqyd.studio comparisons; first-party Owlbear Rodeo blog + docs.
Caveats: rankings rest on hobbyist/SEO blogs (no app-store ratings survived
verification); "worst-UX platform" claims (mostly aimed at Roll20) were **refuted**
in verification — we have a verified winner but no verified loser.

## Why people love it (verified mechanics, not vibes)

1. **A stated philosophy, shipped.** Co-creator Mitch McCaffrey: design driven by
   "spatial thinking" — layouts that make information easy to follow, designs that
   scale across screen sizes, and *reducing the space the interface occupies so the
   content draws the eye*. First-party, and exactly what third-party reviewers
   independently praise.
2. **One home for everything you own.** The v2.2 redesign consolidated all asset
   types into a single tabbed **dock** at the bottom (Scenes, Maps, Props, Mounts,
   Characters, Attachments, Notes), replacing two prior asset locations, explicitly
   "to make the site easier to learn."
3. **Universal drag-and-drop with context awareness.** Any asset drags from dock to
   viewport; dragging an image adds it to the scene, dragging a *scene* switches to
   that scene. One gesture, meaning derived from what you're holding.
4. **Classification at drop time, not navigation time.** Importing an image summons
   a radial **selection wheel** — hover over map/prop/token and release. You never
   pre-navigate to the "right place" before acting.
5. **Zero-friction entry.** Players join by link — no accounts, no character sheets;
   a waiting room with GM approval is the only gate. Free tier is genuinely usable.
6. **Micro-feedback everywhere.** Click-dragging a character moves it *and* draws a
   live distance ruler; pointers carry presence name-tags with off-screen arrows;
   fog is infinite fill-with-cut so players never see a map edge.

A verified minority view worth keeping: some users prefer OBR *because* it refuses
automation — a lightweight shared space keeps players engaged with the rules
instead of the software. Minimalism as a feature, not a gap.

## The winner's UI anatomy (docs-derived)

- **Entry:** profile page → Create Room (name, background, extension list). Player
  path: link → waiting room → GM approves.
- **In-room:** the infinite scene canvas IS the page. Chrome:
  - **Bottom dock** — tabbed asset bar + Asset Manager modal (create/edit/delete).
  - **Right toolbar** — appears only when a scene is open. Tools: Move, Fog,
    Drawing, Measure, Pointer (+ extension tools). Each tool expands into a small
    top strip: *modes* on the left (exclusive, stateful) and *actions* on the
    right (one-shot). Two levels, never deeper.
  - **Bottom-left Extras menu** — extensions; a consolidated players panel (single
    compact list; permissions live here, pulled out of buried menus).
  - **Dice** — a click summons a wooden dice tray with one button per standard die.
- **Permissions:** per-layer create/update/delete toggles + "Owner Only" for
  characters. Players simply see fewer affordances.
- **Known limitations (honest):** no character sheets, initiative, or token
  attributes (by design — bookkeeping lives outside); live GM edits are visible to
  players (no staging); voice/video is external; extension ecosystem still young.
  (Older reviews cite 24-hour room expiry — that was v1; v2 rooms persist.)

## The principles, translated to this repo

Our current failure mode is the opposite of every pattern above: one overloaded
page, deep tab nesting inside a cramped sheet host, browsers embedded as tabs,
scene tooling squeezed into the same shell — chrome everywhere, content nowhere.

1. **Pick the dominant surface per mode and give it ~90% of the pixels.** Three
   primary surfaces: **Library** (characters + campaigns), **Sheet** (one
   character), **Scene** (grid runtime). One visible at a time; instant switching.
   The sheet/scene is the "canvas" — panels are guests, not tenants.
2. **One dock, typed tabs, everywhere the same.** Replace scattered
   browsers-inside-tabs (equipment/spells/feats/monsters) with a single dock
   surface with type tabs, summonable from any primary surface. Same muscle
   memory in Sheet and Scene.
3. **Drag-and-drop as the primary verb, classification at drop time.** Drag a
   monster from the dock onto the scene → token. Drag a spell onto the sheet →
   the radial/inline classifier asks "prepared / known / favorite?" at drop,
   not via pre-navigation.
4. **Two-level tool grammar in Scene: tools → modes + actions.** Kill nested
   panels; a right-side toolbar whose active tool exposes one strip of modes and
   one of actions. Dice tray summonable, not permanently docked.
5. **Progressive disclosure by context and role.** Tooling appears when its
   surface is active (no scene tools while reading a sheet); player-visible
   views show fewer affordances (we already have validators/permissions concepts).
6. **Micro-feedback is the "buttery."** Move-with-ruler, presence tags, drop
   animations, roll results that land visibly. We are event-sourced — every event
   can afford one small, fast visual acknowledgment.
7. **Guard the entry path.** OBR's join-by-link is their onboarding moat; ours is
   local-first instant character creation. Whatever the redesign does, "new
   character in under a minute, no wall of choices" must survive it.
8. **Smoothness is an engineering budget, not a coat of paint.** OBR rebuilt its
   renderer for it. For us: measure sheet-render jank first (profiling before
   pixels); the bundle-size gate already exists — add an interaction-latency
   budget to verify before restyling anything.

## Anti-pattern notes (weakly evidenced, flagged as such)

No "worst UX" platform survived verification. The only robust negative signal:
Foundry's setup/administration burden gates its power behind hours of learning —
the lesson for us is *not* "avoid power" but "never make power the toll booth to
the basic loop." Fantasy Grounds' density appeared only in unverified side notes.
Foundry's v13 (2025) shipped a genuine UI modernization (ApplicationV2, adaptive
light/dark themes) — worth a follow-up look as the "power tool that learned
approachability" case study.

## Follow-ups

1. **Hands-on pass (blocked here):** with open network egress, drive
   owlbear.rodeo with Playwright — screenshot every surface, verify the anatomy
   above, capture the interaction feel this doc can't. Note: the site bot-blocks
   automated fetchers; a real browser session is required.
2. Decide the three-surface shell (Library/Sheet/Scene) and dock inventory
   against the current component tree (`src/App.tsx`, `src/components/`,
   `src/systems/*/components/`).
3. Prototype the dock + drop-classifier on ONE flow (monster → scene token)
   before any broad restyle.
