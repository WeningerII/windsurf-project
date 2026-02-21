import React, { useCallback } from 'react';
import { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { Pf2eDataModel, Pf2eProficiency, Pf2eProficiencyTier, tierBonus } from './data-model';
import { Shield, Heart, Star, Eye, Zap, Swords, Plus, X } from 'lucide-react';
import { abilityMod, formatMod, parseNum } from '../../utils/math';
import { SKILL_ABILITIES, SAVE_ABILITIES } from './constants';

interface Props {
  document: CharacterDocument<Pf2eDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

const TIER_LABELS: Record<Pf2eProficiencyTier, string> = {
  untrained: 'U', trained: 'T', expert: 'E', master: 'M', legendary: 'L',
};

const TIER_COLORS: Record<Pf2eProficiencyTier, string> = {
  untrained: 'text-muted-foreground',
  trained: 'text-blue-500',
  expert: 'text-purple-500',
  master: 'text-amber-500',
  legendary: 'text-red-500',
};

const TIER_ORDER: Pf2eProficiencyTier[] = ['untrained', 'trained', 'expert', 'master', 'legendary'];

function nextTier(current: Pf2eProficiencyTier): Pf2eProficiencyTier {
  const idx = TIER_ORDER.indexOf(current);
  return TIER_ORDER[(idx + 1) % TIER_ORDER.length];
}

const ABILITY_NAMES: Record<string, string> = {
  str: 'Strength', dex: 'Dexterity', con: 'Constitution',
  int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma',
};

export const Pf2eCharacterSheet: React.FC<Props> = ({ document, onUpdate }) => {
  const d = document.system;

  const update = useCallback((patch: Partial<Pf2eDataModel>) => {
    if (!onUpdate) return;
    onUpdate({ ...document, system: { ...d, ...patch }, updatedAt: new Date() });
  }, [document, d, onUpdate]);

  const ProfBadge = ({ prof, onClick }: { prof: Pf2eProficiency; onClick?: () => void }) => (
    <button
      onClick={onClick}
      disabled={!onUpdate}
      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${TIER_COLORS[prof.tier]} ${onUpdate ? 'hover:bg-muted cursor-pointer' : ''}`}
      title={`${prof.tier} (${tierBonus(prof.tier) > 0 ? `+${prof.total}` : '0'}). Click to cycle.`}
    >
      {TIER_LABELS[prof.tier]}
    </button>
  );

  const cycleSkillTier = (skillId: string) => {
    const current = d.skillProficiencies[skillId] ?? { tier: 'untrained' as Pf2eProficiencyTier, total: 0 };
    update({
      skillProficiencies: {
        ...d.skillProficiencies,
        [skillId]: { ...current, tier: nextTier(current.tier) },
      },
    });
  };

  const cycleSaveTier = (saveId: keyof typeof d.saveProficiencies) => {
    const current = d.saveProficiencies[saveId];
    update({
      saveProficiencies: {
        ...d.saveProficiencies,
        [saveId]: { ...current, tier: nextTier(current.tier) },
      },
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
            disabled={!onUpdate}
            title="Character name"
            placeholder="Character name"
          />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Level</span>
            <input
              type="number"
              value={d.level}
              onChange={e => update({ level: parseNum(e.target.value, 1) })}
              className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary font-bold"
              min={1} max={20}
              disabled={!onUpdate}
              title="Character level"
            />
            <span>XP</span>
            <input
              type="number"
              value={d.experiencePoints}
              onChange={e => update({ experiencePoints: parseNum(e.target.value, 0) })}
              className="w-20 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary"
              min={0}
              disabled={!onUpdate}
              title="Experience points"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Hero Points */}
          <div className="text-center">
            <div className="text-xs font-medium text-muted-foreground mb-1">Hero Points</div>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <button
                  key={i}
                  onClick={() => update({ heroPoints: i < d.heroPoints ? i : i + 1 })}
                  disabled={!onUpdate}
                  className={`w-7 h-7 rounded-full border-2 transition-colors ${
                    i < d.heroPoints
                      ? 'bg-amber-400 border-amber-500 text-amber-900'
                      : 'border-input hover:border-amber-400'
                  }`}
                  title={`${d.heroPoints}/3 Hero Points`}
                >
                  <Star className="w-3 h-3 mx-auto" />
                </button>
              ))}
            </div>
          </div>
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
                <span className="text-xs font-semibold text-muted-foreground uppercase">{key}</span>
                <input
                  type="number"
                  value={score}
                  onChange={e => update({ baseAttributes: { ...d.baseAttributes, [key]: parseNum(e.target.value, 10) } })}
                  className="w-14 text-center text-lg font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary"
                  disabled={!onUpdate}
                  title={`${name} score`}
                />
                <span className="text-sm font-medium">{formatMod(mod)}</span>
                <span className="text-xs text-muted-foreground">{name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Combat Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-xs font-medium text-muted-foreground">AC</div>
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
              disabled={!onUpdate}
              title="Current HP"
            />
            <span className="text-muted-foreground">/</span>
            <input
              type="number"
              value={d.hitPoints.max}
              onChange={e => update({ hitPoints: { ...d.hitPoints, max: parseNum(e.target.value, 1) } })}
              className="w-14 text-center text-lg bg-transparent border-b border-input focus:outline-none focus:border-primary"
              disabled={!onUpdate}
              title="Max HP"
            />
          </div>
          {d.hitPoints.temp > 0 && <div className="text-xs text-blue-500">+{d.hitPoints.temp} temp</div>}
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-xs font-medium text-muted-foreground">Speed</div>
          <div className="text-2xl font-bold">{d.speed} ft</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1"><Eye className="w-3 h-3" /> Perception</div>
          <div className="flex items-center justify-center gap-2">
            <ProfBadge
              prof={d.perceptionProficiency}
              onClick={() => update({ perceptionProficiency: { ...d.perceptionProficiency, tier: nextTier(d.perceptionProficiency.tier) } })}
            />
            <span className="text-xl font-bold">
              {formatMod(abilityMod(d.baseAttributes.wis ?? 10) + d.perceptionProficiency.total)}
            </span>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1"><Swords className="w-3 h-3" /> Class DC</div>
          <div className="text-2xl font-bold">{10 + d.level + 2 + Math.max(...Object.values(d.baseAttributes).map(abilityMod))}</div>
        </div>
      </div>

      {/* Saving Throws */}
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Saving Throws
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(SAVE_ABILITIES).map(([saveId, attr]) => {
            const save = d.saveProficiencies[saveId as keyof typeof d.saveProficiencies];
            const mod = abilityMod(d.baseAttributes[attr] ?? 10);
            const total = mod + (save?.total ?? 0);
            return (
              <div key={saveId} className="flex items-center justify-between p-3 bg-card border rounded-lg">
                <div className="flex items-center gap-2">
                  <ProfBadge
                    prof={save}
                    onClick={() => cycleSaveTier(saveId as keyof typeof d.saveProficiencies)}
                  />
                  <div>
                    <div className="font-medium capitalize">{saveId}</div>
                    <div className="text-xs text-muted-foreground uppercase">{attr}</div>
                  </div>
                </div>
                <span className="text-xl font-bold">{formatMod(total)}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5" /> Skills
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(SKILL_ABILITIES).map(([skillId, attr]) => {
            const prof = d.skillProficiencies[skillId] ?? { tier: 'untrained' as Pf2eProficiencyTier, total: 0 };
            const mod = abilityMod(d.baseAttributes[attr] ?? 10);
            const total = mod + prof.total;
            return (
              <div key={skillId} className="flex items-center justify-between p-2 bg-card border rounded">
                <div className="flex items-center gap-2">
                  <ProfBadge prof={prof} onClick={() => cycleSkillTier(skillId)} />
                  <div>
                    <span className="font-medium capitalize">{skillId.replace(/-/g, ' ')}</span>
                    <span className="text-xs text-muted-foreground ml-1 uppercase">({attr})</span>
                  </div>
                </div>
                <span className="font-bold min-w-[3rem] text-right">{formatMod(total)}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Conditions */}
      <section className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Conditions</h3>
        <div className="flex flex-wrap gap-2">
          {d.conditions.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No active conditions.</p>
          ) : (
            d.conditions.map((cond, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive text-sm rounded border border-destructive/20">
                {cond.name}{cond.value != null && cond.value > 0 ? ` ${cond.value}` : ''}
                {onUpdate && (
                  <button
                    onClick={() => update({ conditions: d.conditions.filter((_, j) => j !== i) })}
                    className="hover:text-destructive/80"
                    title="Remove condition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))
          )}
          {onUpdate && (
            <button
              onClick={() => update({ conditions: [...d.conditions, { id: `cond-${Date.now()}`, name: 'New Condition' }] })}
              className="inline-flex items-center gap-1 px-2 py-1 border border-dashed border-input rounded text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          )}
        </div>
      </section>

      {/* Feats */}
      <section className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Feats</h3>
        <div className="space-y-2">
          {d.feats.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No feats selected.</p>
          ) : (
            d.feats.map(feat => (
              <div key={feat.id} className="flex items-start justify-between p-2 bg-muted/30 rounded border">
                <div>
                  <div className="font-medium">{feat.name} <span className="text-xs text-muted-foreground">Lv {feat.level} • {feat.type}</span></div>
                  {feat.description && <p className="text-sm text-muted-foreground mt-1">{feat.description}</p>}
                </div>
                {onUpdate && (
                  <button
                    onClick={() => update({ feats: d.feats.filter(f => f.id !== feat.id) })}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                    title="Remove feat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
