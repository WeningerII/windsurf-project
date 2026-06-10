import React from 'react';
import { Zap } from 'lucide-react';
import type { PactMagicSlots, SpellSlots } from '../types/core/character';

interface Props {
  slots: SpellSlots;
  /** Warlock Pact Magic pool (separate short-rest slots, one shared level). */
  pactMagic?: PactMagicSlots;
  onUseSlot?: (level: number) => void;
  onRecoverSlot?: (level: number) => void;
  onUsePactSlot?: () => void;
  onRecoverPactSlot?: () => void;
  onRecoverAll?: () => void;
}

type SlotKey = keyof SpellSlots;
const SLOT_LEVELS: SlotKey[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const SpellSlotTracker: React.FC<Props> = ({
  slots,
  pactMagic,
  onUseSlot,
  onRecoverSlot,
  onUsePactSlot,
  onRecoverPactSlot,
  onRecoverAll,
}) => {
  const hasStandardSlots = SLOT_LEVELS.some((k) => slots[k].max > 0);
  const hasPactSlots = (pactMagic?.max ?? 0) > 0;
  if (!hasStandardSlots && !hasPactSlots) return null;

  const pactRemaining = pactMagic ? pactMagic.max - pactMagic.used : 0;

  return (
    <section className="bg-card p-4 rounded-lg border space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5" /> Spell Slots
        </h3>
        {onRecoverAll && (
          <button
            onClick={onRecoverAll}
            className="text-xs px-2 py-1 rounded border border-input hover:bg-muted transition-colors"
          >
            Recover All
          </button>
        )}
      </div>
      {hasStandardSlots && (
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {SLOT_LEVELS.map((level) => {
            const slot = slots[level];
            if (slot.max === 0) return null;
            const remaining = slot.max - slot.used;
            return (
              <div key={level} className="text-center space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Lvl {level}</div>
                <div className="flex justify-center gap-0.5 flex-wrap">
                  {Array.from({ length: slot.max }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (i < remaining && onUseSlot) onUseSlot(level);
                        else if (i >= remaining && onRecoverSlot) onRecoverSlot(level);
                      }}
                      disabled={!onUseSlot && !onRecoverSlot}
                      className={`w-5 h-5 rounded-full border-2 transition-colors ${
                        i < remaining
                          ? 'bg-primary border-primary/80 hover:bg-primary/80'
                          : 'border-input hover:border-primary/50'
                      }`}
                      title={
                        i < remaining ? `Use level ${level} slot` : `Recover level ${level} slot`
                      }
                    />
                  ))}
                </div>
                <div className="text-xs tabular-nums text-muted-foreground">
                  {remaining}/{slot.max}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {hasPactSlots && pactMagic && (
        <div className="flex items-center gap-3 border-t border-input pt-2">
          <div className="text-xs font-medium text-muted-foreground">
            Pact Magic (Lvl {pactMagic.level})
          </div>
          <div className="flex gap-0.5 flex-wrap">
            {Array.from({ length: pactMagic.max }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (i < pactRemaining && onUsePactSlot) onUsePactSlot();
                  else if (i >= pactRemaining && onRecoverPactSlot) onRecoverPactSlot();
                }}
                disabled={!onUsePactSlot && !onRecoverPactSlot}
                className={`w-5 h-5 rounded-full border-2 transition-colors ${
                  i < pactRemaining
                    ? 'bg-primary border-primary/80 hover:bg-primary/80'
                    : 'border-input hover:border-primary/50'
                }`}
                title={i < pactRemaining ? 'Use pact slot' : 'Recover pact slot'}
              />
            ))}
          </div>
          <div className="text-xs tabular-nums text-muted-foreground">
            {pactRemaining}/{pactMagic.max}
          </div>
        </div>
      )}
    </section>
  );
};
