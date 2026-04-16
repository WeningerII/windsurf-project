#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const generatedFiles = [
  path.join(projectRoot, 'docs/generated/roadmap-metrics.md'),
  path.join(projectRoot, 'docs/generated/roadmap-metrics.json'),
];

function normalizeGeneratedContent(filePath, contents) {
  if (contents === null) {
    return null;
  }

  if (filePath.endsWith('.md')) {
    return contents.replace(/^_Generated: .+_$/m, '_Generated: <normalized>_');
  }

  if (filePath.endsWith('.json')) {
    return contents.replace(
      /"generatedAt":\s*"[^"]+"/,
      '"generatedAt": "<normalized>"'
    );
  }

  return contents;
}

const beforeState = new Map(
  generatedFiles.map((filePath) => [
    filePath,
    normalizeGeneratedContent(filePath, existsSync(filePath) ? readFileSync(filePath, 'utf8') : null),
  ])
);

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

execFileSync(npmCommand, ['run', 'roadmap:metrics', '--silent'], {
  cwd: projectRoot,
  stdio: 'inherit',
});

const changedFiles = generatedFiles.filter((filePath) => {
  const before = beforeState.get(filePath);
  const after = normalizeGeneratedContent(
    filePath,
    existsSync(filePath) ? readFileSync(filePath, 'utf8') : null
  );
  return before !== after;
});

for (const filePath of generatedFiles) {
  const before = beforeState.get(filePath);
  if (before === null) {
    if (existsSync(filePath)) {
      rmSync(filePath);
    }
    continue;
  }

  writeFileSync(filePath, before, 'utf8');
}

if (changedFiles.length > 0) {
  const relativeFiles = changedFiles.map((filePath) => path.relative(projectRoot, filePath));
  console.error(
    [
      'Generated roadmap docs are stale.',
      'Run `npm run roadmap:metrics` and commit the updated generated files.',
      ...relativeFiles.map((filePath) => `- ${filePath}`),
    ].join('\n')
  );
  process.exit(1);
}
