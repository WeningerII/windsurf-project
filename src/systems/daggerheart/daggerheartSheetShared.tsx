import { Badge } from '../../components/ui/Badge';
import type {
  DaggerheartAutomationMode,
  DaggerheartDomainCard,
  DaggerheartFeature,
} from '../../types/daggerheart';

const DOMAIN_CARD_AUTOMATION_LABELS: Record<DaggerheartAutomationMode, string> = {
  passive: 'Auto-applied',
  'triggered-manual': 'Manual',
  'reference-only': 'Reference',
};

const DOMAIN_CARD_AUTOMATION_VARIANTS: Record<
  DaggerheartAutomationMode,
  'success' | 'info' | 'outline'
> = {
  passive: 'success',
  'triggered-manual': 'info',
  'reference-only': 'outline',
};

function humanizeEffectTag(tag: string) {
  return tag
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

interface DaggerheartFeatureListProps {
  features: DaggerheartFeature[];
}

export function DaggerheartFeatureList({ features }: DaggerheartFeatureListProps) {
  return (
    <ul className="space-y-1.5 text-sm text-muted-foreground">
      {features.map((entry) => (
        <li key={entry.id}>
          <span className="font-medium text-foreground">{entry.name}.</span> {entry.description}
        </li>
      ))}
    </ul>
  );
}

interface DaggerheartSubclassFeatureGroupProps {
  label: string;
  features: DaggerheartFeature[];
  fallback: string;
}

export function DaggerheartSubclassFeatureGroup({
  label,
  features,
  fallback,
}: DaggerheartSubclassFeatureGroupProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      {features.length > 0 ? (
        <DaggerheartFeatureList features={features} />
      ) : (
        <p className="text-sm text-muted-foreground">{fallback}</p>
      )}
    </div>
  );
}

interface DaggerheartDomainCardAutomationProps {
  card: Pick<DaggerheartDomainCard, 'automationMode' | 'automationNote' | 'effectTags'> | undefined;
}

export function DaggerheartDomainCardAutomation({ card }: DaggerheartDomainCardAutomationProps) {
  if (!card) {
    return null;
  }

  if (
    !card.automationMode &&
    !card.automationNote &&
    (!card.effectTags || card.effectTags.length === 0)
  ) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {card.automationMode && (
          <Badge variant={DOMAIN_CARD_AUTOMATION_VARIANTS[card.automationMode]}>
            {DOMAIN_CARD_AUTOMATION_LABELS[card.automationMode]}
          </Badge>
        )}
        {(card.effectTags || []).map((tag) => (
          <Badge key={tag} variant="outline">
            {humanizeEffectTag(tag)}
          </Badge>
        ))}
      </div>
      {card.automationNote && (
        <p className="text-xs text-muted-foreground">{card.automationNote}</p>
      )}
    </div>
  );
}
