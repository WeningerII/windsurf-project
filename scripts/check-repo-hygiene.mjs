#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const filesToScan = [
  'README.md',
  'CONTRIBUTING.md',
  'docs/STATUS.md',
  '.github/workflows/ci.yml',
];

const placeholderPattern = /<owner>\/<repo>/;
const trackedArtifacts = ['playwright-report/index.html', 'test-results/.last-run.json'];
const gitCommand = process.platform === 'win32' ? 'git.exe' : 'git';

const placeholderHits = filesToScan.filter((filePath) => {
  const contents = readFileSync(path.join(projectRoot, filePath), 'utf8');
  return placeholderPattern.test(contents);
});

const trackedArtifactHits = trackedArtifacts.filter((artifactPath) => {
  try {
    execFileSync(gitCommand, ['ls-files', '--error-unmatch', artifactPath], {
      cwd: projectRoot,
      stdio: 'ignore',
    });
    return existsSync(path.join(projectRoot, artifactPath));
  } catch {
    return false;
  }
});

if (placeholderHits.length > 0 || trackedArtifactHits.length > 0) {
  const messages = ['Repo hygiene checks failed.'];

  if (placeholderHits.length > 0) {
    messages.push('Remove placeholder repo URLs from:');
    messages.push(...placeholderHits.map((filePath) => `- ${filePath}`));
  }

  if (trackedArtifactHits.length > 0) {
    messages.push('Generated Playwright artifacts must not be tracked:');
    messages.push(...trackedArtifactHits.map((filePath) => `- ${filePath}`));
  }

  console.error(messages.join('\n'));
  process.exit(1);
}
