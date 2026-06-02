import { Dices, Mountain } from 'lucide-react';
import type { SceneState } from '../../types/core/scene';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface SkillChallengePanelProps {
  state: SceneState;
  successesNeeded: string;
  onSuccessesNeededChange: (value: string) => void;
  failuresAllowed: string;
  onFailuresAllowedChange: (value: string) => void;
  dc: string;
  onDcChange: (value: string) => void;
  modifier: string;
  onModifierChange: (value: string) => void;
  skill: string;
  onSkillChange: (value: string) => void;
  onAttempt: () => void;
  /** Result outcome ('success' | 'failure') once attempted, else undefined. */
  outcome?: 'success' | 'failure';
  log: string[];
}

/**
 * The exploration / skill-challenge controls: the party (every character token)
 * contributes checks toward a goal — X successes before Y failures — through the
 * deterministic group resolver. A rolling log shows each member's attempt and the
 * verdict. The N-participant principle for non-combat: the whole party pushes.
 */
export function SkillChallengePanel({
  state,
  successesNeeded,
  onSuccessesNeededChange,
  failuresAllowed,
  onFailuresAllowedChange,
  dc,
  onDcChange,
  modifier,
  onModifierChange,
  skill,
  onSkillChange,
  onAttempt,
  outcome,
  log,
}: SkillChallengePanelProps) {
  const party = Object.values(state.tokens).filter((token) => token.kind === 'character');
  const canAttempt = party.length > 0;

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-sm font-semibold">
          <Mountain className="h-4 w-4" /> Skill Challenge
          {outcome && (
            <Badge variant={outcome === 'success' ? 'default' : 'destructive'}>{outcome}</Badge>
          )}
        </h5>
        <Button variant="outline" size="sm" disabled={!canAttempt} onClick={onAttempt}>
          <Dices className="mr-1.5 h-4 w-4" />
          Attempt
        </Button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="text-muted-foreground">
          Party: <span className="font-medium text-foreground">{party.length}</span> character
          {party.length === 1 ? '' : 's'} contributing.
        </div>

        <Input
          aria-label="Challenge skill"
          value={skill}
          onChange={(event) => onSkillChange(event.target.value)}
          placeholder="Skill (e.g. survival)"
        />
        <div className="grid grid-cols-4 gap-2">
          <Input
            aria-label="Successes needed"
            inputMode="numeric"
            value={successesNeeded}
            onChange={(event) => onSuccessesNeededChange(event.target.value)}
            placeholder="Succ"
          />
          <Input
            aria-label="Failures allowed"
            inputMode="numeric"
            value={failuresAllowed}
            onChange={(event) => onFailuresAllowedChange(event.target.value)}
            placeholder="Fail"
          />
          <Input
            aria-label="Challenge DC"
            inputMode="numeric"
            value={dc}
            onChange={(event) => onDcChange(event.target.value)}
            placeholder="DC"
          />
          <Input
            aria-label="Party skill modifier"
            inputMode="numeric"
            value={modifier}
            onChange={(event) => onModifierChange(event.target.value)}
            placeholder="Mod"
          />
        </div>

        {party.length === 0 && (
          <div className="text-xs text-muted-foreground">
            Place character tokens for the party to attempt a challenge.
          </div>
        )}

        {log.length > 0 && (
          <ol className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md border bg-muted/40 p-2 text-xs">
            {log.map((line, index) => (
              <li key={`${index}-${line}`} className="text-muted-foreground">
                {line}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
