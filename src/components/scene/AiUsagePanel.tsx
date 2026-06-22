import { Activity } from 'lucide-react';
import type { AiTrace, BudgetCaps, SessionUsage } from '../../ai/aiObservability';

interface AiUsagePanelProps {
  usage: SessionUsage;
  caps: BudgetCaps;
  /** The most recent gateway trace, if any. */
  lastTrace?: AiTrace;
}

/** Short label for a cap value (a finite ceiling, or "∞" when disabled). */
function capLabel(value: number): string {
  return Number.isFinite(value) ? String(value) : '∞';
}

/**
 * A small, read-only meter for this session's AI usage and the most recent
 * gateway trace (Phase 14 observability). It makes the cost ceiling and the last
 * prompt → response → result interaction visible to the GM, so AI spend is never
 * invisible. Renders nothing until the session has made at least one AI call.
 */
export function AiUsagePanel({ usage, caps, lastTrace }: AiUsagePanelProps) {
  if (usage.calls === 0) return null;

  return (
    <div
      className="rounded-lg border bg-card p-3 text-xs text-muted-foreground"
      aria-label="AI usage this session"
    >
      <div className="mb-1 flex items-center gap-1.5 font-semibold text-foreground">
        <Activity className="h-3.5 w-3.5" /> AI usage
      </div>
      <p>
        {usage.calls} / {capLabel(caps.maxCalls)} calls · {usage.units.toLocaleString()} /{' '}
        {capLabel(caps.maxUnits)} units this session
      </p>
      {lastTrace && (
        <p className="mt-0.5">
          Last: <span className="font-medium text-foreground">{lastTrace.task}</span> ·{' '}
          {lastTrace.ok ? (lastTrace.source ?? 'ok') : `failed (${lastTrace.code})`} ·{' '}
          {lastTrace.latencyMs}ms{lastTrace.provider ? ` · ${lastTrace.provider}` : ''}
          <span className="ml-1 opacity-60">#{lastTrace.traceId.slice(0, 8)}</span>
        </p>
      )}
    </div>
  );
}
