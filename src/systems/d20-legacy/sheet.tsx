import React, { useCallback } from 'react';
import { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { Shield, Swords, Heart, Footprints, Target, Plus, X } from 'lucide-react';
import { abilityMod, formatMod, parseNum } from '../../utils/math';
import { Dnd35eDataModel } from '../dnd35e/data-model';
import { Pf1eDataModel } from '../pf1e/data-model';

type D20LegacyData = Dnd35eDataModel | Pf1eDataModel;

/**
 * Native sheet for d20 3.x-family systems (D&D 3.5e and Pathfinder 1e).
 *
 * These systems share: BAB, 3 saves (Fort/Ref/Will), skill ranks,
 * touch/flat-footed AC, size modifiers, and grapple/CMB+CMD.
 */

interface Props {
  document: CharacterDocument<SystemDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

const ABILITY_NAMES: Record<string, string> = {
  str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA',
};

export const D20LegacySheet: React.FC<Props> = ({ document, onUpdate }) => {
  const sys = document.system as D20LegacyData;
  const isPf1e = document.systemId === 'pf1e';

  const { baseAttributes, hitPoints, baseAttackBonus: bab, armorClass: ac, initiative, speed, saves, skillRanks, feats } = sys;

  // System-specific fields (narrowed by systemId check in JSX)
  const grapple = isPf1e ? undefined : (sys as Dnd35eDataModel).grapple;
  const cmb = isPf1e ? (sys as Pf1eDataModel).cmb : undefined;
  const cmd = isPf1e ? (sys as Pf1eDataModel).cmd : undefined;

  const update = useCallback((patch: Partial<D20LegacyData>) => {
    if (!onUpdate) return;
    onUpdate({ ...document, system: { ...sys, ...patch } as SystemDataModel, updatedAt: new Date() });
  }, [document, sys, onUpdate]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-2">
        <input
          value={document.name}
          onChange={e => onUpdate?.({ ...document, name: e.target.value, updatedAt: new Date() })}
          className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
          disabled={!onUpdate}
          title="Character name"
          placeholder="Character name"
        />
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Level {(sys.level as number) ?? 1}</span>
          <span>•</span>
          <span>{isPf1e ? 'Pathfinder 1e' : 'D&D 3.5e'}</span>
        </div>
      </div>

      {/* Ability Scores */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Ability Scores</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries(ABILITY_NAMES).map(([key, label]) => {
            const score = baseAttributes[key] ?? 10;
            const mod = abilityMod(score);
            return (
              <div key={key} className="flex flex-col items-center p-3 bg-card border rounded-lg">
                <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                <input
                  type="number"
                  value={score}
                  onChange={e => update({ baseAttributes: { ...baseAttributes, [key]: parseNum(e.target.value, 10) } })}
                  className="w-14 text-center text-lg font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary"
                  disabled={!onUpdate}
                  title={`${label} score`}
                />
                <span className="text-sm font-medium">{formatMod(mod)}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Combat Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* AC breakdown */}
        <div className="bg-card border rounded-lg p-3 text-center">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1"><Shield className="w-3 h-3" /> AC</div>
          <div className="text-3xl font-bold">{ac.total}</div>
        </div>
        <div className="bg-card border rounded-lg p-3 text-center">
          <div className="text-xs font-medium text-muted-foreground">Touch</div>
          <div className="text-2xl font-bold">{ac.touch}</div>
        </div>
        <div className="bg-card border rounded-lg p-3 text-center">
          <div className="text-xs font-medium text-muted-foreground">Flat-Footed</div>
          <div className="text-2xl font-bold">{ac.flatFooted}</div>
        </div>

        {/* HP */}
        <div className="bg-card border rounded-lg p-3 text-center">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1"><Heart className="w-3 h-3" /> HP</div>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={hitPoints.current}
              onChange={e => update({ hitPoints: { ...hitPoints, current: parseNum(e.target.value, 0) } })}
              className="w-12 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary"
              disabled={!onUpdate}
              title="Current HP"
            />
            <span className="text-muted-foreground">/</span>
            <span className="text-lg">{hitPoints.max}</span>
          </div>
        </div>

        {/* BAB */}
        <div className="bg-card border rounded-lg p-3 text-center">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1"><Swords className="w-3 h-3" /> BAB</div>
          <div className="text-2xl font-bold">{formatMod(bab)}</div>
        </div>

        {/* Grapple / CMB+CMD */}
        {isPf1e ? (
          <>
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-xs font-medium text-muted-foreground">CMB</div>
              <div className="text-2xl font-bold">{formatMod(cmb ?? 0)}</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-xs font-medium text-muted-foreground">CMD</div>
              <div className="text-2xl font-bold">{cmd ?? 10}</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-xs font-medium text-muted-foreground">Grapple</div>
              <div className="text-2xl font-bold">{formatMod(grapple ?? 0)}</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1"><Footprints className="w-3 h-3" /> Speed</div>
              <div className="text-2xl font-bold">{speed} ft</div>
            </div>
          </>
        )}
      </div>

      {/* Initiative + Speed (PF1e row) */}
      {isPf1e && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border rounded-lg p-3 text-center">
            <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1"><Target className="w-3 h-3" /> Initiative</div>
            <div className="text-2xl font-bold">{formatMod(initiative)}</div>
          </div>
          <div className="bg-card border rounded-lg p-3 text-center">
            <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1"><Footprints className="w-3 h-3" /> Speed</div>
            <div className="text-2xl font-bold">{speed} ft</div>
          </div>
        </div>
      )}

      {/* Saving Throws */}
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Saving Throws
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(['fortitude', 'reflex', 'will'] as const).map(saveId => {
            const save = saves[saveId];
            return (
              <div key={saveId} className="bg-card border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold capitalize">{saveId}</span>
                  <span className="text-2xl font-bold">{formatMod(save.total)}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
                  <div className="text-center">
                    <div>Base</div>
                    <div className="font-medium text-foreground">{formatMod(save.base)}</div>
                  </div>
                  <div className="text-center">
                    <div>Ability</div>
                    <div className="font-medium text-foreground">{formatMod(save.ability)}</div>
                  </div>
                  <div className="text-center">
                    <div>Misc</div>
                    <input
                      type="number"
                      value={save.misc}
                      onChange={e => update({
                        saves: { ...saves, [saveId]: { ...save, misc: parseNum(e.target.value, 0) } },
                      })}
                      className="w-full text-center font-medium text-foreground bg-transparent border-b border-input focus:outline-none focus:border-primary"
                      disabled={!onUpdate}
                      title={`${saveId} misc modifier`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {Object.entries(skillRanks).filter(([, ranks]) => ranks > 0).map(([skillId, ranks]) => (
            <div key={skillId} className="flex items-center justify-between p-2 bg-card border rounded text-sm">
              <span className="font-medium capitalize">{skillId.replace(/-/g, ' ')}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{ranks} ranks</span>
                <input
                  type="number"
                  value={ranks}
                  onChange={e => update({ skillRanks: { ...skillRanks, [skillId]: parseNum(e.target.value, 0) } })}
                  className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary"
                  min={0}
                  disabled={!onUpdate}
                  title={`${skillId} ranks`}
                />
              </div>
            </div>
          ))}
          {Object.keys(skillRanks).filter(k => skillRanks[k] > 0).length === 0 && (
            <p className="text-sm text-muted-foreground italic col-span-2">No skill ranks assigned.</p>
          )}
        </div>
      </section>

      {/* Feats */}
      <section className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Feats</h3>
        <div className="space-y-2">
          {feats.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No feats selected.</p>
          ) : (
            feats.map(feat => (
              <div key={feat.id} className="flex items-start justify-between p-2 bg-muted/30 rounded border">
                <div>
                  <span className="font-medium">{feat.name}</span>
                  {feat.description && <p className="text-sm text-muted-foreground mt-1">{feat.description}</p>}
                </div>
                {onUpdate && (
                  <button
                    onClick={() => update({ feats: feats.filter(f => f.id !== feat.id) })}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                    title="Remove feat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
          {onUpdate && (
            <button
              onClick={() => update({
                feats: [...feats, { id: `feat-${Date.now()}`, name: 'New Feat', description: '', source: 'Custom' }],
              })}
              className="w-full py-2 border border-dashed border-input rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Feat
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
