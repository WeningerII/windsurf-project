import React from 'react';

interface Props {
  resourceLabel: string;
  onRetry?: () => void;
}

/**
 * Error state for lazy-loaded M&M reference catalogs (mirrors the Daggerheart
 * sheet's optionsState === 'error' message) so a failed import no longer
 * leaves the tab stuck on its loading placeholder.
 */
export const MamResourceLoadError: React.FC<Props> = ({ resourceLabel, onRetry }) => (
  <div className="text-center py-8 space-y-2">
    <p className="text-sm text-destructive">
      Failed to load {resourceLabel}. Existing sheet values remain editable.
    </p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="rounded border border-input px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        Retry
      </button>
    )}
  </div>
);
