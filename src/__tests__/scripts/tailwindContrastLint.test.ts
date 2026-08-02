import { describe, expect, it } from 'vitest';
import {
  compositeOver,
  contrastRatio,
  evaluateAgainstBaseline,
  extractClassStrings,
  parseClassString,
  roundRatio,
  scanSources,
  thresholdFor,
} from '../../../scripts/lib/tailwindContrast.mjs';
import type { Rgb, Theme } from '../../../scripts/lib/tailwindContrast.mjs';

/**
 * Self-check for the static contrast lint (WORK_PLAN §6.4).
 *
 * The lint exists because the RENDERED a11y scan was measured reaching four of
 * the ~17 files the contrast fix touched — dropping the `supportBadges` dark
 * override, a 1.79:1 failure, left it at "8 passed, exit 0". So the first thing
 * this file pins is that the replacement gate FAILS on that exact revert, and
 * the second is that the arithmetic reproduces the ratios §6.4 published from a
 * live browser. A gate nobody has watched fail is not a gate.
 */

/** The shipped theme surfaces: `--background` in each theme. */
const SURFACES: Record<Theme, Rgb> = {
  light: [255, 255, 255],
  dark: [2, 8, 23],
};
const surfaceFor = (theme: Theme) => SURFACES[theme];

/** Just enough of the palette and the token set for the cases below. */
const PALETTE: Record<string, Rgb> = {
  'amber-400': [251, 191, 36],
  'amber-600': [217, 119, 6],
  'amber-700': [180, 83, 9],
  'slate-300': [203, 213, 225],
  'slate-500': [100, 116, 139],
  'slate-700': [51, 65, 85],
  white: [255, 255, 255],
};
const TOKENS: Record<Theme, Record<string, Rgb>> = {
  light: { background: [255, 255, 255], foreground: [15, 23, 42] },
  dark: { background: [2, 8, 23], foreground: [248, 250, 252] },
};
const resolve = (name: string, theme: Theme): Rgb | null =>
  TOKENS[theme][name] ?? PALETTE[name] ?? null;

function scan(source: string) {
  return scanSources([{ file: 'src/components/Fixture.tsx', source }], { resolve, surfaceFor });
}

describe('contrast arithmetic', () => {
  it('reproduces the ratios §6.4 measured in a live browser', () => {
    // These three numbers were published by the 2026-07-31 audit from computed
    // styles, not from this code — they are an independent check on the maths.
    expect(roundRatio(contrastRatio(PALETTE['amber-600'], SURFACES.dark))).toBe(6.28);
    expect(roundRatio(contrastRatio(PALETTE['amber-700'], SURFACES.dark))).toBe(3.98);
    expect(roundRatio(contrastRatio(PALETTE['amber-400'], SURFACES.dark))).toBe(11.98);
  });

  it('is symmetric and bounded by the black/white extreme', () => {
    expect(roundRatio(contrastRatio([0, 0, 0], [255, 255, 255]))).toBe(21);
    expect(contrastRatio(SURFACES.dark, PALETTE['amber-600'])).toBe(
      contrastRatio(PALETTE['amber-600'], SURFACES.dark)
    );
    expect(contrastRatio(SURFACES.dark, SURFACES.dark)).toBe(1);
  });

  it('composites a tint over the surface instead of ignoring the alpha', () => {
    expect(compositeOver(PALETTE['slate-500'], 0.1, SURFACES.dark)).toEqual([12, 19, 35]);
    expect(compositeOver(PALETTE['slate-500'], 1, SURFACES.dark)).toEqual(PALETTE['slate-500']);
  });

  it('applies WCAG large-text thresholds, not one blanket number', () => {
    expect(thresholdFor({ fontSizePx: 16, bold: false })).toBe(4.5);
    expect(thresholdFor({ fontSizePx: 24, bold: false })).toBe(3);
    // 18px bold is 13.5pt — under WCAG's 14pt bold, so still normal text.
    expect(thresholdFor({ fontSizePx: 18, bold: true })).toBe(4.5);
    expect(thresholdFor({ fontSizePx: 20, bold: true })).toBe(3);
    expect(thresholdFor({ fontSizePx: 20, bold: false })).toBe(4.5);
  });
});

describe('the revert control the rendered scan could not catch', () => {
  const guarded = "'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20'";
  const reverted = "'bg-slate-500/10 text-slate-700 border border-slate-500/20'";

  it('passes with the dark override in place', () => {
    expect(scan(guarded).findings).toEqual([]);
  });

  it('fails at 1.79:1 in dark once the override is deleted', () => {
    const { findings } = scan(reverted);
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      theme: 'dark',
      foreground: 'text-slate-700',
      background: 'bg-slate-500/10',
      ratio: 1.79,
      threshold: 4.5,
      passes: false,
    });
  });

  it('reports the light theme too — the same class can fail on either side', () => {
    // amber-700 was the 2026-07-28 fix for light that broke dark on the nine
    // call sites carrying no override.
    const { findings } = scan("'text-amber-700'");
    expect(findings.map((finding) => finding.theme)).toEqual(['dark']);
    expect(findings[0].ratio).toBe(3.98);
    expect(scan("'text-amber-600'").findings.map((finding) => finding.theme)).toEqual(['light']);
  });

  it('judges a dark override on its own merits, not just its presence', () => {
    expect(scan("'text-slate-700 dark:text-slate-500'").findings).toHaveLength(1);
    expect(scan("'text-slate-700 dark:text-slate-300'").findings).toEqual([]);
  });
});

describe('what the parser will and will not treat as a class string', () => {
  it('ignores colour classes named inside comments', () => {
    const source = ['// text-amber-700 is the light value', '/* text-amber-700 */'].join('\n');
    expect(scan(source).colourStrings).toBe(0);
  });

  it('splits template literals at each interpolation', () => {
    const chunks = extractClassStrings('`px-2 ${active ? a : b} text-amber-700`');
    expect(chunks.map((chunk) => chunk.text)).toEqual(['px-2 ', ' text-amber-700']);
  });

  it('keeps line numbers across multi-line literals', () => {
    const chunks = extractClassStrings(
      ['const a = 1;', '', "const b = 'text-amber-700';"].join('\n')
    );
    expect(chunks.at(-1)).toMatchObject({ line: 3 });
  });

  it('does not mistake sizing or layout utilities for colours', () => {
    expect(parseClassString('text-sm text-center truncate', resolve)).toBeNull();
    expect(parseClassString('text-amber-700', resolve)).not.toBeNull();
  });

  it('reports an opacity utility as unchecked rather than silently skipping it', () => {
    const { findings, unchecked } = scan("'opacity-50 text-amber-700'");
    expect(findings).toEqual([]);
    expect(unchecked).toHaveLength(1);
    expect(unchecked[0].reason).toContain('opacity');
  });
});

describe('the baseline ratchet', () => {
  const finding = {
    file: 'src/components/Fixture.tsx',
    line: 1,
    theme: 'dark' as const,
    foreground: 'text-slate-700',
    background: 'bg-slate-500/10',
    ratio: 1.79,
    threshold: 4.5,
    passes: false,
  };
  const key = 'src/components/Fixture.tsx|dark|text-slate-700|bg-slate-500/10';
  const entry = { ratio: 1.79, threshold: 4.5, note: 'recorded' };

  it('accepts a failure that is recorded at its exact ratio', () => {
    const result = evaluateAgainstBaseline([finding], { pairs: { [key]: entry } });
    expect(result).toMatchObject({ unrecorded: [], changed: [], stale: [] });
  });

  it('fails a new failure that is not recorded', () => {
    expect(evaluateAgainstBaseline([finding], { pairs: {} }).unrecorded).toHaveLength(1);
  });

  it('fails a recorded pair whose ratio moved — in either direction', () => {
    const worse = evaluateAgainstBaseline([{ ...finding, ratio: 1.5 }], {
      pairs: { [key]: entry },
    });
    expect(worse.changed[0]).toMatchObject({ ratio: 1.5, recordedRatio: 1.79 });
    const better = evaluateAgainstBaseline([{ ...finding, ratio: 4.4 }], {
      pairs: { [key]: entry },
    });
    expect(better.changed).toHaveLength(1);
  });

  it('fails a recorded pair that no longer occurs, so the baseline cannot rot', () => {
    expect(evaluateAgainstBaseline([], { pairs: { [key]: entry } }).stale).toEqual([key]);
  });

  it('keys on file and colour pair, not line number', () => {
    const moved = evaluateAgainstBaseline([{ ...finding, line: 420 }], { pairs: { [key]: entry } });
    expect(moved).toMatchObject({ unrecorded: [], changed: [], stale: [] });
  });
});
