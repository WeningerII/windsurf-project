import { useMemo, useState } from 'react';
import { Dices } from 'lucide-react';
import type { SceneCheckLogEntry, SceneCheckMode, SceneState } from '../../types/core/scene';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';

const DND5E_SKILLS = [
  'Perception',
  'Investigation',
  'Insight',
  'Stealth',
  'Athletics',
  'Acrobatics',
  'Persuasion',
  'Deception',
  'Intimidation',
  'Arcana',
  'History',
  'Nature',
  'Survival',
] as const;

interface CheckPanelProps {
  state: SceneState;
  /** Selected token, offered as the default roller. */
  actorId?: string;
  onRoll: (params: {
    label: string;
    modifier: number;
    dc?: number;
    actorTokenId?: string;
    mode?: SceneCheckMode;
  }) => void;
}

/**
 * Per-system check-label suggestions; the input stays free-text either way.
 * Kept as a local map (the lint-enforced layer boundary forbids shared
 * components value-importing from src/systems/**): 5e names for the 5e family,
 * each system's own skill vocabulary elsewhere, and Daggerheart's six TRAITS —
 * it has no skill list. Unknown/unset system ids get a small neutral set.
 */
const SKILL_SUGGESTIONS_BY_SYSTEM: Record<string, readonly string[]> = {
  'dnd-5e-2014': DND5E_SKILLS,
  'dnd-5e-2024': DND5E_SKILLS,
  'dnd-3.5e': [
    'Spot',
    'Listen',
    'Search',
    'Hide',
    'Move Silently',
    'Sense Motive',
    'Bluff',
    'Diplomacy',
    'Intimidate',
    'Tumble',
  ],
  pf1e: [
    'Perception',
    'Stealth',
    'Acrobatics',
    'Sense Motive',
    'Bluff',
    'Diplomacy',
    'Intimidate',
    'Survival',
  ],
  pf2e: [
    'Perception',
    'Stealth',
    'Athletics',
    'Acrobatics',
    'Deception',
    'Diplomacy',
    'Intimidation',
    'Arcana',
    'Nature',
    'Society',
    'Survival',
  ],
  mam3e: [
    'Perception',
    'Investigation',
    'Insight',
    'Stealth',
    'Athletics',
    'Acrobatics',
    'Deception',
    'Persuasion',
    'Intimidation',
    'Expertise',
    'Technology',
    'Treatment',
  ],
  daggerheart: ['Agility', 'Strength', 'Finesse', 'Instinct', 'Presence', 'Knowledge'],
};

const DEFAULT_SUGGESTIONS = ['Perception', 'Stealth', 'Persuasion'];

const OUTCOME_BADGE: Record<SceneCheckLogEntry['outcome'], string> = {
  success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  failure: 'bg-destructive/15 text-destructive',
  unresolved: '',
};

const OUTCOME_LABEL: Record<SceneCheckLogEntry['outcome'], string> = {
  success: 'Success',
  failure: 'Failure',
  unresolved: 'No difficulty',
};

/**
 * Non-combat ability/skill checks: roll a d20 + modifier against an optional
 * DC, attributed to a token or to the GM. Every roll goes through the
 * event-sourced scene path (so it lands in the replayable check log); this
 * panel only gathers inputs and renders the log newest-first.
 */
export function CheckPanel({ state, actorId, onRoll }: CheckPanelProps) {
  const [label, setLabel] = useState('');
  const [modifier, setModifier] = useState('');
  const [dc, setDc] = useState('');
  // null = follow the selected grid token; '' = explicitly Unattributed (GM);
  // a token id = that roller. Distinguishing null from '' lets the GM pick the
  // unattributed option even when a grid token is selected (otherwise selecting
  // '' equals the initial state, the change is a no-op, and the value snaps back
  // to the actorId default).
  const [actorChoice, setActorChoice] = useState<string | null>(null);
  const [mode, setMode] = useState<'normal' | SceneCheckMode>('normal');

  const tokens = Object.values(state.tokens);
  const effectiveActor =
    actorChoice !== null ? actorChoice : actorId && state.tokens[actorId] ? actorId : '';

  const trimmedLabel = label.trim();
  const parsedModifier = modifier.trim() === '' ? 0 : Number(modifier);
  const parsedDc = dc.trim() === '' ? undefined : Number(dc);
  const canRoll =
    trimmedLabel.length > 0 &&
    Number.isFinite(parsedModifier) &&
    (parsedDc === undefined || Number.isFinite(parsedDc));

  const handleRoll = () => {
    if (!canRoll) return;
    onRoll({
      label: trimmedLabel,
      modifier: parsedModifier,
      ...(parsedDc !== undefined ? { dc: parsedDc } : {}),
      ...(effectiveActor ? { actorTokenId: effectiveActor } : {}),
      ...(mode !== 'normal' ? { mode } : {}),
    });
    setLabel('');
    setModifier('');
    setDc('');
  };

  // Reverse only when the log changes — the panel re-renders on every keystroke
  // of its inputs, and the log only grows when a roll is committed.
  const recent = useMemo(() => [...state.checkLog].reverse(), [state.checkLog]);

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-sm font-semibold">
          <Dices className="h-4 w-4" /> Checks
        </h5>
      </div>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] gap-2">
          <input
            list="scene-check-skills"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRoll();
            }}
            placeholder="Check (e.g. Perception)"
            aria-label="Check label"
            className="h-9 min-w-0 rounded-md border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRoll();
            }}
            placeholder="+mod"
            aria-label="Check modifier"
            className="h-9 min-w-0 rounded-md border border-input bg-transparent px-2 text-sm focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            value={dc}
            onChange={(e) => setDc(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRoll();
            }}
            placeholder="Difficulty"
            aria-label="Check difficulty"
            className="h-9 min-w-0 rounded-md border border-input bg-transparent px-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <datalist id="scene-check-skills">
          {(SKILL_SUGGESTIONS_BY_SYSTEM[state.systemId ?? ''] ?? DEFAULT_SUGGESTIONS).map(
            (skill) => (
              <option key={skill} value={skill} />
            )
          )}
        </datalist>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2">
          <Select
            aria-label="Check roller"
            value={effectiveActor}
            onChange={(e) => setActorChoice(e.target.value)}
          >
            <option value="">Unattributed (GM)</option>
            {tokens.map((token) => (
              <option key={token.id} value={token.id}>
                {token.name}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Roll mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'normal' | SceneCheckMode)}
          >
            <option value="normal">Normal</option>
            <option value="advantage">Advantage</option>
            <option value="disadvantage">Disadvantage</option>
          </Select>
          <Button size="sm" disabled={!canRoll} onClick={handleRoll}>
            <Dices className="mr-1.5 h-4 w-4" />
            Roll
          </Button>
        </div>

        {recent.length > 0 && (
          <ol className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md border bg-muted/40 p-2 text-xs">
            {recent.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-muted-foreground">
                  <span className="font-medium text-foreground">{entry.label}</span>
                  {entry.actorTokenId && state.tokens[entry.actorTokenId]
                    ? ` (${state.tokens[entry.actorTokenId].name})`
                    : ''}
                  {': '}
                  d20 {entry.die}
                  {entry.discardedDie !== undefined && (
                    <span className="line-through"> {entry.discardedDie}</span>
                  )}
                  {entry.mode ? ` (${entry.mode === 'advantage' ? 'adv' : 'dis'})` : ''}
                  {entry.die === 20 ? ' nat20!' : entry.die === 1 ? ' nat1' : ''}
                  {entry.modifier >= 0 ? ` + ${entry.modifier}` : ` − ${Math.abs(entry.modifier)}`}
                  {' = '}
                  <span className="font-semibold text-foreground">{entry.total}</span>
                  {entry.dc !== undefined ? ` vs difficulty ${entry.dc}` : ''}
                </span>
                <Badge
                  variant="secondary"
                  className={`shrink-0 text-[10px] px-1.5 py-0 ${OUTCOME_BADGE[entry.outcome]}`}
                >
                  {OUTCOME_LABEL[entry.outcome]}
                </Badge>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
