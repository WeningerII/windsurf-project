/**
 * Daggerheart's two scene-side catalogs: the weapon table character tokens need
 * to fight (weapons are catalog refs on the document, so combat-stat resolution
 * cannot read them off the token) and the SRD adversaries a Daggerheart scene
 * fields as monster-kind tokens. Both are empty for every other system, which is
 * also what hides the adversary picker.
 *
 * Extracted verbatim from SceneManager to shrink that component; the host
 * destructures the return into the same names it used inline.
 */
import { useEffect, useState } from 'react';
import { loadDaggerheartAdversariesForSystem } from '../../utils/dataLoader';
import { errorLogger, ErrorCategory, ErrorSeverity } from '../../utils/errorLogger';
import type { DaggerheartAdversary, DaggerheartWeapon } from '../../types/daggerheart';

export function useDaggerheartSceneCatalog(sceneSystemId: string | undefined) {
  // Daggerheart scenes need the weapon catalog so character tokens can fight
  // (weapons are catalog refs on the document); mirrors the monster preload.
  const [daggerheartWeaponsById, setDaggerheartWeaponsById] = useState<
    ReadonlyMap<string, DaggerheartWeapon>
  >(new Map());
  useEffect(() => {
    if (sceneSystemId !== 'daggerheart') {
      setDaggerheartWeaponsById(new Map());
      return;
    }
    let cancelled = false;
    import('../../data/daggerheart/1.0/equipment')
      .then((mod) => {
        if (cancelled) return;
        setDaggerheartWeaponsById(
          new Map((mod.daggerheartWeapons ?? []).map((weapon) => [weapon.id, weapon]))
        );
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        errorLogger.log(
          ErrorCategory.DATA_LOAD,
          ErrorSeverity.LOW,
          'Failed to preload Daggerheart weapon catalog',
          error instanceof Error ? error : undefined
        );
      });
    return () => {
      cancelled = true;
    };
  }, [sceneSystemId]);

  // Daggerheart scenes field SRD adversaries as monster-kind tokens.
  const [daggerheartAdversariesById, setDaggerheartAdversariesById] = useState<
    ReadonlyMap<string, DaggerheartAdversary>
  >(new Map());
  const [adversaryId, setAdversaryId] = useState('');
  useEffect(() => {
    if (sceneSystemId !== 'daggerheart') {
      setDaggerheartAdversariesById(new Map());
      setAdversaryId('');
      return;
    }
    let cancelled = false;
    loadDaggerheartAdversariesForSystem('daggerheart')
      .then((adversaries) => {
        if (cancelled) return;
        setDaggerheartAdversariesById(
          new Map(adversaries.map((adversary) => [adversary.id, adversary]))
        );
        setAdversaryId((current) => current || (adversaries[0]?.id ?? ''));
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        errorLogger.log(
          ErrorCategory.DATA_LOAD,
          ErrorSeverity.LOW,
          'Failed to load Daggerheart adversaries',
          error instanceof Error ? error : undefined
        );
      });
    return () => {
      cancelled = true;
    };
  }, [sceneSystemId]);

  return { daggerheartWeaponsById, daggerheartAdversariesById, adversaryId, setAdversaryId };
}
