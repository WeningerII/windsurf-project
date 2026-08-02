/**
 * Static WCAG-AA contrast lint over the Tailwind colour classes written into
 * `src/**` — every tree, including `src/systems/**`, which holds 5 of the ~17
 * files the 2026-07-31 contrast fix touched (WORK_PLAN §6.4).
 *
 * WHY THIS EXISTS — the rendered gate provably cannot see most of the surface.
 * `e2e/a11y.spec.ts` runs axe over 8 surfaces in both themes, which judges real
 * computed styles and is the better instrument where it reaches. It reaches
 * FOUR of the ~17 files the 2026-07-31 contrast fix touched. That number is
 * measured, not estimated: dropping the `supportBadges` dark override — slate-700
 * on the dark background, 1.79:1, a real AA failure — left the rendered scan at
 * "8 passed, exit 0", because that badge renders on none of the scanned
 * surfaces. A gate whose reach depends on which screens a Playwright script
 * happens to visit defends shared design TOKENS well and component-local colour
 * classes barely at all.
 *
 * So this module judges the SOURCE instead of the DOM. It cannot see a computed
 * style, but it also cannot miss a file, and its reach does not change when
 * someone edits an e2e script.
 *
 * WHAT IT CHECKS
 * Every class string that names a text colour is resolved twice — once as the
 * light theme renders it, once as the dark theme does — and both ratios must
 * clear WCAG AA. A class with no `dark:` counterpart is simply a colour that
 * resolves to the same value in both passes, which is exactly the defect shape
 * §6.4 shipped: `amber-600` → `amber-700` fixed light and broke dark (6.28:1 →
 * 3.98:1) on the nine of thirteen call sites that carried no override.
 *
 * WHAT IT CANNOT SEE, stated rather than papered over:
 *  - Ancestor backgrounds. A class string is judged against its own `bg-*` class
 *    composited over the theme's `--background`. In this theme that assumption is
 *    exact for the common case — `--card`, `--popover` and `--background` are the
 *    same colour in BOTH themes — but a coloured panel nesting a lighter tint is
 *    modelled as sitting directly on the page.
 *  - Class strings assembled across separate literals (`cn(base, variant)`). Each
 *    literal is judged alone, so an override living in a sibling literal is not
 *    seen. This can over-report; it cannot under-report.
 *  - `opacity-*` on the element. Rather than ignore it, a string that combines an
 *    opacity utility with a colour class is counted and reported as UNCHECKED, so
 *    the blind spot has a number instead of a silence.
 *  - Anything not written as a literal Tailwind class (inline styles, computed
 *    class names, SVG `fill`).
 *
 * THRESHOLDS are WCAG AA's own, not a single number: 4.5:1 normal text, 3:1 for
 * large text (>= 24px, or >= 18.66px at font-weight 700+). Icons and other
 * graphical objects are held to the text threshold anyway — the parser cannot
 * tell an icon's class string from a label's, and the honest failure direction
 * for a lint is to over-report into a recorded baseline rather than to invent a
 * heuristic that quietly exempts things.
 */

/** WCAG 2.1 SC 1.4.3 — normal text. */
export const AA_NORMAL = 4.5;
/** WCAG 2.1 SC 1.4.3 — large text (>= 24px, or >= 18.66px bold). */
export const AA_LARGE = 3;

/** Tailwind's default font-size scale, in px, for the large-text rule. */
const FONT_SIZE_PX = {
  'text-xs': 12,
  'text-sm': 14,
  'text-base': 16,
  'text-lg': 18,
  'text-xl': 20,
  'text-2xl': 24,
  'text-3xl': 30,
  'text-4xl': 36,
  'text-5xl': 48,
  'text-6xl': 60,
  'text-7xl': 72,
  'text-8xl': 96,
  'text-9xl': 128,
};

/** font-weight 700+, the only weights WCAG counts as bold. */
const BOLD_CLASSES = new Set(['font-bold', 'font-extrabold', 'font-black']);

/** Colour utilities of the form `[dark:]{text|bg}-<name>[-<shade>][/<alpha>]`. */
const COLOR_CLASS =
  /^(dark:)?(text|bg)-([a-z]+(?:-[a-z]+)*?)(?:-(50|100|200|300|400|500|600|700|800|900|950))?(?:\/(\d{1,3}))?$/;

const ARBITRARY_FONT_SIZE = /^text-\[(\d+(?:\.\d+)?)px\]$/;
const OPACITY_CLASS = /^(dark:)?opacity-\d{1,3}$/;

/**
 * Extract every string literal from a TS/TSX source, with its line number.
 *
 * Deliberately a character walk rather than a regex: comments in this repo are
 * long and full of prose apostrophes and quoted class names (this file included),
 * and a regex over raw source picks those up as literals. Template literals are
 * split at each `${...}`, so a conditional class expression contributes its
 * static chunks independently.
 */
export function extractClassStrings(source) {
  const out = [];
  let line = 1;
  let i = 0;

  const push = (text, startLine) => {
    if (text.trim()) out.push({ text, line: startLine });
  };

  while (i < source.length) {
    const ch = source[i];

    if (ch === '\n') {
      line++;
      i++;
      continue;
    }
    if (ch === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && source[i + 1] === '*') {
      i += 2;
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
        if (source[i] === '\n') line++;
        i++;
      }
      i += 2;
      continue;
    }
    if (ch === "'" || ch === '"') {
      const startLine = line;
      const quote = ch;
      let text = '';
      i++;
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') {
          i += 2;
          continue;
        }
        if (source[i] === '\n') break; // unterminated — not a literal we care about
        text += source[i++];
      }
      i++;
      push(text, startLine);
      continue;
    }
    if (ch === '`') {
      let startLine = line;
      let text = '';
      i++;
      while (i < source.length && source[i] !== '`') {
        if (source[i] === '\\') {
          i += 2;
          continue;
        }
        if (source[i] === '$' && source[i + 1] === '{') {
          push(text, startLine);
          text = '';
          i += 2;
          // Skip the interpolation, tracking brace depth so nested objects and
          // template literals inside it do not end it early.
          let depth = 1;
          while (i < source.length && depth > 0) {
            if (source[i] === '{') depth++;
            else if (source[i] === '}') depth--;
            else if (source[i] === '\n') line++;
            i++;
          }
          startLine = line;
          continue;
        }
        if (source[i] === '\n') line++;
        text += source[i++];
      }
      i++;
      push(text, startLine);
      continue;
    }
    i++;
  }

  return out;
}

function parseAlpha(raw) {
  return raw === undefined ? 1 : Number(raw) / 100;
}

/**
 * Split a class string into the pieces the contrast rule needs. Returns null for
 * strings that name no text colour — the overwhelming majority.
 */
export function parseClassString(text, resolve) {
  const classes = text.split(/\s+/).filter(Boolean);
  let lightText = null;
  let darkText = null;
  let lightBg = null;
  let darkBg = null;
  let fontSizePx = 16;
  let bold = false;
  let hasOpacity = false;

  for (const cls of classes) {
    if (BOLD_CLASSES.has(cls)) {
      bold = true;
      continue;
    }
    if (OPACITY_CLASS.test(cls)) {
      hasOpacity = true;
      continue;
    }
    if (Object.hasOwn(FONT_SIZE_PX, cls)) {
      fontSizePx = FONT_SIZE_PX[cls];
      continue;
    }
    const arbitrary = ARBITRARY_FONT_SIZE.exec(cls);
    if (arbitrary) {
      fontSizePx = Number(arbitrary[1]);
      continue;
    }
    const match = COLOR_CLASS.exec(cls);
    if (!match) continue;
    const [, dark, role, family, shade, alpha] = match;
    const name = shade ? `${family}-${shade}` : family;
    // A name the theme does not define is not a colour class: `text-center`,
    // `text-sm` and `bg-none` all reach here.
    if (!resolve(name, 'light')) continue;
    const token = { className: cls, name, alpha: parseAlpha(alpha) };
    if (role === 'text') {
      if (dark) darkText = token;
      else lightText = token;
    } else if (dark) darkBg = token;
    else lightBg = token;
  }

  if (!lightText && !darkText) return null;
  return { lightText, darkText, lightBg, darkBg, fontSizePx, bold, hasOpacity };
}

/** sRGB relative luminance, WCAG 2.1 definition. */
export function relativeLuminance([r, g, b]) {
  const [rl, gl, bl] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/** WCAG 2.1 contrast ratio between two opaque sRGB colours. */
export function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Composite `colour` at `alpha` over an opaque `backdrop` (simple source-over). */
export function compositeOver(colour, alpha, backdrop) {
  if (alpha >= 1) return colour;
  return colour.map((channel, index) =>
    Math.round(channel * alpha + backdrop[index] * (1 - alpha))
  );
}

/** The AA threshold this text is held to, per WCAG's large-text definition. */
export function thresholdFor({ fontSizePx, bold }) {
  if (fontSizePx >= 24) return AA_LARGE;
  if (bold && fontSizePx >= 18.66) return AA_LARGE;
  return AA_NORMAL;
}

/**
 * Ratios are pinned into a baseline, so they must not wobble with floating-point
 * noise across Node versions. Two decimals is finer than any threshold decision
 * and coarse enough to be stable.
 */
export function roundRatio(value) {
  return Math.round(value * 100) / 100;
}

/** Stable identity for a finding — deliberately free of line numbers, which churn. */
export function findingKey(finding) {
  return `${finding.file}|${finding.theme}|${finding.foreground}|${finding.background}`;
}

/**
 * Evaluate one parsed class string in one theme.
 *
 * `resolve(name, theme)` returns an `[r, g, b]` triple for a palette name
 * (`amber-600`) or a theme token (`muted-foreground`), or null.
 */
export function evaluateTheme(parsed, theme, resolve, surfaceFor) {
  const textToken = theme === 'dark' ? (parsed.darkText ?? parsed.lightText) : parsed.lightText;
  if (!textToken) return null;
  const bgToken = theme === 'dark' ? (parsed.darkBg ?? parsed.lightBg) : parsed.lightBg;

  const foreground = resolve(textToken.name, theme);
  if (!foreground) return null;

  const surface = surfaceFor(theme);
  let background = surface;
  if (bgToken) {
    const bgColour = resolve(bgToken.name, theme);
    if (!bgColour) return null;
    background = compositeOver(bgColour, bgToken.alpha, surface);
  }

  const ratio = roundRatio(
    contrastRatio(compositeOver(foreground, textToken.alpha, background), background)
  );
  const threshold = thresholdFor(parsed);

  return {
    theme,
    foreground: textToken.className,
    background: bgToken ? bgToken.className : '(theme surface)',
    ratio,
    threshold,
    passes: ratio >= threshold,
  };
}

/**
 * Scan pre-read sources for AA failures.
 *
 * `files` is `[{ file, source }]` with repo-relative paths. Returns the failures
 * plus the two counters that keep the gate's own reach honest: how many class
 * strings carried a colour at all, and how many were skipped as unresolvable.
 */
export function scanSources(files, { resolve, surfaceFor }) {
  const findings = [];
  const unchecked = [];
  let colourStrings = 0;

  for (const { file, source } of files) {
    for (const { text, line } of extractClassStrings(source)) {
      const parsed = parseClassString(text, resolve);
      if (!parsed) continue;
      colourStrings++;
      if (parsed.hasOpacity) {
        unchecked.push({ file, line, reason: 'opacity utility on the same element', text });
        continue;
      }
      for (const theme of ['light', 'dark']) {
        const result = evaluateTheme(parsed, theme, resolve, surfaceFor);
        if (!result || result.passes) continue;
        findings.push({ file, line, ...result });
      }
    }
  }

  findings.sort(
    (a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.theme.localeCompare(b.theme)
  );
  return { findings, unchecked, colourStrings };
}

/**
 * Compare findings against the recorded baseline.
 *
 * The baseline is a RATCHET, not an allowlist, and it is deliberately the same
 * shape `scripts/data/srd-fidelity-baseline.json` uses: each entry pins the exact
 * measured ratio, so a baselined pair that changes AT ALL — improved or degraded
 * — fails and demands the record be updated. Anything failing that is not
 * baselined fails immediately.
 */
export function evaluateAgainstBaseline(findings, baseline) {
  const recorded = baseline?.pairs ?? {};
  const seen = new Map();
  for (const finding of findings) {
    const key = findingKey(finding);
    if (!seen.has(key)) seen.set(key, finding);
  }

  const unrecorded = [];
  const changed = [];
  for (const [key, finding] of seen) {
    const entry = recorded[key];
    if (!entry) {
      unrecorded.push(finding);
      continue;
    }
    if (entry.ratio !== finding.ratio) changed.push({ ...finding, recordedRatio: entry.ratio });
  }

  const stale = Object.keys(recorded).filter((key) => !seen.has(key));
  return { unrecorded, changed, stale, current: seen };
}
