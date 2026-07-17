import React from 'react';
import { Star } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import type { CharacterDocument } from '../../../types/core/document';
import type { CharacterClass } from '../../../types/character-options/classes';
import type { Species } from '../../../types/character-options/species';
import type { Pf2eBackgroundDefinition } from '../../../data/pathfinder/2e/backgrounds';
import type { Pf2eDataModel } from '../data-model';
import { clampCount } from '../../../utils/resourcePool';

interface Props {
  document: CharacterDocument<Pf2eDataModel>;
  canUpdate: boolean;
  classes: CharacterClass[];
  ancestries: Species[];
  heritages: Species['subraces'];
  backgrounds: Pf2eBackgroundDefinition[];
  backgroundsLoaded: boolean;
  onNameChange: (name: string) => void;
  onLevelChange: (value: string) => void;
  onClassChange: (classId: string) => void;
  onAncestryChange: (ancestryId: string) => void;
  onHeritageChange: (heritageId: string) => void;
  onBackgroundChange: (backgroundId: string) => void;
  onExperiencePointsChange: (value: string) => void;
  onHeroPointsChange: (value: number) => void;
  onLoadOptions: () => void | Promise<void>;
  onLoadBackgrounds: () => void | Promise<void>;
}

export const Pf2eHeader: React.FC<Props> = ({
  document,
  canUpdate,
  classes,
  ancestries,
  heritages,
  backgrounds,
  backgroundsLoaded,
  onNameChange,
  onLevelChange,
  onClassChange,
  onAncestryChange,
  onHeritageChange,
  onBackgroundChange,
  onExperiencePointsChange,
  onHeroPointsChange,
  onLoadOptions,
  onLoadBackgrounds,
}) => {
  const data = document.system;

  return (
    <div className="flex justify-between items-start bg-card p-6 rounded-xl border shadow-sm">
      <div className="space-y-1 flex-1">
        <input
          value={document.name}
          onChange={(event) => onNameChange(event.target.value)}
          className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
          disabled={!canUpdate}
          title="Character name"
          placeholder="Character name"
        />
        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
          <Badge variant="info">Level {data.level}</Badge>
          <button
            type="button"
            onClick={() => onLevelChange(String(clampCount(data.level - 1, 20, 1)))}
            className="flex h-6 w-6 items-center justify-center rounded border border-input text-muted-foreground hover:bg-muted focus:outline-none focus:border-primary disabled:opacity-40"
            disabled={!canUpdate}
            // Milestone leveling: steps level by 1 and re-derives via the class
            // template. It does not gate on XP or apply per-level choices.
            title="Milestone level down (−1)"
          >
            −
          </button>
          <input
            type="number"
            value={data.level}
            onChange={(event) => onLevelChange(event.target.value)}
            className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary font-bold tabular-nums"
            min={1}
            max={20}
            disabled={!canUpdate}
            title="Character level"
          />
          <button
            type="button"
            onClick={() => onLevelChange(String(clampCount(data.level + 1, 20, 1)))}
            className="flex h-6 w-6 items-center justify-center rounded border border-input text-muted-foreground hover:bg-muted focus:outline-none focus:border-primary disabled:opacity-40"
            disabled={!canUpdate}
            title="Milestone level up (+1)"
          >
            +
          </button>
          <select
            value={data.classId || ''}
            onChange={(event) => onClassChange(event.target.value)}
            onFocus={onLoadOptions}
            className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
            disabled={!canUpdate}
            title="Class"
          >
            <option value="">Class...</option>
            {classes.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
          <select
            value={data.ancestryId || ''}
            onChange={(event) => onAncestryChange(event.target.value)}
            onFocus={onLoadOptions}
            className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
            disabled={!canUpdate}
            title="Ancestry"
          >
            <option value="">Ancestry...</option>
            {ancestries.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
          <select
            value={data.heritageId || ''}
            onChange={(event) => onHeritageChange(event.target.value)}
            className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
            disabled={!canUpdate || !heritages || heritages.length === 0}
            title="Heritage"
          >
            <option value="">
              {!heritages || heritages.length === 0 ? 'Heritage...' : 'Select heritage...'}
            </option>
            {heritages?.map((heritage) => (
              <option key={heritage.id} value={heritage.id}>
                {heritage.name}
              </option>
            ))}
          </select>
          <select
            value={data.backgroundId || ''}
            onChange={(event) => onBackgroundChange(event.target.value)}
            onFocus={onLoadBackgrounds}
            className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
            disabled={!canUpdate}
            title="Background"
          >
            <option value="">
              {backgroundsLoaded ? 'Background...' : 'Loading backgrounds...'}
            </option>
            {backgrounds.map((background) => (
              <option key={background.id} value={background.id}>
                {background.name}
              </option>
            ))}
          </select>
          <span>XP</span>
          <input
            type="number"
            value={data.experiencePoints}
            onChange={(event) => onExperiencePointsChange(event.target.value)}
            className="w-20 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
            min={0}
            disabled={!canUpdate}
            title="Experience points"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className="text-xs font-medium text-muted-foreground mb-1">Hero Points</div>
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                type="button"
                onClick={() => onHeroPointsChange(index < data.heroPoints ? index : index + 1)}
                disabled={!canUpdate}
                className={`w-7 h-7 rounded-full border-2 transition-colors ${
                  index < data.heroPoints
                    ? 'bg-amber-400 border-amber-500 text-amber-900'
                    : 'border-input hover:border-amber-400'
                }`}
                title={`${data.heroPoints}/3 Hero Points`}
              >
                <Star className="w-3 h-3 mx-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
