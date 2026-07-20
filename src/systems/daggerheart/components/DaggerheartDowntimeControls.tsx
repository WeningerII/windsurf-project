import { Heart, Moon, Shield, Star, Sun, Zap } from 'lucide-react';

interface Props {
  canUpdate: boolean;
  onTendToAllWounds: () => void;
  onClearAllStress: () => void;
  onRepairAllArmor: () => void;
  onPrepare: () => void;
  onShortTendToWounds: () => void;
  onShortClearStress: () => void;
  onShortRepairArmor: () => void;
}

const MOVE_BUTTON_CLASS =
  'inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:border-primary hover:text-primary disabled:opacity-50';

/**
 * Downtime moves for Daggerheart. Rest is move-based — a long rest is two moves,
 * a short rest is one — so these are offered as individual, honestly-labeled
 * actions rather than a single "reset everything" button. Long-rest moves clear
 * a whole track; short-rest moves clear `1d4 + tier` (the handler rolls a fresh
 * live d4 on each click). Only the narrative "Work on a Project" move stays
 * GM-adjudicated; nothing below fakes a roll or a choice.
 */
export function DaggerheartDowntimeControls({
  canUpdate,
  onTendToAllWounds,
  onClearAllStress,
  onRepairAllArmor,
  onPrepare,
  onShortTendToWounds,
  onShortClearStress,
  onShortRepairArmor,
}: Props) {
  return (
    <section className="rounded-lg border bg-muted/30 p-3">
      <h5 className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Moon className="h-3.5 w-3.5" /> Long-rest downtime moves
      </h5>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          className={MOVE_BUTTON_CLASS}
          onClick={onTendToAllWounds}
          disabled={!canUpdate}
          title="Clear all marked Hit Points"
        >
          <Heart className="h-3 w-3" /> Tend to All Wounds
        </button>
        <button
          type="button"
          className={MOVE_BUTTON_CLASS}
          onClick={onClearAllStress}
          disabled={!canUpdate}
          title="Clear all marked Stress"
        >
          <Zap className="h-3 w-3" /> Clear All Stress
        </button>
        <button
          type="button"
          className={MOVE_BUTTON_CLASS}
          onClick={onRepairAllArmor}
          disabled={!canUpdate}
          title="Clear all marked Armor Slots"
        >
          <Shield className="h-3 w-3" /> Repair All Armor
        </button>
        <button
          type="button"
          className={MOVE_BUTTON_CLASS}
          onClick={onPrepare}
          disabled={!canUpdate}
          title="Gain 1 Hope"
        >
          <Star className="h-3 w-3" /> Prepare
        </button>
      </div>
      <h5 className="mb-1 mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Sun className="h-3.5 w-3.5" /> Short-rest downtime moves (clear 1d4 + tier)
      </h5>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          className={MOVE_BUTTON_CLASS}
          onClick={onShortTendToWounds}
          disabled={!canUpdate}
          title="Heal 1d4 + tier Hit Points"
        >
          <Heart className="h-3 w-3" /> Tend to Wounds
        </button>
        <button
          type="button"
          className={MOVE_BUTTON_CLASS}
          onClick={onShortClearStress}
          disabled={!canUpdate}
          title="Clear 1d4 + tier marked Stress"
        >
          <Zap className="h-3 w-3" /> Clear Stress
        </button>
        <button
          type="button"
          className={MOVE_BUTTON_CLASS}
          onClick={onShortRepairArmor}
          disabled={!canUpdate}
          title="Clear 1d4 + tier marked Armor Slots"
        >
          <Shield className="h-3 w-3" /> Repair Armor
        </button>
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        You make two downtime moves on a long rest and one on a short rest; short-rest moves clear a
        fresh 1d4 + tier per click. Work on a Project is GM-adjudicated.
      </p>
    </section>
  );
}
