# M&M 3e SRD Data Status and Maintenance Plan

**Date:** February 17, 2026
**Scope:** Maintain verified SRD-only M&M 3e data integrity
**Source Material:** [d20herosrd.com](https://www.d20herosrd.com/)

---

## 1. Authoritative Snapshot (Current)

All counts below are from current code exports and metadata.

| Category | Current Count | Notes |
| --- | ---: | --- |
| Powers (total) | 61 | 40 core effects + 21 sample powers |
| Attack powers | 12 | SRD-verified |
| Control powers | 11 | SRD-verified |
| Defense powers | 7 | SRD-verified |
| General powers | 16 | SRD-verified |
| Movement powers | 8 | SRD-verified |
| Sensory powers | 7 | SRD-verified |
| Advantages (total) | 74 | combat 33, fortune 6, general 16, skill 19 |
| Skills | 16 | Complete |
| Complications | 28 | SRD-only list after non-SRD removals |
| Conditions | 29 | 16 basic + 13 combined |
| Archetypes | 15 | Complete |
| Equipment (total) | 150 | weapons 32, armor 20, gear 30, devices 29, vehicles 24, HQ 15 |
| Power modifiers (extras) | 56 | Duplicate `_extra` variants removed |
| Power modifiers (flaws) | 45 | Current export set |

---

## 2. Completed Refactor Work

### 2.1 Architecture Cleanup (Completed)
- Deleted all `advantages/additional-*.ts` overflow files.
- Consolidated to category files only: `combat.ts`, `fortune.ts`, `general.ts`, `skill.ts`.
- Rewrote `advantages/index.ts` to clean aggregation (no dedup pass as data crutch).
- Removed duplicate `_extra` entries from `modifiers/extras.ts`.

### 2.2 SRD Verification (Completed)
- Powers reduced to SRD-verified set (`61`) and validated by type.
- Complications corrected to SRD-only set (`28`).
- Conditions corrected to SRD set (`29`) including missing combined conditions.
- Equipment expanded and normalized to `150` entries.

### 2.3 Metrics Integrity (Completed)
- Roadmap metrics generator uses canonical arrays directly.
- Module audit duplicate inflation was removed.
- Current module audit expectations:
  - M&M powers: `61`, duplicates `0`
  - M&M advantages: `74`, duplicates `0`
  - M&M archetypes: `15`, duplicates `0`

---

## 3. Ongoing Maintenance Tasks

### 3.1 Data QA (High Priority)
- Re-verify each power's `action`, `range`, `duration`, and `baseCost` against SRD on change.
- Re-verify advantage `type` classification when editing descriptions.
- Re-verify complication/condition wording against SRD canonical behavior text.

### 3.2 Consistency QA (Medium Priority)
- Keep archetype references aligned with current power IDs.
- Keep descriptor usage in powers aligned with `descriptorGroups` in `powers/aggregations.ts`.
- Ensure no duplicate IDs across any M&M data category.

### 3.3 Metrics/Docs Sync (Medium Priority)
- Run `npm run roadmap:metrics` after data changes.
- Keep `README.md`, `ARCHITECTURE.md`, `SRD_COMPLIANCE.md`, and `TECHNICAL_ROADMAP.md` aligned with generated counts.

---

## 4. Verification Checklist

Run after any M&M content edit:

```bash
# Type + build + tests
npx tsc --noEmit
npm run build
npm test -- --run

# Metrics regeneration
npm run roadmap:metrics

# Duplicate ID checks (expect no output)
rg "^\s*id:" src/data/mutants-and-masterminds/3e/powers/core/*.ts | sort | uniq -d
rg "^\s*id:" src/data/mutants-and-masterminds/3e/advantages/*.ts | sort | uniq -d
rg "^\s*id:" src/data/mutants-and-masterminds/3e/equipment/*.ts | sort | uniq -d

# Quick count sanity checks (current expectations)
# powers: 61, advantages: 74, equipment: 150, complications: 28, conditions: 29
```

---

## 5. Non-Goals

- No return to 200+ fabricated/placeholder power targets.
- No duplicate or overflow category files.
- No non-SRD source additions.
- No UI changes in this plan.

---

## 6. Success Criteria (Maintenance)

- [ ] No duplicate IDs across powers/advantages/equipment/modifiers.
- [ ] SRD-only source attribution preserved.
- [ ] Build and tests pass after data changes.
- [ ] Roadmap metrics regenerated and all public docs synchronized.

