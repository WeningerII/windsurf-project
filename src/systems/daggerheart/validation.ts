import type { SystemValidator, ValidationContext, ValidationIssue } from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import type { DaggerheartClass } from '../../types/daggerheart';
import {
  loadDaggerheartClassesForSystem,
  loadDaggerheartAncestriesForSystem,
  loadDaggerheartCommunitiesForSystem,
} from '../../utils/dataLoader';
import { LOADOUT_LIMIT, normalizeDomainId } from './daggerheartSheetConstants';
import type { DaggerheartDataModel } from './data-model';

/**
 * Daggerheart legality gate.
 *
 * Daggerheart character creation is unusually prescriptive, which makes it a
 * good fit for a deterministic gate: traits are assigned from a fixed array,
 * the loadout has a hard size, and cards must come from the class's domains.
 * This validator loads the loader-backed catalogs and reports the issues that
 * make a build illegal or incomplete, so guided creation and AI drafts pass the
 * same gate as the sheet. It reports issues and never mutates the document.
 */

const TRAIT_IDS: Array<keyof DaggerheartDataModel['attributes']> = [
  'agility',
  'strength',
  'finesse',
  'instinct',
  'presence',
  'knowledge',
];

/** Level-1 trait assignment is the fixed array +2/+1/+1/0/0/-1 (Daggerheart core). */
const LEVEL_ONE_TRAIT_ARRAY = [2, 1, 1, 0, 0, -1];
const MIN_LEVEL = 1;
const MAX_LEVEL = 10;
const MAX_HOPE = 6;
/** Sanity bounds for traits once tier advancements have raised them past level 1. */
const TRAIT_MIN = -5;
const TRAIT_MAX = 15;

export function createDaggerheartValidator(): SystemValidator<DaggerheartDataModel> {
  return {
    validateDocument: (document, context) => validateDaggerheartDocument(document, context),
  };
}

async function validateDaggerheartDocument(
  document: CharacterDocument<DaggerheartDataModel>,
  context: ValidationContext
) {
  const issues: ValidationIssue[] = [];
  const system = document.system;

  if (document.systemId !== 'daggerheart') {
    addIssue(issues, context, {
      code: 'daggerheart-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected daggerheart but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  const [classes, ancestries, communities] = await Promise.all([
    loadDaggerheartClassesForSystem('daggerheart'),
    loadDaggerheartAncestriesForSystem('daggerheart'),
    loadDaggerheartCommunitiesForSystem('daggerheart'),
  ]);

  const level = validateLevel(issues, context, system.level);
  validateClassAndSubclass(issues, context, system, classes);
  validateNamedChoice(
    issues,
    context,
    system.heritage,
    toNameSet(ancestries),
    'heritage',
    'ancestry'
  );
  validateNamedChoice(
    issues,
    context,
    system.community,
    toNameSet(communities),
    'community',
    'community'
  );
  validateTraits(issues, context, system.attributes, level);
  validateDomainCards(issues, context, system, level, classByName(classes));
  validateResources(issues, context, system);

  return { issues };
}

function validateLevel(
  issues: ValidationIssue[],
  context: ValidationContext,
  level: number
): number {
  if (!isIntegerInRange(level, MIN_LEVEL, MAX_LEVEL)) {
    addIssue(issues, context, {
      code: 'daggerheart-invalid-level',
      severity: 'error',
      path: 'system.level',
      message: 'Character level must be an integer from 1 through 10.',
      recoverable: true,
      details: { value: level },
    });
    return Number.isFinite(level) && level >= 1 ? Math.floor(level) : 1;
  }
  return level;
}

function validateClassAndSubclass(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: DaggerheartDataModel,
  classes: DaggerheartClass[]
) {
  if (!system.class) {
    addIssue(issues, context, {
      code: 'daggerheart-missing-class',
      severity: 'warning',
      path: 'system.class',
      message: 'No class is selected yet.',
      recoverable: true,
    });
    return;
  }

  const selectedClass = classes.find((entry) => entry.name === system.class);
  if (!selectedClass) {
    addIssue(issues, context, {
      code: 'daggerheart-unknown-class',
      severity: 'error',
      path: 'system.class',
      message: `Class '${system.class}' is not in the loader-backed class catalog.`,
      recoverable: true,
      details: { class: system.class },
    });
    return;
  }

  if (!system.subclass) {
    addIssue(issues, context, {
      code: 'daggerheart-missing-subclass',
      severity: 'warning',
      path: 'system.subclass',
      message: 'No subclass is selected yet.',
      recoverable: true,
    });
    return;
  }

  if (!selectedClass.subclasses.some((subclass) => subclass.name === system.subclass)) {
    addIssue(issues, context, {
      code: 'daggerheart-subclass-class-mismatch',
      severity: 'error',
      path: 'system.subclass',
      message: `Subclass '${system.subclass}' does not belong to class '${system.class}'.`,
      recoverable: true,
      details: { class: system.class, subclass: system.subclass },
    });
  }
}

function validateNamedChoice(
  issues: ValidationIssue[],
  context: ValidationContext,
  value: string,
  names: Set<string>,
  field: 'heritage' | 'community',
  label: string
) {
  if (!value) {
    addIssue(issues, context, {
      code: `daggerheart-missing-${label}`,
      severity: 'warning',
      path: `system.${field}`,
      message: `No ${label} is selected yet.`,
      recoverable: true,
    });
    return;
  }

  if (!names.has(value)) {
    addIssue(issues, context, {
      code: `daggerheart-unknown-${label}`,
      severity: 'error',
      path: `system.${field}`,
      message: `${label} '${value}' is not in the loader-backed ${label} catalog.`,
      recoverable: true,
      details: { value },
    });
  }
}

function validateTraits(
  issues: ValidationIssue[],
  context: ValidationContext,
  attributes: DaggerheartDataModel['attributes'],
  level: number
) {
  const values = TRAIT_IDS.map((id) => attributes[id]);

  if (values.some((value) => !Number.isInteger(value))) {
    TRAIT_IDS.forEach((id) => {
      if (!Number.isInteger(attributes[id])) {
        addIssue(issues, context, {
          code: 'daggerheart-invalid-trait',
          severity: 'error',
          path: `system.attributes.${id}`,
          message: `${id} must be an integer.`,
          recoverable: true,
          details: { trait: id, value: attributes[id] },
        });
      }
    });
    return;
  }

  if (level === 1) {
    // Level-1 traits come from the fixed array, so the sorted values must match.
    const sorted = [...values].sort((a, b) => b - a);
    const matches = sorted.every((value, index) => value === LEVEL_ONE_TRAIT_ARRAY[index]);
    if (!matches) {
      addIssue(issues, context, {
        code: 'daggerheart-trait-array-mismatch',
        severity: 'error',
        path: 'system.attributes',
        message: `Level-1 traits must be the array ${formatArray(LEVEL_ONE_TRAIT_ARRAY)}; got ${formatArray(sorted)}.`,
        recoverable: true,
        details: { expected: LEVEL_ONE_TRAIT_ARRAY, actual: sorted },
      });
    }
    return;
  }

  // Above level 1, traits grow through advancements — range-check for sanity.
  TRAIT_IDS.forEach((id) => {
    if (!isIntegerInRange(attributes[id], TRAIT_MIN, TRAIT_MAX)) {
      addIssue(issues, context, {
        code: 'daggerheart-trait-out-of-range',
        severity: 'warning',
        path: `system.attributes.${id}`,
        message: `${id} of ${attributes[id]} is outside the expected range ${TRAIT_MIN}..${TRAIT_MAX}.`,
        recoverable: true,
        details: { trait: id, value: attributes[id] },
      });
    }
  });
}

function validateDomainCards(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: DaggerheartDataModel,
  level: number,
  classes: Map<string, DaggerheartClass>
) {
  const cards = system.domainCards ?? [];
  const loadoutCount = cards.filter((card) => (card.location ?? 'loadout') !== 'vault').length;

  if (loadoutCount > LOADOUT_LIMIT) {
    addIssue(issues, context, {
      code: 'daggerheart-loadout-over-limit',
      severity: 'error',
      path: 'system.domainCards',
      message: `Loadout holds ${loadoutCount} cards, above the limit of ${LOADOUT_LIMIT}.`,
      recoverable: true,
      details: { loadoutCount, limit: LOADOUT_LIMIT },
    });
  }

  const classDomains = new Set(
    (classes.get(system.class)?.domains ?? []).map((domain) => normalizeDomainId(domain))
  );

  cards.forEach((card, index) => {
    if (Number.isFinite(card.level) && card.level > level) {
      addIssue(issues, context, {
        code: 'daggerheart-card-above-level',
        severity: 'error',
        path: `system.domainCards.${index}`,
        message: `Domain card '${card.name}' is level ${card.level}, above the character level ${level}.`,
        recoverable: true,
        details: { card: card.name, cardLevel: card.level, level },
      });
    }

    if (classDomains.size > 0 && card.domain) {
      const cardDomain = normalizeDomainId(String(card.domain));
      if (!classDomains.has(cardDomain)) {
        addIssue(issues, context, {
          code: 'daggerheart-card-off-domain',
          severity: 'warning',
          path: `system.domainCards.${index}`,
          message: `Domain card '${card.name}' (${cardDomain}) is not from a domain of class '${system.class}'.`,
          recoverable: true,
          details: { card: card.name, cardDomain, classDomains: [...classDomains] },
        });
      }
    }
  });
}

function validateResources(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: DaggerheartDataModel
) {
  if (!isIntegerInRange(system.hope, 0, MAX_HOPE)) {
    addIssue(issues, context, {
      code: 'daggerheart-invalid-hope',
      severity: 'warning',
      path: 'system.hope',
      message: `Hope must be an integer from 0 through ${MAX_HOPE}.`,
      recoverable: true,
      details: { value: system.hope },
    });
  }

  checkPool(issues, context, system.hitPoints, 'system.hitPoints', 'hit points');
  checkPool(issues, context, system.stress, 'system.stress', 'stress');
}

function checkPool(
  issues: ValidationIssue[],
  context: ValidationContext,
  pool: { current: number; max: number } | undefined,
  path: string,
  label: string
) {
  if (!pool || !Number.isFinite(pool.max) || pool.max < 1) {
    addIssue(issues, context, {
      code: 'daggerheart-invalid-pool',
      severity: 'error',
      path: `${path}.max`,
      message: `Maximum ${label} must be a positive number.`,
      recoverable: true,
      details: { value: pool?.max },
    });
    return;
  }

  if (pool.current < 0 || pool.current > pool.max) {
    addIssue(issues, context, {
      code: 'daggerheart-invalid-pool',
      severity: 'warning',
      path,
      message: `Current ${label} must be between 0 and the maximum.`,
      recoverable: true,
      details: { ...pool },
    });
  }
}

function classByName(classes: DaggerheartClass[]): Map<string, DaggerheartClass> {
  return new Map(classes.map((entry) => [entry.name, entry]));
}

function toNameSet(items: Array<{ name: string }>): Set<string> {
  return new Set(items.map((item) => item.name));
}

function formatArray(values: number[]): string {
  return `[${values.map((value) => (value >= 0 ? `+${value}` : `${value}`)).join(', ')}]`;
}

function isIntegerInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

function addIssue(
  issues: ValidationIssue[],
  context: ValidationContext,
  issue: ValidationIssue
): void {
  const source = issue.source ?? context.source ?? context.reason;
  issues.push(source ? { ...issue, source } : issue);
}
