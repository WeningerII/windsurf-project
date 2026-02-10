import { GameSystemId } from '../types/game-systems';
import { gameSystems } from '../data/game-systems';
import { BookOpen, Shield, Users, Sword } from 'lucide-react';
import { dnd5eMetadata } from '../data/dnd/5e-2014/metadata';
import { dnd5e2024Metadata } from '../data/dnd/5e-2024/metadata';
import { dnd35eMetadata } from '../data/dnd/3.5e/metadata';
import { pf1eMetadata } from '../data/pathfinder/1e/metadata';
import { pf2eMetadata } from '../data/pathfinder/2e/metadata';
import { mm3eMetadata } from '../data/mutants-and-masterminds/3e/metadata';

interface GameSystemSelectorProps {
  selectedSystem: GameSystemId | null;
  onSelect: (systemId: GameSystemId) => void;
}

const systemMetadata: Record<GameSystemId, { spells: number; classes: number; monsters: number; equipment: number }> = {
  'dnd-5e-2024': {
    spells: dnd5e2024Metadata.stats.spells.count,
    classes: dnd5e2024Metadata.stats.classes.count,
    monsters: dnd5e2024Metadata.stats.monsters.count,
    equipment: dnd5e2024Metadata.stats.equipment.weapons + dnd5e2024Metadata.stats.equipment.armor + dnd5e2024Metadata.stats.equipment.gear + dnd5e2024Metadata.stats.equipment.magicItems,
  },
  'dnd-5e-2014': {
    spells: dnd5eMetadata.stats.spells.count,
    classes: dnd5eMetadata.stats.classes.count,
    monsters: dnd5eMetadata.stats.monsters.count,
    equipment: dnd5eMetadata.stats.equipment.weapons + dnd5eMetadata.stats.equipment.armor + dnd5eMetadata.stats.equipment.adventuringGear + dnd5eMetadata.stats.equipment.magicItems,
  },
  'pf2e': {
    spells: pf2eMetadata.stats.spells.count,
    classes: pf2eMetadata.stats.classes.count,
    monsters: 0,
    equipment: pf2eMetadata.stats.equipment.weapons + pf2eMetadata.stats.equipment.armor + pf2eMetadata.stats.equipment.gear + pf2eMetadata.stats.equipment.magicItems,
  },
  'dnd-3.5e': {
    spells: dnd35eMetadata.stats.spells.count,
    classes: dnd35eMetadata.stats.classes.count + dnd35eMetadata.stats.prestigeClasses.count,
    monsters: 0,
    equipment: dnd35eMetadata.stats.equipment.weapons + dnd35eMetadata.stats.equipment.armor + dnd35eMetadata.stats.equipment.shields + dnd35eMetadata.stats.equipment.adventuringGear + dnd35eMetadata.stats.equipment.magicItems,
  },
  'pf1e': {
    spells: pf1eMetadata.stats.spells.count,
    classes: pf1eMetadata.stats.classes.baseClasses + pf1eMetadata.stats.classes.prestigeClasses,
    monsters: 0,
    equipment: pf1eMetadata.stats.equipment.weapons + pf1eMetadata.stats.equipment.armor + pf1eMetadata.stats.equipment.gear + pf1eMetadata.stats.equipment.magicItems,
  },
  'mam3e': {
    spells: mm3eMetadata.stats.powers.count,
    classes: 0,
    monsters: 0,
    equipment: mm3eMetadata.stats.equipment.vehicles + mm3eMetadata.stats.equipment.devices + mm3eMetadata.stats.equipment.headquarters + mm3eMetadata.stats.equipment.weapons + mm3eMetadata.stats.equipment.armor + mm3eMetadata.stats.equipment.gear,
  },
};

export const GameSystemSelector: React.FC<GameSystemSelectorProps> = ({
  selectedSystem,
  onSelect,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Game System</h2>
        <p className="text-muted-foreground">Select from 6 fully implemented RPG systems</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gameSystems.map((system) => {
          const metadata = systemMetadata[system.id as GameSystemId];
          return (
            <button
              key={system.id}
              onClick={() => onSelect(system.id as GameSystemId)}
              className={`p-6 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
                selectedSystem === system.id
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-input hover:border-primary/50'
              }`}
            >
              <div className="mb-4">
                <h3 className="font-semibold text-xl mb-1">{system.name}</h3>
                <p className="text-sm text-muted-foreground">{system.version}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                {metadata.spells > 0 && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="w-3 h-3" />
                    <span>{metadata.spells} spells</span>
                  </div>
                )}
                {metadata.classes > 0 && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>{metadata.classes} classes</span>
                  </div>
                )}
                {metadata.monsters > 0 && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{metadata.monsters} monsters</span>
                  </div>
                )}
                {metadata.equipment > 0 && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Sword className="w-3 h-3" />
                    <span>{metadata.equipment} items</span>
                  </div>
                )}
              </div>
              
              {selectedSystem === system.id && (
                <div className="mt-3 pt-3 border-t border-primary/20">
                  <p className="text-xs font-medium text-primary">✓ Selected</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
