import { Plus, Skull, Trash2 } from 'lucide-react';
import type { EncounterPartySummary, EncounterPlanSummary } from '../../scene/encounterBuilder';
import type { Monster } from '../../types/creatures/monsters';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface EncounterPanelProps {
  monsters: Monster[];
  monsterId: string;
  onMonsterChange: (value: string) => void;
  count: string;
  onCountChange: (value: string) => void;
  originX: string;
  onOriginXChange: (value: string) => void;
  originY: string;
  onOriginYChange: (value: string) => void;
  loading: boolean;
  loadError: string | null;
  selectedMonster: Monster | undefined;
  selectedMonsterTotalXp: number;
  canAddEncounter: boolean;
  hasSelections: boolean;
  plan: EncounterPlanSummary;
  party: EncounterPartySummary;
  xpPerPartyLevel: number;
  onQueueMonster: () => void;
  onAddEncounter: () => void;
  onRemoveSelection: (monsterId: string) => void;
}

function formatAverageLevel(level: number): string {
  return Number.isInteger(level) ? String(level) : level.toFixed(1);
}

/** Encounter builder: pick loader-backed monsters, queue them, preview party-aware XP. */
export function EncounterPanel({
  monsters,
  monsterId,
  onMonsterChange,
  count,
  onCountChange,
  originX,
  onOriginXChange,
  originY,
  onOriginYChange,
  loading,
  loadError,
  selectedMonster,
  selectedMonsterTotalXp,
  canAddEncounter,
  hasSelections,
  plan,
  party,
  xpPerPartyLevel,
  onQueueMonster,
  onAddEncounter,
  onRemoveSelection,
}: EncounterPanelProps) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="text-sm font-semibold">Encounter</h5>
        <Skull className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <Select
          aria-label="Encounter monster"
          value={monsterId}
          onChange={(event) => onMonsterChange(event.target.value)}
          disabled={loading || monsters.length === 0}
        >
          {monsters.length === 0 ? (
            <option value="">{loading ? 'Loading monsters...' : 'No monsters'}</option>
          ) : (
            monsters.map((monster) => (
              <option key={monster.id} value={monster.id}>
                {monster.name} (CR {monster.challengeRating})
              </option>
            ))
          )}
        </Select>
        <div className="grid grid-cols-3 gap-2">
          <Input
            aria-label="Encounter count"
            inputMode="numeric"
            value={count}
            onChange={(event) => onCountChange(event.target.value)}
          />
          <Input
            aria-label="Encounter start x"
            inputMode="numeric"
            value={originX}
            onChange={(event) => onOriginXChange(event.target.value)}
          />
          <Input
            aria-label="Encounter start y"
            inputMode="numeric"
            value={originY}
            onChange={(event) => onOriginYChange(event.target.value)}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {selectedMonster
            ? `${selectedMonsterTotalXp} XP / ${selectedMonster.source}`
            : loadError || 'Loader-backed monsters only'}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!monsterId || loading}
            onClick={onQueueMonster}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Queue Monster
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!canAddEncounter || loading}
            onClick={onAddEncounter}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Encounter
          </Button>
        </div>
        {hasSelections && (
          <div className="space-y-1 rounded border bg-muted/30 p-2">
            {plan.entries.map((entry) => (
              <div
                key={entry.monsterId}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="min-w-0 truncate">
                  {entry.count} x {entry.name} ({entry.totalXp} XP)
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => onRemoveSelection(entry.monsterId)}
                  title={`Remove ${entry.name} from encounter`}
                  aria-label={`Remove ${entry.name} from encounter`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-1 text-xs text-muted-foreground">
          {plan.issues.length > 0 ? (
            <div className="text-destructive">{plan.issues[0].message}</div>
          ) : (
            <div>
              Plan: {plan.totalCount} monster{plan.totalCount === 1 ? '' : 's'} / {plan.totalXp} XP
            </div>
          )}
          {party.members.length > 0 ? (
            <div>
              Party: {party.members.length} PC{party.members.length === 1 ? '' : 's'} / avg level{' '}
              {formatAverageLevel(party.averageLevel)} / {xpPerPartyLevel} XP per party level
            </div>
          ) : (
            <div>Party: no linked character levels</div>
          )}
        </div>
      </div>
    </div>
  );
}
