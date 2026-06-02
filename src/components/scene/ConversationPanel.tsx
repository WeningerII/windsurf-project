import { Megaphone, Users } from 'lucide-react';
import type { SceneState } from '../../types/core/scene';
import { ATTITUDES, type Attitude, type SocialApproach } from '../../rules';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';

const APPROACHES: SocialApproach[] = ['persuasion', 'deception', 'intimidation'];

/** Color the attitude badge from hostile (red) → helpful (green). */
function attitudeVariant(attitude: string): 'destructive' | 'secondary' | 'default' {
  if (attitude === 'hostile' || attitude === 'unfriendly') return 'destructive';
  if (attitude === 'friendly' || attitude === 'helpful') return 'default';
  return 'secondary';
}

interface ConversationPanelProps {
  state: SceneState;
  /** The selected token, used as the speaker. */
  speakerId?: string;
  approach: SocialApproach;
  onApproachChange: (approach: SocialApproach) => void;
  baseDC: string;
  onBaseDCChange: (value: string) => void;
  modifier: string;
  onModifierChange: (value: string) => void;
  onSetAttitude: (tokenId: string, attitude: Attitude) => void;
  onAddress: () => void;
  log: string[];
}

/**
 * The social loop's controls: pick a speaker (the selected token), an approach,
 * and a difficulty, then address the room — every NPC reacts on its own
 * attitude-adjusted DC. NPC dispositions are listed and editable, and a rolling
 * log shows each shift. All resolution goes through the event-sourced scene path.
 */
export function ConversationPanel({
  state,
  speakerId,
  approach,
  onApproachChange,
  baseDC,
  onBaseDCChange,
  modifier,
  onModifierChange,
  onSetAttitude,
  onAddress,
  log,
}: ConversationPanelProps) {
  const speaker = speakerId ? state.tokens[speakerId] : undefined;
  const npcs = Object.values(state.tokens).filter((token) => token.kind === 'npc');
  const canAddress = Boolean(speaker) && npcs.length > 0;

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-sm font-semibold">
          <Users className="h-4 w-4" /> Conversation
        </h5>
        <Button variant="outline" size="sm" disabled={!canAddress} onClick={onAddress}>
          <Megaphone className="mr-1.5 h-4 w-4" />
          Address {npcs.length} NPC{npcs.length === 1 ? '' : 's'}
        </Button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="text-muted-foreground">
          {speaker ? (
            <>
              Speaker: <span className="font-medium text-foreground">{speaker.name}</span>
            </>
          ) : (
            'Select a token on the grid to speak.'
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Select
            aria-label="Social approach"
            value={approach}
            onChange={(event) => onApproachChange(event.target.value as SocialApproach)}
          >
            {APPROACHES.map((a) => (
              <option key={a} value={a}>
                {a[0].toUpperCase() + a.slice(1)}
              </option>
            ))}
          </Select>
          <Input
            aria-label="Conversation base DC"
            inputMode="numeric"
            value={baseDC}
            onChange={(event) => onBaseDCChange(event.target.value)}
            placeholder="DC"
          />
          <Input
            aria-label="Speaker social modifier"
            inputMode="numeric"
            value={modifier}
            onChange={(event) => onModifierChange(event.target.value)}
            placeholder="Mod"
          />
        </div>

        {npcs.length === 0 ? (
          <div className="text-xs text-muted-foreground">
            Place NPC tokens for the party to converse with.
          </div>
        ) : (
          <div className="space-y-1">
            {npcs.map((npc) => (
              <div
                key={npc.id}
                className="grid grid-cols-[minmax(0,1fr)_auto_minmax(7rem,9rem)] items-center gap-2 rounded border px-2 py-1"
              >
                <span className="min-w-0 truncate">{npc.name}</span>
                <Badge variant={attitudeVariant(npc.attitude ?? 'indifferent')}>
                  {npc.attitude ?? 'indifferent'}
                </Badge>
                <Select
                  aria-label={`${npc.name} attitude`}
                  value={npc.attitude ?? 'indifferent'}
                  onChange={(event) => onSetAttitude(npc.id, event.target.value as Attitude)}
                >
                  {ATTITUDES.map((attitude) => (
                    <option key={attitude} value={attitude}>
                      {attitude}
                    </option>
                  ))}
                </Select>
              </div>
            ))}
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
