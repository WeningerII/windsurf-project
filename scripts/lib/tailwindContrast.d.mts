/**
 * Types for the static contrast lint. The implementation is plain `.mjs` so the
 * verify-chain gate (`scripts/check-a11y-contrast.mjs`) and its vitest
 * self-check share ONE source of truth without a build step; this declaration is
 * what lets the TypeScript side import it.
 */

export type Rgb = [number, number, number];
export type Theme = 'light' | 'dark';

export interface ColourToken {
  className: string;
  name: string;
  alpha: number;
}

export interface ParsedClassString {
  lightText: ColourToken | null;
  darkText: ColourToken | null;
  lightBg: ColourToken | null;
  darkBg: ColourToken | null;
  fontSizePx: number;
  bold: boolean;
  hasOpacity: boolean;
}

export interface ContrastResult {
  theme: Theme;
  foreground: string;
  background: string;
  ratio: number;
  threshold: number;
  passes: boolean;
}

export interface Finding extends ContrastResult {
  file: string;
  line: number;
}

export interface BaselineEntry {
  ratio: number;
  threshold: number;
  note: string;
}

export interface Baseline {
  note?: string;
  pairs: Record<string, BaselineEntry>;
}

export type Resolve = (name: string, theme: Theme) => Rgb | null;

export declare const AA_NORMAL: number;
export declare const AA_LARGE: number;

export declare function extractClassStrings(source: string): { text: string; line: number }[];
export declare function parseClassString(text: string, resolve: Resolve): ParsedClassString | null;
export declare function relativeLuminance(colour: Rgb): number;
export declare function contrastRatio(a: Rgb, b: Rgb): number;
export declare function compositeOver(colour: Rgb, alpha: number, backdrop: Rgb): Rgb;
export declare function thresholdFor(text: { fontSizePx: number; bold: boolean }): number;
export declare function roundRatio(value: number): number;
export declare function findingKey(finding: {
  file: string;
  theme: Theme;
  foreground: string;
  background: string;
}): string;
export declare function evaluateTheme(
  parsed: ParsedClassString,
  theme: Theme,
  resolve: Resolve,
  surfaceFor: (theme: Theme) => Rgb
): ContrastResult | null;
export declare function scanSources(
  files: { file: string; source: string }[],
  helpers: { resolve: Resolve; surfaceFor: (theme: Theme) => Rgb }
): {
  findings: Finding[];
  unchecked: { file: string; line: number; reason: string; text: string }[];
  colourStrings: number;
};
export declare function evaluateAgainstBaseline(
  findings: Finding[],
  baseline: Baseline
): {
  unrecorded: Finding[];
  changed: (Finding & { recordedRatio: number })[];
  stale: string[];
  current: Map<string, Finding>;
};
