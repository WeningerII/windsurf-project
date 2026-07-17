import type { CharacterDocument, SystemDataModel } from '../types/core/document';

/**
 * Cross-system presentation helpers for character documents. The character
 * `system` payload is a black box at the container boundary, so these read it
 * defensively (every system spells level/class/species/HP differently) and
 * return display-ready strings — or `null` when a field doesn't apply.
 */

function humanizeToken(value: string): string {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null;
  return value as Record<string, unknown>;
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

/** Sortable numeric level (falls back to power level, then 0). */
export function getDocumentLevelValue(doc: CharacterDocument<SystemDataModel>): number {
  const sys = doc.system as Record<string, unknown>;
  return asNumber(sys.level) ?? asNumber(sys.powerLevel) ?? 0;
}

export function getLevelLabel(doc: CharacterDocument<SystemDataModel>): string | null {
  const sys = doc.system as Record<string, unknown>;
  const level = asNumber(sys.level);
  if (level !== null) return `Level ${level}`;

  const powerLevel = asNumber(sys.powerLevel);
  if (powerLevel !== null) return `Power Level ${powerLevel}`;

  return null;
}

export function getClassLabel(system: SystemDataModel): string | null {
  const data = system as Record<string, unknown>;
  const classLevels = data.classLevels;
  if (Array.isArray(classLevels) && classLevels.length > 0) {
    const first = asRecord(classLevels[0]);
    const classId = first ? asString(first.classId) : null;
    if (classId) {
      const extraClasses = classLevels.length - 1;
      return `${humanizeToken(classId)}${extraClasses > 0 ? ` +${extraClasses}` : ''}`;
    }
  }

  const classId = asString(data.classId);
  return classId ? humanizeToken(classId) : null;
}

/**
 * A character's origin line with each system's own caption — mirroring the
 * captions the systems' sheets ship: 3.5e/PF1e say 'Race', PF2e and Daggerheart
 * say 'Ancestry' (PF2e via `ancestryId`, Daggerheart via `heritage`), the 5e
 * family says 'Species'. Returns null when no origin field is set.
 */
export function getSpeciesLabel(
  doc: CharacterDocument<SystemDataModel>
): { label: string; value: string } | null {
  const data = doc.system as Record<string, unknown>;
  const speciesId = asString(data.speciesId);
  if (speciesId) {
    const label = doc.systemId === 'dnd-3.5e' || doc.systemId === 'pf1e' ? 'Race' : 'Species';
    return { label, value: humanizeToken(speciesId) };
  }

  const ancestryId = asString(data.ancestryId);
  if (ancestryId) return { label: 'Ancestry', value: humanizeToken(ancestryId) };

  const heritage = asString(data.heritage);
  if (heritage) return { label: 'Ancestry', value: humanizeToken(heritage) };

  return null;
}

export function getHitPointLabel(system: SystemDataModel): string | null {
  const data = system as Record<string, unknown>;
  const hp = asRecord(data.hitPoints);
  if (!hp) return null;

  const current = asNumber(hp.current);
  const max = asNumber(hp.max);
  if (current === null || max === null) return null;

  return `${current}/${max} HP`;
}
