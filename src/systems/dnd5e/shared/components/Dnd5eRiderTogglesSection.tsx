// purpose: 5e combat-toggle chips — thin wrapper supplying the 5e labels to
// the generic CombatTogglesSection (riders compiled by collectDnd5eRiderEffects).
import React from 'react';
import { CombatTogglesSection } from '../../../../components/CombatTogglesSection';

const TOGGLE_LABELS: Record<string, string> = {
  rage: 'Rage',
  'great-weapon-master': 'Great Weapon Master (-5/+10)',
  sharpshooter: 'Sharpshooter (-5/+10)',
  'sneak-attack': 'Sneak Attack',
  'divine-smite': 'Divine Smite (2d8)',
};

interface Props {
  availableToggles: string[];
  activeToggles: string[];
  onChange?: (activeToggles: string[]) => void;
}

export const Dnd5eRiderTogglesSection: React.FC<Props> = (props) => (
  <CombatTogglesSection {...props} labels={TOGGLE_LABELS} />
);
