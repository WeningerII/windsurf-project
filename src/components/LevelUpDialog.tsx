import React, { useState, useEffect } from 'react';
import { Character } from '../types/game-systems';
import { CharacterClass } from '../types/character-options/classes';
import { levelUpCharacter } from '../engine/progression/level-up-engine';
import { calculateAbilityModifier } from '../engine/core/calculator';
import { loadClassesForSystem } from '../utils/dataLoader';
import { GAME_RULES } from '../constants/game-rules';
import { ArrowUp, Dice1 } from 'lucide-react';

interface LevelUpDialogProps {
  character: Character;
  onLevelUp: (updatedCharacter: Character) => void;
  onClose: () => void;
}

type HPMethod = 'max' | 'average' | 'roll';

export const LevelUpDialog: React.FC<LevelUpDialogProps> = ({
  character,
  onLevelUp,
  onClose,
}) => {
  const [availableClasses, setAvailableClasses] = useState<CharacterClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>(
    character.classLevels[0]?.classId || ''
  );
  const [hpMethod, setHpMethod] = useState<HPMethod>('average');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;
    const load = async () => {
      try {
        const classes = await loadClassesForSystem(character.system);
        if (!canceled) {
          setAvailableClasses(classes);
          setLoading(false);
        }
      } catch {
        if (!canceled) setLoading(false);
      }
    };
    load();
    return () => { canceled = true; };
  }, [character.system]);

  if (character.level >= GAME_RULES.MAX_CHARACTER_LEVEL) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div className="bg-card border border-input rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
          <h2 className="text-xl font-bold mb-4">Maximum Level Reached</h2>
          <p className="text-muted-foreground mb-4">This character is already at level {GAME_RULES.MAX_CHARACTER_LEVEL}.</p>
          <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Close
          </button>
        </div>
      </div>
    );
  }

  const conScore = character.baseAttributes['con'] ?? character.baseAttributes['sta'] ?? GAME_RULES.DEFAULT_ABILITY_SCORE;
  const conModifier = calculateAbilityModifier(conScore);
  const selectedClass = availableClasses.find(c => c.id === selectedClassId);
  const hitDieSize = selectedClass ? parseInt(String(selectedClass.hitDie).replace('d', '')) : 8;

  const getHPGain = (): number => {
    let roll: number;
    switch (hpMethod) {
      case 'max':
        roll = hitDieSize;
        break;
      case 'average':
        roll = Math.floor(hitDieSize / 2) + 1;
        break;
      case 'roll':
        roll = Math.floor(Math.random() * hitDieSize) + 1;
        break;
    }
    return Math.max(roll + conModifier, 1);
  };

  const handleLevelUp = () => {
    const updatedCharacter = levelUpCharacter(
      character,
      selectedClassId,
      hpMethod === 'roll' ? Math.floor(Math.random() * hitDieSize) + 1 : hpMethod,
      conModifier
    );
    onLevelUp(updatedCharacter);
  };

  const newLevel = character.level + 1;
  const isMulticlass = selectedClassId !== (character.classLevels[0]?.classId || '');
  const currentClassLevel = character.classLevels.find(cl => cl.classId === selectedClassId);
  const newClassLevel = currentClassLevel ? currentClassLevel.level + 1 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-card border border-input rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl space-y-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <ArrowUp className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold">Level Up to {newLevel}</h2>
            <p className="text-sm text-muted-foreground">{character.name}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading classes...</div>
        ) : (
          <>
            {/* Class Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Level up in class:</label>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Select class to level up"
              >
                {availableClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} {character.classLevels.find(cl => cl.classId === cls.id)
                      ? `(currently level ${character.classLevels.find(cl => cl.classId === cls.id)!.level})`
                      : '(new — multiclass)'}
                  </option>
                ))}
              </select>
              {isMulticlass && (
                <p className="text-xs text-amber-600 font-medium">
                  Multiclassing into {selectedClass?.name || selectedClassId}
                </p>
              )}
            </div>

            {/* HP Method */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Hit Point Method:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['max', 'average', 'roll'] as HPMethod[]).map(method => (
                  <button
                    key={method}
                    onClick={() => setHpMethod(method)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                      hpMethod === method
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-input hover:border-primary/50'
                    }`}
                  >
                    {method === 'max' && `Max (${hitDieSize})`}
                    {method === 'average' && `Average (${Math.floor(hitDieSize / 2) + 1})`}
                    {method === 'roll' && (
                      <span className="flex items-center justify-center gap-1">
                        <Dice1 className="w-4 h-4" /> Roll
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                HP gain: {hpMethod === 'roll' ? `1d${hitDieSize}` : hpMethod === 'max' ? hitDieSize : Math.floor(hitDieSize / 2) + 1} + {conModifier >= 0 ? '+' : ''}{conModifier} (CON) = {hpMethod !== 'roll' ? getHPGain() : `varies`} HP
              </p>
            </div>

            {/* Summary */}
            <div className="bg-muted/50 border border-input rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-sm">Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Character Level:</span> {character.level} → {newLevel}</div>
                <div><span className="text-muted-foreground">Class Level:</span> {selectedClass?.name} {currentClassLevel?.level ?? 0} → {newClassLevel}</div>
                <div><span className="text-muted-foreground">Hit Die:</span> d{hitDieSize}</div>
                <div><span className="text-muted-foreground">CON Modifier:</span> {conModifier >= 0 ? '+' : ''}{conModifier}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLevelUp}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium"
              >
                Level Up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
