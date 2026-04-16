import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import type { Species } from '../../../types/character-options/species';
import { parseNum } from '../../../utils/math';

interface Props {
  documentName: string;
  isPf1e: boolean;
  level: number;
  favoredClassSkillBonus: number;
  speciesId?: string;
  speciesOptions: Species[];
  sizeCategory?: string;
  experiencePoints?: number;
  canUpdate: boolean;
  onNameChange: (value: string) => void;
  onSpeciesChange: (species: Species) => void;
  onLoadOptions: () => void | Promise<void>;
  onSizeCategoryChange: (value: string) => void;
  onExperiencePointsChange: (value: number) => void;
}

export const D20LegacyHeader: React.FC<Props> = ({
  documentName,
  isPf1e,
  level,
  favoredClassSkillBonus,
  speciesId,
  speciesOptions,
  sizeCategory,
  experiencePoints,
  canUpdate,
  onNameChange,
  onSpeciesChange,
  onLoadOptions,
  onSizeCategoryChange,
  onExperiencePointsChange,
}) => (
  <div className="bg-card p-6 rounded-xl border shadow-sm space-y-2">
    <input
      value={documentName}
      onChange={(event) => onNameChange(event.target.value)}
      className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
      disabled={!canUpdate}
      title="Character name"
      placeholder="Character name"
    />
    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
      <Badge variant="secondary">{isPf1e ? 'Pathfinder 1e' : 'D&D 3.5e'}</Badge>
      <Badge variant="info">Level {level}</Badge>
      {isPf1e && favoredClassSkillBonus > 0 && (
        <Badge variant="secondary" title="Favored class skill-point selections">
          Skill FCB +{favoredClassSkillBonus}
        </Badge>
      )}
      <span>Total Level</span>
      <span className="font-bold text-foreground tabular-nums">{level}</span>
      <select
        value={speciesId || ''}
        onChange={(event) => {
          const species = speciesOptions.find((entry) => entry.id === event.target.value);
          if (species) {
            onSpeciesChange(species);
          }
        }}
        onFocus={() => {
          void onLoadOptions();
        }}
        className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
        disabled={!canUpdate}
        title="Race"
      >
        <option value="">Race...</option>
        {speciesOptions.map((species) => (
          <option key={species.id} value={species.id}>
            {species.name}
          </option>
        ))}
      </select>
      <select
        value={sizeCategory || 'medium'}
        onChange={(event) => onSizeCategoryChange(event.target.value)}
        className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
        disabled={!canUpdate}
        title="Size Category"
      >
        <option value="fine">Fine</option>
        <option value="diminutive">Diminutive</option>
        <option value="tiny">Tiny</option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="huge">Huge</option>
        <option value="gargantuan">Gargantuan</option>
        <option value="colossal">Colossal</option>
      </select>
      <span>XP</span>
      <input
        type="number"
        value={experiencePoints ?? 0}
        onChange={(event) => onExperiencePointsChange(parseNum(event.target.value, 0))}
        className="w-20 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
        min={0}
        disabled={!canUpdate}
        title="Experience Points"
      />
    </div>
  </div>
);
