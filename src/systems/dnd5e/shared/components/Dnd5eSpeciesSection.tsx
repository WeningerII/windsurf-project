// purpose: Species section — selected species/lineage with size, speed, and template-driven trait provenance.
import { Badge } from '../../../../components/ui/Badge';
import { Species } from '../../../../types/character-options/species';
import { formatDnd5eSpeciesToolLabel } from '../speciesTemplate';

type ChoiceSlot = {
  slotIndex: number;
  label: string;
  value: string;
  options: string[];
};

interface Props {
  selectedSpecies: Species;
  speciesAbilitySlots: ChoiceSlot[];
  speciesLanguageSlots: ChoiceSlot[];
  speciesSkillSlots: ChoiceSlot[];
  speciesToolSlots: ChoiceSlot[];
  abilityNames: Record<string, string>;
  skillNames: Map<string, string>;
  canUpdate: boolean;
  onSpeciesAbilityChange?: (slotIndex: number, abilityId: string) => void;
  onSpeciesLanguageChange?: (slotIndex: number, language: string) => void;
  onSpeciesSkillChange?: (slotIndex: number, skillId: string) => void;
  onSpeciesToolChange?: (slotIndex: number, toolId: string) => void;
}

export function Dnd5eSpeciesSection({
  selectedSpecies,
  speciesAbilitySlots,
  speciesLanguageSlots,
  speciesSkillSlots,
  speciesToolSlots,
  abilityNames,
  skillNames,
  canUpdate,
  onSpeciesAbilityChange,
  onSpeciesLanguageChange,
  onSpeciesSkillChange,
  onSpeciesToolChange,
}: Props) {
  const hasChoiceSlots =
    speciesAbilitySlots.length > 0 ||
    speciesLanguageSlots.length > 0 ||
    speciesSkillSlots.length > 0 ||
    speciesToolSlots.length > 0;

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{selectedSpecies.name}</h3>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          Species
        </Badge>
      </div>
      {hasChoiceSlots && (
        <div className="mt-3 space-y-3">
          {speciesAbilitySlots.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Species Ability Choices
              </div>
              {speciesAbilitySlots.map((slot) => (
                <label key={slot.slotIndex} className="block space-y-1">
                  <span className="text-xs text-muted-foreground">{slot.label}</span>
                  <select
                    value={slot.value}
                    onChange={(event) =>
                      onSpeciesAbilityChange?.(slot.slotIndex, event.target.value)
                    }
                    className="w-full rounded border border-input bg-transparent px-2 py-1 text-sm focus:border-primary focus:outline-none"
                    disabled={!canUpdate}
                    aria-label={`Species ability ${slot.slotIndex + 1}`}
                  >
                    <option value="">Select ability...</option>
                    {slot.options.map((option) => (
                      <option key={option} value={option}>
                        {abilityNames[option] || option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}
          {speciesLanguageSlots.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Species Languages
              </div>
              {speciesLanguageSlots.map((slot) => (
                <label key={slot.slotIndex} className="block space-y-1">
                  <span className="text-xs text-muted-foreground">{slot.label}</span>
                  <select
                    value={slot.value}
                    onChange={(event) =>
                      onSpeciesLanguageChange?.(slot.slotIndex, event.target.value)
                    }
                    className="w-full rounded border border-input bg-transparent px-2 py-1 text-sm focus:border-primary focus:outline-none"
                    disabled={!canUpdate}
                    aria-label={`Species language ${slot.slotIndex + 1}`}
                  >
                    <option value="">Select language...</option>
                    {slot.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}
          {speciesSkillSlots.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Species Skills
              </div>
              {speciesSkillSlots.map((slot) => (
                <label key={slot.slotIndex} className="block space-y-1">
                  <span className="text-xs text-muted-foreground">{slot.label}</span>
                  <select
                    value={slot.value}
                    onChange={(event) => onSpeciesSkillChange?.(slot.slotIndex, event.target.value)}
                    className="w-full rounded border border-input bg-transparent px-2 py-1 text-sm focus:border-primary focus:outline-none"
                    disabled={!canUpdate}
                    aria-label={`Species skill ${slot.slotIndex + 1}`}
                  >
                    <option value="">Select skill...</option>
                    {slot.options.map((option) => (
                      <option key={option} value={option}>
                        {skillNames.get(option) || option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}
          {speciesToolSlots.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Species Tools
              </div>
              {speciesToolSlots.map((slot) => (
                <label key={slot.slotIndex} className="block space-y-1">
                  <span className="text-xs text-muted-foreground">{slot.label}</span>
                  <select
                    value={slot.value}
                    onChange={(event) => onSpeciesToolChange?.(slot.slotIndex, event.target.value)}
                    className="w-full rounded border border-input bg-transparent px-2 py-1 text-sm focus:border-primary focus:outline-none"
                    disabled={!canUpdate}
                    aria-label={`Species tool ${slot.slotIndex + 1}`}
                  >
                    <option value="">Select tool...</option>
                    {slot.options.map((option) => (
                      <option key={option} value={option}>
                        {formatDnd5eSpeciesToolLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
