import React, { useCallback } from 'react';
import { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import { Dnd5e2024DataModel } from '../data-model';
import { Shield, Heart, Target, Crosshair } from 'lucide-react';
import { abilityMod, formatMod, parseNum } from '../../../utils/math';

interface Props {
  document: CharacterDocument<Dnd5e2024DataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

const ABILITY_NAMES: Record<string, string> = {
  str: 'Strength', dex: 'Dexterity', con: 'Constitution',
  int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma',
};

export const Dnd5e2024Sheet: React.FC<Props> = ({ document, onUpdate }) => {
  const d = document.system;

  const update = useCallback((patch: Partial<Dnd5e2024DataModel>) => {
    if (!onUpdate) return;
    onUpdate({ ...document, system: { ...d, ...patch }, updatedAt: new Date() });
  }, [document, d, onUpdate]);

  const profBonus = Math.ceil(d.level / 4) + 1;

  const toggleProficiency = (skillId: string) => {
    const current = d.skillProficiencies[skillId]?.level || 'none';
    let next: 'none' | 'proficient' | 'expertise' = 'none';
    if (current === 'none') next = 'proficient';
    else if (current === 'proficient') next = 'expertise';
    
    const newProfs = { ...d.skillProficiencies };
    if (next === 'none') delete newProfs[skillId];
    else newProfs[skillId] = { level: next, source: ['manual'] };
    
    update({ skillProficiencies: newProfs });
  };

  const toggleSaveProficiency = (abilityId: string) => {
    const has = d.savingThrowProficiencies.includes(abilityId);
    update({
      savingThrowProficiencies: has 
        ? d.savingThrowProficiencies.filter((a: string) => a !== abilityId)
        : [...d.savingThrowProficiencies, abilityId]
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start bg-card p-6 rounded-xl border shadow-sm">
        <div className="space-y-1 flex-1">
          <input
            value={document.name}
            onChange={e => onUpdate?.({ ...document, name: e.target.value, updatedAt: new Date() })}
            className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
            title="Character name"
            placeholder="Character name"
            disabled={!onUpdate}
          />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Level</span>
            <input
              type="number"
              value={d.level}
              onChange={e => update({ level: parseNum(e.target.value, 1) })}
              className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary font-bold"
              min={1} max={20}
              title="Character Level"
              disabled={!onUpdate}
            />
            <span>XP</span>
            <input
              type="number"
              value={d.experiencePoints}
              onChange={e => update({ experiencePoints: parseNum(e.target.value, 0) })}
              className="w-20 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary"
              min={0}
              title="Experience Points"
              disabled={!onUpdate}
            />
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-muted-foreground">Proficiency Bonus</div>
          <div className="text-2xl font-bold text-primary">+{profBonus}</div>
        </div>
      </div>

      {/* Ability Scores */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Ability Scores</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries(ABILITY_NAMES).map(([key, name]) => {
            const score = d.baseAttributes[key] ?? 10;
            const mod = abilityMod(score);
            return (
              <div key={key} className="flex flex-col items-center p-3 bg-card border rounded-lg">
                <span className="text-xs font-semibold text-muted-foreground uppercase">{name}</span>
                <input
                  type="number"
                  value={score}
                  onChange={e => update({ baseAttributes: { ...d.baseAttributes, [key]: parseNum(e.target.value, 10) } })}
                  className="w-14 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary"
                  title={`${name} Score`}
                  disabled={!onUpdate}
                />
                <span className="text-sm font-medium">{formatMod(mod)}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Combat Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1"><Shield className="w-3 h-3" /> AC</div>
          <div className="text-3xl font-bold">{d.armorClass}</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1"><Heart className="w-3 h-3" /> HP</div>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={d.hitPoints.current}
              onChange={e => update({ hitPoints: { ...d.hitPoints, current: parseNum(e.target.value, 0) } })}
              className="w-14 text-center text-2xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary"
              title="Current HP"
              disabled={!onUpdate}
            />
            <span className="text-muted-foreground">/</span>
            <input
              type="number"
              value={d.hitPoints.max}
              onChange={e => update({ hitPoints: { ...d.hitPoints, max: parseNum(e.target.value, 1) } })}
              className="w-14 text-center text-lg bg-transparent border-b border-input focus:outline-none focus:border-primary"
              title="Maximum HP"
              disabled={!onUpdate}
            />
          </div>
          {d.hitPoints.temp > 0 && <div className="text-xs text-blue-500">+{d.hitPoints.temp} temp</div>}
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-xs font-medium text-muted-foreground">Initiative</div>
          <div className="text-2xl font-bold">{formatMod(d.initiative)}</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-xs font-medium text-muted-foreground">Speed</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <input
              type="number"
              value={d.speed}
              onChange={e => update({ speed: parseNum(e.target.value, 30) })}
              className="w-12 text-center text-2xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary"
              title="Speed"
              disabled={!onUpdate}
            />
            <span className="text-sm text-muted-foreground">ft</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saving Throws */}
        <section className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" /> Saving Throws
          </h3>
          <div className="space-y-2">
            {Object.entries(ABILITY_NAMES).map(([key, name]) => {
              const isProficient = d.savingThrowProficiencies.includes(key);
              const mod = abilityMod(d.baseAttributes[key] ?? 10) + (isProficient ? profBonus : 0);
              return (
                <div key={key} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSaveProficiency(key)}
                      disabled={!onUpdate}
                      className="w-5 h-5 rounded border flex items-center justify-center"
                    >
                      {isProficient && <div className="w-3 h-3 bg-primary rounded-sm" />}
                    </button>
                    <span>{name}</span>
                  </div>
                  <span className="font-bold w-8 text-right">{formatMod(mod)}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Skills */}
        <section className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" /> Skills
          </h3>
          <div className="space-y-2">
            {[
              { id: 'acrobatics', name: 'Acrobatics', attr: 'dex' },
              { id: 'animal-handling', name: 'Animal Handling', attr: 'wis' },
              { id: 'arcana', name: 'Arcana', attr: 'int' },
              { id: 'athletics', name: 'Athletics', attr: 'str' },
              { id: 'deception', name: 'Deception', attr: 'cha' },
              { id: 'history', name: 'History', attr: 'int' },
              { id: 'insight', name: 'Insight', attr: 'wis' },
              { id: 'intimidation', name: 'Intimidation', attr: 'cha' },
              { id: 'investigation', name: 'Investigation', attr: 'int' },
              { id: 'medicine', name: 'Medicine', attr: 'wis' },
              { id: 'nature', name: 'Nature', attr: 'int' },
              { id: 'perception', name: 'Perception', attr: 'wis' },
              { id: 'performance', name: 'Performance', attr: 'cha' },
              { id: 'persuasion', name: 'Persuasion', attr: 'cha' },
              { id: 'religion', name: 'Religion', attr: 'int' },
              { id: 'sleight-of-hand', name: 'Sleight of Hand', attr: 'dex' },
              { id: 'stealth', name: 'Stealth', attr: 'dex' },
              { id: 'survival', name: 'Survival', attr: 'wis' },
            ].map(skill => {
              const prof = d.skillProficiencies[skill.id];
              const isProficient = prof?.level === 'proficient' || prof?.level === 'expertise';
              const isExpertise = prof?.level === 'expertise' || prof?.level === 'double';
              const pbMultiplier = isExpertise ? 2 : isProficient ? 1 : (prof?.level === 'half' ? 0.5 : 0);
              
              const mod = abilityMod(d.baseAttributes[skill.attr] ?? 10) + Math.floor(profBonus * pbMultiplier);
              
              return (
                <div key={skill.id} className="flex items-center justify-between p-1 hover:bg-muted/50 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleProficiency(skill.id)}
                      disabled={!onUpdate}
                      className="w-5 h-5 rounded border flex items-center justify-center text-xs"
                      title="Toggle proficiency"
                    >
                      {isExpertise ? 'E' : isProficient ? 'P' : ''}
                    </button>
                    <span>{skill.name} <span className="text-muted-foreground text-xs uppercase ml-1">({skill.attr})</span></span>
                  </div>
                  <span className="font-bold w-8 text-right">{formatMod(mod)}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Weapon Masteries (2024 specific) */}
        <section className="bg-card p-4 rounded-lg border md:col-span-2">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Crosshair className="w-5 h-5" /> Weapon Masteries
          </h3>
          <div className="space-y-2">
            {d.weaponMasteries && d.weaponMasteries.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {d.weaponMasteries.map((mastery, idx) => (
                  <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {mastery}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No weapon masteries selected.</p>
            )}
            <div className="mt-2 text-xs text-muted-foreground">
              Note: Weapon mastery editing interface will be available in a future update.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
