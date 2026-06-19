import { Minus, Plus, Skull, Sparkles, Trash2, Wand2 } from 'lucide-react';
import type { EncounterPartySummary, EncounterPlanSummary } from '../../scene/encounterBuilder';
import type { EncounterDifficulty } from '../../scene/encounterDraft';
import type { EncounterSpecValidation } from '../../scene/encounterSpec';
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
  /** Manual correction: bump a queued monster's count by +/-1 (min 1). */
  onAdjustSelection?: (monsterId: string, delta: number) => void;
  /** Deterministic, budget-validated draft (SRD 5.2.1 XP budgets). */
  onDraftEncounter?: (difficulty: EncounterDifficulty) => void;
  /**
   * AI-assisted draft (model proposes from the catalog; the same deterministic
   * gate decides). Omit to hide the AI affordance entirely — the panel is
   * unchanged when AI is off.
   */
  onAiDraft?: () => void;
  /** Free-text description of the desired fight, fed to the model. */
  aiPrompt?: string;
  onAiPromptChange?: (value: string) => void;
  /** True while a draft request is in flight (disables the controls). */
  aiDrafting?: boolean;
  /** Difficulty driving both the draft and the live budget readout. */
  difficulty: EncounterDifficulty;
  onDifficultyChange: (difficulty: EncounterDifficulty) => void;
  /** Encounter-spec gate result for the pending selections at `difficulty`. */
  validation: EncounterSpecValidation;
  /** Scene markers offered as spawn zones (placement stays inside the rect). */
  zoneOptions: Array<{ id: string; label: string }>;
  zoneId: string;
  onZoneChange: (zoneId: string) => void;
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
  onAdjustSelection,
  onDraftEncounter,
  onAiDraft,
  aiPrompt,
  onAiPromptChange,
  aiDrafting,
  difficulty,
  onDifficultyChange,
  validation,
  zoneOptions,
  zoneId,
  onZoneChange,
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
        {zoneOptions.length > 0 && (
          <Select
            aria-label="Spawn zone"
            value={zoneId}
            onChange={(event) => onZoneChange(event.target.value)}
          >
            <option value="">Spawn: whole map</option>
            {zoneOptions.map((option) => (
              <option key={option.id} value={option.id}>
                Spawn in: {option.label}
              </option>
            ))}
          </Select>
        )}
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
        {onDraftEncounter && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Select
                aria-label="Draft difficulty"
                value={difficulty}
                onChange={(event) => onDifficultyChange(event.target.value as EncounterDifficulty)}
                disabled={loading || party.members.length === 0}
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </Select>
              <Button
                variant="outline"
                size="sm"
                disabled={loading || monsters.length === 0 || party.members.length === 0}
                onClick={() => onDraftEncounter(difficulty)}
                title="Draft monsters to the party's SRD XP budget"
              >
                <Wand2 className="mr-1.5 h-4 w-4" />
                Draft
              </Button>
            </div>
            <div
              className={`text-xs ${
                validation.remaining < 0 ? 'text-destructive' : 'text-muted-foreground'
              }`}
            >
              Budget ({difficulty}): {validation.totalXp} / {validation.budget} XP
              {validation.remaining < 0 ? ` — over by ${-validation.remaining}` : ''}
            </div>
          </>
        )}
        {onAiDraft && (
          <div className="space-y-2 rounded border border-dashed border-primary/40 p-2">
            <label
              htmlFor="ai-encounter-prompt"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Describe the fight; AI drafts from the loaded catalog
            </label>
            <textarea
              id="ai-encounter-prompt"
              aria-label="AI encounter prompt"
              value={aiPrompt ?? ''}
              onChange={(event) => onAiPromptChange?.(event.target.value)}
              placeholder="e.g. a goblin ambush led by a tougher boss…"
              rows={2}
              disabled={aiDrafting}
              className="w-full resize-none rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none disabled:opacity-50"
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={
                aiDrafting ||
                loading ||
                monsters.length === 0 ||
                party.members.length === 0 ||
                !(aiPrompt ?? '').trim()
              }
              onClick={onAiDraft}
              title="Ask AI to draft an on-budget encounter for your review"
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              {aiDrafting ? 'Drafting…' : 'Draft with AI'}
            </Button>
            <p className="text-[11px] text-muted-foreground">
              The AI proposes; the same budget gate decides. Review and press Add Encounter to
              apply.
            </p>
          </div>
        )}
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
                {onAdjustSelection && (
                  <span className="flex shrink-0 items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onAdjustSelection(entry.monsterId, -1)}
                      disabled={entry.count <= 1}
                      title={`One fewer ${entry.name}`}
                      aria-label={`One fewer ${entry.name}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onAdjustSelection(entry.monsterId, 1)}
                      title={`One more ${entry.name}`}
                      aria-label={`One more ${entry.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </span>
                )}
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
