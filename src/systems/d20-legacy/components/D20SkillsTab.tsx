import React from 'react';
import { abilityMod, parseNum } from '../../../utils/math';
import type { Skill } from '../../../types/game-systems';

interface Props {
  skills: Skill[];
  baseAttributes: Record<string, number>;
  skillRanks: Record<string, number>;
  classSkills?: string[];
  isPf1e: boolean;
  canUpdate: boolean;
  onSkillRanksChange: (skillRanks: Record<string, number>) => void;
}

export const D20SkillsTab: React.FC<Props> = ({
  skills,
  baseAttributes,
  skillRanks,
  classSkills,
  isPf1e,
  canUpdate,
  onSkillRanksChange,
}) => {
  const trainedSkillCount = Object.keys(skillRanks).filter((key) => skillRanks[key] > 0).length;

  return (
    <section>
      <h3 className="text-lg font-semibold mb-3">Skills ({trainedSkillCount} trained)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {skills.map((skill) => {
          const ranks = skillRanks[skill.id] ?? 0;
          const isClassSkill = classSkills?.includes(skill.id);
          const abilMod = abilityMod(baseAttributes[skill.attribute] ?? 10);
          const classBonus = isPf1e && isClassSkill && ranks > 0 ? 3 : 0;
          const total = ranks + abilMod + classBonus;
          return (
            <div
              key={skill.id}
              className={`flex items-center justify-between p-1.5 bg-card border rounded text-sm transition-colors hover:bg-muted/50 ${ranks > 0 ? '' : 'opacity-60'}`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                {isClassSkill && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                    title="Class skill"
                  />
                )}
                <span className="font-medium truncate text-xs">{skill.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase">
                  {skill.attribute}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-bold tabular-nums w-6 text-right" title="Total">
                  {total >= 0 ? '+' : ''}
                  {total}
                </span>
                <input
                  type="number"
                  value={ranks}
                  onChange={(event) =>
                    onSkillRanksChange({
                      ...skillRanks,
                      [skill.id]: parseNum(event.target.value, 0),
                    })
                  }
                  className="w-10 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums text-xs"
                  min={0}
                  disabled={!canUpdate}
                  title={`${skill.name} ranks`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
