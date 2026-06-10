import React from 'react';
import { Plus, Star, Target, X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { DiceRollButton } from '../../../components/DiceRollButton';
import type { RollResult } from '../../../registry/types';
import type { CharacterDocument } from '../../../types/core/document';
import { generateUUID } from '../../../utils/browserCompat';
import type { Mam3eDataModel } from '../data-model';

const MAM3E_SKILLS: Array<{
  id: string;
  label: string;
  ability: keyof Mam3eDataModel['abilities'];
}> = [
  { id: 'acrobatics', label: 'Acrobatics', ability: 'agi' },
  { id: 'athletics', label: 'Athletics', ability: 'str' },
  { id: 'close-combat', label: 'Close Combat', ability: 'fgt' },
  { id: 'deception', label: 'Deception', ability: 'pre' },
  { id: 'expertise', label: 'Expertise', ability: 'int' },
  { id: 'insight', label: 'Insight', ability: 'awe' },
  { id: 'intimidation', label: 'Intimidation', ability: 'pre' },
  { id: 'investigation', label: 'Investigation', ability: 'int' },
  { id: 'perception', label: 'Perception', ability: 'awe' },
  { id: 'persuasion', label: 'Persuasion', ability: 'pre' },
  { id: 'ranged-combat', label: 'Ranged Combat', ability: 'dex' },
  { id: 'sleight-of-hand', label: 'Sleight of Hand', ability: 'dex' },
  { id: 'stealth', label: 'Stealth', ability: 'agi' },
  { id: 'technology', label: 'Technology', ability: 'int' },
  { id: 'treatment', label: 'Treatment', ability: 'int' },
  { id: 'vehicles', label: 'Vehicles', ability: 'dex' },
];

interface Props {
  document: CharacterDocument<Mam3eDataModel>;
  canUpdate: boolean;
  onSkillRankChange: (skillId: string, rank: number, total: number) => void;
  onAdvantagesChange: (advantages: Mam3eDataModel['advantages']) => void;
  onRollCheck: (checkId: string) => Promise<RollResult>;
}

export const MamSkillsAdvantagesTab: React.FC<Props> = ({
  document,
  canUpdate,
  onSkillRankChange,
  onAdvantagesChange,
  onRollCheck,
}) => {
  const data = document.system;

  return (
    <>
      <section className="bg-card p-4 rounded-lg border mb-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Target className="w-5 h-5" /> Skills
        </h3>
        <div className="space-y-1">
          {MAM3E_SKILLS.map(({ id, label, ability }) => {
            const skill = data.skills[id] ?? { rank: 0, total: 0 };
            const total = skill.rank + data.abilities[ability];

            return (
              <div
                key={id}
                className="flex items-center justify-between p-1.5 hover:bg-muted/50 rounded text-sm transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>{label}</span>
                  <span className="text-muted-foreground text-xs uppercase">({ability})</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={skill.rank}
                    onChange={(event) => onSkillRankChange(id, Number(event.target.value), total)}
                    className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums text-sm"
                    min={0}
                    disabled={!canUpdate}
                    title={`${label} ranks`}
                  />
                  <span className="font-bold w-8 text-right tabular-nums">
                    {total >= 0 ? '+' : ''}
                    {total}
                  </span>
                  <DiceRollButton label={`${label} Check`} onRoll={() => onRollCheck(id)} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Star className="w-5 h-5" /> Advantages
          {data.advantages.length > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {data.advantages.length}
            </Badge>
          )}
        </h3>
        <div className="space-y-2">
          {data.advantages.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No advantages added yet.</p>
          ) : (
            data.advantages.map((advantage, index) => (
              <div
                key={advantage.id}
                className="flex items-center justify-between gap-2 p-2 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
              >
                {canUpdate ? (
                  <>
                    <input
                      type="text"
                      value={advantage.name}
                      onChange={(event) =>
                        onAdvantagesChange(
                          data.advantages.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, name: event.target.value } : entry
                          )
                        )
                      }
                      className="flex-1 min-w-0 font-medium bg-transparent border-b border-transparent focus:border-input focus:outline-none"
                      title="Advantage name"
                    />
                    <label className="flex items-center gap-1 text-xs text-muted-foreground">
                      Rank
                      <input
                        type="number"
                        min={0}
                        value={advantage.rank ?? 0}
                        onChange={(event) =>
                          onAdvantagesChange(
                            data.advantages.map((entry, entryIndex) =>
                              entryIndex === index
                                ? // Ranked advantages cost their rank in PP, so
                                  // negative ranks would refund points.
                                  { ...entry, rank: Math.max(0, Number(event.target.value) || 0) }
                                : entry
                            )
                          )
                        }
                        className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                        title="Advantage rank (ranked advantages cost rank PP; 0 = unranked)"
                      />
                    </label>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{advantage.name}</span>
                    {advantage.rank != null && advantage.rank > 0 && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 tabular-nums">
                        Rank {advantage.rank}
                      </Badge>
                    )}
                  </div>
                )}
                {canUpdate && (
                  <button
                    type="button"
                    onClick={() =>
                      onAdvantagesChange(
                        data.advantages.filter((_, entryIndex) => entryIndex !== index)
                      )
                    }
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove advantage"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
          {canUpdate && (
            <button
              type="button"
              onClick={() =>
                // UUID ids cannot collide on rapid double-adds the way
                // Date.now() ids could (duplicate ids broke per-id updates
                // and React keys).
                onAdvantagesChange([
                  ...data.advantages,
                  { id: `adv-${generateUUID()}`, name: 'New Advantage' },
                ])
              }
              className="w-full py-2 border border-dashed border-input rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Advantage
            </button>
          )}
        </div>
      </section>
    </>
  );
};
