import React from 'react';
import { abilityMod, parseNum } from '../../../utils/math';
import {
  dnd35eSkillSynergyTotal,
  dnd35eMaxSkillRanks,
  pf1eMaxSkillRanks,
} from '../../../utils/derivedCombatMath';
import type { Skill } from '../../../types/game-systems';

interface Props {
  skills: Skill[];
  baseAttributes: Record<string, number>;
  skillRanks: Record<string, number>;
  classSkills?: string[];
  isPf1e: boolean;
  characterLevel: number;
  canUpdate: boolean;
  onSkillRanksChange: (skillRanks: Record<string, number>) => void;
}

export const D20SkillsTab: React.FC<Props> = ({
  skills,
  baseAttributes,
  skillRanks,
  classSkills,
  isPf1e,
  characterLevel,
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
          // 3.5e auto-applies its unconditional skill synergies; PF1e's synergy
          // list differs and is not yet wired, so leave PF1e totals unchanged.
          const synergyBonus = isPf1e ? 0 : dnd35eSkillSynergyTotal(skill.id, skillRanks);
          const total = ranks + abilMod + classBonus + synergyBonus;
          // RAW max ranks: 3.5e class = level+3 / cross-class = (level+3)/2;
          // PF1e = level. Soft-validate (flag, don't clamp) so mid-edit values
          // and effect-granted ranks are never silently destroyed.
          const maxRanks = isPf1e
            ? pf1eMaxSkillRanks(characterLevel)
            : dnd35eMaxSkillRanks(characterLevel, Boolean(isClassSkill));
          const overCap = ranks > maxRanks;
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
                <span
                  className="text-xs font-bold tabular-nums w-6 text-right"
                  title={synergyBonus > 0 ? `Total (includes +${synergyBonus} synergy)` : 'Total'}
                >
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
                  className={`w-10 text-center bg-transparent border-b focus:outline-none tabular-nums text-xs ${
                    overCap
                      ? 'border-destructive text-destructive'
                      : 'border-input focus:border-primary'
                  }`}
                  min={0}
                  max={maxRanks}
                  disabled={!canUpdate}
                  title={
                    overCap
                      ? `${skill.name}: ${ranks} ranks exceeds the level-${characterLevel} max of ${maxRanks}`
                      : `${skill.name} ranks (max ${maxRanks})`
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
