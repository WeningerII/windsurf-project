import type { SceneState } from '../types/core/scene';
import { ORACLE_ANSWER_LABEL } from './oracle';

/**
 * Build a factual recap of what happened in a scene, suitable as a draft
 * campaign session-log entry. This is a deterministic summary of the folded
 * state — defeated combatants, checks rolled, oracle answers — never invented
 * narrative; the player edits it into prose afterward. Pure and side-effect
 * free so it can be previewed live and unit-tested.
 */
export function summarizeSceneForLog(state: SceneState): string {
  const lines: string[] = [];

  const combatants = Object.values(state.tokens).filter(
    (token): token is typeof token & { hp: NonNullable<typeof token.hp> } => Boolean(token.hp)
  );
  if (combatants.length > 0) {
    const defeated = combatants.filter((token) => token.hp.current <= 0).map((token) => token.name);
    const parts: string[] = [];
    if (state.round > 1) parts.push(`reached round ${state.round}`);
    if (defeated.length > 0) parts.push(`defeated ${formatList(defeated)}`);
    if (parts.length > 0) {
      lines.push(`Combat: ${parts.join('; ')}.`);
    }
  }

  if (state.checkLog.length > 0) {
    const items = state.checkLog.map((entry) => {
      const vs = entry.dc !== undefined ? ` vs DC ${entry.dc}` : '';
      const tag = entry.outcome === 'unresolved' ? '' : ` (${entry.outcome})`;
      return `${entry.label} ${entry.total}${vs}${tag}`;
    });
    lines.push(`Checks: ${items.join('; ')}.`);
  }

  if (state.oracleLog.length > 0) {
    const items = state.oracleLog.map((entry) => {
      const question = entry.question ?? 'Oracle';
      return `${question} → ${ORACLE_ANSWER_LABEL[entry.answer]}`;
    });
    lines.push(`Oracle: ${items.join('; ')}.`);
  }

  return lines.length > 0 ? lines.join('\n') : 'No recorded events in this scene yet.';
}

/** "a", "a and b", or "a, b, and c". */
function formatList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
