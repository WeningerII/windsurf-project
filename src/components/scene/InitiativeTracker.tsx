import { RotateCcw, Swords } from 'lucide-react';
import type { SceneToken } from '../../types/core/scene';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface InitiativeTrackerProps {
  tokens: Record<string, SceneToken>;
  initiativeValues: Record<string, string>;
  onInitiativeChange: (tokenId: string, value: string) => void;
  onAdvanceTurn: () => void;
  onSetOrder: () => void;
}

/** Per-token initiative inputs, "Set Order", and "Next Turn". */
export function InitiativeTracker({
  tokens,
  initiativeValues,
  onInitiativeChange,
  onAdvanceTurn,
  onSetOrder,
}: InitiativeTrackerProps) {
  const tokenList = Object.values(tokens);
  const hasTokens = tokenList.length > 0;

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="text-sm font-semibold">Initiative</h5>
        <Button variant="outline" size="sm" disabled={!hasTokens} onClick={onAdvanceTurn}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Next Turn
        </Button>
      </div>
      <div className="space-y-2">
        {tokenList.map((token) => (
          <label
            key={token.id}
            className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-2 text-sm"
          >
            <span className="truncate">{token.name}</span>
            <Input
              aria-label={`${token.name} initiative`}
              inputMode="numeric"
              value={initiativeValues[token.id] ?? '10'}
              onChange={(event) => onInitiativeChange(token.id, event.target.value)}
            />
          </label>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={!hasTokens}
          onClick={onSetOrder}
        >
          <Swords className="mr-1.5 h-4 w-4" />
          Set Order
        </Button>
      </div>
    </div>
  );
}
