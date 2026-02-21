# Multi-System SRD Compliance Policy

**Last Updated**: February 18, 2026  
**Compliance Level**: ✅ **STRICT SRD-ONLY ACROSS ALL SYSTEMS**  
**Policy**: This project ships only SRD/open-licensed content. Proprietary supplements, setting books, and non-SRD options are out of scope.

---

## Source of Truth

Canonical compliance and content totals come from generated roadmap metrics:

- `docs/generated/roadmap-metrics.json`
- `docs/generated/roadmap-metrics.md`
- Policy config: `src/utils/openContentPolicy.ts`

If a static number in any document conflicts with generated metrics, generated metrics win.

---

## Canonical Content Snapshot

Loader-backed totals (authoritative):

| System | Spells/Powers | Classes | Species | Monsters | Equipment | Feats |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| D&D 5e (2014) | 238 | 12 | 9 | 41 | 230 | 0 |
| D&D 5e (2024) | 315 | 12 | 9 | 99 | 204 | 87 |
| D&D 3.5e | 555 | 11 | 7 | 0 | 207 | 515 |
| Pathfinder 1e | 134 | 11 | 7 | 0 | 70 | 86 |
| Pathfinder 2e | 146 | 12 | 6 | 0 | 188 | 93 |
| Mutants & Masterminds 3e | 61 | 0 | 0 | 0 | 150 | 0 |

Referenced module audits (non-loader exports currently tracked):

- M&M 3e advantages: 74
- M&M 3e archetypes: 15
- PF2e archetypes: 5

Current generated audit status is clean for loader-backed datasets:

- Missing source attribution: `0`
- Non-compliant records: `0`
- Duplicates removed: `0`

---

## Allowed Sources by System

- **D&D 5e (2014)**: `SRD 5.1`, `SRD`, `System Reference Document 5.1`
- **D&D 5e (2024)**: `SRD 5.2`, `System Reference Document 5.2`
- **D&D 3.5e**: `SRD 3.5`, `PHB 3.5`, `PHB`, `Player's Handbook 3.5`
- **Pathfinder 1e**: `Core Rulebook`, `CRB`
- **Pathfinder 2e**: `Core Rulebook`, `CRB`
- **Mutants & Masterminds 3e**: `Hero's Handbook`, `HH`, `Mutants & Masterminds Hero's Handbook`

All new data entries must include explicit source attribution matching policy.

---

## Prohibited Content

Do not add:

- Supplement-only material (for example Xanathar's, Tasha's, APG, Lost Omens)
- Setting/campaign proprietary content
- Product Identity names/lore/artwork
- Non-SRD subclasses/species/feats/spells/equipment
- Any item without verifiable SRD/open-license source

---

## Verification Workflow

Before merge:

1. Add content in canonical data files with source attribution.
2. Run `npm run validate`.
3. Run `npm run roadmap:metrics`.
4. Run `npm test -- --run`.
5. Confirm generated metrics show:
- `missingSourceCount = 0`
- `nonCompliantCount = 0`

---

## Enforcement Checklist

- [ ] Source field present on every new record
- [ ] Source matches allowed policy for the system
- [ ] No duplicate record IDs
- [ ] No supplement-specific strings/identifiers
- [ ] Validation, tests, and metrics regeneration completed

---

## Historical Notes

- PF2e uncommon heritage rollback (January 2026): non-SRD heritage content removed and guarded.
- M&M 3e expansion cleanup: canonical loader-backed SRD powers count is now `61`.

Historical implementation narratives belong in `docs/archive/` and are not normative policy.
