import type { SystemSupportLevel } from '../../types/system-catalog';

/**
 * Shared styling and labels for system support-level badges, used by
 * GameSystemSelector and SystemStatusDashboard.
 */
export const supportBadgeStyles: Record<SystemSupportLevel, string> = {
  full: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
  partial: 'bg-amber-500/10 text-amber-700 border border-amber-500/20',
  scaffold: 'bg-slate-500/10 text-slate-700 border border-slate-500/20',
};

export const supportBadgeLabels: Record<SystemSupportLevel, string> = {
  full: 'Full',
  partial: 'Partial',
  scaffold: 'Scaffold',
};
