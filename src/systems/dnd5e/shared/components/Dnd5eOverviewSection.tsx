import { BookOpen, Heart, Shield, Sparkles, Target } from 'lucide-react';
import { DamageHealControl } from '../../../../components/DamageHealControl';
import { DeathSavesTracker } from '../../../../components/DeathSavesTracker';
import { HitDiceTracker } from '../../../../components/HitDiceTracker';
import { RestControls } from '../../../../components/RestControls';
import { CombatStatCard } from '../../../../components/sheet';
import { SpellSlotTracker } from '../../../../components/SpellSlotTracker';
import type { DeathSaves, HitDice, SpellSlots } from '../../../../types/core/character';
import { formatMod, parseNum } from '../../../../utils/math';

type HitPoints = {
  current: number;
  max: number;
  temp: number;
};

interface Props {
  armorClass: number;
  hitPoints: HitPoints;
  initiative: number;
  speed: number;
  spellcasting?: {
    classes: Array<unknown>;
    spellSlots: SpellSlots;
  };
  exhaustionLevel?: number;
  deathSaves: DeathSaves;
  hitDice: HitDice[];
  canUpdate: boolean;
  onHitPointsChange?: (hitPoints: { current?: number; max?: number }) => void;
  onDamageHeal?: (amount: number, type: 'damage' | 'heal') => void;
  onExhaustionChange?: (level: number) => void;
  onShortRest?: () => void;
  onLongRest?: () => void;
  onDeathSavesChange?: (deathSaves: DeathSaves) => void;
  onSpendHitDie?: (index: number) => void;
  onRecoverHitDie?: (index: number) => void;
  onUseSpellSlot?: (level: number) => void;
  onRecoverSpellSlot?: (level: number) => void;
  onRecoverAllSpellSlots?: () => void;
}

function spellSlotCount(slots?: SpellSlots): number {
  if (!slots) {
    return 0;
  }

  return Object.values(slots).reduce((total, slot) => total + slot.max, 0);
}

export function Dnd5eOverviewSection({
  armorClass,
  hitPoints,
  initiative,
  speed,
  spellcasting,
  exhaustionLevel,
  deathSaves,
  hitDice,
  canUpdate,
  onHitPointsChange,
  onDamageHeal,
  onExhaustionChange,
  onShortRest,
  onLongRest,
  onDeathSavesChange,
  onSpendHitDie,
  onRecoverHitDie,
  onUseSpellSlot,
  onRecoverSpellSlot,
  onRecoverAllSpellSlots,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <CombatStatCard icon={Shield} title="Armor Class" value={armorClass} />
        <CombatStatCard
          icon={Heart}
          title="Hit Points"
          value={`${hitPoints.current}/${hitPoints.max}`}
        >
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <input
                type="number"
                value={hitPoints.current}
                onChange={(event) =>
                  onHitPointsChange?.({ current: parseNum(event.target.value, 0) })
                }
                className="w-16 text-center text-3xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                title="Current hit points"
                disabled={!canUpdate}
              />
              <span className="text-muted-foreground">/</span>
              <input
                type="number"
                value={hitPoints.max}
                onChange={(event) => onHitPointsChange?.({ max: parseNum(event.target.value, 1) })}
                className="w-16 text-center text-lg bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                title="Maximum hit points"
                disabled={!canUpdate}
              />
            </div>
            {hitPoints.temp > 0 && (
              <div className="text-xs text-blue-500 tabular-nums">+{hitPoints.temp} temp</div>
            )}
            {canUpdate && onDamageHeal && <DamageHealControl onApply={onDamageHeal} />}
          </div>
        </CombatStatCard>
        <CombatStatCard icon={Target} title="Initiative" value={formatMod(initiative)} />
        <CombatStatCard icon={Sparkles} title="Speed" value={`${speed} ft`} />
        <CombatStatCard
          icon={BookOpen}
          title="Spell Slots"
          value={spellSlotCount(spellcasting?.spellSlots)}
          subtitle={
            spellcasting ? `${spellcasting.classes.length} casting class(es)` : 'No spellcasting'
          }
        />
      </div>

      <RestControls
        exhaustionLevel={exhaustionLevel}
        onExhaustionChange={canUpdate ? onExhaustionChange : undefined}
        onShortRest={canUpdate ? onShortRest : undefined}
        onLongRest={canUpdate ? onLongRest : undefined}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DeathSavesTracker
          currentHP={hitPoints.current}
          deathSaves={deathSaves}
          onChange={canUpdate ? onDeathSavesChange : undefined}
        />
        <HitDiceTracker
          hitDice={hitDice}
          onSpend={canUpdate ? onSpendHitDie : undefined}
          onRecover={canUpdate ? onRecoverHitDie : undefined}
          onLongRest={canUpdate ? onLongRest : undefined}
        />
        {spellcasting && (
          <SpellSlotTracker
            slots={spellcasting.spellSlots}
            onUseSlot={canUpdate ? onUseSpellSlot : undefined}
            onRecoverSlot={canUpdate ? onRecoverSpellSlot : undefined}
            onRecoverAll={canUpdate ? onRecoverAllSpellSlots : undefined}
          />
        )}
      </div>
    </>
  );
}
