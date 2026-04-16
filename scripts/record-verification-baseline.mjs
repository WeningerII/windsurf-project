#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) {
      continue;
    }

    const key = arg.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }

    parsed[key] = value;
    index += 1;
  }

  return parsed;
}

function toOptionalNumber(value) {
  if (value == null) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric value: ${value}`);
  }

  return parsed;
}

const args = parseArgs(process.argv.slice(2));

if (!args.date || !args['node-version']) {
  throw new Error(
    'Usage: tsx scripts/record-verification-baseline.mjs --date "Month DD, YYYY" --node-version 20.19.0 [--verify-command "npm run verify"] [--vitest-files 92] [--vitest-tests 793] [--playwright-tests 46]'
  );
}

const baselinePath = path.join(process.cwd(), 'docs/generated/verification-baseline.json');
const currentBaseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
const nextBaseline = {
  ...currentBaseline,
  lastVerifiedDate: args.date,
  nodeVersion: args['node-version'],
  verifyCommand: args['verify-command'] ?? currentBaseline.verifyCommand ?? 'npm run verify',
  vitestFiles: toOptionalNumber(args['vitest-files']) ?? currentBaseline.vitestFiles,
  vitestTests: toOptionalNumber(args['vitest-tests']) ?? currentBaseline.vitestTests,
  playwrightTests: toOptionalNumber(args['playwright-tests']) ?? currentBaseline.playwrightTests,
};

writeFileSync(`${baselinePath}`, `${JSON.stringify(nextBaseline, null, 2)}\n`, 'utf8');
