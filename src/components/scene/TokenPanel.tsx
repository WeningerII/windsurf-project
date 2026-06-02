import { useState } from 'react';
import { Heart, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { SceneTokenKind } from '../../types/core/scene';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

/** Common tabletop conditions a token can carry (5e drives advantage from some). */
const COMMON_CONDITIONS = [
  'prone',
  'grappled',
  'restrained',
  'blinded',
  'frightened',
  'poisoned',
  'stunned',
  'unconscious',
  'invisible',
] as const;

interface TokenPanelProps {
  eligibleDocuments: CharacterDocument<SystemDataModel>[];
  tokenDocumentId: string;
  onSelectLinkedDocument: (documentId: string) => void;
  tokenName: string;
  onTokenNameChange: (value: string) => void;
  tokenKind: SceneTokenKind;
  onTokenKindChange: (value: SceneTokenKind) => void;
  isPlacing: boolean;
  onTogglePlace: () => void;
  canDeleteToken: boolean;
  onDeleteSelectedToken: () => void;
  /** The selected token's HP, when it has any — enables the damage/heal control. */
  selectedTokenHp?: { current: number; max: number; temp?: number };
  /** Apply a signed HP delta (apply-damage semantics: positive damages, negative heals). */
  onApplyHpDelta?: (amount: number) => void;
  /** The selected token's active conditions (present when a token is selected). */
  selectedTokenStatuses?: string[];
  /** Replace the selected token's conditions. */
  onSetStatuses?: (statuses: string[]) => void;
}

/** Token controls: link a character (or define a manual token) and place it. */
export function TokenPanel({
  eligibleDocuments,
  tokenDocumentId,
  onSelectLinkedDocument,
  tokenName,
  onTokenNameChange,
  tokenKind,
  onTokenKindChange,
  isPlacing,
  onTogglePlace,
  canDeleteToken,
  onDeleteSelectedToken,
  selectedTokenHp,
  onApplyHpDelta,
  selectedTokenStatuses,
  onSetStatuses,
}: TokenPanelProps) {
  const [hpAmount, setHpAmount] = useState('');
  const amount = Math.max(0, Math.floor(Number(hpAmount) || 0));
  const active = new Set(selectedTokenStatuses ?? []);
  const toggleStatus = (condition: string) => {
    const next = new Set(active);
    if (next.has(condition)) next.delete(condition);
    else next.add(condition);
    onSetStatuses?.([...next]);
  };
  const applyHp = (signed: number) => {
    onApplyHpDelta?.(signed);
    setHpAmount('');
  };
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="text-sm font-semibold">Token</h5>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={!canDeleteToken}
          onClick={onDeleteSelectedToken}
          title="Remove token"
          aria-label="Remove token"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Select
          aria-label="Linked character"
          value={tokenDocumentId}
          onChange={(event) => onSelectLinkedDocument(event.target.value)}
        >
          <option value="">Manual token</option>
          {eligibleDocuments.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </Select>
        <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] gap-2">
          <Input
            aria-label="Token name"
            value={tokenName}
            onChange={(event) => onTokenNameChange(event.target.value)}
            placeholder="Token name"
          />
          <Select
            aria-label="Token kind"
            value={tokenKind}
            onChange={(event) => onTokenKindChange(event.target.value as SceneTokenKind)}
            disabled={Boolean(tokenDocumentId)}
          >
            <option value="character">Character</option>
            <option value="monster">Monster</option>
            <option value="npc">NPC</option>
            <option value="object">Object</option>
          </Select>
        </div>
        <Button
          variant={isPlacing ? 'default' : 'outline'}
          size="sm"
          className="w-full"
          onClick={onTogglePlace}
          disabled={!tokenName.trim() && !tokenDocumentId}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Place Token
        </Button>

        {selectedTokenHp && onApplyHpDelta && (
          <div className="space-y-1.5 border-t pt-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Heart className="h-3.5 w-3.5" />
              Hit Points: {Math.max(0, selectedTokenHp.current)}/{selectedTokenHp.max}
              {selectedTokenHp.temp ? ` (+${selectedTokenHp.temp} temp)` : ''}
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2">
              <Input
                aria-label="HP amount"
                type="number"
                min={0}
                value={hpAmount}
                onChange={(event) => setHpAmount(event.target.value)}
                placeholder="Amount"
              />
              <Button
                size="sm"
                variant="outline"
                disabled={amount <= 0}
                onClick={() => applyHp(amount)}
                title="Apply damage"
              >
                Damage
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={amount <= 0}
                onClick={() => applyHp(-amount)}
                title="Restore hit points"
              >
                Heal
              </Button>
            </div>
          </div>
        )}

        {selectedTokenStatuses && onSetStatuses && (
          <div className="space-y-1.5 border-t pt-2">
            <div className="text-xs font-medium text-muted-foreground">Conditions</div>
            <div className="flex flex-wrap gap-1">
              {COMMON_CONDITIONS.map((condition) => {
                const on = active.has(condition);
                return (
                  <button
                    key={condition}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleStatus(condition)}
                    className={cn(
                      'rounded border px-1.5 py-0.5 text-[11px] capitalize transition-colors',
                      on
                        ? 'border-amber-500 bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {condition}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
