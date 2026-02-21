import React, { useCallback } from 'react';
import { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { Mam3eDataModel } from './data-model';
import { Shield, Zap, Brain, Activity, AlertTriangle, Plus, X } from 'lucide-react';
import { parseNum } from '../../utils/math';

interface Props {
  document: CharacterDocument<Mam3eDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export const Mam3eCharacterSheet: React.FC<Props> = ({ document, onUpdate }) => {
  const data = document.system;
  const { powerPoints, abilities, defenses } = data;

  const update = useCallback((patch: Partial<Mam3eDataModel>) => {
    if (!onUpdate) return;
    onUpdate({ ...document, system: { ...data, ...patch }, updatedAt: new Date() });
  }, [document, data, onUpdate]);

  const updateAbility = useCallback((key: keyof typeof abilities, value: number) => {
    update({ abilities: { ...abilities, [key]: value } });
  }, [abilities, update]);

  const updateDefenseRank = useCallback((key: keyof typeof defenses, rank: number) => {
    update({ defenses: { ...defenses, [key]: { ...defenses[key], rank } } });
  }, [defenses, update]);

  const ppSpent = powerPoints.spent.abilities + powerPoints.spent.defenses + powerPoints.spent.powers + powerPoints.spent.advantages + powerPoints.spent.skills;
  const ppOver = ppSpent > powerPoints.total;

  const AbilityBlock = ({ label, abilityKey }: { label: string; abilityKey: keyof typeof abilities }) => (
    <div className="flex flex-col items-center p-3 bg-card border rounded-lg">
      <span className="text-xs font-semibold text-muted-foreground uppercase">{label}</span>
      <input
        type="number"
        value={abilities[abilityKey]}
        onChange={e => updateAbility(abilityKey, parseNum(e.target.value, 0))}
        className="w-14 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary"
        disabled={!onUpdate}
        title={`${label} rank`}
      />
      <span className="text-xs text-muted-foreground">{abilities[abilityKey] * 2} PP</span>
    </div>
  );

  const DefenseRow = ({ label, defKey }: { label: string; defKey: keyof typeof defenses }) => {
    const def = defenses[defKey];
    return (
      <div className="flex justify-between items-center py-1 border-b last:border-0">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-1">
            <span className="text-muted-foreground">Rank:</span>
            <input
              type="number"
              value={def.rank}
              onChange={e => updateDefenseRank(defKey, parseNum(e.target.value, 0))}
              className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary"
              disabled={!onUpdate}
            />
          </label>
          <span className="font-bold">Total: {def.total}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {document.img ? (
              <img src={document.img} alt={document.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <Zap className="w-8 h-8 text-primary" />
            )}
          </div>
          <div className="space-y-1">
            <input
              value={document.name}
              onChange={e => onUpdate?.({ ...document, name: e.target.value, updatedAt: new Date() })}
              className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
              disabled={!onUpdate}
              title="Character name"
              placeholder="Character name"
            />
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Power Level</span>
              <input
                type="number"
                value={data.powerLevel}
                onChange={e => update({ powerLevel: parseNum(e.target.value, 1) })}
                className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary"
                min={1}
                disabled={!onUpdate}
                title="Power level"
              />
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-muted-foreground">Power Points</div>
          <div className={`text-2xl font-bold ${ppOver ? 'text-destructive' : 'text-primary'}`}>
            {ppSpent} / {powerPoints.total}
          </div>
          {ppOver && (
            <div className="flex items-center gap-1 text-xs text-destructive mt-1">
              <AlertTriangle className="w-3 h-3" />
              Over budget by {ppSpent - powerPoints.total}
            </div>
          )}
          <input
            type="number"
            value={powerPoints.total}
            onChange={e => update({ powerPoints: { ...powerPoints, total: parseNum(e.target.value, 0) } })}
            className="w-16 text-center text-xs bg-transparent border-b border-input focus:outline-none focus:border-primary mt-1"
            min={0}
            disabled={!onUpdate}
            title="Total power points"
          />
          <span className="text-xs text-muted-foreground ml-1">total PP</span>
        </div>
      </div>

      {/* Abilities Grid */}
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5" /> Abilities
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          <AbilityBlock label="STR" abilityKey="str" />
          <AbilityBlock label="STA" abilityKey="sta" />
          <AbilityBlock label="AGI" abilityKey="agi" />
          <AbilityBlock label="DEX" abilityKey="dex" />
          <AbilityBlock label="FGT" abilityKey="fgt" />
          <AbilityBlock label="INT" abilityKey="int" />
          <AbilityBlock label="AWE" abilityKey="awe" />
          <AbilityBlock label="PRE" abilityKey="pre" />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Defenses */}
        <section className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" /> Defenses
          </h3>
          <div className="space-y-2">
            <DefenseRow label="Dodge" defKey="dodge" />
            <DefenseRow label="Parry" defKey="parry" />
            <DefenseRow label="Fortitude" defKey="fortitude" />
            <DefenseRow label="Toughness" defKey="toughness" />
            <DefenseRow label="Will" defKey="will" />
          </div>
        </section>

        {/* Powers */}
        <section className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5" /> Powers
          </h3>
          <div className="space-y-3">
            {data.powers.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No powers added yet.</p>
            ) : (
              data.powers.map(power => (
                <div key={power.id} className="p-3 bg-muted/30 rounded border">
                  <div className="flex justify-between font-medium">
                    <span>{power.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-primary/10 px-2 rounded text-primary">
                        {power.action}
                      </span>
                      {onUpdate && (
                        <button
                          onClick={() => update({ powers: data.powers.filter(p => p.id !== power.id) })}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          title="Remove power"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{power.description}</p>
                </div>
              ))
            )}
            {onUpdate && (
              <button
                onClick={() => {
                  const id = `power-${Date.now()}`;
                  update({
                    powers: [...data.powers, {
                      id,
                      name: 'New Power',
                      system: 'mam3e',
                      source: 'Custom',
                      type: 'attack',
                      action: 'standard',
                      range: 'close',
                      duration: 'instant',
                      baseCost: 1,
                      perRank: true,
                      description: '',
                      effects: [],
                    }],
                  });
                }}
                className="w-full py-2 border border-dashed border-input rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Power
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Complications */}
      <section className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Complications
        </h3>
        <div className="space-y-2">
          {data.complications.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No complications added yet.</p>
          ) : (
            data.complications.map((comp, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-muted/30 rounded border">
                <div className="flex-1">
                  <input
                    value={comp.name}
                    onChange={e => {
                      const updated = [...data.complications];
                      updated[i] = { ...comp, name: e.target.value };
                      update({ complications: updated });
                    }}
                    className="font-medium bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
                    placeholder="Complication name"
                    disabled={!onUpdate}
                  />
                  <input
                    value={comp.description}
                    onChange={e => {
                      const updated = [...data.complications];
                      updated[i] = { ...comp, description: e.target.value };
                      update({ complications: updated });
                    }}
                    className="text-sm text-muted-foreground bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full mt-1"
                    placeholder="Description"
                    disabled={!onUpdate}
                  />
                </div>
                {onUpdate && (
                  <button
                    onClick={() => update({ complications: data.complications.filter((_, j) => j !== i) })}
                    className="text-muted-foreground hover:text-destructive transition-colors mt-1"
                    title="Remove complication"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
          {onUpdate && (
            <button
              onClick={() => update({ complications: [...data.complications, { name: '', description: '' }] })}
              className="w-full py-2 border border-dashed border-input rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Complication
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
