import type { CreationPlan } from '../../../creation/types';
import type { Mam3eDataModel } from '../data-model';
import { Mam3eCreator } from './Mam3eCreator';

/**
 * M&M 3e guided-creation plan: name → point-buy → review. The point-buy step
 * REUSES the existing {@link Mam3eCreator} in embedded mode (it streams its raw
 * data model out via `onChange` rather than committing), so the wizard drives
 * the same engine-backed point-buy math as the standalone creator with no
 * duplication. Unlike the d20 systems, M&M builds are not loader-driven choices,
 * so this is a component step, not choice steps.
 */
export function createMam3eCreationPlan(): CreationPlan<Mam3eDataModel> {
  return {
    systemId: 'mam3e',
    steps: [
      {
        kind: 'component',
        id: 'point-buy',
        title: 'Point buy',
        description: 'Set a Power Level, then buy abilities, skills, and defenses.',
        Component: ({ onChange }) => <Mam3eCreator embedded onChange={onChange} />,
      },
    ],
  };
}
