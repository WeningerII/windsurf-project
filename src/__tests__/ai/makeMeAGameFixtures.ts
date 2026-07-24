/**
 * Recorded gateway transcripts for the make-me-a-game flow — one per system, all
 * seven, no system privileged.
 *
 * These are RECORDED PROVIDER OUTPUTS, not stubs: each `output` is replayed
 * through the real gateway core (`createRecordedGateway`), which re-validates it
 * with `parseTaskData` exactly as it validates a live provider's answer. Every
 * id below is a real loader id from that system's own catalogs — if the SRD data
 * is regenerated and an id disappears, the pool gate rejects it and the seeded
 * replay fails loudly rather than silently drifting.
 *
 * `encounter` is present only for the systems that HAVE a cited encounter-budget
 * model (`ENCOUNTER_BUDGET_SYSTEMS`). For the two that do not, the fixture states
 * the real reason instead of borrowing another system's numbers.
 */
import type { GameSystemId } from '../../types/game-systems';
import type { EncounterDifficulty } from '../../scene/encounterDraft';

export interface RecordedGameFixture {
  systemId: GameSystemId;
  /** One recorded character-draft output per requested party member, in order. */
  party: Array<{ prompt: string; output: unknown }>;
  /** Recorded encounter-draft output, when the system can be budgeted at all. */
  encounter?: { prompt: string; difficulty: EncounterDifficulty; output: unknown };
  /**
   * Why this system's encounter step cannot run — a real, specific reason, set
   * only when `encounter` is absent. Asserted verbatim-ish by the test so the
   * flow can never quietly start skipping a system that should participate.
   */
  encounterSkipMatch?: RegExp;
}

export const MAKE_GAME_FIXTURES: RecordedGameFixture[] = [
  {
    systemId: 'dnd-5e-2014',
    party: [
      {
        prompt: 'a reckless frontline brawler',
        output: {
          name: 'Korga Stonefist',
          classId: 'barbarian',
          ancestryId: 'human',
          rationale: 'Rage first, apologize later.',
        },
      },
      {
        prompt: 'a wandering singer who keeps the party alive',
        output: { name: 'Lirel of the Vale', classId: 'bard', ancestryId: 'elf' },
      },
    ],
    encounter: {
      prompt: 'something small skittering out of the undergrowth',
      difficulty: 'low',
      output: {
        selections: [{ monsterId: 'awakened-shrub', count: 2 }],
        rationale: 'The treeline itself objects.',
      },
    },
  },
  {
    systemId: 'dnd-5e-2024',
    party: [
      {
        prompt: 'a reckless frontline brawler',
        output: { name: 'Korga Stonefist', classId: 'barbarian', ancestryId: 'dragonborn' },
      },
      {
        prompt: 'a wandering singer who keeps the party alive',
        output: { name: 'Lirel of the Vale', classId: 'bard', ancestryId: 'dwarf' },
      },
    ],
    encounter: {
      prompt: 'something small skittering out of the undergrowth',
      difficulty: 'low',
      output: { selections: [{ monsterId: 'awakened-shrub-2024', count: 2 }] },
    },
  },
  {
    systemId: 'dnd-3.5e',
    party: [
      {
        prompt: 'a reckless frontline brawler',
        output: { name: 'Korga Stonefist', classId: 'barbarian', ancestryId: 'dwarf' },
      },
      {
        prompt: 'a wandering singer who keeps the party alive',
        output: { name: 'Lirel of the Vale', classId: 'bard', ancestryId: 'elf' },
      },
    ],
    encounter: {
      prompt: 'vermin in the cellar',
      difficulty: 'low',
      output: { selections: [{ monsterId: 'cat-35e-monster', count: 2 }] },
    },
  },
  {
    systemId: 'pf1e',
    party: [
      {
        prompt: 'a reckless frontline brawler',
        output: { name: 'Korga Stonefist', classId: 'barbarian', ancestryId: 'dwarf' },
      },
      {
        prompt: 'a wandering singer who keeps the party alive',
        output: { name: 'Lirel of the Vale', classId: 'bard', ancestryId: 'elf' },
      },
    ],
    encounter: {
      prompt: 'scaly little ambushers in a warren',
      difficulty: 'low',
      output: { selections: [{ monsterId: 'kobold', count: 1 }] },
    },
  },
  {
    systemId: 'pf2e',
    party: [
      {
        prompt: 'a bomb-throwing tinkerer',
        output: {
          name: 'Korga Stonefist',
          classId: 'alchemist',
          ancestryId: 'dwarf',
          backgroundId: 'pf2e-bg-acolyte',
        },
      },
      {
        prompt: 'a wandering singer who keeps the party alive',
        output: {
          name: 'Lirel of the Vale',
          classId: 'bard',
          ancestryId: 'elf',
          backgroundId: 'pf2e-bg-acrobat',
        },
      },
    ],
    encounter: {
      prompt: 'housework gone wrong',
      difficulty: 'low',
      output: { selections: [{ monsterId: 'animated-broom', count: 1 }] },
    },
  },
  {
    systemId: 'mam3e',
    party: [
      // M&M 3e exposes no class/ancestry/background pools at all (its build is
      // point-buy), so the only pool the model can draw from is power effects —
      // which the creation plan's component step cannot apply headlessly. The
      // draft is still legal; the unrouted id is reported, not hidden.
      {
        prompt: 'a street-level bruiser with a heavy punch',
        output: { name: 'Ferrocrete', spellIds: ['damage'] },
      },
      { prompt: 'an escape artist who talks too much', output: { name: 'Quickstep' } },
    ],
    encounterSkipMatch: /no cited encounter-budget model/i,
  },
  {
    systemId: 'daggerheart',
    party: [
      // Daggerheart DOES expose class/ancestry/community pools, but its guided-
      // creation plan declares no loader-driven choice steps yet, so every legal
      // id comes back unrouted. Recorded here deliberately: the flow must report
      // that honestly rather than pretend the choices applied.
      {
        prompt: 'a battlefield protector',
        output: {
          name: 'Bastion',
          classId: 'daggerheart-guardian',
          ancestryId: 'clank',
          backgroundId: 'highborne',
        },
      },
      { prompt: 'a wandering singer who keeps the party alive', output: { name: 'Refrain' } },
    ],
    encounterSkipMatch: /no cited encounter-budget model/i,
  },
];
