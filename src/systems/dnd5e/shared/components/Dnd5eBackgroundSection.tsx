import { Badge } from '../../../../components/ui/Badge';
import { Background } from '../../../../types/character-options/backgrounds';
import { formatBackgroundToolLabel } from '../../../../utils/backgroundTemplate';

type ChoiceSlot = {
  slotIndex: number;
  label: string;
  value: string;
  options: string[];
};

interface Props {
  selectedBackground: Background;
  backgroundFixedTools: string[];
  backgroundToolSlots: ChoiceSlot[];
  backgroundLanguageSlots: ChoiceSlot[];
  canUpdate: boolean;
  onBackgroundToolChange?: (slotIndex: number, toolId: string) => void;
  onBackgroundLanguageChange?: (slotIndex: number, language: string) => void;
}

export function Dnd5eBackgroundSection({
  selectedBackground,
  backgroundFixedTools,
  backgroundToolSlots,
  backgroundLanguageSlots,
  canUpdate,
  onBackgroundToolChange,
  onBackgroundLanguageChange,
}: Props) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{selectedBackground.name}</h3>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          Background
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{selectedBackground.feature.name}</p>
      {(backgroundFixedTools.length > 0 || backgroundToolSlots.length > 0) && (
        <div className="mt-3 space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Background Tools
          </div>
          {backgroundFixedTools.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {backgroundFixedTools.map((toolId) => formatBackgroundToolLabel(toolId)).join(', ')}
            </p>
          )}
          {backgroundToolSlots.map((slot) => (
            <label key={slot.slotIndex} className="block space-y-1">
              <span className="text-xs text-muted-foreground">{slot.label}</span>
              <select
                value={slot.value}
                onChange={(event) => onBackgroundToolChange?.(slot.slotIndex, event.target.value)}
                className="w-full rounded border border-input bg-transparent px-2 py-1 text-sm focus:border-primary focus:outline-none"
                disabled={!canUpdate}
                aria-label={`Background tool ${slot.slotIndex + 1}`}
              >
                <option value="">Select tool...</option>
                {slot.options.map((option) => (
                  <option key={option} value={option}>
                    {formatBackgroundToolLabel(option)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}
      {selectedBackground.languageProficiencies && (
        <div className="mt-3 space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Background Languages
          </div>
          {Array.isArray(selectedBackground.languageProficiencies) ? (
            <p className="text-sm text-muted-foreground">
              {selectedBackground.languageProficiencies.join(', ')}
            </p>
          ) : (
            backgroundLanguageSlots.map((slot) => (
              <label key={slot.slotIndex} className="block space-y-1">
                <span className="text-xs text-muted-foreground">{slot.label}</span>
                <select
                  value={slot.value}
                  onChange={(event) =>
                    onBackgroundLanguageChange?.(slot.slotIndex, event.target.value)
                  }
                  className="w-full rounded border border-input bg-transparent px-2 py-1 text-sm focus:border-primary focus:outline-none"
                  disabled={!canUpdate}
                  aria-label={`Background language ${slot.slotIndex + 1}`}
                >
                  <option value="">Select language...</option>
                  {slot.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))
          )}
        </div>
      )}
    </section>
  );
}
