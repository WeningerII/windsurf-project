// purpose: Selected feats section — lists chosen feats with manual-rider badge and removal/option editing.
import { FeatDefinition } from '../../../../types/character-options/feats';
import { Feat } from '../../../../types/core/character';
import type {
  Dnd5eFeatChoiceRequirement,
  Dnd5eFeatSelections,
} from '../../../../utils/featTemplate';
import { DND5E_FEAT_COPY } from '../../../../utils/documentationCopy';
import { getDnd5eFeatAutomationRequirements } from '../../../../utils/featTemplate';
import { shouldShowDnd5eManualFeatBadge } from '../../../../utils/featManualBadge';

interface Props {
  feats: Feat[];
  featTemplateError: string | null;
  featDefinitionsById: Map<string, FeatDefinition>;
  canUpdate: boolean;
  resolveFeatSelections: (
    featDefinition: FeatDefinition,
    feat: Feat,
    baseAttributes: Record<string, number>
  ) => Dnd5eFeatSelections;
  optionDisabledForRequirement: (
    requirement: Dnd5eFeatChoiceRequirement,
    selections: string[],
    selectionIndex: number,
    optionId: string
  ) => boolean;
  baseAttributes: Record<string, number>;
  onFeatRemove?: (featId: string) => void;
  onFeatSelectionChange?: (
    featDefinition: FeatDefinition,
    featId: string,
    requirementId: string,
    selectionIndex: number,
    optionId: string
  ) => void;
}

export function Dnd5eSelectedFeatsSection({
  feats,
  featTemplateError,
  featDefinitionsById,
  canUpdate,
  resolveFeatSelections,
  optionDisabledForRequirement,
  baseAttributes,
  onFeatRemove,
  onFeatSelectionChange,
}: Props) {
  if (feats.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border bg-card p-4 space-y-2">
      <h3 className="text-lg font-semibold">Selected Feats</h3>
      <p className="text-xs text-muted-foreground">{DND5E_FEAT_COPY.selectedSupport}</p>
      {featTemplateError && (
        <p className="text-sm text-destructive" role="alert">
          {featTemplateError}
        </p>
      )}
      {feats.map((feat) => (
        <div key={feat.id} className="rounded border bg-muted/30 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-medium">{feat.name}</div>
                {(() => {
                  const featDefinition = featDefinitionsById.get(feat.id);
                  if (!featDefinition || !shouldShowDnd5eManualFeatBadge(featDefinition, feat)) {
                    return null;
                  }

                  return (
                    <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Manual
                    </span>
                  );
                })()}
              </div>
              <div className="text-xs text-muted-foreground">{feat.source}</div>
              <p className="mt-1 text-sm text-muted-foreground">{feat.description}</p>
            </div>
            {canUpdate && onFeatRemove && (
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-destructive"
                onClick={() => onFeatRemove(feat.id)}
              >
                Remove
              </button>
            )}
          </div>
          {(() => {
            const featDefinition = featDefinitionsById.get(feat.id);
            if (!featDefinition) {
              return null;
            }

            const requirements = getDnd5eFeatAutomationRequirements(featDefinition);
            if (requirements.length === 0) {
              return null;
            }

            const resolvedSelections = resolveFeatSelections(featDefinition, feat, baseAttributes);

            return (
              <div className="mt-3 space-y-3 rounded border border-dashed bg-background/70 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Automation Choices
                </div>
                {requirements.map((requirement) => {
                  const selections = resolvedSelections[requirement.id] || [];

                  return (
                    <div key={`${feat.id}-${requirement.id}`} className="space-y-1.5">
                      <div className="text-sm font-medium">{requirement.label}</div>
                      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: requirement.count }, (_, selectionIndex) => (
                          <select
                            key={`${requirement.id}-${selectionIndex}`}
                            value={selections[selectionIndex] || ''}
                            onChange={(event) =>
                              onFeatSelectionChange?.(
                                featDefinition,
                                feat.id,
                                requirement.id,
                                selectionIndex,
                                event.target.value
                              )
                            }
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            title={`${feat.id} ${requirement.id} selection ${selectionIndex + 1}`}
                            disabled={!canUpdate}
                          >
                            {requirement.options.map((option) => (
                              <option
                                key={option.id}
                                value={option.id}
                                disabled={optionDisabledForRequirement(
                                  requirement,
                                  selections,
                                  selectionIndex,
                                  option.id
                                )}
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      ))}
    </section>
  );
}
