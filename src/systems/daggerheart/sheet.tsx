import React, { useCallback } from 'react';
import { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { DaggerheartDataModel } from './data-model';
import { Heart, Shield, Zap, Star, StickyNote, Swords, Plus, X } from 'lucide-react';
import { parseNum } from '../../utils/math';
import { Badge } from '../../components/ui/Badge';
import { DiceRollButton } from '../../components/DiceRollButton';
import { systemRegistry } from '../../registry';

interface Props {
  document: CharacterDocument<DaggerheartDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

const ATTRIBUTES: Array<{
  id: keyof DaggerheartDataModel['attributes'];
  label: string;
  pair: string;
}> = [
  { id: 'agility', label: 'Agility', pair: 'Physical' },
  { id: 'strength', label: 'Strength', pair: 'Physical' },
  { id: 'finesse', label: 'Finesse', pair: 'Mental' },
  { id: 'instinct', label: 'Instinct', pair: 'Mental' },
  { id: 'presence', label: 'Presence', pair: 'Social' },
  { id: 'knowledge', label: 'Knowledge', pair: 'Social' },
];

export const DaggerheartSheet: React.FC<Props> = ({ document, onUpdate }) => {
  const data = document.system;

  const update = useCallback(
    (patch: Partial<DaggerheartDataModel>) => {
      if (!onUpdate) return;
      onUpdate({
        ...document,
        system: { ...data, ...patch },
        updatedAt: new Date(),
      } as CharacterDocument<SystemDataModel>);
    },
    [document, data, onUpdate]
  );

  const updateAttr = useCallback(
    (key: keyof typeof data.attributes, value: number) => {
      update({ attributes: { ...data.attributes, [key]: value } });
    },
    [data, update]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-card p-5 rounded-xl border shadow-sm">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={document.name}
              onChange={(e) =>
                onUpdate &&
                onUpdate({
                  ...document,
                  name: e.target.value,
                  updatedAt: new Date(),
                } as CharacterDocument<SystemDataModel>)
              }
              className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
              disabled={!onUpdate}
              placeholder="Character Name"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-1">
              <span className="text-muted-foreground">Heritage:</span>
              <input
                value={data.heritage}
                onChange={(e) => update({ heritage: e.target.value })}
                className="bg-transparent border-b border-input focus:border-primary focus:outline-none w-28"
                disabled={!onUpdate}
              />
            </label>
            <label className="flex items-center gap-1">
              <span className="text-muted-foreground">Community:</span>
              <input
                value={data.community}
                onChange={(e) => update({ community: e.target.value })}
                className="bg-transparent border-b border-input focus:border-primary focus:outline-none w-28"
                disabled={!onUpdate}
              />
            </label>
            <label className="flex items-center gap-1">
              <span className="text-muted-foreground">Class:</span>
              <input
                value={data.class}
                onChange={(e) => update({ class: e.target.value })}
                className="bg-transparent border-b border-input focus:border-primary focus:outline-none w-24"
                disabled={!onUpdate}
              />
            </label>
            <label className="flex items-center gap-1">
              <span className="text-muted-foreground">Subclass:</span>
              <input
                value={data.subclass}
                onChange={(e) => update({ subclass: e.target.value })}
                className="bg-transparent border-b border-input focus:border-primary focus:outline-none w-24"
                disabled={!onUpdate}
              />
            </label>
            <label className="flex items-center gap-1">
              <span className="text-muted-foreground">Level:</span>
              <input
                type="number"
                value={data.level}
                onChange={(e) => update({ level: parseNum(e.target.value, 1) })}
                className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary"
                min={1}
                max={10}
                disabled={!onUpdate}
              />
            </label>
          </div>
        </div>

        {/* HP / Stress / Armor / Hope */}
        <div className="flex flex-wrap gap-3 text-center">
          <div className="bg-muted/30 rounded-lg p-3 min-w-[80px]">
            <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
              <Heart className="w-3 h-3" /> HP
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <input
                type="number"
                value={data.hitPoints.current}
                onChange={(e) =>
                  update({ hitPoints: { ...data.hitPoints, current: parseNum(e.target.value, 0) } })
                }
                className="w-10 text-center text-lg font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                disabled={!onUpdate}
                title="Current HP"
              />
              <span className="text-muted-foreground">/</span>
              <span className="text-lg font-bold tabular-nums">{data.hitPoints.max}</span>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 min-w-[80px]">
            <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
              <Zap className="w-3 h-3" /> Stress
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <input
                type="number"
                value={data.stress.current}
                onChange={(e) =>
                  update({ stress: { ...data.stress, current: parseNum(e.target.value, 0) } })
                }
                className="w-10 text-center text-lg font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                disabled={!onUpdate}
                title="Current Stress"
              />
              <span className="text-muted-foreground">/</span>
              <span className="text-lg font-bold tabular-nums">{data.stress.max}</span>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 min-w-[80px]">
            <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> Armor
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <input
                type="number"
                value={data.armor.current}
                onChange={(e) =>
                  update({ armor: { ...data.armor, current: parseNum(e.target.value, 0) } })
                }
                className="w-10 text-center text-lg font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                disabled={!onUpdate}
                title="Current Armor"
              />
              <span className="text-muted-foreground">/</span>
              <input
                type="number"
                value={data.armor.max}
                onChange={(e) =>
                  update({ armor: { ...data.armor, max: parseNum(e.target.value, 0) } })
                }
                className="w-10 text-center text-lg font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                disabled={!onUpdate}
                title="Max Armor"
              />
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 min-w-[80px]">
            <div className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-3 h-3" /> Hope
            </div>
            <input
              type="number"
              value={data.hope}
              onChange={(e) => update({ hope: parseNum(e.target.value, 0) })}
              className="w-10 text-center text-xl font-bold bg-transparent border-b border-amber-400 focus:outline-none focus:border-amber-500 tabular-nums mt-1 mx-auto block"
              min={0}
              disabled={!onUpdate}
              title="Hope tokens"
            />
          </div>
        </div>
      </div>

      {/* Defenses row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card p-3 rounded-lg border text-center">
          <div className="text-xs text-muted-foreground font-medium">Evasion</div>
          <div className="text-xl font-bold tabular-nums">{data.evasion}</div>
        </div>
        <div className="bg-card p-3 rounded-lg border text-center">
          <div className="text-xs text-muted-foreground font-medium">Armor Score</div>
          <input
            type="number"
            value={data.armorScore}
            onChange={(e) => update({ armorScore: parseNum(e.target.value, 0) })}
            className="w-14 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums mx-auto block"
            disabled={!onUpdate}
            title="Armor Score"
          />
        </div>
        <div className="bg-card p-3 rounded-lg border text-center">
          <div className="text-xs text-muted-foreground font-medium">Major Threshold</div>
          <input
            type="number"
            value={data.majorThreshold}
            onChange={(e) => update({ majorThreshold: parseNum(e.target.value, 0) })}
            className="w-14 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums mx-auto block"
            disabled={!onUpdate}
            title="Major damage threshold"
          />
        </div>
        <div className="bg-card p-3 rounded-lg border text-center">
          <div className="text-xs text-muted-foreground font-medium">Severe Threshold</div>
          <input
            type="number"
            value={data.severeThreshold}
            onChange={(e) => update({ severeThreshold: parseNum(e.target.value, 0) })}
            className="w-14 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums mx-auto block"
            disabled={!onUpdate}
            title="Severe damage threshold"
          />
        </div>
      </div>

      {/* Attributes */}
      <section className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Swords className="w-5 h-5" /> Attributes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ATTRIBUTES.map((attr) => (
            <div key={attr.id} className="flex flex-col items-center p-3 bg-muted/20 rounded-lg">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {attr.pair}
              </span>
              <span className="text-xs font-semibold uppercase">{attr.label}</span>
              <input
                type="number"
                value={data.attributes[attr.id]}
                onChange={(e) => updateAttr(attr.id, parseNum(e.target.value, -3))}
                className="w-14 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums mt-1"
                disabled={!onUpdate}
                title={`${attr.label} modifier`}
              />
              <DiceRollButton
                label={`Roll ${attr.label}`}
                onRoll={() =>
                  systemRegistry.get(document.systemId)!.engine.rollCheck(document, attr.id)
                }
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Experiences */}
      <section className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Experiences</h3>
        <div className="flex flex-wrap gap-2">
          {data.experiences.map((exp, i) => (
            <div
              key={i}
              className="flex items-center gap-1 bg-muted/40 rounded-full pl-3 pr-1.5 py-1"
            >
              <input
                value={exp}
                onChange={(e) => {
                  const updated = [...data.experiences];
                  updated[i] = e.target.value;
                  update({ experiences: updated });
                }}
                className="bg-transparent text-sm w-28 focus:outline-none"
                disabled={!onUpdate}
              />
              {onUpdate && (
                <button
                  onClick={() =>
                    update({ experiences: data.experiences.filter((_, j) => j !== i) })
                  }
                  className="p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Remove experience"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          {onUpdate && (
            <button
              onClick={() => update({ experiences: [...data.experiences, ''] })}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary border border-dashed border-input rounded-full px-3 py-1 hover:border-primary transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Experience
            </button>
          )}
        </div>
        {data.experiences.length === 0 && !onUpdate && (
          <p className="text-sm text-muted-foreground italic">No experiences listed.</p>
        )}
      </section>

      {/* Domain Cards */}
      <section className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Domain Cards</h3>
        <div className="space-y-2">
          {data.domainCards.map((card, i) => (
            <div
              key={card.id || i}
              className="p-3 rounded border flex items-start justify-between gap-2"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <input
                    value={card.name}
                    onChange={(e) => {
                      const updated = [...data.domainCards];
                      updated[i] = { ...card, name: e.target.value };
                      update({ domainCards: updated });
                    }}
                    className="font-medium text-sm bg-transparent border-b border-input focus:outline-none focus:border-primary"
                    disabled={!onUpdate}
                    placeholder="Card name"
                  />
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {card.domain || 'domain'}
                  </Badge>
                </div>
                <textarea
                  value={card.description}
                  onChange={(e) => {
                    const updated = [...data.domainCards];
                    updated[i] = { ...card, description: e.target.value };
                    update({ domainCards: updated });
                  }}
                  className="w-full mt-1 text-xs text-muted-foreground bg-transparent border-b border-input focus:outline-none focus:border-primary resize-none"
                  rows={2}
                  disabled={!onUpdate}
                  placeholder="Card description..."
                />
              </div>
              {onUpdate && (
                <button
                  onClick={() =>
                    update({ domainCards: data.domainCards.filter((_, j) => j !== i) })
                  }
                  className="p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Remove domain card"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {onUpdate && (
            <button
              onClick={() =>
                update({
                  domainCards: [
                    ...data.domainCards,
                    {
                      id: `dc-${Date.now()}`,
                      name: '',
                      domain: '',
                      level: data.level,
                      description: '',
                    },
                  ],
                })
              }
              className="w-full py-2 border border-dashed border-input rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Domain Card
            </button>
          )}
        </div>
      </section>

      {/* Notes */}
      <section className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <StickyNote className="w-5 h-5" /> Notes
        </h3>
        <textarea
          value={data.notes || ''}
          onChange={(e) => update({ notes: e.target.value })}
          className="w-full min-h-[120px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
          placeholder="Campaign notes, session log..."
          disabled={!onUpdate}
        />
      </section>
    </div>
  );
};
