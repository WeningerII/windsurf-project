# docs/ — what is authoritative, and in what order

This index exists because the docs tree had grown to the point where you could not
tell, from the tree alone, which document wins when two disagree. That question now
has one answer, below.

## Authority order

When two documents conflict, the higher entry wins. This is not a courtesy ranking —
it is the order the CI gates enforce.

1. **Code.** The implementation is the ground truth. Every document here has been
   wrong about the code at some point; the code has never been wrong about itself.
2. **`generated/`** — machine-written from the code by `npm run check:generated-docs`.
   Never hand-edit. If a number here looks wrong, the generator or its input is
   wrong, not the file.
3. **`MASTER_PLAN.md`** — the sole planning authority. Roadmap, sequencing, phase
   status, and long-horizon scope. If another document appears to define roadmap,
   treat it as historical or descriptive.
4. **`WORK_PLAN.md`** — the forward-looking work queue: what to do next, in what
   order, and what each item unblocks. It derives from the plan and the gaps; where
   it disagrees with either, they win and the queue is stale. **This is the document
   to open when the question is "what should I pick up?"** — the plan answers "where
   are we," which is a different question and was for a long time the only one the
   tree could answer.
5. **`GAPS.md`** — the tracking document for outstanding gaps and the GLOBAL DONE
   criteria. Findings and their evidence live here; the plan summarizes them.
6. **`STATUS.md`** — a current-state summary *only*. It must not compete with the
   plan on sequencing or with `generated/` on counts.
7. **`rfc/`** — accepted architecture decision records. An RFC describes a decision,
   not its rollout status; the plan owns rollout status.

`VISION.md` sits outside this ladder on purpose: it is the durable *why* and changes
rarely. `MASTER_PLAN.md` is the *what* and *how* and changes often. Where the two
disagree about scope, the plan wins.

## Reading order for a new session

**To pick up work:** `WORK_PLAN.md` first, and often only. It opens with the decisions
that gate everything else, then the queue in dependency order. Follow a citation into
`GAPS.md` when you need the evidence behind an item.

**To understand the project:**

1. `../CLAUDE.md` — repo shape, commands, and the gotchas that bite first.
2. `../memory/hot.md` — what was in flight last session.
3. `MASTER_PLAN.md` — "Current Repo Truth", then the active-track tables.
4. `generated/roadmap-metrics.md` and `generated/srd-coverage.md` — the live numbers.

Do not start from a design doc or an RFC. They describe intent at a point in time,
and several have been overtaken by what shipped.

## Directories

| Path | What it is | Hand-editable |
|---|---|---|
| `generated/` | Metrics, coverage, and the rendered gap ledger, written by scripts | **No** — gated by `check:generated-docs` |
| `rfc/` | Accepted decision records, 001–007 | Yes, as amendments |
| `design/` | Live design docs for work still in progress | Yes |
| `runbooks/` | Operational procedures (alerting, backup/restore, recovery) | Yes |
| `compute-register/` | Denominator B: per-system engine math, gated by `check:compute-register` | Yes, with a test anchor |
| `srd-manifest/` | Denominator A catalogs — **being demoted**, see `GAPS.md` §6 | Generated; do not gate |
| `history/` | Superseded documents. Banner-enforced, never updated to track current state | Only to add a banner |

## Order of operations when you change something

The gates define this; it is not advisory.

1. **Change the code first.** A doc describing unshipped behaviour is the failure
   mode this tree is recovering from.
2. **Update `MASTER_PLAN.md`**, obeying its `All-seven-equal phrasing` constraint —
   no system name as the subject of a deliverable, tallies use denominator 7,
   asymmetric progress recorded as explicit per-system debt.
3. **Record findings in `GAPS.md`** as a new numbered section, taking the next free
   number. Sections are kept in numeric order; parallel branches have collided here
   repeatedly, so re-check your number after any rebase.
4. **Update `STATUS.md`** only if the current-state summary changed. Keep it a
   summary.
5. **Regenerate**: `npm run check:generated-docs` rewrites both the roadmap metrics
   and the master gap ledger. Never hand-edit its outputs.
6. **Verify**: `npm run check:doc-drift`, `npm run check:repo-hygiene`. Drift pairs
   documented behaviour with code via `doc-drift.manifest.ts` — a new markdown file
   must be registered there or hygiene fails.

## Two rules this tree learned the hard way

**Narrative docs do not own counts.** Precise numbers belong in `generated/`, cited.
Prose that restates a count is prose that will be wrong within a week. A SHA pinned in
prose is the same mistake: one sat in three documents until 64 merges had passed it.

**Do not claim a guard you have not proven can fail.** Several "enforced" and
"cannot be gamed" claims in this tree turned out to describe mechanisms that were
structurally incapable of going red — a coverage metric whose numerator and
denominator came from the same stale file, an all-seven assertion that could not
fail, a name-based diff described as guarding against substance-level defects. If you
write that something is gated, break it on purpose first and watch the gate catch it.
