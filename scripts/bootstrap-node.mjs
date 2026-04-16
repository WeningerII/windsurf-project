#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  buildPinnedNodeSpawnEnv,
  ensurePinnedNodeRuntime,
} from './runtime/ensure-node-runtime.mjs';

export async function runBootstrapNodeInstall({
  rootDir = process.cwd(),
  env = process.env,
  ensureRuntime = ensurePinnedNodeRuntime,
  spawnImpl = spawnSync,
} = {}) {
  const runtime = await ensureRuntime({ rootDir });
  const result = spawnImpl(runtime.nodePath, [runtime.npmCliPath, 'ci'], {
    cwd: rootDir,
    env: buildPinnedNodeSpawnEnv({ ...runtime, env }),
    stdio: 'inherit',
  });

  return {
    status: result.status ?? 1,
    signal: result.signal ?? null,
    runtime,
  };
}

async function main() {
  const result = await runBootstrapNodeInstall();
  process.exit(result.status);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
