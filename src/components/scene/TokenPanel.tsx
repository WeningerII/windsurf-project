import { Dices, Plus, Trash2 } from 'lucide-react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { SceneAllegiance, SceneTokenKind } from '../../types/core/scene';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface TokenPanelProps {
  eligibleDocuments: CharacterDocument<SystemDataModel>[];
  tokenDocumentId: string;
  onSelectLinkedDocument: (documentId: string) => void;
  tokenName: string;
  onTokenNameChange: (value: string) => void;
  tokenKind: SceneTokenKind;
  onTokenKindChange: (value: SceneTokenKind) => void;
  /** Side a placed NPC fights on (only shown for the npc kind). */
  tokenAllegiance: SceneAllegiance;
  onTokenAllegianceChange: (value: SceneAllegiance) => void;
  /** Creature statblocks an NPC can be backed by (the scene's loaded catalog). */
  eligibleStatblocks: { id: string; name: string }[];
  tokenStatblockId: string;
  onSelectStatblock: (statblockId: string) => void;
  /** Roll up a random NPC (name + a catalog statblock) and enter placement. */
  onGenerateNpc: () => void;
  isPlacing: boolean;
  onTogglePlace: () => void;
  /**
   * Whether the click-to-place button renders (Phase 4). Default true. When
   * scene-drag is enabled SceneManager hides it so exactly one character
   * placement affordance (the drag) exists — mutual exclusion, Finding 21.
   */
  showPlaceButton?: boolean;
  canDeleteToken: boolean;
  onDeleteSelectedToken: () => void;
  /** Condition ids offered for the selected token (empty hides the section). */
  conditionOptions?: readonly string[];
  /** The selected token's active conditions. */
  selectedTokenConditions?: readonly string[];
  onToggleSelectedTokenCondition?: (conditionId: string) => void;
  /** The selected token's current side (undefined hides the re-side control). */
  selectedTokenSide?: SceneAllegiance;
  onSetSelectedTokenSide?: (value: SceneAllegiance) => void;
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
  tokenAllegiance,
  onTokenAllegianceChange,
  eligibleStatblocks,
  tokenStatblockId,
  onSelectStatblock,
  onGenerateNpc,
  isPlacing,
  onTogglePlace,
  showPlaceButton = true,
  canDeleteToken,
  onDeleteSelectedToken,
  conditionOptions = [],
  selectedTokenConditions = [],
  onToggleSelectedTokenCondition,
  selectedTokenSide,
  onSetSelectedTokenSide,
}: TokenPanelProps) {
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
          >
            <option value="character">Character</option>
            {/* A linked sheet backs a character or an NPC; monster/object are
                only for manual (unlinked) tokens. */}
            {!tokenDocumentId && <option value="monster">Monster</option>}
            <option value="npc">NPC</option>
            {!tokenDocumentId && <option value="object">Object</option>}
          </Select>
        </div>
        {tokenKind === 'npc' && (
          <>
            <Select
              aria-label="NPC side"
              value={tokenAllegiance}
              onChange={(event) => onTokenAllegianceChange(event.target.value as SceneAllegiance)}
            >
              <option value="hostile">Enemy (fights the party)</option>
              <option value="party">Ally (fights with the party)</option>
              <option value="neutral">Neutral (bystander)</option>
            </Select>
            {/* Back the NPC with a creature statblock (mechanically real), or
                roll one up. A linked sheet takes precedence over this. */}
            {!tokenDocumentId && eligibleStatblocks.length > 0 && (
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <Select
                  aria-label="NPC statblock"
                  value={tokenStatblockId}
                  onChange={(event) => onSelectStatblock(event.target.value)}
                >
                  <option value="">No statblock (manual)</option>
                  {eligibleStatblocks.map((statblock) => (
                    <option key={statblock.id} value={statblock.id}>
                      {statblock.name}
                    </option>
                  ))}
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGenerateNpc}
                  title="Roll up a random NPC (name + statblock)"
                >
                  <Dices className="mr-1.5 h-4 w-4" />
                  Generate
                </Button>
              </div>
            )}
          </>
        )}
        {showPlaceButton && (
          <Button
            variant={isPlacing ? 'default' : 'outline'}
            size="sm"
            className="w-full"
            onClick={onTogglePlace}
            disabled={!tokenName.trim() && !tokenDocumentId && !tokenStatblockId}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Place Token
          </Button>
        )}
        {selectedTokenSide && onSetSelectedTokenSide && (
          <div>
            <div className="mb-1 text-xs font-medium text-muted-foreground">
              Selected token side
            </div>
            <Select
              aria-label="Selected token side"
              value={selectedTokenSide}
              onChange={(event) => onSetSelectedTokenSide(event.target.value as SceneAllegiance)}
            >
              <option value="party">Ally (with the party)</option>
              <option value="hostile">Enemy (against the party)</option>
              <option value="neutral">Neutral (bystander)</option>
            </Select>
          </div>
        )}
        {conditionOptions.length > 0 && onToggleSelectedTokenCondition && (
          <div>
            <div className="mb-1 text-xs font-medium text-muted-foreground">
              Conditions {!canDeleteToken && '(select a token)'}
            </div>
            <div className="flex flex-wrap gap-1">
              {conditionOptions.map((conditionId) => {
                const active = selectedTokenConditions.includes(conditionId);
                return (
                  <button
                    key={conditionId}
                    type="button"
                    disabled={!canDeleteToken}
                    onClick={() => onToggleSelectedTokenCondition(conditionId)}
                    className={`rounded border px-1.5 py-0.5 text-[11px] capitalize transition-colors disabled:opacity-50 ${
                      active
                        ? 'border-amber-500 bg-amber-500/15 text-amber-600'
                        : 'text-muted-foreground hover:border-primary hover:text-primary'
                    }`}
                    title={`${active ? 'Clear' : 'Apply'} ${conditionId} on the selected token — applied under this system's rules in combat`}
                  >
                    {conditionId}
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
