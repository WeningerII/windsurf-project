#!/usr/bin/env node

import { assertHostRuntimeSupported } from './runtime/runtime-policy.mjs';

try {
  assertHostRuntimeSupported();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
