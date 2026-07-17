import { Heart, Moon, Shield, Star, Zap } from 'lucide-react';

interface Props {
  canUpdate: boolean;
  onTendToAllWounds: () => void;
  onClearAllStress: () => void;
  onRepairAllArmor: () => void;
  onPrepare: () => void;
}

const MOVE_BUTTON_CLASS =
  'inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:border-primary hover:text-primary disabled:opacity-50';

/**
 * Long-rest downtime moves for Daggerheart. Rest is move-based — a long rest is
 * two downtime moves — so these are offered as individual, honestly-labeled
 * actions rather than a single "reset everything" button. The short-rest
 * `1d4 + tier` variants and the narrative "Work on a Project" move are not here
 * (they stay GM-adjudicated); nothing below fakes a roll or a choice.
 */
export function DaggerheartDowntimeControls({
  canUpdate,
  onTendToAllWounds,
  onClearAllStress,
  onRepairAllArmor,
  onPrepare,
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
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        You make two downtime moves on a long rest. Short-rest moves (clear 1d4 + tier) and Work on
        a Project are GM-adjudicated.
      </p>
    </section>
  );
}
