import React, { useState } from 'react';
import { Character, GameSystem } from '../types/game-systems';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Calculator, ArrowUp } from 'lucide-react';
import { sanitizeInput } from '../utils/validation';
import { calculateProficiencyBonus, calculateAbilityModifier, formatModifier } from '../engine/core/calculator';
import { GAME_RULES } from '../constants/game-rules';
import { LevelUpDialog } from './LevelUpDialog';
import { calculateMulticlassSpellSlots } from '../engine/multiclassing/spell-slot-calculator';

interface CharacterSheetProps {
  character: Character;
  gameSystem: GameSystem;
  onUpdate: (character: Character) => void;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  character,
  gameSystem,
  onUpdate,
}) => {
  const parseInteger = (value: string, fallback: number) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const updateAttribute = (attributeId: string, value: number) => {
    onUpdate({
      ...character,
      baseAttributes: {
        ...character.baseAttributes,
        [attributeId]: value,
      },
    });
  };

  const proficiencyBonus = calculateProficiencyBonus(character.level);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const updateField = (field: keyof Character, value: any) => {
    onUpdate({
      ...character,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Character Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Character Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Character Name</Label>
              <Input
                id="name"
                value={character.name}
                onChange={(e) => updateField('name', sanitizeInput(e.target.value))}
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                type="number"
                value={character.level}
                onChange={(e) =>
                  updateField('level', parseInteger(e.target.value, GAME_RULES.MIN_CHARACTER_LEVEL))
                }
                min={GAME_RULES.MIN_CHARACTER_LEVEL}
                max={GAME_RULES.MAX_CHARACTER_LEVEL}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="species">Species/Race</Label>
              <Input
                id="species"
                value={character.speciesId || ''}
                onChange={(e) => updateField('speciesId', e.target.value)}
                placeholder="Enter species"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                value={character.classLevels.map(cl => cl.classId).join(', ')}
                onChange={(e) => {
                  const classId = e.target.value.split(',')[0]?.trim() || '';
                  if (classId) {
                    updateField('classLevels', [{ classId, level: character.level, hitDieRolls: [] }]);
                  } else {
                    updateField('classLevels', []);
                  }
                }}
                placeholder="Enter class"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="background">Background</Label>
              <Input
                id="background"
                value={character.backgroundId || ''}
                onChange={(e) => updateField('backgroundId', e.target.value)}
                placeholder="Enter background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alignment">Alignment</Label>
              <Input
                id="alignment"
                value={character.alignmentId || ''}
                onChange={(e) => updateField('alignmentId', e.target.value)}
                placeholder="Enter alignment"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attributes */}
      <Card>
        <CardHeader>
          <CardTitle>Attributes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {gameSystem.attributes.map((attr) => {
              const score = character.baseAttributes[attr.id] ?? GAME_RULES.DEFAULT_ABILITY_SCORE;
              const modifier = calculateAbilityModifier(score);
              return (
                <div key={attr.id} className="space-y-2">
                  <Label
                    htmlFor={attr.id}
                    className="text-xs font-semibold uppercase text-muted-foreground"
                    title={attr.description}
                  >
                    {attr.abbreviation}
                  </Label>
                  <Input
                    id={attr.id}
                    type="number"
                    value={score}
                    onChange={(e) =>
                      updateAttribute(attr.id, parseInteger(e.target.value, GAME_RULES.DEFAULT_ABILITY_SCORE))
                    }
                    min={GAME_RULES.MIN_ABILITY_SCORE}
                    max={GAME_RULES.MAX_ABILITY_SCORE}
                    className="text-center text-lg font-bold"
                  />
                  <p className="text-3xl font-bold">
                    {score}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatModifier(modifier)}
                  </p>
                  <div className="text-center text-xs text-muted-foreground">
                    {attr.name}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Combat Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Combat Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hp-current">Current HP</Label>
              <Input
                id="hp-current"
                type="number"
                value={character.hitPoints?.current ?? 0}
                onChange={(e) =>
                  updateField('hitPoints', {
                    ...character.hitPoints,
                    current: parseInteger(e.target.value, 0),
                  })
                }
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hp-max">Max HP</Label>
              <Input
                id="hp-max"
                type="number"
                value={character.hitPoints?.max ?? 0}
                onChange={(e) =>
                  updateField('hitPoints', {
                    ...character.hitPoints,
                    max: parseInteger(e.target.value, 0),
                  })
                }
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hp-temp">Temporary HP</Label>
              <Input
                id="hp-temp"
                type="number"
                value={character.hitPoints?.temp ?? 0}
                onChange={(e) =>
                  updateField('hitPoints', {
                    ...character.hitPoints,
                    temp: parseInteger(e.target.value, 0),
                  })
                }
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ac">Armor Class</Label>
              <Input
                id="ac"
                type="number"
                value={character.armorClass ?? 10}
                onChange={(e) =>
                  updateField('armorClass', parseInteger(e.target.value, 10))
                }
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="speed">Speed</Label>
              <Input
                id="speed"
                type="number"
                value={character.speed ?? 30}
                onChange={(e) =>
                  updateField('speed', parseInteger(e.target.value, 30))
                }
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initiative">Initiative</Label>
              <Input
                id="initiative"
                type="number"
                value={character.initiative}
                onChange={(e) =>
                  updateField('initiative', parseInteger(e.target.value, 0))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prof-bonus">Proficiency Bonus</Label>
              <div className="h-10 flex items-center justify-center text-lg font-bold border rounded-md bg-muted">
                +{proficiencyBonus}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Level Up</Label>
              <button
                onClick={() => setShowLevelUp(true)}
                disabled={character.level >= GAME_RULES.MAX_CHARACTER_LEVEL}
                className="w-full h-10 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUp className="w-4 h-4" />
                Level {character.level + 1}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Up Dialog */}
      {showLevelUp && (
        <LevelUpDialog
          character={character}
          onLevelUp={(updated) => {
            onUpdate(updated);
            setShowLevelUp(false);
          }}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      {/* Saving Throws */}
      <Card>
        <CardHeader>
          <CardTitle>Saving Throws</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {gameSystem.attributes.map((attr) => {
              const score = character.baseAttributes[attr.id] ?? GAME_RULES.DEFAULT_ABILITY_SCORE;
              const modifier = calculateAbilityModifier(score);
              const isProficient = character.savingThrowProficiencies.includes(attr.id);
              const saveBonus = modifier + (isProficient ? proficiencyBonus : 0);

              const toggleSaveProficiency = () => {
                const updated = isProficient
                  ? character.savingThrowProficiencies.filter(id => id !== attr.id)
                  : [...character.savingThrowProficiencies, attr.id];
                updateField('savingThrowProficiencies', updated);
              };

              return (
                <div
                  key={attr.id}
                  className="flex items-center justify-between p-2 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleSaveProficiency}
                      className="w-5 h-5 rounded border-2 flex items-center justify-center hover:bg-primary/10 transition-colors text-xs"
                      title={isProficient ? 'Remove proficiency' : 'Add proficiency'}
                    >
                      {isProficient ? '★' : '○'}
                    </button>
                    <span className="text-sm font-medium">{attr.abbreviation}</span>
                  </div>
                  <span className="text-sm font-bold">{formatModifier(saveBonus)}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      {gameSystem.skills && gameSystem.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameSystem.skills.map((skill) => {
                const attrScore = character.baseAttributes[skill.attribute] ?? GAME_RULES.DEFAULT_ABILITY_SCORE;
                const attrModifier = calculateAbilityModifier(attrScore);
                const skillProficiency = character.skillProficiencies[skill.id];
                const isProficient = skillProficiency?.level === 'proficient' || skillProficiency?.level === 'expertise';
                const isExpertise = skillProficiency?.level === 'expertise' || skillProficiency?.level === 'double';
                const profBonus = isProficient ? (isExpertise ? proficiencyBonus * 2 : proficiencyBonus) : 0;
                const ranks = character.skillRanks?.[skill.id] ?? 0;
                const skillBonus = attrModifier + profBonus + ranks;
                
                // Only show ranks for systems that use them (D&D 3.5e and Pathfinder 1e)
                const showRanks = character.system === 'dnd-3.5e' || character.system === 'pf1e';

                const toggleProficiency = () => {
                  const currentLevel = skillProficiency?.level;
                  let newLevel: 'none' | 'proficient' | 'expertise' = 'none';
                  
                  if (!currentLevel || currentLevel === 'none') {
                    newLevel = 'proficient';
                  } else if (currentLevel === 'proficient') {
                    newLevel = 'expertise';
                  } else {
                    newLevel = 'none';
                  }

                  updateField('skillProficiencies', {
                    ...character.skillProficiencies,
                    [skill.id]: newLevel === 'none' ? undefined : { level: newLevel },
                  });
                };

                return (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-2 rounded-md border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleProficiency}
                          className="w-6 h-6 rounded border-2 flex items-center justify-center hover:bg-primary/10 transition-colors"
                          title="Toggle proficiency (none → proficient → expertise → none)"
                        >
                          {isExpertise ? '★★' : isProficient ? '★' : '○'}
                        </button>
                        <div className="font-medium text-sm">{skill.name}</div>
                      </div>
                      <div className="text-xs text-muted-foreground uppercase ml-8">
                        {skill.attribute}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {showRanks && (
                        <Input
                          type="number"
                          value={ranks}
                          onChange={(e) =>
                            updateField('skillRanks', {
                              ...character.skillRanks,
                              [skill.id]: parseInteger(e.target.value, 0),
                            })
                          }
                          className="w-16 text-center"
                          min="0"
                          title="Skill ranks"
                        />
                      )}
                      <div className="text-sm font-bold min-w-[3rem] text-right">
                        {formatModifier(skillBonus)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spell Slots */}
      {character.classLevels.length > 0 && character.system !== 'mam3e' && (() => {
        const computedSlots = calculateMulticlassSpellSlots(character);
        const hasAnySlots = Object.values(computedSlots).some(slot => slot.max > 0);
        if (!hasAnySlots) return null;

        const currentSlots = character.spellcasting?.spellSlots;

        const toggleSlotUsed = (level: number) => {
          const emptySlots = {
            1: { max: 0, used: 0 }, 2: { max: 0, used: 0 }, 3: { max: 0, used: 0 },
            4: { max: 0, used: 0 }, 5: { max: 0, used: 0 }, 6: { max: 0, used: 0 },
            7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 },
          };
          const slots = currentSlots || emptySlots;
          const key = level as keyof typeof slots;
          const current = slots[key];
          const computed = computedSlots[key];
          const newUsed = current.used < computed.max ? current.used + 1 : 0;

          updateField('spellcasting', {
            ...character.spellcasting,
            classes: character.spellcasting?.classes || [],
            spellsKnown: character.spellcasting?.spellsKnown || [],
            spellsPrepared: character.spellcasting?.spellsPrepared || [],
            spellSlots: {
              ...slots,
              [level]: { max: computed.max, used: newUsed },
            },
          });
        };

        return (
          <Card>
            <CardHeader>
              <CardTitle>Spell Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map(level => {
                  const computed = computedSlots[level];
                  if (computed.max === 0) return null;
                  const used = currentSlots?.[level]?.used ?? 0;
                  return (
                    <div key={level} className="text-center space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        Level {level}
                      </div>
                      <div className="flex justify-center gap-1 flex-wrap">
                        {Array.from({ length: computed.max }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => toggleSlotUsed(level)}
                            className={`w-5 h-5 rounded-full border-2 transition-colors ${
                              i < used
                                ? 'bg-muted-foreground border-muted-foreground'
                                : 'border-primary bg-primary/10 hover:bg-primary/30'
                            }`}
                            title={`Level ${level} spell slot (${used}/${computed.max} used)`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {used}/{computed.max}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  const resetSlots = { ...computedSlots };
                  for (const key of Object.keys(resetSlots)) {
                    resetSlots[Number(key) as keyof typeof resetSlots] = {
                      max: resetSlots[Number(key) as keyof typeof resetSlots].max,
                      used: 0,
                    };
                  }
                  updateField('spellcasting', {
                    ...character.spellcasting,
                    classes: character.spellcasting?.classes || [],
                    spellsKnown: character.spellcasting?.spellsKnown || [],
                    spellsPrepared: character.spellcasting?.spellsPrepared || [],
                    spellSlots: resetSlots,
                  });
                }}
                className="mt-4 px-3 py-1 text-xs border border-input rounded-lg hover:bg-muted transition-all"
              >
                Recover All Slots (Long Rest)
              </button>
            </CardContent>
          </Card>
        );
      })()}

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={character.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Add notes about your character..."
            className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </CardContent>
      </Card>
    </div>
  );
};
