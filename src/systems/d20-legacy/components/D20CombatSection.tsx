import React from 'react';
import { Shield, Heart, Swords, Footprints, Target } from 'lucide-react';
import { CharacterDocument } from '../../../types/core/document';
import { DamageHealControl } from '../../../components/DamageHealControl';
import { DiceRollButton } from '../../../components/DiceRollButton';
import { formatMod, parseNum } from '../../../utils/math';
import { Dnd35eDataModel } from '../../dnd35e/data-model';
import { Pf1eDataModel } from '../../pf1e/data-model';
import { systemRegistry } from '../../../registry';

interface Props {
  document: CharacterDocument<Dnd35eDataModel | Pf1eDataModel>;
  isPf1e: boolean;
  armorClass: { total: number; touch: number; flatFooted: number };
  hitPoints: { current: number; max: number; temp: number };
  baseAttackBonus: number;
  iterativeAttackBonuses: number[];
  initiative: number;
  speed: number;
  grapple?: number;
  cmb?: number;
  cmd?: number;
  canUpdate: boolean;
  onHitPointsChange: (current: number) => void;
  onApplyDamageOrHealing: (amount: number, type: 'damage' | 'heal') => void;
}

export const D20CombatSection: React.FC<Props> = ({
  document,
  isPf1e,
  armorClass,
  hitPoints,
  baseAttackBonus,
  iterativeAttackBonuses,
  initiative,
  speed,
  grapple,
  cmb,
  cmd,
  canUpdate,
  onHitPointsChange,
  onApplyDamageOrHealing,
}) => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> AC
          </div>
          <div className="text-3xl font-bold tabular-nums">{armorClass.total}</div>
        </div>
        <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Touch</div>
          <div className="text-2xl font-bold tabular-nums">{armorClass.touch}</div>
        </div>
        <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Flat-Footed</div>
          <div className="text-2xl font-bold tabular-nums">{armorClass.flatFooted}</div>
        </div>
        <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
            <Heart className="w-3 h-3" /> HP
          </div>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={hitPoints.current}
              onChange={(event) => onHitPointsChange(parseNum(event.target.value, 0))}
              className="w-12 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
              disabled={!canUpdate}
              title="Current HP"
            />
            <span className="text-muted-foreground">/</span>
            <span className="text-lg tabular-nums">{hitPoints.max}</span>
          </div>
          {canUpdate && <DamageHealControl onApply={onApplyDamageOrHealing} />}
        </div>
        <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
            <Swords className="w-3 h-3" /> BAB
          </div>
          <div className="text-2xl font-bold tabular-nums">{formatMod(baseAttackBonus)}</div>
          {iterativeAttackBonuses.length > 1 && (
            <div className="text-[10px] text-muted-foreground mt-1">
              {iterativeAttackBonuses.map(formatMod).join(' / ')}
            </div>
          )}
        </div>
        {isPf1e ? (
          <>
            <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
              <div className="text-xs font-medium text-muted-foreground">CMB</div>
              <div className="text-2xl font-bold tabular-nums">{formatMod(cmb ?? 0)}</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
              <div className="text-xs font-medium text-muted-foreground">CMD</div>
              <div className="text-2xl font-bold tabular-nums">{cmd ?? 10}</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
              <div className="text-xs font-medium text-muted-foreground">Grapple</div>
              <div className="text-2xl font-bold tabular-nums">{formatMod(grapple ?? 0)}</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
              <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
                <Footprints className="w-3 h-3" /> Speed
              </div>
              <div className="text-2xl font-bold tabular-nums">{speed} ft</div>
            </div>
          </>
        )}
      </div>

      {isPf1e && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
            <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
              <Target className="w-3 h-3" /> Initiative
            </div>
            <div className="text-2xl font-bold tabular-nums">{formatMod(initiative)}</div>
          </div>
          <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
            <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
              <Footprints className="w-3 h-3" /> Speed
            </div>
            <div className="text-2xl font-bold tabular-nums">{speed} ft</div>
          </div>
        </div>
      )}

      <section className="bg-card p-3 rounded-lg border">
        <h3 className="text-sm font-semibold mb-2">Quick Rolls</h3>
        <div className="flex flex-wrap items-center gap-2">
          <DiceRollButton
            label="Attack Roll"
            onRoll={() =>
              systemRegistry.get(document.systemId)!.engine.rollCheck(document, 'attack')
            }
          />
          {isPf1e ? (
            <DiceRollButton
              label="Combat Maneuver"
              onRoll={() =>
                systemRegistry.get(document.systemId)!.engine.rollCheck(document, 'cmb')
              }
            />
          ) : (
            <DiceRollButton
              label="Grapple Check"
              onRoll={() =>
                systemRegistry.get(document.systemId)!.engine.rollCheck(document, 'grapple')
              }
            />
          )}
        </div>
      </section>
    </>
  );
};
