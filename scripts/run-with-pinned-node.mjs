#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  buildPinnedNodeSpawnEnv,
  ensurePinnedNodeRuntime,
} from './runtime/ensure-node-runtime.mjs';

export function getPinnedCommandArgs(argv = process.argv) {
  const separatorIndex = argv.indexOf('--');
  const rawArgs = separatorIndex >= 0 ? argv.slice(separatorIndex + 1) : argv.slice(2);

  if (rawArgs.length === 0) {
    throw new Error('Usage: npm run pinned -- <npm-args>');
  }

  return rawArgs;
}

export async function runPinnedNpmCommand({
  rootDir = process.cwd(),
  argv = process.argv,
  env = process.env,
  ensureRuntime = ensurePinnedNodeRuntime,
  spawnImpl = spawnSync,
} = {}) {
  const runtime = await ensureRuntime({ rootDir });
  const npmArgs = getPinnedCommandArgs(argv);
  const result = spawnImpl(runtime.nodePath, [runtime.npmCliPath, ...npmArgs], {
    cwd: rootDir,
    env: buildPinnedNodeSpawnEnv({ ...runtime, env }),
    stdio: 'inherit',
  });

  return {
    status: result.status ?? 1,
    signal: result.signal ?? null,
    runtime,
    npmArgs,
  };
}

async function main() {
  const result = await runPinnedNpmCommand();
  process.exit(result.status);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
