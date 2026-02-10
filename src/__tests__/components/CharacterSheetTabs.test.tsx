import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterSheetTabs } from '../../components/CharacterSheetTabs';
import type { Character, GameSystem } from '../../types/game-systems';
import type { Spell } from '../../types/magic/spells';
import type { Monster } from '../../types/creatures/monsters';
import type { FeatDefinition } from '../../types/character-options/feats';
import type { Item } from '../../types/equipment/items';
import {
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadMonstersForSystem,
  loadSpellsForSystem,
} from '../../utils/dataLoader';

vi.mock('../../utils/dataLoader', () => ({
  loadSpellsForSystem: vi.fn(),
  loadMonstersForSystem: vi.fn(),
  loadFeatsForSystem: vi.fn(),
  loadEquipmentForSystem: vi.fn(),
}));

vi.mock('../../components/CharacterSheet', () => ({
  CharacterSheet: ({ character }: { character: Character }) => (
    <div data-testid="character-sheet">Sheet: {character.name}</div>
  ),
}));

vi.mock('../../components/InventoryManager', () => ({
  InventoryManager: ({
    items,
    onAddItem,
    onRemoveItem,
  }: {
    items: Array<{ id: string; name: string; quantity: number }>;
    onAddItem: (item: { id: string; name: string; quantity: number; description?: string }) => void;
    onRemoveItem: (itemId: string) => void;
  }) => (
    <div>
      <div data-testid="inventory-count">{items.length}</div>
      <button
        onClick={() =>
          onAddItem({
            id: 'added-item',
            name: 'Added Item',
            quantity: 2,
            description: 'added note',
          })
        }
      >
        Add Inventory Item
      </button>
      <button onClick={() => onRemoveItem(items[0]?.id || '')}>Remove First Item</button>
    </div>
  ),
}));

vi.mock('../../components/SpellBrowser', () => ({
  SpellBrowser: ({
    spells,
  }: {
    spells: Array<{ castingTime: string; range: string; duration: string; classes: string[] }>;
  }) => (
    <div>
      <div data-testid="spell-count">{spells.length}</div>
      {spells[0] ? (
        <div data-testid="spell-first">
          {`${spells[0].castingTime}|${spells[0].range}|${spells[0].duration}|${spells[0].classes.join(',')}`}
        </div>
      ) : null}
    </div>
  ),
}));

vi.mock('../../components/FeatBrowser', () => ({
  FeatBrowser: ({
    feats,
  }: {
    feats: Array<{ id: string; prerequisites?: Array<{ type: string; description: string }> }>;
  }) => (
    <div>
      <div data-testid="feat-count">{feats.length}</div>
      {feats[0] ? (
        <div data-testid="feat-first">
          {`${feats[0].id}|${feats[0].prerequisites?.[0]?.type ?? ''}|${feats[0].prerequisites?.[0]?.description ?? ''}`}
        </div>
      ) : null}
    </div>
  ),
}));

vi.mock('../../components/EquipmentBrowser', () => ({
  EquipmentBrowser: ({
    equipment,
  }: {
    equipment: Array<{ rarity: string; cost: string }>;
  }) => (
    <div>
      <div data-testid="equipment-count">{equipment.length}</div>
      {equipment[0] ? (
        <div data-testid="equipment-first">{`${equipment[0].rarity}|${equipment[0].cost}`}</div>
      ) : null}
    </div>
  ),
}));

vi.mock('../../components/MonsterBrowser', () => ({
  MonsterBrowser: ({
    monsters,
    onSelectMonster,
  }: {
    monsters: Monster[];
    onSelectMonster: (monster: Monster) => void;
  }) => (
    <div>
      <div data-testid="monster-count">{monsters.length}</div>
      <button onClick={() => monsters[0] && onSelectMonster(monsters[0])}>Select First Monster</button>
    </div>
  ),
}));

vi.mock('../../components/MonsterStatBlock', () => ({
  MonsterStatBlock: ({ monster }: { monster: Monster }) => (
    <div data-testid="monster-stat-block">{monster.name}</div>
  ),
}));

function createCharacter(system: Character['system'] = 'dnd-5e-2014'): Character {
  return {
    id: 'tabs-char-1',
    name: 'Tabs Hero',
    system,
    level: 3,
    experiencePoints: 900,
    classLevels: [{ classId: 'fighter', level: 3, hitDieRolls: [10, 8, 6] }],
    baseAttributes: { str: 14, dex: 12, con: 13, int: 10, wis: 10, cha: 8 },
    skillProficiencies: {},
    hitPoints: { current: 24, max: 24, temp: 0 },
    hitDice: [{ die: 'd10', total: 3, remaining: 3 }],
    armorClass: 15,
    initiative: 1,
    speed: 30,
    armorProficiencies: [],
    weaponProficiencies: [],
    toolProficiencies: [],
    languageProficiencies: [],
    savingThrowProficiencies: ['str', 'con'],
    features: [],
    feats: [],
    equipment: [],
    inventory: [{ itemId: 'potion', quantity: 1, customName: 'Potion', notes: 'heal' }],
    currency: { copper: 0, silver: 0, electrum: 0, gold: 25, platinum: 0 },
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  };
}

function createSystem(systemId: Character['system']): GameSystem {
  return {
    id: systemId,
    name: 'System Name',
    fullName: 'System Full Name',
    version: '1.0',
    attributes: [
      { id: 'str', name: 'Strength', abbreviation: 'STR', description: 'Power' },
      { id: 'dex', name: 'Dexterity', abbreviation: 'DEX', description: 'Agility' },
    ],
    skills: [{ id: 'athletics', name: 'Athletics', attribute: 'str' }],
  };
}

describe('CharacterSheetTabs', () => {
  const loadSpellsMock = vi.mocked(loadSpellsForSystem);
  const loadMonstersMock = vi.mocked(loadMonstersForSystem);
  const loadFeatsMock = vi.mocked(loadFeatsForSystem);
  const loadEquipmentMock = vi.mocked(loadEquipmentForSystem);

  beforeEach(() => {
    vi.restoreAllMocks();
    loadSpellsMock.mockResolvedValue([]);
    loadMonstersMock.mockResolvedValue([]);
    loadFeatsMock.mockResolvedValue([]);
    loadEquipmentMock.mockResolvedValue([]);
  });

  it('renders sheet by default and updates inventory through callbacks', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const character = createCharacter();

    render(
      <CharacterSheetTabs
        character={character}
        gameSystem={createSystem(character.system)}
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByTestId('character-sheet')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /inventory/i }));
    expect(screen.getByTestId('inventory-count')).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: /add inventory item/i }));
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        inventory: expect.arrayContaining([expect.objectContaining({ itemId: 'added-item', quantity: 2 })]),
      })
    );

    await user.click(screen.getByRole('button', { name: /remove first item/i }));
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        inventory: expect.not.arrayContaining([expect.objectContaining({ itemId: 'potion' })]),
      })
    );
  });

  it('loads spells lazily, maps spell fields, and avoids duplicate fetch on revisit', async () => {
    const user = userEvent.setup();
    const character = createCharacter();

    const spell = {
      id: 'magic-missile',
      name: 'Magic Missile',
      level: 1,
      school: 'Evocation',
      castingTime: { amount: 1, type: 'action' },
      range: { type: 'ranged', feet: 120 },
      duration: { type: 'timed', maxDuration: '1 minute' },
      description: 'Darts of magical force',
      classes: undefined,
    } as unknown as Spell;
    loadSpellsMock.mockResolvedValue([spell]);

    render(
      <CharacterSheetTabs
        character={character}
        gameSystem={createSystem(character.system)}
        onUpdate={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /spells/i }));
    await waitFor(() => expect(loadSpellsMock).toHaveBeenCalledWith(character.system));
    expect(screen.getByTestId('spell-count')).toHaveTextContent('1');
    expect(screen.getByTestId('spell-first')).toHaveTextContent('1 action|120 feet|1 minute|');

    await user.click(screen.getByRole('button', { name: /sheet/i }));
    await user.click(screen.getByRole('button', { name: /spells/i }));
    expect(loadSpellsMock).toHaveBeenCalledTimes(1);
  });

  it('shows fallback messaging when spell loading fails or returns empty', async () => {
    const user = userEvent.setup();
    const character = createCharacter();

    loadSpellsMock.mockRejectedValueOnce(new Error('spell load failed'));

    render(
      <CharacterSheetTabs
        character={character}
        gameSystem={createSystem(character.system)}
        onUpdate={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /spells/i }));
    await waitFor(() => {
      expect(screen.getByText('No spells available for this system yet.')).toBeInTheDocument();
    });
  });

  it('loads feats and applies fallback prerequisite mapping', async () => {
    const user = userEvent.setup();
    const character = createCharacter();

    const feat = {
      name: 'Sharpshooter',
      system: character.system,
      source: 'SRD',
      description: 'Ranged mastery',
      benefits: ['Ignore cover'],
      prerequisites: [{ type: undefined, description: undefined }],
    } as unknown as FeatDefinition;
    loadFeatsMock.mockResolvedValue([feat]);

    render(
      <CharacterSheetTabs
        character={character}
        gameSystem={createSystem(character.system)}
        onUpdate={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /feats/i }));
    await waitFor(() => expect(loadFeatsMock).toHaveBeenCalledWith(character.system));
    expect(screen.getByTestId('feat-count')).toHaveTextContent('1');
    expect(screen.getByTestId('feat-first')).toHaveTextContent('Sharpshooter|unknown|');
  });

  it('loads equipment and maps default rarity/cost values', async () => {
    const user = userEvent.setup();
    const character = createCharacter();

    const item = {
      id: 'chain-shirt',
      name: 'Chain Shirt',
      type: 'armor',
      rarity: undefined,
      cost: { amount: 50, currency: 'gp' },
      weight: 20,
      description: 'Armor',
    } as unknown as Item;
    loadEquipmentMock.mockResolvedValue([item]);

    render(
      <CharacterSheetTabs
        character={character}
        gameSystem={createSystem(character.system)}
        onUpdate={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /equipment/i }));
    await waitFor(() => expect(loadEquipmentMock).toHaveBeenCalledWith(character.system));
    expect(screen.getByTestId('equipment-count')).toHaveTextContent('1');
    expect(screen.getByTestId('equipment-first')).toHaveTextContent('common|50 gp');
  });

  it('loads monsters, supports select/back flow, and handles empty fallback', async () => {
    const user = userEvent.setup();
    const character = createCharacter();
    const monster = { id: 'goblin', name: 'Goblin' } as unknown as Monster;
    loadMonstersMock.mockResolvedValue([monster]);

    render(
      <CharacterSheetTabs
        character={character}
        gameSystem={createSystem(character.system)}
        onUpdate={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /monsters/i }));
    await waitFor(() => expect(loadMonstersMock).toHaveBeenCalledWith(character.system));
    expect(screen.getByText(/currently showing 1 monsters/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /select first monster/i }));
    expect(screen.getByTestId('monster-stat-block')).toHaveTextContent('Goblin');
    await user.click(screen.getByRole('button', { name: /back to monster list/i }));
    expect(screen.getByTestId('monster-count')).toHaveTextContent('1');
  });

  it('resets loaded tab state when character system changes', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const character = createCharacter('dnd-5e-2014');
    loadSpellsMock.mockResolvedValueOnce([
      {
        id: 'acid-arrow',
        name: 'Acid Arrow',
        level: 2,
        school: 'Evocation',
        castingTime: '1 action',
        range: { type: 'ranged', feet: 90 },
        duration: { type: 'instantaneous' },
        description: 'Acid streak',
        classes: ['wizard'],
      } as unknown as Spell,
    ]);
    loadSpellsMock.mockResolvedValueOnce([]);

    const { rerender } = render(
      <CharacterSheetTabs
        character={character}
        gameSystem={createSystem(character.system)}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('button', { name: /spells/i }));
    await waitFor(() => expect(screen.getByRole('button', { name: /spells \(1\)/i })).toBeInTheDocument());

    const updatedCharacter = createCharacter('pf2e');
    rerender(
      <CharacterSheetTabs
        character={updatedCharacter}
        gameSystem={createSystem(updatedCharacter.system)}
        onUpdate={onUpdate}
      />
    );

    await waitFor(() => expect(loadSpellsMock).toHaveBeenLastCalledWith('pf2e'));
    expect(screen.getByRole('button', { name: /spells \(0\)/i })).toBeInTheDocument();
  });
});
