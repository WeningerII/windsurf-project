import { useMemo, useState } from 'react';
import { BookMarked, Check } from 'lucide-react';
import type { SceneState } from '../../types/core/scene';
import { summarizeSceneForLog } from '../../scene/sceneRecap';
import { Button } from '../ui/Button';

interface RecapPanelProps {
  state: SceneState;
  /** Name of the campaign this scene is linked to (shown on the button). */
  campaignName: string;
  onLog: (title: string, body: string) => void;
}

/**
 * Bridges a scene back to its campaign: previews a factual recap of the scene's
 * events (combat outcomes, checks, oracle answers) and logs it as a campaign
 * session entry. The preview is the exact text that will be logged — no hidden
 * behavior — and the player edits it into prose in the campaign view.
 */
export function RecapPanel({ state, campaignName, onLog }: RecapPanelProps) {
  const recap = useMemo(() => summarizeSceneForLog(state), [state]);
  // Track the exact text that was logged rather than a one-way boolean, so the
  // "Logged" confirmation clears once play continues and the recap grows —
  // otherwise it would falsely imply the newer recap is already in the log.
  const [loggedRecap, setLoggedRecap] = useState<string | null>(null);
  const logged = loggedRecap === recap;

  const handleLog = () => {
    onLog(state.name, recap);
    setLoggedRecap(recap);
  };

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-sm font-semibold">
          <BookMarked className="h-4 w-4" /> Session Recap
        </h5>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLog}
          title={`Log this recap to ${campaignName}'s session log`}
        >
          {logged ? (
            <Check className="mr-1.5 h-4 w-4" />
          ) : (
            <BookMarked className="mr-1.5 h-4 w-4" />
          )}
          {logged ? 'Logged' : `Log to ${campaignName}`}
        </Button>
      </div>
      <p className="whitespace-pre-wrap rounded-md border bg-muted/40 p-2 text-xs text-muted-foreground">
        {recap}
      </p>
      {logged && (
        <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400">
          Added to {campaignName}. Edit it into prose in the campaign view.
        </p>
      )}
    </div>
  );
}
