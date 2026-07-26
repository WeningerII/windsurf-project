# docs/history — archived planning documents

This folder holds superseded planning documents. They are historical records, not
roadmap authorities.

Archived by Remediation Phase 6 (2026-07-21):

- `PRODUCTION_PLAN.md` — March 2026 production-hardening sequence
- `EVIDENCE_LINKED_PARITY_AUDIT.md` — the pre-parity-push evidence snapshot
- `EVIDENCE_LINKED_PARITY_REMEDIATION_PLAN.md` — the remediation sequencing that followed it
- `DAGGERHEART_DATA_ORGANIZATION_PLAN.md` — the original Daggerheart data-shape rationale

Consolidated here 2026-07-26, when three superseded documents were found living
outside this folder and reading as current:

- `2026-06-09-full-repo-code-review.md` — a snapshot of commit `128726d`. It
  already carried a historical banner but sat alone in a reviews folder of its
  own, so nothing signalled its status from the tree.
- `ui-shell-redesign-plan.md` — the first-pass shell synthesis, superseded two
  days later by `docs/design/ui-shell-redesign-final-plan.md`, which names it in
  its own Supersedes line. It had been sitting beside the plan that replaced it.
- `pf1e-equipment-sourcing.md` — a sourcing proposal whose follow-on shipped
  (`scripts/encode-pf1e-equipment.mjs`). Its own Status line still reads
  "awaiting encode follow-on"; that line is preserved as written and corrected in
  the banner rather than rewritten.

Each file carries a historical banner and a dated current-truth note,
and the still-valid content they contained was merged into `docs/MASTER_PLAN.md`
(see its Historical Provenance table). Do not update these files to track
current state; change `docs/MASTER_PLAN.md`, `docs/STATUS.md`, or `docs/GAPS.md`
instead.
