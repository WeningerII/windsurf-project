import { SystemRegistry } from '../registry';
import { DaggerheartSystemDef } from '../systems/daggerheart/definition';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../systems/daggerheart/data-model';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';

const TEST_DATE = new Date('2026-07-01T00:00:00.000Z');

function createRegistry(): SystemRegistry {
  const registry = new SystemRegistry();
  registry.register(DaggerheartSystemDef);
  return registry;
}

function createDocument<T extends SystemDataModel>(
  systemId: string,
  system: T
): CharacterDocument<T> {
  return {
    id: `${systemId}-doc`,
    name: 'Daggerheart Validation Test Character',
    systemId,
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

type DomainCardEntry = DaggerheartDataModel['domainCards'][number];

function cardEntry(overrides: Partial<DomainCardEntry> & { id: string }): DomainCardEntry {
  return {
    name: '',
    domain: 'blade',
    level: 1,
    location: 'loadout',
    description: '',
    ...overrides,
  };
}

/** A fully legal level-1 SRD Warrior (domains: blade, bone). */
function createLegalWarrior(): DaggerheartDataModel {
  return {
    ...createDefaultDaggerheartData(),
    level: 1,
    class: 'daggerheart-warrior',
    subclass: 'warrior-call-of-the-brave',
    heritage: 'clank',
    community: 'highborne',
    // Character-creation array +2/+1/+1/+0/+0/-1 in some assignment.
    attributes: {
      agility: 2,
      strength: 1,
      finesse: 1,
      instinct: 0,
      presence: 0,
      knowledge: -1,
    },
    weapons: {
      // Broadsword (burden 1) + Shortsword (burden 1) = legal 2-hand loadout.
      primaryId: 'daggerheart-weapon-primary-broadsword-tier-1',
      secondaryId: 'daggerheart-weapon-secondary-shortsword-tier-1',
      inventoryIds: [],
    },
    armorId: 'daggerheart-armor-gambeson-armor-tier-1',
    domainCards: [
      cardEntry({ id: 'blade-get-back-up', cardId: 'blade-get-back-up' }),
      cardEntry({ id: 'blade-whirlwind', cardId: 'blade-whirlwind' }),
    ],
  };
}

function issueCodes(result: Awaited<ReturnType<SystemRegistry['validateDocument']>>) {
  return result.issues.map((issue) => issue.code);
}

describe('Daggerheart validation', () => {
  it('accepts a legal SRD warrior without mutating the document', async () => {
    const registry = createRegistry();
    const document = createDocument('daggerheart', createLegalWarrior());
    const serializedBeforeValidation = JSON.stringify(document);

    const result = await registry.validateDocument(document, { reason: 'creation' });

    expect(result.issues).toEqual([]);
    expect(JSON.stringify(document)).toBe(serializedBeforeValidation);
  });

  it('resolves display names the way the sheet normalization does', async () => {
    const registry = createRegistry();
    const system = {
      ...createLegalWarrior(),
      class: 'Warrior',
      subclass: 'Call of the Brave',
      heritage: 'Clank',
      community: 'Highborne',
    };

    const result = await registry.validateDocument(createDocument('daggerheart', system));

    expect(result.issues).toEqual([]);
  });

  it('warns on an over-burden weapon loadout (two-handed primary plus secondary)', async () => {
    const registry = createRegistry();
    const system = createLegalWarrior();
    // Greatsword has burden 2; adding any secondary exceeds the 2 hands.
    system.weapons.primaryId = 'daggerheart-weapon-primary-greatsword-tier-1';

    const result = await registry.validateDocument(createDocument('daggerheart', system));

    expect(issueCodes(result)).toContain('daggerheart-over-burden');
    expect(result.issues.every((issue) => issue.severity !== 'error')).toBe(true);
  });

  it('accepts a two-handed primary once the secondary slot is empty', async () => {
    const registry = createRegistry();
    const system = createLegalWarrior();
    system.weapons.primaryId = 'daggerheart-weapon-primary-greatsword-tier-1';
    system.weapons.secondaryId = '';

    const result = await registry.validateDocument(createDocument('daggerheart', system));

    expect(result.issues).toEqual([]);
  });

  it('warns on out-of-domain cards but accepts in-domain cards', async () => {
    const registry = createRegistry();
    const system = createLegalWarrior();
    // Grace belongs to Bard/Rogue, not the Warrior's blade/bone.
    system.domainCards.push(
      cardEntry({ id: 'grace-deft-deceiver', cardId: 'grace-deft-deceiver', domain: 'grace' })
    );

    const result = await registry.validateDocument(createDocument('daggerheart', system));

    const outOfDomain = result.issues.filter(
      (issue) => issue.code === 'daggerheart-card-out-of-domain'
    );
    expect(outOfDomain).toHaveLength(1);
    expect(outOfDomain[0].severity).toBe('warning');
    expect(outOfDomain[0].details).toMatchObject({
      cardId: 'grace-deft-deceiver',
      cardDomain: 'grace',
      classDomains: ['blade', 'bone'],
    });
  });

  it('warns when a card is above the character level', async () => {
    const registry = createRegistry();
    const system = createLegalWarrior();
    // Champion's Edge is a level-5 blade card; the character is level 1.
    system.domainCards.push(
      cardEntry({ id: 'blade-champion-s-edge', cardId: 'blade-champion-s-edge', level: 5 })
    );

    const result = await registry.validateDocument(createDocument('daggerheart', system));

    const aboveLevel = result.issues.filter(
      (issue) => issue.code === 'daggerheart-card-above-level'
    );
    expect(aboveLevel).toHaveLength(1);
    expect(aboveLevel[0].severity).toBe('warning');
    expect(aboveLevel[0].details).toMatchObject({ cardLevel: 5, characterLevel: 1 });
  });

  it('warns when the loadout exceeds the 5-card limit, counting only non-vault cards', async () => {
    const registry = createRegistry();
    const overloaded = createLegalWarrior();
    overloaded.level = 3;
    overloaded.attributes.strength = 2; // level > 1, creation-array check off
    overloaded.domainCards = [
      cardEntry({ id: 'blade-get-back-up', cardId: 'blade-get-back-up' }),
      cardEntry({ id: 'blade-not-good-enough', cardId: 'blade-not-good-enough' }),
      cardEntry({ id: 'blade-whirlwind', cardId: 'blade-whirlwind' }),
      cardEntry({ id: 'blade-a-soldier-s-bond', cardId: 'blade-a-soldier-s-bond' }),
      cardEntry({ id: 'blade-reckless', cardId: 'blade-reckless' }),
      cardEntry({ id: 'blade-scramble', cardId: 'blade-scramble' }),
    ];

    const overloadedResult = await registry.validateDocument(
      createDocument('daggerheart', overloaded)
    );
    const overLimit = overloadedResult.issues.filter(
      (issue) => issue.code === 'daggerheart-loadout-over-limit'
    );
    expect(overLimit).toHaveLength(1);
    expect(overLimit[0].severity).toBe('warning');
    expect(overLimit[0].details).toMatchObject({ loadoutCount: 6, limit: 5 });

    // Vaulting the sixth card makes the same collection legal.
    const vaulted = structuredClone(overloaded);
    vaulted.domainCards[5].location = 'vault';
    const vaultedResult = await registry.validateDocument(createDocument('daggerheart', vaulted));
    expect(issueCodes(vaultedResult)).not.toContain('daggerheart-loadout-over-limit');
  });

  it('reports unknown class, heritage, community, subclass, equipment, and level as warnings only', async () => {
    const registry = createRegistry();
    const system = {
      ...createLegalWarrior(),
      level: 11,
      class: 'invented-class',
      heritage: 'invented-ancestry',
      community: 'invented-community',
      armorId: 'invented-armor',
    };
    system.weapons = {
      primaryId: 'invented-weapon',
      secondaryId: '',
      inventoryIds: [],
    };

    const result = await registry.validateDocument(createDocument('daggerheart', system), {
      reason: 'import',
    });

    expect(issueCodes(result)).toEqual(
      expect.arrayContaining([
        'daggerheart-invalid-level',
        'daggerheart-unknown-class',
        'daggerheart-unknown-heritage',
        'daggerheart-unknown-community',
        'daggerheart-unknown-armor',
        'daggerheart-unknown-weapon',
      ])
    );
    // Warn/annotate, never block: no content issue is an error.
    expect(result.issues.every((issue) => issue.severity !== 'error')).toBe(true);
    expect(result.issues.every((issue) => issue.source === 'import')).toBe(true);
  });

  it('warns when a secondary weapon sits in the primary slot', async () => {
    const registry = createRegistry();
    const system = createLegalWarrior();
    system.weapons.primaryId = 'daggerheart-weapon-secondary-shortsword-tier-1';
    system.weapons.secondaryId = '';

    const result = await registry.validateDocument(createDocument('daggerheart', system));

    expect(issueCodes(result)).toContain('daggerheart-weapon-slot-category-mismatch');
  });

  it('warns when level-1 traits deviate from the +2/+1/+1/+0/+0/-1 creation array', async () => {
    const registry = createRegistry();
    const system = createLegalWarrior();
    system.attributes = {
      agility: 3,
      strength: 3,
      finesse: 3,
      instinct: 3,
      presence: 3,
      knowledge: 3,
    };

    const result = await registry.validateDocument(createDocument('daggerheart', system));

    expect(issueCodes(result)).toContain('daggerheart-trait-array-mismatch');
  });

  it('skips the creation-array check for unassigned defaults and leveled characters', async () => {
    const registry = createRegistry();

    const blank = createDocument('daggerheart', createDefaultDaggerheartData());
    const blankResult = await registry.validateDocument(blank);
    expect(issueCodes(blankResult)).not.toContain('daggerheart-trait-array-mismatch');

    const leveled = createLegalWarrior();
    leveled.level = 5;
    leveled.attributes.knowledge = 1; // advancement raised a trait
    const leveledResult = await registry.validateDocument(createDocument('daggerheart', leveled));
    expect(issueCodes(leveledResult)).not.toContain('daggerheart-trait-array-mismatch');
  });

  it('keeps unresolved manual card references as warnings that survive import untouched', async () => {
    const registry = createRegistry();
    const system = createLegalWarrior();
    system.domainCards.push(
      cardEntry({
        id: 'homebrew:gm-ruled-card',
        name: 'GM Ruled Homebrew Card',
        domain: 'blade',
        description: 'Resolution adjudicated at the table.',
      })
    );
    const document = createDocument('daggerheart', system);
    const serializedBeforeValidation = JSON.stringify(document);

    const result = await registry.validateDocument(document, { reason: 'import' });

    const unresolved = result.issues.filter(
      (issue) => issue.code === 'daggerheart-unresolved-domain-card'
    );
    expect(unresolved).toHaveLength(1);
    expect(unresolved[0].severity).toBe('warning');
    expect(unresolved[0].recoverable).toBe(true);
    // Round-trip unaffected: the document (manual id included) is unchanged.
    expect(JSON.stringify(document)).toBe(serializedBeforeValidation);
    const roundTripped = JSON.parse(JSON.stringify(document));
    expect(roundTripped.system.domainCards[2].id).toBe('homebrew:gm-ruled-card');
  });

  it('annotates custom inventory as info and warns on over-max consumables', async () => {
    const registry = createRegistry();
    const system = createLegalWarrior();
    system.inventory = [
      {
        itemId: 'custom-item:heirloom',
        name: 'Heirloom Locket',
        quantity: 1,
        description: 'Sentimental.',
      },
      { itemId: 'not-a-catalog-id', name: 'Mystery Trinket', quantity: 1, description: '' },
      {
        itemId: 'daggerheart-consumable-minor-health-potion',
        name: 'Minor Health Potion',
        quantity: 9,
        description: '',
      },
    ];

    const result = await registry.validateDocument(createDocument('daggerheart', system));

    const unknownItems = result.issues.filter(
      (issue) => issue.code === 'daggerheart-unknown-inventory-item'
    );
    expect(unknownItems).toHaveLength(1); // custom-item: prefix is exempt
    expect(unknownItems[0].severity).toBe('info');

    const overMax = result.issues.filter(
      (issue) => issue.code === 'daggerheart-consumable-over-max'
    );
    expect(overMax).toHaveLength(1);
    expect(overMax[0].severity).toBe('warning');
  });
});
