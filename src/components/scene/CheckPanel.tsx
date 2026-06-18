import { useState } from 'react';
import { Dices } from 'lucide-react';
import type { SceneCheckLogEntry, SceneCheckMode, SceneState } from '../../types/core/scene';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';

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

/** Common d20 skill labels across systems; the input stays free-text. */
const SKILL_SUGGESTIONS = [
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
];

const OUTCOME_BADGE: Record<SceneCheckLogEntry['outcome'], string> = {
  success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  failure: 'bg-destructive/15 text-destructive',
  unresolved: '',
};

const OUTCOME_LABEL: Record<SceneCheckLogEntry['outcome'], string> = {
  success: 'Success',
  failure: 'Failure',
  unresolved: 'No DC',
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
  const [actorTokenId, setActorTokenId] = useState('');
  const [mode, setMode] = useState<'normal' | SceneCheckMode>('normal');

  const tokens = Object.values(state.tokens);
  // Default the roller to the selected token until the user picks one.
  const effectiveActor = actorTokenId || (actorId && state.tokens[actorId] ? actorId : '');

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

  const recent = [...state.checkLog].reverse();

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
            placeholder="DC"
            aria-label="Check DC"
            className="h-9 min-w-0 rounded-md border border-input bg-transparent px-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <datalist id="scene-check-skills">
          {SKILL_SUGGESTIONS.map((skill) => (
            <option key={skill} value={skill} />
          ))}
        </datalist>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2">
          <Select
            aria-label="Check roller"
            value={effectiveActor}
            onChange={(e) => setActorTokenId(e.target.value)}
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
                  {entry.dc !== undefined ? ` vs DC ${entry.dc}` : ''}
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
