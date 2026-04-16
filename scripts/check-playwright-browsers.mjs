#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { registry } from '../node_modules/playwright-core/lib/server/registry/index.js';

export const REQUIRED_PLAYWRIGHT_EXECUTABLES = [
  { id: 'chromium', label: 'Chromium' },
  { id: 'chromium-headless-shell', label: 'Chromium headless shell' },
  { id: 'firefox', label: 'Firefox' },
  { id: 'ffmpeg', label: 'FFmpeg' },
];

export function getPlaywrightExecutableReport({
  platform = process.platform,
  registryImpl = registry,
  existsSyncImpl = existsSync,
} = {}) {
  const executables = REQUIRED_PLAYWRIGHT_EXECUTABLES.map(({ id, label }) => {
    const executable = registryImpl.findExecutable(id);
    const executablePath = executable?.executablePath(platform);

    return {
      id,
      label,
      executablePath,
      installed: Boolean(executablePath && existsSyncImpl(executablePath)),
    };
  });

  return {
    executables,
    missingExecutables: executables.filter((entry) => !entry.installed),
  };
}

export function formatMissingPlaywrightBrowsersMessage(report) {
  return [
    'Playwright browser prerequisites are missing.',
    'Install them with `npm run pinned -- exec playwright install chromium firefox`.',
    ...report.missingExecutables.map(
      ({ label, executablePath }) => `- ${label}: ${executablePath ?? 'unresolved executable path'}`
    ),
  ].join('\n');
}

export function assertPlaywrightBrowsersInstalled(options = {}) {
  const report = getPlaywrightExecutableReport(options);
  if (report.missingExecutables.length > 0) {
    throw new Error(formatMissingPlaywrightBrowsersMessage(report));
  }

  return report;
}

async function main() {
  assertPlaywrightBrowsersInstalled();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
