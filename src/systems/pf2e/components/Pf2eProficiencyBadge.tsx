import React from 'react';
import type { Pf2eProficiency, Pf2eProficiencyTier } from '../data-model';

const TIER_LABELS: Record<Pf2eProficiencyTier, string> = {
  untrained: 'U',
  trained: 'T',
  expert: 'E',
  master: 'M',
  legendary: 'L',
};

const TIER_COLORS: Record<Pf2eProficiencyTier, string> = {
  untrained: 'text-muted-foreground',
  trained: 'text-blue-500',
  expert: 'text-purple-500',
  master: 'text-amber-500',
  legendary: 'text-red-500',
};

interface Props {
  proficiency: Pf2eProficiency;
  canUpdate: boolean;
  onClick?: () => void;
}

export const Pf2eProficiencyBadge: React.FC<Props> = ({ proficiency, canUpdate, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!canUpdate}
    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${TIER_COLORS[proficiency.tier]} ${canUpdate ? 'hover:bg-muted cursor-pointer' : ''}`}
    title={`${proficiency.tier}. Click to cycle.`}
  >
    {TIER_LABELS[proficiency.tier]}
  </button>
);
