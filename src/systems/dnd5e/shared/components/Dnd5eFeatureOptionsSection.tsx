import { Suspense, type ComponentType } from 'react';
import type {
  Dnd5eFeatureOptionDefinition,
  Dnd5eFeatureOptionSelection,
} from '../../../../types/character-options/feature-options';
import { getDnd5eFeatureOptionGroupLabel } from '../../../../utils/dnd5eFeatureOptions';
import { lazyWithPreload } from '../../../../utils/lazyWithPreload';
import { DND5E_FEATURE_OPTION_COPY } from '../../../../utils/documentationCopy';

type FeatureOptionBrowserProps = {
  options: Dnd5eFeatureOptionDefinition[];
  selectedOptions?: Dnd5eFeatureOptionSelection[];
  onSelectOption?: (option: Dnd5eFeatureOptionDefinition) => void;
};

const FeatureOptionBrowser = lazyWithPreload<FeatureOptionBrowserProps>(async () => {
  const module = await import('../../../../components/FeatureOptionBrowser');
  return {
    default: module.FeatureOptionBrowser as ComponentType<FeatureOptionBrowserProps>,
  };
});

interface Props {
  featureOptionError: string | null;
  selectedFeatureOptions: Dnd5eFeatureOptionDefinition[];
  eligibleFeatureOptions: Dnd5eFeatureOptionDefinition[];
  featureOptionSelections: Dnd5eFeatureOptionSelection[];
  featureOptionsLoaded: boolean;
  canUpdate: boolean;
  onFeatureOptionRemove?: (selection: {
    id: string;
    group: Dnd5eFeatureOptionSelection['group'];
  }) => void;
  onFeatureOptionSelect?: (option: Dnd5eFeatureOptionDefinition) => void;
}

type Dnd5eFeatureOptionsSectionComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

function featureOptionSelectionKey(
  selection: Pick<Dnd5eFeatureOptionSelection, 'group' | 'id'>
): string {
  return `${selection.group}:${selection.id}`;
}

export const Dnd5eFeatureOptionsSection: Dnd5eFeatureOptionsSectionComponent = ({
  featureOptionError,
  selectedFeatureOptions,
  eligibleFeatureOptions,
  featureOptionSelections,
  featureOptionsLoaded,
  canUpdate,
  onFeatureOptionRemove,
  onFeatureOptionSelect,
}: Props) => (
  <>
    <section className="rounded-lg border bg-card p-4 space-y-2">
      <h3 className="text-lg font-semibold">Selected Feature Options</h3>
      <p className="text-xs text-muted-foreground">{DND5E_FEATURE_OPTION_COPY.provenanceSupport}</p>
      {featureOptionError && (
        <p className="text-sm text-destructive" role="alert">
          {featureOptionError}
        </p>
      )}
      {selectedFeatureOptions.length > 0 ? (
        selectedFeatureOptions.map((option) => (
          <div key={featureOptionSelectionKey(option)} className="rounded border bg-muted/30 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{option.name}</div>
                <div className="text-xs text-muted-foreground">
                  {getDnd5eFeatureOptionGroupLabel(option.group)} • {option.source}
                </div>
                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                  {option.description}
                </p>
                {option.prerequisites && option.prerequisites.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Prerequisites: {option.prerequisites.join(', ')}
                  </p>
                )}
              </div>
              {canUpdate && onFeatureOptionRemove && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => onFeatureOptionRemove({ id: option.id, group: option.group })}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground italic">
          No 5e-2014 feature options selected yet.
        </p>
      )}
    </section>

    {featureOptionsLoaded ? (
      eligibleFeatureOptions.length > 0 ? (
        <Suspense
          fallback={
            <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
              Loading feature option browser...
            </div>
          }
        >
          <FeatureOptionBrowser
            options={eligibleFeatureOptions}
            selectedOptions={featureOptionSelections}
            onSelectOption={onFeatureOptionSelect}
          />
        </Suspense>
      ) : (
        <section className="rounded-lg border border-dashed border-input bg-card p-4 text-sm text-muted-foreground">
          {DND5E_FEATURE_OPTION_COPY.emptyState}
        </section>
      )
    ) : (
      <section className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        Loading feature options...
      </section>
    )}
  </>
);

Dnd5eFeatureOptionsSection.preload = () => FeatureOptionBrowser.preload();
