#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { getRuntimeCachePaths, resolveNodeDistribution } from './runtime/ensure-node-runtime.mjs';
import {
  BOOTSTRAP_MIN_NODE_MAJOR,
  formatBootstrapPathMessage,
  formatManagerPathMessage,
  getRuntimePolicyStatus,
} from './runtime/runtime-policy.mjs';

function readWorkflowPinSource(rootDir) {
  const workflowPath = path.join(rootDir, '.github', 'workflows', 'ci.yml');
  const workflowText = readFileSync(workflowPath, 'utf8');
  const nodeVersionFile = workflowText.match(/node-version-file:\s*['"]?([^'"\n]+)['"]?/)?.[1] ?? null;
  const nodeVersion = workflowText.match(/node-version:\s*['"]?([^'"\n]+)['"]?/)?.[1] ?? null;

  return {
    nodeVersionFile,
    nodeVersion,
  };
}

export function formatRuntimeDoctorReport({ rootDir = process.cwd(), hostVersion = process.versions.node } = {}) {
  const status = getRuntimePolicyStatus({ rootDir, hostVersion });
  const workflow = readWorkflowPinSource(rootDir);
  const reportLines = [
    `Host Node: v${status.hostVersion}`,
    `Supported range: ${status.policy.supportedRangeLabel}`,
    `Exact repo pin: ${status.policy.pinnedVersion}`,
    `Pin files in sync: ${status.policy.nodeVersionFileVersion === status.policy.nvmVersion ? 'yes' : 'no'}`,
    `Bootstrap host floor: Node ${BOOTSTRAP_MIN_NODE_MAJOR}+`,
    `Host supports normal npm flow: ${status.hostSupported ? 'yes' : 'no'}`,
    `Host supports repo bootstrap: ${status.hostBootstrapCapable ? 'yes' : 'no'}`,
    `CI pin source: ${workflow.nodeVersionFile ? `node-version-file: ${workflow.nodeVersionFile}` : `node-version: ${workflow.nodeVersion ?? 'missing'}`}`,
    formatManagerPathMessage(status.policy),
    formatBootstrapPathMessage(status.policy, status.hostBootstrapCapable),
  ];

  try {
    const distribution = resolveNodeDistribution({
      version: status.policy.pinnedVersion,
      platform: process.platform,
      arch: process.arch,
    });
    const cachePaths = getRuntimeCachePaths(rootDir, distribution);
    reportLines.splice(
      8,
      0,
      `Pinned runtime cache: ${existsSync(cachePaths.runtimeDir) ? cachePaths.runtimeDir : 'missing'}`,
      `Pinned archive cache: ${existsSync(cachePaths.archivePath) ? cachePaths.archivePath : 'missing'}`
    );
  } catch (error) {
    reportLines.splice(
      8,
      0,
      `Pinned runtime cache: unavailable (${error instanceof Error ? error.message : String(error)})`
    );
  }

  if (status.policyIssues.length > 0) {
    reportLines.push('Runtime policy issues:');
    for (const issue of status.policyIssues) {
      reportLines.push(`- ${issue}`);
    }
  }

  return reportLines.join('\n');
}

function main() {
  console.log(formatRuntimeDoctorReport());
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
