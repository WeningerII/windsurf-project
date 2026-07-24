import { useEffect, useState } from 'react';
import { Skeleton } from '../components/ui/Skeleton';
import { systemRegistry } from '../registry';
import type { SystemDataModel } from '../types/core/document';
import type { CreationPlan } from './types';
import { CreationWizard } from './CreationWizard';

export interface CreationWizardHostProps {
  systemId: string;
  onComplete: (system: SystemDataModel, name: string) => void;
  onCancel: () => void;
}

/**
 * Resolves a system's lazy creation plan + default-data factory from the
 * registry, then hands them to the generic {@link CreationWizard}. Kept separate
 * from the wizard so the whole subtree (plan resolution + wizard UI) lives behind
 * one lazy boundary and adds nothing to the eager first-paint bundle.
 *
 * Systems without a `loadCreationPlan` yield no plan; the host renders a small
 * notice and a Continue action so the app can fall back to default-seeded
 * creation. All seven registered systems ship a plan, so this is a safety net,
 * not an expected path.
 */
export function CreationWizardHost({ systemId, onComplete, onCancel }: CreationWizardHostProps) {
  const [plan, setPlan] = useState<CreationPlan<SystemDataModel> | null | undefined>(undefined);
  const def = systemRegistry.get(systemId);

  useEffect(() => {
    let cancelled = false;
    setPlan(undefined);
    systemRegistry
      .getCreationPlan(systemId)
      .then((resolved) => {
        if (!cancelled) setPlan(resolved ?? null);
      })
      .catch(() => {
        if (!cancelled) setPlan(null);
      });
    return () => {
      cancelled = true;
    };
  }, [systemId]);

  if (!def) {
    return <div className="p-8 text-sm text-destructive">Unknown system “{systemId}”.</div>;
  }

  if (plan === undefined) {
    return (
      <div className="space-y-3 p-8" data-testid="creation-host-loading">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (plan === null) {
    // No guided plan: fall back to default-seeded creation.
    return (
      <div className="space-y-4 p-8">
        <p className="text-sm text-muted-foreground">
          {def.label} does not expose a guided creator yet. Continue to start from its SRD default
          template.
        </p>
        <button
          type="button"
          onClick={() => onComplete(def.createDefaultData(), 'New Character')}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <CreationWizard
      systemId={systemId}
      plan={plan}
      createDefaultData={def.createDefaultData}
      systemLabel={def.label}
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
}

export default CreationWizardHost;
