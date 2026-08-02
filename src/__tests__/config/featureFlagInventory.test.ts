import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { FEATURE_FLAGS } from '../../config/featureFlags';

/**
 * The staged-rollout inventory gate (`p7.release`). `featureFlags.test.ts` next
 * to this file pins each flag's SEMANTICS; this pins the flag SET — that every
 * `VITE_` name the shipped app reads is classified, and that an operator can
 * discover it from `.env.example` without reading source.
 *
 * The gap this closes is exactly that: `VITE_SCENE_DRAG_ENABLED`,
 * `VITE_SCENE_CANVAS_ENABLED` and `VITE_TELEMETRY_ENABLED` all shipped
 * undocumented, so the two scene rollout switches were reachable only by
 * grepping `import.meta.env`. Turning a flag on in a staged rollout is the one
 * operation where "read the source" is the wrong answer.
 *
 * Scanned by TEXT rather than by AST, deliberately: a flag named in a comment
 * (`src/App.tsx`, `dragContext.ts`) is a flag someone will try to set, and a
 * mention that outlives its `import.meta.env` read should fail here rather than
 * rot silently. Over-inclusive is the safe direction for this gate.
 */

const SCAN_ROOTS = ['src', 'e2e'];
const SCAN_EXT = /\.tsx?$/;
const VITE_NAME = /VITE_[A-Z0-9_]+/g;

/**
 * Boolean flags that deliberately do NOT delegate to `FEATURE_FLAGS`, with the
 * reason each is exempt. `isFeatureEnabled` reads `import.meta.env[envVar]`
 * through a computed key, which Vite cannot statically fold — so a flag routed
 * through the registry keeps its guarded branch in the bundle. That is fine for
 * flags whose branch is lazy anyway, and wrong for one whose whole point is to
 * tree-shake away when unset.
 *
 * Recorded here rather than "fixed" so the exclusion is a decision on the record
 * instead of an oversight. Moving `sceneCanvas` into the registry is a bundle
 * change, not a tidy-up.
 */
const REGISTRY_EXEMPT_FLAGS: Readonly<Record<string, string>> = {
  VITE_SCENE_CANVAS_ENABLED:
    'read directly in src/components/scene/sceneCanvasFlag.ts so Vite build-time-folds the ' +
    'static member access and tree-shakes the canvas branch out of a flag-off build; the ' +
    'registry module is in the eager index chunk and its computed lookup folds nothing.',
};

/**
 * Presence-checked configuration STRINGS. Not flags, and deliberately outside
 * the registry — the same carve-out `src/config/featureFlags.ts` documents.
 * They are listed anyway because `.env.example` must still describe them.
 */
const CONFIG_STRINGS = ['VITE_SENTRY_DSN', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];

function scanViteNames(): Map<string, string[]> {
  const found = new Map<string, string[]>();
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // The suite's own fixtures stub flags that the app may not read.
        if (entry.name === '__tests__' || entry.name === 'node_modules') continue;
        walk(abs);
      } else if (entry.isFile() && SCAN_EXT.test(entry.name)) {
        const rel = path.relative(process.cwd(), abs);
        for (const [name] of readFileSync(abs, 'utf8').matchAll(VITE_NAME)) {
          const sites = found.get(name) ?? [];
          if (!sites.includes(rel)) sites.push(rel);
          found.set(name, sites);
        }
      }
    }
  };
  for (const root of SCAN_ROOTS) walk(path.resolve(process.cwd(), root));
  return found;
}

/** Every `KEY=` assignment in `.env.example`, comments and blanks skipped. */
function documentedEnvKeys(): Set<string> {
  const text = readFileSync(path.resolve(process.cwd(), '.env.example'), 'utf8');
  const keys = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (match) keys.add(match[1]);
  }
  return keys;
}

const scanned = scanViteNames();
const registered = Object.values(FEATURE_FLAGS).map((def) => def.envVar);
const classified = new Set([
  ...registered,
  ...Object.keys(REGISTRY_EXEMPT_FLAGS),
  ...CONFIG_STRINGS,
]);

describe('VITE_ inventory', () => {
  it('classifies every VITE_ name the app reads', () => {
    const unclassified = [...scanned.keys()]
      .filter((name) => !classified.has(name))
      .map((name) => `${name} (${scanned.get(name)?.join(', ')})`);
    expect(
      unclassified,
      'A new VITE_ name must be registered in FEATURE_FLAGS, listed in REGISTRY_EXEMPT_FLAGS ' +
        'with its reason, or declared a config string here.'
    ).toEqual([]);
  });

  it('carries no classification for a name nothing reads', () => {
    const orphaned = [...classified].filter((name) => !scanned.has(name));
    expect(orphaned, 'A classified name with no read site is a stale entry.').toEqual([]);
  });

  // The escape hatch is "exempt WITH a reason", so the reason is the part that
  // has to be enforced. Without this, `VITE_X: ''` silences the gate above and
  // the exemption becomes exactly the undocumented omission it exists to
  // prevent — a registry bypass nobody can review.
  it('makes every registry exemption state why, not just that', () => {
    const unreasoned = Object.entries(REGISTRY_EXEMPT_FLAGS)
      .filter(([, reason]) => reason.trim().length < 40)
      .map(([name]) => name);
    expect(
      unreasoned,
      'A REGISTRY_EXEMPT_FLAGS entry must carry the reason it bypasses FEATURE_FLAGS. ' +
        'An empty or token reason is an undocumented exemption wearing a gate.'
    ).toEqual([]);
  });
});

describe('.env.example is the operator-facing place every flag is documented', () => {
  const documented = documentedEnvKeys();

  it.each([...registered, ...Object.keys(REGISTRY_EXEMPT_FLAGS)])(
    '%s is documented in .env.example',
    (envVar) => {
      expect(
        documented.has(envVar),
        `${envVar} gates shipped behavior but .env.example does not mention it, so a staged ` +
          'rollout cannot discover it without reading source.'
      ).toBe(true);
    }
  );

  it.each(CONFIG_STRINGS)('%s is documented in .env.example', (envVar) => {
    expect(documented.has(envVar), `${envVar} is read by the app but undocumented.`).toBe(true);
  });

  it('leaves every documented VITE_ key blank, so the committed defaults are OFF', () => {
    const text = readFileSync(path.resolve(process.cwd(), '.env.example'), 'utf8');
    const withValues = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^VITE_[A-Z0-9_]+\s*=\s*\S/.test(line));
    expect(withValues, 'A value here would ship a flag ON by default.').toEqual([]);
  });
});
