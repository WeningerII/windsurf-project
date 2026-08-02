#!/usr/bin/env node

/**
 * check:ci-parity — the gate that keeps `npm run verify` and CI honest about
 * each other.
 *
 * THE BLIND SPOT THIS CLOSES: the verify chain in package.json and the steps
 * GitHub Actions actually executes are two independent lists that nothing
 * previously compared. Add a step to the chain and forget the workflow (or the
 * reverse) and CI keeps reporting green while proving strictly less than it
 * claims to. This repo has already shipped that exact failure once: a Playwright
 * acceptance spec sat in the tree passing for weeks because no workflow ever set
 * the flag it needed, so it asserted nothing and said so in green. A five-job CI
 * split makes that hole structural rather than accidental — so this gate landed
 * BEFORE the split, not after. The split has since landed, and this gate is now
 * the only thing standing between `verify` and a workflow that quietly runs 22
 * of its 23 steps.
 *
 * WHAT IT ASSERTS: the MULTISET of `npm run` invocations across every job in
 * every workflow equals the multiset of steps in package.json's `verify` chain.
 * Multiset, not set — a step running twice in CI and once in verify is drift
 * too, and a plain set comparison would swallow it.
 *
 * A job that delegates wholesale with `run: npm run verify` covers the entire
 * chain by construction, so the expansion is transitive: any script whose body
 * is nothing but `npm run X && npm run Y && ...` is an aggregate and expands to
 * its members. Divergence is therefore only reported when CI enumerates a
 * SUBSET of the chain individually — which is precisely what a job split does.
 *
 * ORDER: the chain is a sequence, not a bag. Two steps consume artifacts an
 * earlier step emits, and a reorder would silently break them while the multiset
 * stayed identical. Those dependencies are asserted separately, from
 * ORDERING_CONSTRAINTS below.
 *
 * SELF-REFERENCE: this gate is itself a member of the chain it measures, and
 * since the split it is enumerated like any other step (ci.yml's `lint-types`
 * job). That is self-consistent and requires no special case. The gate must NOT
 * exempt itself: dropping any OTHER step from the jobs fails here exactly like
 * dropping `lint` would.
 *
 * The one case it cannot catch is deleting its own step from `lint-types`, since
 * a gate that no longer runs cannot report that it no longer runs — and a second
 * job running it is no answer, that would be a duplicate in the very multiset it
 * compares. Before the split this was covered by construction (a single
 * `npm run verify` step). It is covered again from OUTSIDE: `command_rule` in
 * src/utils/docDrift.ts asserts ci.yml still runs this gate, and doc-drift runs
 * in a different job, so removing both steps takes two edits in two files.
 *
 * PLACEMENT: first gate after `node:check`. It is offline and sub-second (it
 * reads package.json and the workflow YAML, nothing else), so drift in the shape
 * of the chain is reported before the chain spends twenty minutes proving it.
 *
 * YAML PARSING LIMITATION: this repo declares no YAML parser in dependencies and
 * a gate is not worth a new one, so the workflows are read with the indentation
 * scanner below rather than a real parser. It understands exactly what these
 * workflows use: `jobs:` -> job id -> `steps:` -> `- ` items -> `run:`/`name:`/
 * `env:` keys, with `run:` as either a plain scalar or a `|`/`>` block scalar.
 * It does NOT understand YAML anchors, aliases, flow mappings (`{a: b}`),
 * multi-document streams, or `#` comments appearing inside a run body. If a
 * workflow ever needs one of those, replace the scanner rather than teaching it
 * more tricks.
 */

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const workflowDir = path.join(root, '.github', 'workflows');

/**
 * Commands a CI job legitimately runs that the verify chain does not contain.
 *
 * These are NOT a convenience allow-list. Every entry is a reviewable claim that
 * the divergence is deliberate, and each one is consumed AT MOST ONCE per run —
 * a second `npm ci` appearing in the same job is drift, not a covered exception.
 * An entry that matches nothing is reported too: a stale exemption is a lie about
 * what CI does.
 *
 * `envContains` (optional) pins the step's `env:` block. It is what makes the
 * Pages build reviewable rather than hand-waved: the exemption exists solely
 * because that build is configured differently, so if the differentiating env
 * var disappears the exemption stops matching and this gate fires.
 */
const DECLARED_CI_ONLY_COMMANDS = [
  // ── The five verify jobs ─────────────────────────────────────────────────
  // One `npm ci` each, because the split gave the chain five runners instead of
  // one. Enumerated per job rather than matched by pattern: a job that appears
  // without an entry is a job nobody reviewed.
  ...['lint-types', 'hygiene-docs', 'content-provenance', 'unit-tests', 'build-e2e'].map(
    (job) => ({
      workflow: 'ci.yml',
      job,
      command: 'npm ci',
      reason:
        'Dependency install. Environment setup, legitimately outside the chain — verify assumes an installed tree.',
    })
  ),
  {
    workflow: 'ci.yml',
    job: 'build-e2e',
    command: 'npx playwright install chromium firefox',
    reason:
      "Browser provisioning. verify's test:e2e runs scripts/check-playwright-browsers.mjs, which GUARDS that the browsers are present rather than installing them, so the browser SET is pinned here and nowhere in package.json. If playwright.config.ts gains a third project, this line must change and only a human will notice.",
  },

  // ── The scene-drag job ───────────────────────────────────────────────────
  // This job is the reason this gate exists. e2e/scene-drag.spec.ts skips
  // unless VITE_SCENE_DRAG_ENABLED is set, so for its whole life it reported
  // green while proving nothing — no workflow set the flag. Its first real run
  // failed on a shipped defect. It is deliberately NOT in the verify chain: the
  // chain builds flag-off, and a flag-on build cannot be a chain step without
  // changing what every other step measures.
  {
    workflow: 'ci.yml',
    job: 'scene-drag',
    command: 'npm ci',
    reason:
      'Dependency install for the flag-on e2e job. Environment setup, same rationale as the verify jobs.',
  },
  {
    workflow: 'ci.yml',
    job: 'scene-drag',
    command: 'npx playwright install chromium',
    reason:
      'chromium only, by design: this job proves one flag-gated interaction, not cross-browser parity, so firefox would double the install for nothing.',
  },
  {
    workflow: 'ci.yml',
    job: 'scene-drag',
    command: 'npm run build',
    envContains: { VITE_SCENE_DRAG_ENABLED: 'true' },
    reason:
      "Deliberate SECOND build with the scene-drag flag ON, not a duplicate of the chain's build step. Pinned on the env var for the same reason as the Pages build: the exemption exists BECAUSE the build is configured differently, so if the flag disappears this stops matching and the gate fires — which is exactly the failure that let the spec sit green while proving nothing.",
  },
  {
    workflow: 'ci.yml',
    job: 'scene-drag',
    command: 'npx playwright test e2e/scene-drag.spec.ts --project=chromium --reporter=list,json',
    reason:
      'The flag-on acceptance itself. Invoked directly rather than through npm run test:e2e because it needs the single spec, the chromium project, and the JSON reporter that the follow-up step parses to ASSERT nothing was skipped — the assertion that closes the reported-green-while-proving-nothing hole.',
  },

  // ── The scene-canvas job ─────────────────────────────────────────────────
  // The Phase-6 twin of the block above (decision B6). Same shape and the same
  // argument: e2e/scene-canvas.spec.ts skips unless VITE_SCENE_CANVAS_ENABLED is
  // set, so without this job it would be a keystone acceptance that cannot fail.
  // Also deliberately outside the verify chain — the flag is a build input, and
  // the canvas branch replaces the DOM grid every other e2e spec drives.
  {
    workflow: 'ci.yml',
    job: 'scene-canvas',
    command: 'npm ci',
    reason: 'Dependency install for the flag-on e2e job. Environment setup, same rationale as the verify jobs.',
  },
  {
    workflow: 'ci.yml',
    job: 'scene-canvas',
    command: 'npx playwright install chromium',
    reason:
      'chromium only, matching scene-drag: this job proves one flag-gated surface, not cross-browser parity.',
  },
  {
    workflow: 'ci.yml',
    job: 'scene-canvas',
    command: 'npm run build',
    envContains: { VITE_SCENE_CANVAS_ENABLED: 'true' },
    reason:
      "Deliberate SECOND build with the scene-canvas flag ON, not a duplicate of the chain's build step. Pinned on the env var so that if the flag disappears the exemption stops matching and this gate fires — Vite folds the flag at build time and tree-shakes the canvas away without it, so a flag-less build would run this acceptance against a bundle that does not contain the surface it tests.",
  },
  {
    workflow: 'ci.yml',
    job: 'scene-canvas',
    command: 'npx playwright test e2e/scene-canvas.spec.ts --project=chromium --reporter=list,json',
    reason:
      'The flag-on acceptance itself. Invoked directly rather than through npm run test:e2e for the same three reasons as scene-drag: the single spec, the chromium project, and the JSON reporter the follow-up step parses to ASSERT nothing was skipped.',
  },

  {
    workflow: 'pages.yml',
    job: 'build-and-deploy',
    command: 'npm ci',
    reason:
      'Dependency install for the Pages deploy job. Environment setup, same rationale as ci.yml.',
  },
  {
    workflow: 'pages.yml',
    job: 'build-and-deploy',
    command: 'npm run build',
    envContains: { BASE_PATH: '/windsurf-project/' },
    reason:
      "Deliberate SECOND build with different configuration, not a duplicate of the chain's build step: BASE_PATH makes Vite emit every asset URL under the project-pages sub-path. KNOWN GAP, recorded here rather than hidden: verify builds with BASE_PATH unset and check:bundle-size measures only that non-BASE_PATH dist, so the artifact that actually ships to GitHub Pages is never size-checked.",
  },
];

/**
 * Chain steps that must run after another chain step because they consume an
 * artifact it emits. A multiset comparison cannot see a reorder — these can.
 */
const ORDERING_CONSTRAINTS = [
  {
    step: 'check:keepalive-budget',
    mustRunAfter: 'test:coverage',
    reason:
      'it re-asserts the artifact the SurfaceStage keepalive vitest suite emits; run before the suite, the artifact is missing or stale.',
  },
  {
    step: 'check:bundle-size',
    mustRunAfter: 'build',
    reason: 'it reads dist/ and .tmp/build/chunk-graph.json, both produced by the build.',
  },
];

const ROOT_SCRIPT = 'verify';

// ---------------------------------------------------------------------------
// package.json — the verify chain
// ---------------------------------------------------------------------------

const packageJsonPath = path.join(root, 'package.json');
const scripts = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).scripts ?? {};

const normalize = (command) => command.trim().replace(/\s+/g, ' ').replace(/;+$/, '');

/** `npm run foo -- --bar` -> { script: 'foo', args: '-- --bar' }; null if not an `npm run`. */
function parseNpmRun(command) {
  const match = /^npm run (\S+)\s*(.*)$/.exec(normalize(command));
  return match ? { script: match[1], args: match[2] } : null;
}

/**
 * A script is an AGGREGATE when every `&&`-separated segment of its body is an
 * `npm run`, i.e. it is pure delegation with no work of its own. `verify`
 * qualifies; `build` (`npm run node:check && tsc && vite build`) does not, which
 * is what stops the per-script `node:check` preludes from being counted as chain
 * steps. Aggregates expand; everything else is a leaf.
 */
function segmentsOf(body) {
  return body
    .split('&&')
    .map(normalize)
    .filter((segment) => segment.length > 0);
}

function isAggregate(body) {
  const segments = segmentsOf(body);
  return segments.length > 1 && segments.every((segment) => parseNpmRun(segment) !== null);
}

const expansionProblems = [];

/**
 * Expand `npm run <script>` into the leaf chain steps it actually runs.
 * Only argument-free invocations expand: `npm run verify -- --foo` would change
 * the members' behaviour in ways this gate cannot model, so it stays a leaf.
 */
function expand(command, seen) {
  const parsed = parseNpmRun(command);
  if (!parsed) return [normalize(command)];

  const body = scripts[parsed.script];
  if (body === undefined) {
    expansionProblems.push(`\`npm run ${parsed.script}\` — no such script in package.json`);
    return [normalize(command)];
  }
  if (parsed.args !== '' || !isAggregate(body)) return [normalize(command)];
  if (seen.has(parsed.script)) {
    expansionProblems.push(`\`${parsed.script}\` expands into itself (cyclic npm script chain)`);
    return [normalize(command)];
  }

  const nextSeen = new Set(seen).add(parsed.script);
  return segmentsOf(body).flatMap((segment) => expand(segment, nextSeen));
}

const rootBody = scripts[ROOT_SCRIPT];
if (rootBody === undefined) {
  console.error(
    `CI/verify parity check failed.\n- package.json has no \`${ROOT_SCRIPT}\` script, so there is no chain to compare CI against.`
  );
  process.exit(1);
}

const chainSteps = expand(`npm run ${ROOT_SCRIPT}`, new Set());

// ---------------------------------------------------------------------------
// Workflow YAML — the indentation scanner (see LIMITATION in the header)
// ---------------------------------------------------------------------------

const indentOf = (line) => /^ */.exec(line)[0].length;
const isBlank = (line) => line.trim() === '';
const isComment = (line) => /^\s*#/.test(line);
const isStructural = (line) => !isBlank(line) && !isComment(line);

/** Strip one layer of matching quotes from a YAML scalar. */
function unquote(value) {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && /^(".*"|'.*')$/s.test(trimmed)) return trimmed.slice(1, -1);
  return trimmed;
}

/** Index of the first structural line at or below `maxIndent`, scanning forward. */
function endOfBlock(lines, start, maxIndent) {
  for (let i = start; i < lines.length; i += 1) {
    if (isStructural(lines[i]) && indentOf(lines[i]) <= maxIndent) return i;
  }
  return lines.length;
}

/** Parse a `key:` line into [key, rest-of-line]; null when the line is not a mapping key. */
function keyLine(line) {
  const match = /^\s*([A-Za-z0-9_.$-]+):(?:\s+(.*))?$/.exec(line);
  return match ? [match[1], match[2] ?? ''] : null;
}

/**
 * Read the value of a `run:`/`env:` style key starting at `start`, returning
 * [value, nextIndex]. Handles plain scalars and `|`/`>` block scalars (with any
 * chomping/indent indicator). Block bodies are captured VERBATIM — blank and
 * `#` lines inside them belong to the shell script, not to the YAML structure.
 */
function readScalar(lines, start, keyIndent, inlineValue) {
  if (!/^[|>][-+0-9]*\s*$/.test(inlineValue.trim())) {
    return [unquote(inlineValue), start + 1];
  }
  const end = endOfBlock(lines, start + 1, keyIndent);
  const body = lines.slice(start + 1, end);
  const bodyIndents = body.filter((line) => !isBlank(line)).map(indentOf);
  const dedent = bodyIndents.length > 0 ? Math.min(...bodyIndents) : 0;
  return [
    body
      .map((line) => line.slice(dedent))
      .join('\n')
      .trim(),
    end,
  ];
}

/** Parse `.github/workflows/<file>` into [{ job, name, run, env }] for every step carrying a `run:`. */
function scanWorkflow(text) {
  const lines = text.split(/\r?\n/);
  const steps = [];

  const jobsIndex = lines.findIndex(
    (line) => isStructural(line) && indentOf(line) === 0 && line.trim() === 'jobs:'
  );
  if (jobsIndex === -1) return steps;

  const jobsEnd = endOfBlock(lines, jobsIndex + 1, 0);
  const jobIndent = (() => {
    for (let i = jobsIndex + 1; i < jobsEnd; i += 1) {
      if (isStructural(lines[i])) return indentOf(lines[i]);
    }
    return -1;
  })();
  if (jobIndent === -1) return steps;

  for (let i = jobsIndex + 1; i < jobsEnd; i += 1) {
    if (!isStructural(lines[i]) || indentOf(lines[i]) !== jobIndent) continue;
    const header = keyLine(lines[i]);
    if (!header || header[1] !== '') continue;

    const job = header[0];
    const jobEnd = endOfBlock(lines, i + 1, jobIndent);

    // `steps:` inside this job.
    let stepsIndex = -1;
    for (let j = i + 1; j < jobEnd; j += 1) {
      if (isStructural(lines[j]) && lines[j].trim() === 'steps:') {
        stepsIndex = j;
        break;
      }
    }
    if (stepsIndex === -1) continue;

    const stepsIndent = indentOf(lines[stepsIndex]);
    const stepsEnd = endOfBlock(lines, stepsIndex + 1, stepsIndent);

    // Sequence items: `- ` at a fixed indent. Rewriting the dash to spaces puts
    // the item's first key in the same column as its siblings, so one uniform
    // key-indent handles the whole item.
    const itemStarts = [];
    for (let j = stepsIndex + 1; j < stepsEnd; j += 1) {
      if (isStructural(lines[j]) && /^\s*-\s+\S/.test(lines[j])) itemStarts.push(j);
    }

    for (let s = 0; s < itemStarts.length; s += 1) {
      const start = itemStarts[s];
      const end = s + 1 < itemStarts.length ? itemStarts[s + 1] : stepsEnd;
      const dash = /^(\s*)-(\s+)/.exec(lines[start]);
      const keyIndent = dash[1].length + 1 + dash[2].length;

      const item = lines.slice(start, end);
      item[0] = ' '.repeat(keyIndent) + lines[start].slice(keyIndent);

      const step = { job, name: '', run: null, env: {} };
      for (let k = 0; k < item.length; ) {
        if (!isStructural(item[k]) || indentOf(item[k]) !== keyIndent) {
          k += 1;
          continue;
        }
        const parsed = keyLine(item[k]);
        if (!parsed) {
          k += 1;
          continue;
        }
        const [key, inline] = parsed;
        if (key === 'run') {
          const [value, next] = readScalar(item, k, keyIndent, inline);
          step.run = value;
          k = next;
        } else if (key === 'name') {
          step.name = unquote(inline);
          k += 1;
        } else if (key === 'env' && inline.trim() === '') {
          const envEnd = endOfBlock(item, k + 1, keyIndent);
          for (let e = k + 1; e < envEnd; e += 1) {
            if (!isStructural(item[e])) continue;
            const entry = keyLine(item[e]);
            if (entry) step.env[entry[0]] = unquote(entry[1]);
          }
          k = envEnd;
        } else {
          k += 1;
        }
      }

      if (step.run !== null) steps.push(step);
    }
  }

  return steps;
}

/**
 * Pull the toolchain invocations out of a shell `run:` body. Only npm/npx/yarn/
 * pnpm commands matter here; everything else in a run block (echo, git, actions
 * glue) is outside this gate's remit and is ignored on purpose.
 */
function toolchainCommands(runBody) {
  return runBody
    .replace(/\\\r?\n\s*/g, ' ')
    .split(/\r?\n|&&|\|\||;|\|/)
    .map(normalize)
    .filter((command) => /^(npm|npx|yarn|pnpm)\b/.test(command));
}

// ---------------------------------------------------------------------------
// Collect what CI actually runs
// ---------------------------------------------------------------------------

const violations = [];

const workflowFiles = fs.existsSync(workflowDir)
  ? fs
      .readdirSync(workflowDir)
      .filter((file) => /\.ya?ml$/.test(file))
      .sort()
  : [];

if (workflowFiles.length === 0) {
  violations.push(
    'No workflow files found under .github/workflows — CI cannot be running the verify chain at all.'
  );
}

const exceptions = DECLARED_CI_ONLY_COMMANDS.map((entry) => ({ ...entry, matched: 0 }));

function findException(workflow, job, command, env) {
  return exceptions.find((entry) => {
    if (entry.matched > 0) return false;
    if (entry.workflow !== workflow || entry.job !== job) return false;
    if (normalize(entry.command) !== command) return false;
    return Object.entries(entry.envContains ?? {}).every(([key, value]) => env[key] === value);
  });
}

/** Every chain-step occurrence CI performs, with provenance for the failure message. */
const ciOccurrences = [];
const jobsSeen = [];

for (const file of workflowFiles) {
  const steps = scanWorkflow(fs.readFileSync(path.join(workflowDir, file), 'utf8'));
  for (const step of steps) {
    const jobKey = `${file} :: ${step.job}`;
    if (!jobsSeen.includes(jobKey)) jobsSeen.push(jobKey);

    for (const command of toolchainCommands(step.run)) {
      const exempt = findException(file, step.job, command, step.env);
      if (exempt) {
        exempt.matched += 1;
        continue;
      }

      const parsed = parseNpmRun(command);
      if (!parsed) {
        violations.push(
          `${jobKey} runs \`${command}\`, which is neither a verify chain step nor a declared CI-only command. Add it to DECLARED_CI_ONLY_COMMANDS in scripts/check-ci-parity.mjs with a reason, or remove it from the workflow.`
        );
        continue;
      }
      if (scripts[parsed.script] === undefined) {
        violations.push(
          `${jobKey} runs \`${command}\`, but package.json has no \`${parsed.script}\` script. Fix the workflow or restore the script.`
        );
        continue;
      }

      const via = parsed.script === ROOT_SCRIPT ? ` (via \`npm run ${ROOT_SCRIPT}\`)` : '';
      for (const leaf of expand(command, new Set())) {
        ciOccurrences.push({ command: leaf, where: `${jobKey}${via}` });
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Compare — multiset, both directions
// ---------------------------------------------------------------------------

const tally = (items, key) => {
  const counts = new Map();
  for (const item of items) {
    const value = key(item);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
};

const chainCounts = tally(chainSteps, (step) => step);
const ciCounts = tally(ciOccurrences, (occurrence) => occurrence.command);
const whereByCommand = new Map();
for (const occurrence of ciOccurrences) {
  const seen = whereByCommand.get(occurrence.command) ?? [];
  if (!seen.includes(occurrence.where)) seen.push(occurrence.where);
  whereByCommand.set(occurrence.command, seen);
}

const uncovered = [];
const unchained = [];
for (const command of new Set([...chainCounts.keys(), ...ciCounts.keys()])) {
  const inChain = chainCounts.get(command) ?? 0;
  const inCi = ciCounts.get(command) ?? 0;
  if (inCi < inChain) {
    uncovered.push(
      inChain === 1 && inCi === 0
        ? `\`${command}\` — in the verify chain, run by no CI job`
        : `\`${command}\` — verify runs it ${inChain}x, CI runs it ${inCi}x`
    );
  } else if (inCi > inChain) {
    const where = (whereByCommand.get(command) ?? []).join(', ');
    unchained.push(
      inChain === 0
        ? `\`${command}\` — run by CI (${where}), absent from the verify chain`
        : `\`${command}\` — CI runs it ${inCi}x (${where}), verify runs it ${inChain}x`
    );
  }
}

for (const constraint of ORDERING_CONSTRAINTS) {
  const stepIndex = chainSteps.indexOf(`npm run ${constraint.step}`);
  const afterIndex = chainSteps.findIndex((step) =>
    step.startsWith(`npm run ${constraint.mustRunAfter}`)
  );
  if (stepIndex === -1 || afterIndex === -1) {
    violations.push(
      `Ordering constraint references a step that is no longer in the verify chain: \`${constraint.step}\` after \`${constraint.mustRunAfter}\`. Update ORDERING_CONSTRAINTS in scripts/check-ci-parity.mjs.`
    );
  } else if (stepIndex < afterIndex) {
    violations.push(
      `Verify chain order broken: \`${constraint.step}\` runs before \`${constraint.mustRunAfter}\`, but ${constraint.reason}`
    );
  }
}

for (const entry of exceptions) {
  if (entry.matched === 0) {
    violations.push(
      `Stale exception: DECLARED_CI_ONLY_COMMANDS claims ${entry.workflow} :: ${entry.job} runs \`${entry.command}\`${
        entry.envContains ? ` with ${JSON.stringify(entry.envContains)}` : ''
      }, but it does not. Remove the entry from scripts/check-ci-parity.mjs or restore the workflow step.`
    );
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

if (
  uncovered.length > 0 ||
  unchained.length > 0 ||
  violations.length > 0 ||
  expansionProblems.length > 0
) {
  const messages = ['CI/verify parity check FAILED.'];

  if (uncovered.length > 0) {
    messages.push(
      'Steps in the `npm run verify` chain that NO CI job runs (CI is reporting green on less than verify proves):'
    );
    messages.push(...uncovered.map((item) => `- ${item}`));
    messages.push(
      'Fix: add the step to a job in .github/workflows/, or have a job run `npm run verify` wholesale.'
    );
  }

  if (unchained.length > 0) {
    messages.push('Steps CI runs that the `npm run verify` chain does not contain:');
    messages.push(...unchained.map((item) => `- ${item}`));
    messages.push(
      'Fix: add the step to the `verify` script in package.json so it is reproducible locally, or declare it in DECLARED_CI_ONLY_COMMANDS in scripts/check-ci-parity.mjs with a reason.'
    );
  }

  if (violations.length > 0) {
    messages.push('Other parity violations:');
    messages.push(...violations.map((item) => `- ${item}`));
  }

  if (expansionProblems.length > 0) {
    messages.push('Problems expanding the npm script chain:');
    messages.push(...expansionProblems.map((item) => `- ${item}`));
  }

  console.error(messages.join('\n'));
  process.exit(1);
}

console.log(
  `CI/verify parity: OK — ${chainSteps.length} verify chain steps, all covered across ${jobsSeen.length} job(s) in ${workflowFiles.length} workflow(s); ${exceptions.length} declared CI-only command(s).`
);
