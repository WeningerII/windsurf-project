// purpose: Skills tab body — skill-proficiency selector with derived modifiers and roll buttons.
import { Target } from 'lucide-react';
import { DiceRollButton } from '../../../../components/DiceRollButton';
import { TabsContent } from '../../../../components/ui/Tabs';
import type { RollResult } from '../../../../registry/types';
import { abilityMod, formatMod } from '../../../../utils/math';

type SkillDefinition = {
  id: string;
  name: string;
  ability: string;
};

type SkillProficiency = {
  level?: 'none' | 'proficient' | 'expertise' | 'double' | 'half';
  source?: string[];
};

interface Props {
  skills: SkillDefinition[];
  attributes: Record<string, number>;
  skillProficiencies: Record<string, SkillProficiency>;
  profBonus: number;
  canUpdate: boolean;
  onToggleProficiency?: (skillId: string) => void;
  onRollSkill?: (skillId: string) => Promise<RollResult>;
}

export function Dnd5eSkillsTab({
  skills,
  attributes,
  skillProficiencies,
  profBonus,
  canUpdate,
  onToggleProficiency,
  onRollSkill,
}: Props) {
  return (
    <TabsContent value="skills">
      <section className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="w-5 h-5" /> Skills
        </h3>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {skills.map((skill) => {
            const proficiency = skillProficiencies[skill.id];
            const isProficient =
              proficiency?.level === 'proficient' || proficiency?.level === 'expertise';
            const isExpertise =
              proficiency?.level === 'expertise' || proficiency?.level === 'double';
            const proficiencyMultiplier = isExpertise
              ? 2
              : isProficient
                ? 1
                : proficiency?.level === 'half'
                  ? 0.5
                  : 0;
            const total =
              abilityMod(attributes[skill.ability] ?? 10) +
              Math.floor(profBonus * proficiencyMultiplier);

            return (
              <div
                key={skill.id}
                className="flex items-center justify-between rounded-lg border bg-card p-3"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleProficiency?.(skill.id)}
                    disabled={!canUpdate}
                    className="flex h-5 w-5 items-center justify-center rounded border text-[10px]"
                    title={`Toggle ${skill.name} proficiency`}
                  >
                    {isExpertise ? 'E' : isProficient ? 'P' : ''}
                  </button>
                  <div>
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-xs uppercase text-muted-foreground">{skill.ability}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold tabular-nums">{formatMod(total)}</span>
                  {onRollSkill && (
                    <DiceRollButton
                      label={`${skill.name} Check`}
                      onRoll={() => onRollSkill(skill.id)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </TabsContent>
  );
}
