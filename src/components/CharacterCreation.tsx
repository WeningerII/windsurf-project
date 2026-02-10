import React, { useEffect, useMemo, useState } from 'react';
import { GameSystemId, Character } from '../types/game-systems';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { loadClassesForSystem, loadSpeciesForSystem } from '../utils/dataLoader';
import { CharacterClass } from '../types/character-options/classes';
import { Species } from '../types/character-options/species';
import { getGameSystem } from '../data/game-systems';
import { GAME_RULES } from '../constants/game-rules';
import { validateAbilityScore, validateCharacterName, validateLevel } from '../utils/inputValidation';
import { sanitizeInput } from '../utils/validation';
import { generateUUID } from '../utils/browserCompat';
import { calculateAbilityModifier } from '../engine/core/calculator';

interface CharacterCreationProps {
  systemId: GameSystemId;
  onComplete: (character: Character) => void;
  onCancel: () => void;
}

type CreationStep = 'basic-info' | 'class-selection' | 'race-selection' | 'ability-scores' | 'skills' | 'equipment' | 'review';

export const CharacterCreation: React.FC<CharacterCreationProps> = ({
  systemId,
  onComplete,
  onCancel,
}) => {
  const gameSystem = getGameSystem(systemId);
  const defaultAttributes = useMemo(() => {
    if (!gameSystem) return {} as Record<string, number>;
    return gameSystem.attributes.reduce((acc, attr) => {
      acc[attr.id] = GAME_RULES.DEFAULT_ABILITY_SCORE;
      return acc;
    }, {} as Record<string, number>);
  }, [gameSystem]);

  const [currentStep, setCurrentStep] = useState<CreationStep>('basic-info');
  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [characterData, setCharacterData] = useState(() => ({
    name: '',
    classId: '',
    speciesId: '',
    backgroundId: '',
    alignmentId: '',
    level: GAME_RULES.MIN_CHARACTER_LEVEL,
    baseAttributes: defaultAttributes,
  }));

  useEffect(() => {
    setCharacterData({
      name: '',
      classId: '',
      speciesId: '',
      backgroundId: '',
      alignmentId: '',
      level: GAME_RULES.MIN_CHARACTER_LEVEL,
      baseAttributes: defaultAttributes,
    });
    setCurrentStep('basic-info');
  }, [systemId, defaultAttributes]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [classData, speciesData] = await Promise.all([
          loadClassesForSystem(systemId),
          loadSpeciesForSystem(systemId),
        ]);
        setClasses(classData);
        setSpecies(speciesData);
      } catch (loadError) {
        setError('Failed to load class/species data. You can still proceed.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [systemId]);

  const steps: CreationStep[] = [
    'basic-info',
    'class-selection',
    'race-selection',
    'ability-scores',
    'skills',
    'equipment',
    'review',
  ];

  const currentStepIndex = steps.indexOf(currentStep);

  const selectedClass = classes.find((cls) => cls.id === characterData.classId);
  const selectedSpecies = species.find((race) => race.id === characterData.speciesId);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const handleComplete = () => {
    if (!gameSystem) {
      setError('Game system not found. Please try again.');
      return;
    }

    const name = validateCharacterName(sanitizeInput(characterData.name));
    const level = validateLevel(characterData.level);

    const baseAttributes = gameSystem.attributes.reduce((acc, attr) => {
      const value = characterData.baseAttributes[attr.id] ?? GAME_RULES.DEFAULT_ABILITY_SCORE;
      acc[attr.id] = validateAbilityScore(value);
      return acc;
    }, {} as Record<string, number>);

    const createdAt = new Date();

    // Compute starting HP from class hit die + CON modifier
    const conScore = baseAttributes['con'] ?? baseAttributes['sta'] ?? GAME_RULES.DEFAULT_ABILITY_SCORE;
    const conModifier = calculateAbilityModifier(conScore);
    let startingMaxHP = 10; // fallback
    let hitDieName = 'd8'; // fallback
    if (selectedClass) {
      const hitDieSize = parseInt(String(selectedClass.hitDie).replace('d', ''));
      startingMaxHP = hitDieSize + conModifier; // Level 1 = max hit die + CON
      hitDieName = String(selectedClass.hitDie);
    }
    startingMaxHP = Math.max(startingMaxHP, 1); // minimum 1 HP

    // Compute initiative from DEX modifier
    const dexScore = baseAttributes['dex'] ?? baseAttributes['agi'] ?? GAME_RULES.DEFAULT_ABILITY_SCORE;
    const dexModifier = calculateAbilityModifier(dexScore);

    // Compute AC = 10 + DEX modifier (unarmored)
    const startingAC = GAME_RULES.BASE_ARMOR_CLASS + dexModifier;

    const newCharacter: Character = {
      id: generateUUID(),
      name,
      system: systemId,
      level,
      experiencePoints: 0,
      speciesId: selectedSpecies?.id || undefined,
      classLevels: selectedClass
        ? [{ classId: selectedClass.id, level, hitDieRolls: [] }]
        : [],
      backgroundId: characterData.backgroundId || undefined,
      alignmentId: characterData.alignmentId || undefined,
      baseAttributes,
      skillProficiencies: {},
      skillRanks: {},
      hitPoints: { current: startingMaxHP, max: startingMaxHP, temp: 0 },
      hitDice: selectedClass ? [{ die: hitDieName, total: level, remaining: level }] : [],
      armorClass: startingAC,
      initiative: dexModifier,
      speed: selectedSpecies?.speed ?? GAME_RULES.DEFAULT_SPEED,
      armorProficiencies: selectedClass?.armorProficiencies || [],
      weaponProficiencies: selectedClass?.weaponProficiencies || [],
      toolProficiencies: [],
      languageProficiencies: [],
      savingThrowProficiencies: selectedClass?.savingThrowProficiencies || [],
      features: [],
      feats: [],
      equipment: [],
      inventory: [],
      currency: { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 },
      createdAt,
      updatedAt: createdAt,
    };

    onComplete(newCharacter);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basic-info':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Character Name</label>
              <input
                type="text"
                value={characterData.name}
                onChange={(e) =>
                  setCharacterData({
                    ...characterData,
                    name: sanitizeInput(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="Enter character name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Level</label>
              <input
                type="number"
                min={GAME_RULES.MIN_CHARACTER_LEVEL}
                max={GAME_RULES.MAX_CHARACTER_LEVEL}
                value={characterData.level}
                onChange={(e) =>
                  setCharacterData({
                    ...characterData,
                    level: validateLevel(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-input rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Background</label>
              <input
                type="text"
                value={characterData.backgroundId}
                onChange={(e) =>
                  setCharacterData({
                    ...characterData,
                    backgroundId: sanitizeInput(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="Optional background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Alignment</label>
              <input
                type="text"
                value={characterData.alignmentId}
                onChange={(e) =>
                  setCharacterData({
                    ...characterData,
                    alignmentId: sanitizeInput(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="Optional alignment"
              />
            </div>
          </div>
        );

      case 'class-selection':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Select Class</h2>
            <p className="text-muted-foreground">
              Choose your character&apos;s primary class
            </p>
            {loading ? (
              <div className="text-center py-8">Loading classes...</div>
            ) : classes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() =>
                      setCharacterData({ ...characterData, classId: cls.id })
                    }
                    className={`px-4 py-3 rounded-md border transition-all text-left ${
                      characterData.classId === cls.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-input hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold">{cls.name}</div>
                    <div className="text-xs opacity-80 mt-1">
                      Hit Die: {cls.hitDie}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No classes available for this system yet. Click Next to continue.
              </p>
            )}
          </div>
        );

      case 'race-selection':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Select Species/Race</h2>
            <p className="text-muted-foreground">
              Choose your character&apos;s ancestry
            </p>
            {loading ? (
              <div className="text-center py-8">Loading species...</div>
            ) : species.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {species.map((race) => (
                  <button
                    key={race.id}
                    onClick={() =>
                      setCharacterData({ ...characterData, speciesId: race.id })
                    }
                    className={`px-4 py-3 rounded-md border transition-all text-left ${
                      characterData.speciesId === race.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-input hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold">{race.name}</div>
                    <div className="text-xs opacity-80 mt-1">
                      Size: {race.size} • Speed: {race.speed}ft
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No species/races available for this system yet. Click Next to continue.
              </p>
            )}
          </div>
        );

      case 'ability-scores':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ability Scores</h2>
            <p className="text-muted-foreground">
              Distribute your ability scores (standard array: 15, 14, 13, 12, 10, 8)
            </p>
            <div className="grid grid-cols-2 gap-4">
              {gameSystem?.attributes.map((attribute) => {
                const score = characterData.baseAttributes[attribute.id] ?? GAME_RULES.DEFAULT_ABILITY_SCORE;
                return (
                  <div key={attribute.id}>
                    <label className="block text-sm font-medium mb-2">
                      {attribute.name}
                    </label>
                    <input
                      type="number"
                      min={GAME_RULES.MIN_ABILITY_SCORE}
                      max={GAME_RULES.MAX_ABILITY_SCORE}
                      value={score}
                      onChange={(e) =>
                        setCharacterData({
                          ...characterData,
                          baseAttributes: {
                            ...characterData.baseAttributes,
                            [attribute.id]: validateAbilityScore(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-input rounded-md"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Skills</h2>
            <p className="text-muted-foreground">
              Skills will be automatically calculated based on your class and ability scores
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                Your class and ability scores will determine your skill proficiencies and bonuses.
              </p>
            </div>
          </div>
        );

      case 'equipment':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Equipment</h2>
            <p className="text-muted-foreground">
              Equipment will be automatically selected based on your class
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                Your class determines your starting equipment. You can customize this after character creation.
              </p>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Review Character</h2>
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <p>
                <strong>Name:</strong> {characterData.name || 'Unnamed'}
              </p>
              <p>
                <strong>Class:</strong> {selectedClass?.name || 'Not selected'}
              </p>
              <p>
                <strong>Race:</strong> {selectedSpecies?.name || 'Not selected'}
              </p>
              <p>
                <strong>Level:</strong> {characterData.level}
              </p>
              <div className="mt-4">
                <strong>Ability Scores:</strong>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  {gameSystem?.attributes.map((attribute) => (
                    <p key={attribute.id}>
                      {attribute.name}: {characterData.baseAttributes[attribute.id] ?? GAME_RULES.DEFAULT_ABILITY_SCORE}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!gameSystem) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="bg-card border border-input rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Character Creation</h2>
          <p className="text-muted-foreground">Game system not found.</p>
          <div className="mt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-all"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex-1 h-2 mx-1 rounded-full transition-all ${
                index <= currentStepIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
        </p>
      </div>

      <div className="bg-card border border-input rounded-lg p-6 mb-6">
        {error && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        {renderStep()}
      </div>

      <div className="flex justify-between gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-all"
        >
          Cancel
        </button>

        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStepIndex === steps.length - 1 ? (
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all"
            >
              Create Character
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
