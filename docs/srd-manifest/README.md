# `docs/srd-manifest/` — provenance only

**This directory is not a denominator.** It was Denominator A until 2026-07-27.
Read that as a warning label, not as history: the mechanism is retired, and
re-wiring it into a completeness percentage would reintroduce a defect that
published a green 100% for years.

## Why it was demoted

The per-system manifests are **generated from the loaders**. Measuring the
loaders against them therefore put the same population on both sides of the
ratio — manifest ids were numerator *and* denominator — so no per-category
figure could ever read anything but 100%. It did not even require the data to be
correct: because nothing regenerated the manifests, one system's catalog drifted
to roughly a tenth of what its loader ships and still printed 100%, because both
sides shrank together.

Decided 2026-07-21, executed 2026-07-27. `docs/GAPS.md` §6 records the decision
and the three checks that showed it had not been executed.

## What is the denominator now

`docs/generated/srd-coverage.md`, written by `npm run srd:coverage`. Its entry
lists are fetched from open-content SRD indexes **outside this repo**, so
changing the product cannot move the denominator — which is the whole property
the manifests lacked. `docs/generated/roadmap-metrics.md` republishes a
per-system rollup of it, read offline from the `srd-coverage.json` sidecar.

## What lives here

| File | Status |
| --- | --- |
| `types.ts` | Committed, hand-authored. The manifest schema. |
| `_exclusions.ts` | Committed, hand-authored. The manual-exclusion registry — the enumerated manual / reference-only / non-numeric boundaries excluded from **both** denominators. Cited by `docs/MASTER_PLAN.md`, `docs/STATUS.md` and the roadmap metric. |
| `dnd5e-2014.ts`, `dnd5e-2024.ts`, `dnd35e.ts`, `pf1e.ts`, `pf2e.ts`, `mam3e.ts`, `daggerheart.ts` | **Generated on demand and gitignored.** Absent from a clean checkout. Run `npm run srd:manifests` to materialize them. |

The generated manifests answer provenance questions — which shipped entries
claim which source. They answer no coverage question.

A `ManifestEntryStatus` of `original` existed between 2026-07-28 and 2026-07-30
to mark self-authored entries rather than ones transcribed from an open
document. It was removed with the content it described: all 106 self-authored
entries were deleted and the `originalContentSources` policy channel that
admitted them is gone, so the loaders can no longer ship an entry that would
need it (`docs/GAPS.md` §17.3).

## If you are here to fix the drift

Do not. Do not add a gate that regenerates or validates these files, and do not
add a check that fails when they are stale. Staleness is no longer meaningful:
nothing consumes them, and they are rebuilt from the loaders whenever anyone
runs the command. A gate here would entrench the retired mechanism.
