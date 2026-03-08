import React from 'react';
import { Shield, Swords, Footprints, Target, Flame } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { DiceRollButton } from '../../../components/DiceRollButton';
import { formatMod } from '../../../utils/math';
import { Pf1eDataModel } from '../../pf1e/data-model';
import { RollResult } from '../../../registry/types';
import { systemRegistry } from '../../../registry';

interface Props {
  document: any;
  sys: any;
  isPf1e: boolean;
  pf1Data: Pf1eDataModel | null;
}

export const D20CombatSection: React.FC<Props> = ({ document, sys, isPf1e, pf1Data }) => {
  const { baseAttackBonus: bab, armorClass: ac, initiative, speed, grapple } = sys;

  const handleRoll = async (checkId: string): Promise<RollResult> => {
    const engine = systemRegistry.get(document.systemId)?.engine;
    if (engine?.rollCheck) {
      return engine.rollCheck(document, checkId);
    }
    return {
      total: 0,
      formula: '1d20',
      terms: [0],
      flavor: 'Unknown',
    };
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
      {/* AC Section */}
      <div className="bg-card border rounded-lg p-3">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Shield className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Armor Class</span>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold">{ac.total}</span>
          <div className="text-xs text-muted-foreground text-right space-y-0.5">
            <div>Touch {ac.touch}</div>
            <div>Flat {ac.flatFooted}</div>
          </div>
        </div>
      </div>

      {/* Speed & Initiative Section */}
      <div className="bg-card border rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Footprints className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Speed</span>
          </div>
          <span className="font-medium">{speed.base} ft</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="w-4 h-4 text-orange-500/70" />
            <span className="text-xs font-semibold uppercase tracking-wider">Init</span>
          </div>
          <DiceRollButton
            label={formatMod(initiative.total)}
            onRoll={() => handleRoll('initiative')}
            size="sm"
            className="h-6 px-2 -mr-2 font-medium"
          />
        </div>
      </div>

      {/* Combat Stats Section */}
      <div className="bg-card border rounded-lg p-3">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Swords className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">BAB / Melee</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="secondary">BAB {formatMod(bab)}</Badge>
          <Badge variant="outline">
            Melee {formatMod(bab + (sys.baseAttributes.str.mod || 0))}
          </Badge>
          <Badge variant="outline">
            Ranged {formatMod(bab + (sys.baseAttributes.dex.mod || 0))}
          </Badge>
        </div>
      </div>

      {/* Maneuvers Section */}
      <div className="bg-card border rounded-lg p-3">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Target className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            {isPf1e ? 'CMB / CMD' : 'Grapple'}
          </span>
        </div>
        <div className="flex flex-col gap-1 mt-2">
          {isPf1e ? (
            <>
              <Badge variant="secondary" className="justify-center">
                CMB {formatMod(pf1Data?.cmb || 0)}
              </Badge>
              <Badge variant="outline" className="justify-center">
                CMD {pf1Data?.cmd || 10}
              </Badge>
            </>
          ) : (
            <Badge variant="secondary" className="justify-center">
              {formatMod(grapple?.total || 0)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
