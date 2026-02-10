# D&D 3.5e Spells Cleanup Progress

**Last Updated**: January 26, 2026 (audit refresh)

## Status
- Canonical layout: one file per level (5e-2014 style)
- Legacy folders removed
- Spell schema extended for 3.5e-specific fields
- Validation script in place for dupes/placeholders/non-SRD sources

## Current Counts (post-merge)
- Total spells: 555
- By level: 0: 44, 1: 51, 2: 59, 3: 68, 4: 81, 5: 55, 6: 83, 7: 42, 8: 39, 9: 33
- By school: abjuration 88, conjuration 110, divination 56, enchantment 39, evocation 73, illusion 17, necromancy 60, transmutation 112

## Remaining Work
- Verify spell list against SRD 3.5 source; remove any non-SRD entries
- Normalize 3.5-specific mechanics (casting time, ranges, durations, saves)
- Populate 3.5 fields: `subschool`, `descriptors`, `spellResistance`, `target`, `effect`, `area`
- Reconcile any remaining rule drift from 5e-style text
- Keep validation script aligned with schema changes
