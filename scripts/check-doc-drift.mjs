#!/usr/bin/env node

import { formatDocDriftIssues, runDocDriftCheck } from '../src/utils/docDrift.ts';

const issues = await runDocDriftCheck(process.cwd());

if (issues.length > 0) {
  console.error(formatDocDriftIssues(issues));
  process.exit(1);
}
