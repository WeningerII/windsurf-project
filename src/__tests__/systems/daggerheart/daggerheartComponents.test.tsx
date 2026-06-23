import { useState } from 'react';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { CharacterDocument } from '../../../types/core/document';
import { systemRegistry } from '../../../registry';
import { DaggerheartSystemDef } from '../../../systems/daggerheart/definition';
import type {
  DaggerheartAncestry,
  DaggerheartArmor,
  DaggerheartClass,
  DaggerheartCommunity,
  DaggerheartConsumable,
  DaggerheartDomain,
  DaggerheartDomainCard,
  DaggerheartLoot,
  DaggerheartWeapon,
} from '../../../types/daggerheart';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../../../systems/daggerheart/data-model';
import {
  useDaggerheartSheetController,
  type DaggerheartSheetController,
} from '../../../systems/daggerheart/useDaggerheartSheetController';
import { DaggerheartCharacterBasicsSection } from '../../../systems/daggerheart/components/DaggerheartCharacterBasicsSection';
import { DaggerheartNotesSection } from '../../../systems/daggerheart/components/DaggerheartNotesSection';
import { DaggerheartDomainCardsSection } from '../../../systems/daggerheart/components/DaggerheartDomainCardsSection';
import { DaggerheartEquipmentSection } from '../../../systems/daggerheart/components/DaggerheartEquipmentSection';
import { DaggerheartInventorySection } from '../../../systems/daggerheart/components/DaggerheartInventorySection';
import { DaggerheartReferenceLibrarySection } from '../../../systems/daggerheart/components/DaggerheartReferenceLibrarySection';
import { DaggerheartSheetHeader } from '../../../systems/daggerheart/components/DaggerheartSheetHeader';
import { DaggerheartSelectionOverviewSection } from '../../../systems/daggerheart/components/DaggerheartSelectionOverviewSection';

/**
 * Render/interaction coverage for the Daggerheart sheet *section* components.
 *
 * Each section takes a single `{ controller }` prop. We mount a tiny host that
 * owns the document in state, runs the real `useDaggerheartSheetController`
 * (with the SRD data loaders stubbed to deterministic fixtures), and renders
 * the target section with the live controller. The host's `onUpdate` both feeds
 * a `vi.fn()` spy (for patch assertions) and writes the next document back into
 * state — exactly like the real `DaggerheartSheet` host — so multi-keystroke
 * controlled inputs and chained interactions reflect updated state. This drives
 * the uncovered branches (empty states, add/remove rows, equip/stow flows,
 * vault/loadout moves, search filters).
 */

const SRC = 'Daggerheart SRD 1.0';
const META = {
  system: 'daggerheart' as const,
  source: SRC,
  version: '1.0' as const,
  lastUpdated: '2026-03-09',
  sourceBook: { name: 'System Reference Document 1.0', url: 'https://www.daggerheart.com/srd/' },
};

const bardClass: DaggerheartClass = {
  ...META,
  id: 'class-bard',
  name: 'Bard',
  description: 'Charismatic performers.',
  domains: ['grace', 'codex'],
  startingEvasion: 10,
  startingHitPoints: 5,
  classItems: ['A romance novel', 'A letter never opened'],
  hopeFeature: { id: 'bard-hope', name: 'Make a Scene', description: 'Spend Hope to distract.' },
  classFeatures: [{ id: 'bard-rally', name: 'Rally', description: 'Give an ally a Rally Die.' }],
  subclasses: [
    {
      id: 'troubadour',
      name: 'Troubadour',
      description: 'A musical bard.',
      spellcastTrait: 'presence',
      foundationFeatures: [{ id: 't-found', name: 'Gifted Performer', description: 'Play songs.' }],
      specializationFeatures: [],
      masteryFeatures: [],
    },
    {
      id: 'wordsmith',
      name: 'Wordsmith',
      description: 'A poetic bard.',
      foundationFeatures: [],
      specializationFeatures: [],
      masteryFeatures: [],
    },
  ],
};

const humanAncestry: DaggerheartAncestry = {
  ...META,
  id: 'ancestry-human',
  name: 'Human',
  description: 'Adaptable folk.',
  features: [
    { id: 'human-1', name: 'High Stamina', description: 'Gain an extra Stress slot.' },
    { id: 'human-2', name: 'Adaptability', description: 'Reroll a trait check once.' },
  ],
};

const wanderborneCommunity: DaggerheartCommunity = {
  ...META,
  id: 'community-wanderborne',
  name: 'Wanderborne',
  description: 'Those who travel.',
  adjectives: ['nomadic', 'curious'],
  feature: { id: 'wander-1', name: 'Nomadic Pack', description: 'Produce a useful item.' },
};

const graceDomain: DaggerheartDomain = {
  ...META,
  id: 'grace',
  name: 'Grace',
  description: 'The domain of charm.',
  classIds: ['bard'],
};
const codexDomain: DaggerheartDomain = {
  ...META,
  id: 'codex',
  name: 'Codex',
  description: 'The domain of knowledge.',
  classIds: ['bard', 'wizard'],
};

const inspirationalWords: DaggerheartDomainCard = {
  ...META,
  id: 'grace-inspirational-words',
  name: 'Inspirational Words',
  domain: 'grace',
  level: 1,
  type: 'ability',
  recallCost: 1,
  description: 'Bolster your allies.',
};
const bookOfAva: DaggerheartDomainCard = {
  ...META,
  id: 'codex-book-of-ava',
  name: 'Book of Ava',
  domain: 'codex',
  level: 1,
  type: 'spell',
  recallCost: 0,
  description: 'A grimoire of spells.',
};

const broadsword: DaggerheartWeapon = {
  ...META,
  id: 'weapon-broadsword',
  name: 'Broadsword',
  category: 'primary',
  tier: 1,
  trait: 'agility',
  range: 'Melee',
  damage: 'd8+1 phy',
  damageType: 'physical',
  burden: 1,
  feature: 'Reliable cutting edge.',
};
const greataxe: DaggerheartWeapon = {
  ...META,
  id: 'weapon-greataxe',
  name: 'Greataxe',
  category: 'primary',
  tier: 1,
  trait: 'strength',
  range: 'Melee',
  damage: 'd10+3 phy',
  damageType: 'physical',
  burden: 2,
};
const arcaneStaff: DaggerheartWeapon = {
  ...META,
  id: 'weapon-arcane-staff',
  name: 'Arcane Staff',
  category: 'primary',
  tier: 1,
  trait: 'spellcast',
  range: 'Far',
  damage: 'd6 mag',
  damageType: 'magic',
  burden: 1,
  requiresSpellcast: true,
};
const roundShield: DaggerheartWeapon = {
  ...META,
  id: 'weapon-round-shield',
  name: 'Round Shield',
  category: 'secondary',
  tier: 1,
  trait: 'strength',
  range: 'Melee',
  damage: 'd4 phy',
  damageType: 'physical',
  burden: 1,
  feature: 'Raise it for cover.',
  tags: ['shield'],
};
const dagger: DaggerheartWeapon = {
  ...META,
  id: 'weapon-dagger',
  name: 'Dagger',
  category: 'secondary',
  tier: 1,
  trait: 'finesse',
  range: 'Melee',
  damage: 'd4+1 phy',
  damageType: 'physical',
  burden: 1,
};

const chainmail: DaggerheartArmor = {
  ...META,
  id: 'armor-chainmail',
  name: 'Chainmail Armor',
  tier: 1,
  baseMajorThreshold: 7,
  baseSevereThreshold: 15,
  baseArmorScore: 4,
  feature: 'Heavy but protective.',
};

// Real SRD inventory ids so the source-backed branches resolve through
// getDaggerheartInventoryDefinition (which reads shipped data, not the mock).
const SRD_BEDROLL_ID = 'daggerheart-loot-premium-bedroll';
const SRD_STRIDE_RELIC_ID = 'daggerheart-loot-stride-relic';
const SRD_BOLSTER_RELIC_ID = 'daggerheart-loot-bolster-relic';
const SRD_HEALTH_POTION_ID = 'daggerheart-consumable-minor-health-potion';

const bedrollLoot: DaggerheartLoot = {
  ...META,
  id: SRD_BEDROLL_ID,
  name: 'Premium Bedroll',
  category: 'loot',
  description: 'During downtime, you automatically clear a Stress.',
  tags: ['rest'],
};
const healthPotion: DaggerheartConsumable = {
  ...META,
  id: SRD_HEALTH_POTION_ID,
  name: 'Minor Health Potion',
  category: 'consumable',
  maxQuantity: 5,
  description: 'Clear 1d4 Hit Points.',
};

interface LoaderFixtures {
  classes?: DaggerheartClass[];
  ancestries?: DaggerheartAncestry[];
  communities?: DaggerheartCommunity[];
  domains?: DaggerheartDomain[];
  domainCards?: DaggerheartDomainCard[];
  weapons?: DaggerheartWeapon[];
  armor?: DaggerheartArmor[];
  loot?: DaggerheartLoot[];
  consumables?: DaggerheartConsumable[];
}

const FULL_FIXTURES: Required<LoaderFixtures> = {
  classes: [bardClass],
  ancestries: [humanAncestry],
  communities: [wanderborneCommunity],
  domains: [graceDomain, codexDomain],
  domainCards: [inspirationalWords, bookOfAva],
  weapons: [broadsword, greataxe, arcaneStaff, roundShield, dagger],
  armor: [chainmail],
  loot: [bedrollLoot],
  consumables: [healthPotion],
};

vi.mock('../../../utils/dataLoader', () => ({
  loadDaggerheartClassesForSystem: vi.fn(),
  loadDaggerheartAncestriesForSystem: vi.fn(),
  loadDaggerheartCommunitiesForSystem: vi.fn(),
  loadDaggerheartDomainsForSystem: vi.fn(),
  loadDaggerheartDomainCardsForSystem: vi.fn(),
  loadDaggerheartWeaponsForSystem: vi.fn(),
  loadDaggerheartArmorForSystem: vi.fn(),
  loadDaggerheartLootForSystem: vi.fn(),
  loadDaggerheartConsumablesForSystem: vi.fn(),
}));

import * as dataLoader from '../../../utils/dataLoader';

function primeLoaders(fixtures: LoaderFixtures = FULL_FIXTURES) {
  const merged = { ...FULL_FIXTURES, ...fixtures };
  vi.mocked(dataLoader.loadDaggerheartClassesForSystem).mockResolvedValue(merged.classes);
  vi.mocked(dataLoader.loadDaggerheartAncestriesForSystem).mockResolvedValue(merged.ancestries);
  vi.mocked(dataLoader.loadDaggerheartCommunitiesForSystem).mockResolvedValue(merged.communities);
  vi.mocked(dataLoader.loadDaggerheartDomainsForSystem).mockResolvedValue(merged.domains);
  vi.mocked(dataLoader.loadDaggerheartDomainCardsForSystem).mockResolvedValue(merged.domainCards);
  vi.mocked(dataLoader.loadDaggerheartWeaponsForSystem).mockResolvedValue(merged.weapons);
  vi.mocked(dataLoader.loadDaggerheartArmorForSystem).mockResolvedValue(merged.armor);
  vi.mocked(dataLoader.loadDaggerheartLootForSystem).mockResolvedValue(merged.loot);
  vi.mocked(dataLoader.loadDaggerheartConsumablesForSystem).mockResolvedValue(merged.consumables);
}

function makeDoc(
  overrides: Partial<DaggerheartDataModel> = {},
  name = 'Hero'
): CharacterDocument<DaggerheartDataModel> {
  return {
    id: 'dh-doc',
    name,
    systemId: 'daggerheart',
    system: { ...createDefaultDaggerheartData(), ...overrides },
    createdAt: new Date('2026-03-09T00:00:00.000Z'),
    updatedAt: new Date('2026-03-09T00:00:00.000Z'),
  };
}

type SectionComponent = (props: { controller: DaggerheartSheetController }) => JSX.Element | null;

/**
 * Host that owns the document in state and runs the real controller, mirroring
 * `DaggerheartSheet`. `onUpdate` records to the spy and advances local state so
 * the section re-renders against the live controller. `readOnly` omits the
 * handler to exercise the `canUpdate === false` branches.
 */
function SectionHost({
  Section,
  initialDocument,
  onUpdate,
  readOnly,
}: {
  Section: SectionComponent;
  initialDocument: CharacterDocument<DaggerheartDataModel>;
  onUpdate?: ReturnType<typeof vi.fn>;
  readOnly?: boolean;
}) {
  const [document, setDocument] = useState(initialDocument);
  const notifyUpdate = onUpdate as
    | ((doc: CharacterDocument<DaggerheartDataModel>) => void)
    | undefined;
  const handleUpdate = readOnly
    ? undefined
    : (next: CharacterDocument<DaggerheartDataModel>) => {
        notifyUpdate?.(next);
        setDocument(next as CharacterDocument<DaggerheartDataModel>);
      };
  const controller = useDaggerheartSheetController({
    document,
    onUpdate: handleUpdate as never,
  });
  return <Section controller={controller} />;
}

/**
 * Mount a section through {@link SectionHost} and settle the async SRD loaders
 * so `optionsState` reaches `ready`. Returns the render result plus the
 * `onUpdate` spy.
 */
async function renderSection(
  Section: SectionComponent,
  options: {
    document?: CharacterDocument<DaggerheartDataModel>;
    onUpdate?: ReturnType<typeof vi.fn> | null;
    fixtures?: LoaderFixtures;
  } = {}
) {
  primeLoaders(options.fixtures);
  const document = options.document ?? makeDoc();
  const readOnly = options.onUpdate === null;
  const onUpdate = readOnly ? vi.fn() : (options.onUpdate ?? vi.fn());

  const view = render(
    <SectionHost
      Section={Section}
      initialDocument={document}
      onUpdate={onUpdate}
      readOnly={readOnly}
    />
  );
  // Settle the resource-loading effect so optionsState flips to 'ready'.
  await act(async () => {});

  return { onUpdate, view };
}

function lastPatch(onUpdate: ReturnType<typeof vi.fn>) {
  const doc = onUpdate.mock.calls.at(-1)![0] as CharacterDocument<DaggerheartDataModel>;
  return doc.system;
}

/**
 * Overwrite a controlled `<input type="number">` in one shot. `clear` + `type`
 * is unreliable here: the empty-string intermediate falls back to the previous
 * value via `parseNum`, so digits append instead of replacing.
 */
function setNumber(input: HTMLElement, value: string) {
  fireEvent.change(input, { target: { value } });
}

beforeAll(() => {
  // The attribute DiceRollButton resolves the engine from the registry; register
  // the real Daggerheart definition so rollCheck runs instead of throwing.
  systemRegistry.register(DaggerheartSystemDef);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('DaggerheartNotesSection', () => {
  it('renders existing notes and commits edits through the controller', async () => {
    const { onUpdate } = await renderSection(DaggerheartNotesSection, {
      document: makeDoc({ notes: 'Session 1 recap' }),
    });

    const textarea = screen.getByPlaceholderText('Campaign notes, session log...');
    expect(textarea).toHaveValue('Session 1 recap');

    const user = userEvent.setup();
    await user.type(textarea, '!');

    expect(onUpdate).toHaveBeenCalled();
    expect(lastPatch(onUpdate).notes).toBe('Session 1 recap!');
  });

  it('disables the notes textarea when the sheet is read-only', async () => {
    await renderSection(DaggerheartNotesSection, { document: makeDoc(), onUpdate: null });
    expect(screen.getByPlaceholderText('Campaign notes, session log...')).toBeDisabled();
  });
});

describe('DaggerheartCharacterBasicsSection', () => {
  it('edits an attribute and persists the single-field patch', async () => {
    const { onUpdate } = await renderSection(DaggerheartCharacterBasicsSection);

    setNumber(screen.getByTitle('Agility modifier'), '2');

    expect(onUpdate).toHaveBeenCalled();
    expect(lastPatch(onUpdate).attributes.agility).toBe(2);
  });

  it('rolls an attribute check through the registered engine', async () => {
    await renderSection(DaggerheartCharacterBasicsSection);
    const user = userEvent.setup();

    // Each attribute renders a dice button wired to the engine. DiceRollButton
    // builds the title as "Roll <label>", so passing the bare trait label yields
    // "Roll Strength".
    await user.click(screen.getByTitle('Roll Strength'));

    // The engine's 2d12 result surfaces inline (no "Roll failed" error).
    expect(await screen.findByText(/2d12/)).toBeInTheDocument();
    expect(screen.queryByText('Roll failed')).not.toBeInTheDocument();
  });

  it('adds, edits, and removes experiences', async () => {
    const { onUpdate } = await renderSection(DaggerheartCharacterBasicsSection, {
      document: makeDoc({ experiences: ['Sailor'] }),
    });

    const user = userEvent.setup();
    // Edit the existing experience (live state accumulates the keystroke).
    await user.type(screen.getByDisplayValue('Sailor'), 's');
    expect(lastPatch(onUpdate).experiences).toEqual(['Sailors']);

    // Add a new (empty) experience row.
    await user.click(screen.getByRole('button', { name: /Add Experience/ }));
    expect(lastPatch(onUpdate).experiences).toEqual(['Sailors', '']);
    expect(screen.getAllByTitle('Remove experience')).toHaveLength(2);

    // Remove the first experience; only the empty row remains.
    await user.click(screen.getAllByTitle('Remove experience')[0]);
    expect(lastPatch(onUpdate).experiences).toEqual(['']);
    expect(screen.getAllByTitle('Remove experience')).toHaveLength(1);
  });

  it('shows the empty-experiences hint and hides add controls in read-only mode', async () => {
    await renderSection(DaggerheartCharacterBasicsSection, {
      document: makeDoc({ experiences: [] }),
      onUpdate: null,
    });

    expect(screen.getByText('No experiences listed.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Add Experience/ })).not.toBeInTheDocument();
    expect(screen.getByTitle('Agility modifier')).toBeDisabled();
  });

  it('renders an Effective badge when a relic boosts a trait', async () => {
    // Carrying the Stride Relic grants +1 Agility, so the effective value
    // diverges from the stored attribute and the badge is shown.
    await renderSection(DaggerheartCharacterBasicsSection, {
      document: makeDoc({
        attributes: {
          agility: 1,
          strength: 0,
          finesse: 0,
          instinct: 0,
          presence: 0,
          knowledge: 0,
        },
        inventory: [
          { itemId: SRD_STRIDE_RELIC_ID, name: 'Stride Relic', quantity: 1, description: '' },
        ],
      }),
    });

    expect(screen.getByText(/Effective \+2/)).toBeInTheDocument();
  });
});

describe('DaggerheartSheetHeader', () => {
  it('renames the character and edits the resource pools', async () => {
    const { onUpdate } = await renderSection(DaggerheartSheetHeader, {
      document: makeDoc({}, 'Old Name'),
    });
    const user = userEvent.setup();

    const nameInput = screen.getByPlaceholderText('Character Name');
    expect(nameInput).toHaveValue('Old Name');
    await user.type(nameInput, '!');
    expect(onUpdate.mock.calls.at(-1)![0].name).toBe('Old Name!');

    // Level edit routes through update().
    setNumber(screen.getByTitle('Character level'), '3');
    expect(lastPatch(onUpdate).level).toBe(3);

    // HP / Stress / Armor / Hope nested-object edits.
    setNumber(screen.getByTitle('Current HP'), '4');
    expect(lastPatch(onUpdate).hitPoints.current).toBe(4);

    setNumber(screen.getByTitle('Current Stress'), '2');
    expect(lastPatch(onUpdate).stress.current).toBe(2);

    setNumber(screen.getByTitle('Current Armor'), '1');
    expect(lastPatch(onUpdate).armor.current).toBe(1);

    setNumber(screen.getByTitle('Hope tokens'), '5');
    expect(lastPatch(onUpdate).hope).toBe(5);
  });

  it('selects a class and surfaces the SRD start summary plus subclass options', async () => {
    const { onUpdate } = await renderSection(DaggerheartSheetHeader, {
      document: makeDoc({ class: 'Bard', subclass: '' }),
    });
    const user = userEvent.setup();

    // SRD start badge appears for the resolved class.
    expect(screen.getByText(/SRD start: Evasion 10, HP 5/)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Troubadour' })).toBeInTheDocument();

    // Choosing a subclass commits a plain { subclass } patch.
    await user.selectOptions(screen.getByTitle('Subclass'), 'Troubadour');
    expect(lastPatch(onUpdate).subclass).toBe('Troubadour');
  });

  it('keeps manual/unresolved selections editable with a warning banner', async () => {
    await renderSection(DaggerheartSheetHeader, {
      document: makeDoc({
        class: 'Homebrew Class',
        subclass: 'Homebrew Subclass',
        heritage: 'Homebrew Ancestry',
        community: 'Homebrew Community',
      }),
    });

    expect(screen.getByText(/Manual or unresolved selections remain editable/)).toBeInTheDocument();
    expect(screen.getByText('Class: Homebrew Class')).toBeInTheDocument();
    expect(screen.getByText('Ancestry: Homebrew Ancestry')).toBeInTheDocument();
    // Manual options are injected so the select keeps the unknown value.
    expect(screen.getByRole('option', { name: 'Homebrew Class (manual)' })).toBeInTheDocument();
  });

  it('renders the SRD load error message when the catalog fails', async () => {
    primeLoaders();
    vi.mocked(dataLoader.loadDaggerheartClassesForSystem).mockRejectedValue(new Error('boom'));

    const onUpdate = vi.fn();
    const hook = renderHook(() => useDaggerheartSheetController({ document: makeDoc(), onUpdate }));
    await act(async () => {});
    await waitFor(() => expect(hook.result.current.optionsState).toBe('error'));

    render(<DaggerheartSheetHeader controller={hook.result.current} />);
    expect(screen.getByText(/Failed to load Daggerheart SRD reference data/)).toBeInTheDocument();
  });
});

describe('DaggerheartSelectionOverviewSection', () => {
  it('returns null when nothing is selected', async () => {
    const { view } = await renderSection(DaggerheartSelectionOverviewSection, {
      document: makeDoc(),
    });
    expect(view.container).toBeEmptyDOMElement();
  });

  it('renders class, subclass, ancestry, and community detail cards', async () => {
    await renderSection(DaggerheartSelectionOverviewSection, {
      document: makeDoc({
        class: 'Bard',
        subclass: 'Troubadour',
        heritage: 'Human',
        community: 'Wanderborne',
      }),
    });

    expect(screen.getByRole('heading', { name: 'Bard' })).toBeInTheDocument();
    expect(screen.getByText('Starting Evasion')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Troubadour' })).toBeInTheDocument();
    // Troubadour declares a spellcast trait -> warning badge rendered.
    expect(screen.getByText(/Spellcast Trait: presence/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Human' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Wanderborne' })).toBeInTheDocument();
    expect(screen.getByText('nomadic, curious')).toBeInTheDocument();
  });
});

describe('DaggerheartReferenceLibrarySection', () => {
  it('renders nothing until the catalog is ready', async () => {
    const onUpdate = vi.fn();
    primeLoaders();
    const hook = renderHook(() => useDaggerheartSheetController({ document: makeDoc(), onUpdate }));
    // optionsState is still 'loading' on the first synchronous render.
    expect(hook.result.current.optionsState).toBe('loading');
    const { container } = render(
      <DaggerheartReferenceLibrarySection controller={hook.result.current} />
    );
    expect(container).toBeEmptyDOMElement();
    // Settle the loading effect so its state update stays inside act().
    await act(async () => {});
  });

  it('applies a class entry from the class library tab', async () => {
    const { onUpdate } = await renderSection(DaggerheartReferenceLibrarySection);
    const user = userEvent.setup();

    expect(screen.getByText(/SRD entries/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Apply Bard' }));

    expect(onUpdate).toHaveBeenCalled();
    expect(lastPatch(onUpdate).class).toBe('Bard');
  });

  it('shows an Applied label for the already-selected community', async () => {
    await renderSection(DaggerheartReferenceLibrarySection, {
      document: makeDoc({ community: 'Wanderborne' }),
    });
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: 'Community Library' }));

    expect(screen.getByRole('button', { name: 'Wanderborne Applied' })).toBeInTheDocument();
  });
});

describe('DaggerheartDomainCardsSection', () => {
  it('shows empty loadout/vault states and the unfiltered library hint', async () => {
    await renderSection(DaggerheartDomainCardsSection, { document: makeDoc({ level: 1 }) });

    expect(
      screen.getByText('No active domain cards yet. Add cards from the library tab.')
    ).toBeInTheDocument();
  });

  it('adds a library card to the loadout', async () => {
    const { onUpdate } = await renderSection(DaggerheartDomainCardsSection, {
      document: makeDoc({ class: 'Bard', level: 5 }),
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Card Library' }));
    // Class-scoped library shows the Grace card.
    const loadoutButtons = screen.getAllByRole('button', { name: 'Add to Loadout' });
    await user.click(loadoutButtons[0]);

    expect(onUpdate).toHaveBeenCalled();
    const cards = lastPatch(onUpdate).domainCards;
    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({ cardId: 'grace-inspirational-words', location: 'loadout' });
  });

  it('adds a library card straight to the vault', async () => {
    const { onUpdate } = await renderSection(DaggerheartDomainCardsSection, {
      document: makeDoc({ class: 'Bard', level: 5 }),
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Card Library' }));
    await user.click(screen.getAllByRole('button', { name: 'Add to Vault' })[0]);

    const cards = lastPatch(onUpdate).domainCards;
    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({ cardId: 'grace-inspirational-words', location: 'vault' });
  });

  it('moves an owned card to the vault and removes it', async () => {
    const { onUpdate } = await renderSection(DaggerheartDomainCardsSection, {
      document: makeDoc({
        class: 'Bard',
        level: 5,
        domainCards: [
          {
            id: 'grace-inspirational-words',
            cardId: 'grace-inspirational-words',
            name: 'Inspirational Words',
            domain: 'grace',
            level: 1,
            type: 'ability',
            recallCost: 1,
            location: 'loadout',
            description: 'Bolster your allies.',
          },
        ],
      }),
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Move to Vault' }));
    expect(lastPatch(onUpdate).domainCards[0].location).toBe('vault');
    // Live state moves the card out of the loadout tab into the vault.
    expect(
      screen.getByText('No active domain cards yet. Add cards from the library tab.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Vault' }));
    await user.click(screen.getByTitle('Remove domain card'));
    expect(lastPatch(onUpdate).domainCards).toEqual([]);
  });

  it('edits a legacy (non-SRD) card inline', async () => {
    const { onUpdate } = await renderSection(DaggerheartDomainCardsSection, {
      document: makeDoc({
        class: 'Bard',
        level: 5,
        domainCards: [
          {
            id: 'legacy-1',
            name: 'Homebrew Card',
            domain: 'grace',
            level: 1,
            location: 'loadout',
            description: 'Old description',
          },
        ],
      }),
    });
    const user = userEvent.setup();

    // Legacy badge + editable name field (no SRD definition matches).
    expect(screen.getAllByText('Legacy').length).toBeGreaterThan(0);
    const nameField = screen.getByDisplayValue('Homebrew Card');
    await user.type(nameField, '!');
    expect(lastPatch(onUpdate).domainCards[0].name).toBe('Homebrew Card!');

    const descField = screen.getByDisplayValue('Old description');
    await user.type(descField, '.');
    expect(lastPatch(onUpdate).domainCards[0].description).toBe('Old description.');
  });

  it('renders a legacy card read-only with a fallback domain label', async () => {
    await renderSection(DaggerheartDomainCardsSection, {
      onUpdate: null,
      document: makeDoc({
        class: 'Bard',
        level: 5,
        domainCards: [
          {
            id: 'legacy-2',
            name: 'Ancient Whisper',
            // Domain not present in domainOptions -> fallback label path.
            domain: 'mystery',
            level: 2,
            location: 'loadout',
            description: 'A forgotten technique.',
          },
        ],
      }),
    });

    // Read-only legacy cards render the structured (non-editable) layout with
    // the Legacy badge and the raw domain value as its label.
    expect(screen.getByRole('heading', { name: 'Ancient Whisper' })).toBeInTheDocument();
    expect(screen.getByText('Legacy')).toBeInTheDocument();
    expect(screen.getByText('mystery')).toBeInTheDocument();
    // No editable name input in read-only mode.
    expect(screen.queryByDisplayValue('Ancient Whisper')).not.toBeInTheDocument();
  });

  it('filters the card library by search and shows the no-match hint', async () => {
    await renderSection(DaggerheartDomainCardsSection, {
      document: makeDoc({ class: 'Bard', level: 5 }),
    });
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: 'Card Library' }));
    // The Grace card is visible before filtering.
    expect(screen.getByRole('heading', { name: 'Inspirational Words' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Search Daggerheart domain cards'), 'zzz-nonexistent');

    expect(
      await screen.findByText('No SRD domain cards match the current filters.')
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Inspirational Words' })).not.toBeInTheDocument();
  });
});

describe('DaggerheartEquipmentSection', () => {
  it('renders empty weapon/armor cards when nothing is equipped', async () => {
    await renderSection(DaggerheartEquipmentSection, { document: makeDoc() });

    expect(screen.getByText('Choose a primary weapon from the library.')).toBeInTheDocument();
    expect(screen.getByText('Choose a secondary weapon from the library.')).toBeInTheDocument();
    expect(
      screen.getByText('Unarmored thresholds are derived from level only.')
    ).toBeInTheDocument();
  });

  it('equips a primary weapon from the library', async () => {
    const { onUpdate } = await renderSection(DaggerheartEquipmentSection, {
      document: makeDoc(),
    });
    const user = userEvent.setup();

    // The first Primary Library card is the broadsword.
    const buttons = screen.getAllByRole('button', { name: 'Equip Primary' });
    await user.click(buttons[0]);
    expect(lastPatch(onUpdate).weapons.primaryId).toBe('weapon-broadsword');
  });

  it('marks an equipped spellcast weapon with a Spellcast badge', async () => {
    await renderSection(DaggerheartEquipmentSection, {
      document: makeDoc({
        weapons: { primaryId: 'weapon-arcane-staff', secondaryId: '', inventoryIds: [] },
      }),
    });

    // The active primary card (first occurrence, in the loadout grid) surfaces
    // the requiresSpellcast badge alongside the "Primary Weapon" label.
    const activeCard = screen
      .getAllByRole('heading', { name: 'Arcane Staff' })[0]
      .closest('article')!;
    expect(within(activeCard).getByText('Primary Weapon')).toBeInTheDocument();
    expect(within(activeCard).getByText('Spellcast')).toBeInTheDocument();
  });

  it('stows an equipped primary weapon from its active card', async () => {
    const { onUpdate } = await renderSection(DaggerheartEquipmentSection, {
      document: makeDoc({
        weapons: { primaryId: 'weapon-broadsword', secondaryId: '', inventoryIds: [] },
      }),
    });
    const user = userEvent.setup();

    // The active primary card renders a Stow control (inventory has room).
    await user.click(screen.getByRole('button', { name: 'Stow' }));
    expect(lastPatch(onUpdate).weapons.inventoryIds).toContain('weapon-broadsword');
    // Stowing clears the primary slot.
    expect(lastPatch(onUpdate).weapons.primaryId).toBe('');
  });

  it('stows an equipped secondary weapon from its active card', async () => {
    const { onUpdate } = await renderSection(DaggerheartEquipmentSection, {
      document: makeDoc({
        weapons: { primaryId: '', secondaryId: 'weapon-dagger', inventoryIds: [] },
      }),
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Stow' }));
    expect(lastPatch(onUpdate).weapons.inventoryIds).toContain('weapon-dagger');
    expect(lastPatch(onUpdate).weapons.secondaryId).toBe('');
  });

  it('clears an equipped primary weapon from its active card', async () => {
    const { onUpdate } = await renderSection(DaggerheartEquipmentSection, {
      document: makeDoc({
        weapons: { primaryId: 'weapon-broadsword', secondaryId: '', inventoryIds: [] },
      }),
    });
    const user = userEvent.setup();

    await user.click(screen.getByTitle('Clear primary weapon'));
    expect(lastPatch(onUpdate).weapons.primaryId).toBe('');
  });

  it('equips a stowed primary weapon then removes the remaining stowed weapon', async () => {
    const { onUpdate } = await renderSection(DaggerheartEquipmentSection, {
      document: makeDoc({
        weapons: {
          primaryId: '',
          secondaryId: '',
          inventoryIds: ['weapon-broadsword', 'weapon-dagger'],
        },
      }),
    });
    const user = userEvent.setup();

    // Inventory Weapons block lists both stowed weapons with category actions.
    expect(screen.getByText('Inventory Weapons')).toBeInTheDocument();

    // Equip the stowed broadsword as primary (leaves the inventory list).
    const stowSection = screen.getByText('Inventory Weapons').closest('div')!.parentElement!;
    await user.click(within(stowSection).getByRole('button', { name: 'Equip Primary' }));
    expect(lastPatch(onUpdate).weapons.primaryId).toBe('weapon-broadsword');
    expect(lastPatch(onUpdate).weapons.inventoryIds).not.toContain('weapon-broadsword');

    // The dagger is still stowed; remove it via its X control.
    await user.click(screen.getByTitle('Remove stowed weapon'));
    expect(lastPatch(onUpdate).weapons.inventoryIds).not.toContain('weapon-dagger');
  });

  it('equips a stowed secondary weapon', async () => {
    const { onUpdate } = await renderSection(DaggerheartEquipmentSection, {
      document: makeDoc({
        weapons: { primaryId: '', secondaryId: '', inventoryIds: ['weapon-dagger'] },
      }),
    });
    const user = userEvent.setup();

    const stowSection = screen.getByText('Inventory Weapons').closest('div')!.parentElement!;
    await user.click(within(stowSection).getByRole('button', { name: 'Equip Secondary' }));
    expect(lastPatch(onUpdate).weapons.secondaryId).toBe('weapon-dagger');
  });

  it('equips a secondary weapon from the library and then clears it', async () => {
    const { onUpdate } = await renderSection(DaggerheartEquipmentSection, {
      document: makeDoc(),
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Secondary Library' }));
    // Round Shield is the first secondary library entry.
    await user.click(screen.getAllByRole('button', { name: 'Equip Secondary' })[0]);
    expect(lastPatch(onUpdate).weapons.secondaryId).toBe('weapon-round-shield');

    // Live state now renders the active secondary card with a clear control.
    await user.click(await screen.findByTitle('Clear secondary weapon'));
    expect(lastPatch(onUpdate).weapons.secondaryId).toBe('');
  });

  it('equips and unequips armor', async () => {
    const { onUpdate } = await renderSection(DaggerheartEquipmentSection, {
      document: makeDoc(),
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Armor Library' }));
    await user.click(screen.getByRole('button', { name: 'Equip Armor' }));
    expect(lastPatch(onUpdate).armorId).toBe('armor-chainmail');

    // Live state renders the active armor card; unequip it.
    await user.click(await screen.findByTitle('Unequip armor'));
    expect(lastPatch(onUpdate).armorId).toBe('');
  });

  it('filters the primary weapon library by search', async () => {
    await renderSection(DaggerheartEquipmentSection, { document: makeDoc() });
    const user = userEvent.setup();

    expect(screen.getByRole('heading', { name: 'Broadsword' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Search Daggerheart weapons'), 'greataxe');

    // Only the greataxe primary remains in the filtered list.
    expect(await screen.findByRole('heading', { name: 'Greataxe' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Broadsword' })).not.toBeInTheDocument();
  });

  it('filters the secondary weapon library by search', async () => {
    await renderSection(DaggerheartEquipmentSection, { document: makeDoc() });
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Secondary Library' }));
    expect(screen.getByRole('heading', { name: 'Round Shield' })).toBeInTheDocument();
    // The secondary tab has its own search input wired to setWeaponSearch.
    await user.type(screen.getByLabelText('Search Daggerheart secondary weapons'), 'dagger');

    expect(await screen.findByRole('heading', { name: 'Dagger' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Round Shield' })).not.toBeInTheDocument();
  });

  it('filters the armor library by search', async () => {
    await renderSection(DaggerheartEquipmentSection, {
      document: makeDoc(),
      fixtures: {
        armor: [
          chainmail,
          {
            ...chainmail,
            id: 'armor-leather',
            name: 'Leather Armor',
            baseArmorScore: 3,
          },
        ],
      },
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Armor Library' }));
    expect(screen.getByRole('heading', { name: 'Chainmail Armor' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Search Daggerheart armor'), 'leather');

    expect(await screen.findByRole('heading', { name: 'Leather Armor' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Chainmail Armor' })).not.toBeInTheDocument();
  });

  it('stows a primary weapon from the library tab', async () => {
    const { onUpdate } = await renderSection(DaggerheartEquipmentSection, {
      document: makeDoc(),
    });
    const user = userEvent.setup();

    // Primary Library is the default tab; stow the first listed weapon.
    await user.click(screen.getAllByRole('button', { name: 'Stow Weapon' })[0]);
    expect(lastPatch(onUpdate).weapons.inventoryIds).toContain('weapon-broadsword');
  });

  it('stows a secondary weapon from the library tab', async () => {
    const { onUpdate } = await renderSection(DaggerheartEquipmentSection, {
      document: makeDoc(),
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Secondary Library' }));
    await user.click(screen.getAllByRole('button', { name: 'Stow Weapon' })[0]);
    expect(lastPatch(onUpdate).weapons.inventoryIds).toContain('weapon-round-shield');
  });

  it('returns null when the catalog is not ready', async () => {
    primeLoaders();
    const onUpdate = vi.fn();
    const hook = renderHook(() => useDaggerheartSheetController({ document: makeDoc(), onUpdate }));
    const { container } = render(<DaggerheartEquipmentSection controller={hook.result.current} />);
    expect(container).toBeEmptyDOMElement();
    // Settle the loading effect so its state update stays inside act().
    await act(async () => {});
  });
});

describe('DaggerheartInventorySection', () => {
  it('shows the empty-inventory hint and adds a custom item', async () => {
    const { onUpdate } = await renderSection(DaggerheartInventorySection, {
      document: makeDoc({ inventory: [] }),
    });
    const user = userEvent.setup();

    expect(screen.getByText(/No inventory recorded yet/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Add Custom Item/ }));
    const next = lastPatch(onUpdate).inventory;
    expect(next).toHaveLength(1);
    expect(next[0]).toMatchObject({ name: '', quantity: 1 });
  });

  it('edits gold through the currency editor', async () => {
    const { onUpdate } = await renderSection(DaggerheartInventorySection, {
      document: makeDoc({ inventory: [], currency: { handfuls: 0, bags: 0, chests: 0 } }),
    });

    // The Daggerheart currency editor exposes Handfuls/Bags/Chests fields.
    setNumber(screen.getByTitle('Handfuls'), '5');
    expect(lastPatch(onUpdate).currency.handfuls).toBe(5);
  });

  it('edits a custom inventory entry name, quantity, description, and removes it', async () => {
    const { onUpdate } = await renderSection(DaggerheartInventorySection, {
      document: makeDoc({
        inventory: [{ itemId: 'custom-item:1', name: 'Rope', quantity: 1, description: 'Hemp' }],
      }),
    });
    const user = userEvent.setup();

    // Quantity first: the field's title embeds the (still original) name.
    setNumber(screen.getByTitle('Rope quantity'), '3');
    expect(lastPatch(onUpdate).inventory[0].quantity).toBe(3);

    const description = screen.getByPlaceholderText('Item description...');
    await user.type(description, '.');
    expect(lastPatch(onUpdate).inventory[0].description).toBe('Hemp.');

    const nameInput = screen.getByPlaceholderText('Item name');
    await user.type(nameInput, '!');
    expect(lastPatch(onUpdate).inventory[0].name).toBe('Rope!');

    await user.click(screen.getByTitle('Remove inventory item'));
    expect(lastPatch(onUpdate).inventory).toEqual([]);
  });

  it('renders a source-backed consumable entry and uses one', async () => {
    const { onUpdate } = await renderSection(DaggerheartInventorySection, {
      document: makeDoc({
        inventory: [
          {
            itemId: SRD_HEALTH_POTION_ID,
            name: 'Minor Health Potion',
            quantity: 2,
            description: '',
          },
        ],
      }),
    });
    const user = userEvent.setup();

    // Source-backed entries show the definition name as a heading (not an input).
    expect(screen.getByRole('heading', { name: 'Minor Health Potion' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Use One' }));
    expect(lastPatch(onUpdate).inventory[0].quantity).toBe(1);
  });

  it('warns when more than one relic is carried', async () => {
    await renderSection(DaggerheartInventorySection, {
      document: makeDoc({
        inventory: [
          { itemId: SRD_STRIDE_RELIC_ID, name: 'Stride Relic', quantity: 1, description: '' },
          { itemId: SRD_BOLSTER_RELIC_ID, name: 'Bolster Relic', quantity: 1, description: '' },
        ],
      }),
    });

    expect(screen.getByText(/Multiple relics are recorded in inventory/)).toBeInTheDocument();
  });

  it('adds an SRD loot definition from the loot library and filters the list', async () => {
    const { onUpdate } = await renderSection(DaggerheartInventorySection, {
      document: makeDoc({ inventory: [] }),
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Loot Library' }));
    const lootCard = screen.getByText('Premium Bedroll').closest('article')!;
    await user.click(within(lootCard).getByRole('button', { name: 'Add to Inventory' }));
    expect(lastPatch(onUpdate).inventory[0].itemId).toBe(SRD_BEDROLL_ID);

    await user.type(screen.getByLabelText('Search Daggerheart loot'), 'zzz-none');
    expect(await screen.findByText('No SRD loot matches the current search.')).toBeInTheDocument();
  });

  it('shows the no-match hint for consumables search', async () => {
    await renderSection(DaggerheartInventorySection, { document: makeDoc({ inventory: [] }) });
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Consumables' }));
    expect(screen.getByText('Minor Health Potion')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Search Daggerheart consumables'), 'zzz-none');
    expect(
      await screen.findByText('No SRD consumables match the current search.')
    ).toBeInTheDocument();
  });
});
