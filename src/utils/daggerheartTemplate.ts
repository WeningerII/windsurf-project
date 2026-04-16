import type {
  DaggerheartAncestry,
  DaggerheartClass,
  DaggerheartCommunity,
} from '../types/daggerheart';
import type { CharacterDocument } from '../types/core/document';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../systems/daggerheart/data-model';
import { getDaggerheartAncestryAdjustments } from './daggerheartDerived';

const DEFAULTS = createDefaultDaggerheartData();
const CLASS_ITEM_PREFIX = 'template:class-item:';
const COMMUNITY_ITEM_PREFIX = 'template:community-item:';

type DaggerheartInventoryEntry = DaggerheartDataModel['inventory'][number];

function cloneDocument(
  document: CharacterDocument<DaggerheartDataModel>
): CharacterDocument<DaggerheartDataModel> {
  return structuredClone(document);
}

function replaceTemplateInventoryItems(
  inventory: DaggerheartDataModel['inventory'],
  prefix: string,
  nextItems: DaggerheartInventoryEntry[]
): DaggerheartDataModel['inventory'] {
  const preserved = inventory.filter((item) => !item.itemId.startsWith(prefix));
  const preservedIds = new Set(preserved.map((item) => item.itemId));
  const appended = nextItems.filter((item) => !preservedIds.has(item.itemId));
  return [...preserved, ...appended];
}

function classTemplateItems(classData: DaggerheartClass): DaggerheartInventoryEntry[] {
  return classData.classItems.map((name, index) => ({
    itemId: `${CLASS_ITEM_PREFIX}${classData.id}:${index}`,
    name,
    quantity: 1,
    description: `Starting class item from ${classData.name}.`,
  }));
}

function communityTemplateItems(community: DaggerheartCommunity): DaggerheartInventoryEntry[] {
  if (community.id !== 'wanderborne') {
    return [];
  }

  return [
    {
      itemId: `${COMMUNITY_ITEM_PREFIX}${community.id}:nomadic-pack`,
      name: 'Nomadic Pack',
      quantity: 1,
      description: community.feature.description,
    },
  ];
}

export function applyDaggerheartClassTemplate(
  document: CharacterDocument<DaggerheartDataModel>,
  classData: DaggerheartClass,
  options?: {
    previousClass?: DaggerheartClass;
    ancestry?: DaggerheartAncestry;
    subclassName?: string;
  }
): CharacterDocument<DaggerheartDataModel> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const previousClass = options?.previousClass;
  const ancestryBonus = getDaggerheartAncestryAdjustments(options?.ancestry);

  sys.class = classData.name;
  if (options?.subclassName !== undefined) {
    sys.subclass = options.subclassName;
  }

  const expectedPreviousEvasion = (previousClass?.startingEvasion ?? 0) + ancestryBonus.evasion;
  if (
    (previousClass && sys.evasion === expectedPreviousEvasion) ||
    (!previousClass && (sys.evasion === 0 || sys.evasion === DEFAULTS.evasion))
  ) {
    sys.evasion = classData.startingEvasion + ancestryBonus.evasion;
  }

  const previousExpectedHp = (previousClass?.startingHitPoints ?? 0) + ancestryBonus.hitPoints;
  const isDefaultHp =
    sys.hitPoints.current === DEFAULTS.hitPoints.current &&
    sys.hitPoints.max === DEFAULTS.hitPoints.max;
  if (
    (previousClass &&
      sys.hitPoints.current === previousExpectedHp &&
      sys.hitPoints.max === previousExpectedHp) ||
    (!previousClass && isDefaultHp)
  ) {
    const nextHp = classData.startingHitPoints + ancestryBonus.hitPoints;
    sys.hitPoints = { current: nextHp, max: nextHp };
  }

  sys.inventory = replaceTemplateInventoryItems(
    sys.inventory,
    CLASS_ITEM_PREFIX,
    classTemplateItems(classData)
  );

  return nextDocument;
}

export function applyDaggerheartAncestryTemplate(
  document: CharacterDocument<DaggerheartDataModel>,
  ancestry: DaggerheartAncestry,
  options?: {
    previousAncestry?: DaggerheartAncestry;
    classData?: DaggerheartClass;
  }
): CharacterDocument<DaggerheartDataModel> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const previousAdjustments = getDaggerheartAncestryAdjustments(options?.previousAncestry);
  const nextAdjustments = getDaggerheartAncestryAdjustments(ancestry);

  sys.heritage = ancestry.name;

  if (options?.classData) {
    const expectedPreviousEvasion = options.classData.startingEvasion + previousAdjustments.evasion;
    if (sys.evasion === expectedPreviousEvasion) {
      sys.evasion = options.classData.startingEvasion + nextAdjustments.evasion;
    }

    const expectedPreviousHp = options.classData.startingHitPoints + previousAdjustments.hitPoints;
    if (sys.hitPoints.current === expectedPreviousHp && sys.hitPoints.max === expectedPreviousHp) {
      const nextHp = options.classData.startingHitPoints + nextAdjustments.hitPoints;
      sys.hitPoints = { current: nextHp, max: nextHp };
    }
  }

  const expectedPreviousStress = DEFAULTS.stress.max + previousAdjustments.stress;
  if (sys.stress.max === expectedPreviousStress) {
    const nextStress = DEFAULTS.stress.max + nextAdjustments.stress;
    sys.stress = {
      ...sys.stress,
      current: Math.min(sys.stress.current, nextStress),
      max: nextStress,
    };
  }

  return nextDocument;
}

export function applyDaggerheartCommunityTemplate(
  document: CharacterDocument<DaggerheartDataModel>,
  community: DaggerheartCommunity
): CharacterDocument<DaggerheartDataModel> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;

  sys.community = community.name;
  sys.inventory = replaceTemplateInventoryItems(
    sys.inventory,
    COMMUNITY_ITEM_PREFIX,
    communityTemplateItems(community)
  );

  return nextDocument;
}
