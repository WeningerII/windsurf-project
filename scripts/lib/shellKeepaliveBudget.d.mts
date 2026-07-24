/**
 * Types for the Phase-7 keepalive budget module. The implementation is plain
 * `.mjs` so the verify-chain gate (`scripts/check-keepalive-budget.mjs`) and the
 * measuring vitest suite can share ONE source of truth for the numbers without a
 * build step; this declaration is what lets the TypeScript side import it.
 */

export declare const KEEPALIVE_ARTIFACT_PATH: string;
export declare const SURFACE_STAGE_SOURCE: string;
export declare const HIDDEN_SURFACE_CLASSES: string;
export declare const FORBIDDEN_HIDE_UTILITIES: readonly string[];
export declare const REQUIRED_TRANSITIONS: readonly string[];

export declare const KEEPALIVE_BUDGETS: {
  maxAttributeMutationsPerSwitch: number;
  maxChildListMutationsPerSwitch: number;
  maxNodesAddedPerSwitch: number;
  maxNodesRemovedPerSwitch: number;
  maxExtraMountsAfterFirstVisit: number;
  subtreeScalingMustBeConstant: boolean;
  smallSubtreeNodes: number;
  largeSubtreeNodes: number;
};

export declare function evaluateKeepaliveBudget(
  report: unknown,
  expected?: { sourceHash?: string; systemIds?: string[] }
): string[];
