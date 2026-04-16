import { SheetHeader } from '../../../../components/sheet';
import { parseNum } from '../../../../utils/math';

type HeaderOption = {
  id: string;
  name: string;
};

interface Props {
  name: string;
  profBonus: number;
  level: number;
  speciesId?: string;
  species: HeaderOption[];
  backgroundId?: string;
  backgrounds: HeaderOption[];
  experiencePoints: number;
  canUpdate: boolean;
  onNameChange?: (name: string) => void;
  onSpeciesChange?: (speciesId: string) => void;
  onBackgroundChange?: (backgroundId: string) => void;
  onExperiencePointsChange?: (experiencePoints: number) => void;
}

export function Dnd5eHeaderSection({
  name,
  profBonus,
  level,
  speciesId,
  species,
  backgroundId,
  backgrounds,
  experiencePoints,
  canUpdate,
  onNameChange,
  onSpeciesChange,
  onBackgroundChange,
  onExperiencePointsChange,
}: Props) {
  return (
    <SheetHeader
      name={name}
      onNameChange={canUpdate ? onNameChange : undefined}
      rightContent={
        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">Proficiency Bonus</div>
          <div className="text-3xl font-bold text-primary tabular-nums">+{profBonus}</div>
        </div>
      }
    >
      <span>Total Level</span>
      <span className="font-bold text-foreground tabular-nums">{level}</span>
      <select
        value={speciesId || ''}
        onChange={(event) => onSpeciesChange?.(event.target.value)}
        className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
        title="Species"
        disabled={!canUpdate}
      >
        <option value="">Species...</option>
        {species.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {entry.name}
          </option>
        ))}
      </select>
      <select
        value={backgroundId || ''}
        onChange={(event) => onBackgroundChange?.(event.target.value)}
        className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
        title="Background"
        disabled={!canUpdate}
      >
        <option value="">Background...</option>
        {backgrounds.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {entry.name}
          </option>
        ))}
      </select>
      <span>XP</span>
      <input
        type="number"
        value={experiencePoints}
        onChange={(event) => onExperiencePointsChange?.(parseNum(event.target.value, 0))}
        className="w-20 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
        min={0}
        title="Experience points"
        disabled={!canUpdate}
      />
    </SheetHeader>
  );
}
