import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const BOOTSTRAP_MIN_NODE_MAJOR = 18;

function readRequiredTrimmedFile(rootDir, relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing required runtime policy file: ${relativePath}`);
  }

  return readFileSync(absolutePath, 'utf8').trim();
}

function readOptionalTrimmedFile(rootDir, relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  if (!existsSync(absolutePath)) {
    return null;
  }

  return readFileSync(absolutePath, 'utf8').trim();
}

function readPackageJson(rootDir) {
  return JSON.parse(readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
}

export function normalizeNodeVersion(version) {
  return version.trim().replace(/^v/, '');
}

export function parseNodeVersion(version) {
  const normalized = normalizeNodeVersion(version);
  const match = normalized.match(/^(\d+)\.(\d+)\.(\d+)$/);

  if (!match) {
    throw new Error(`Invalid Node.js version: ${version}`);
  }

  return {
    major: Number.parseInt(match[1], 10),
    minor: Number.parseInt(match[2], 10),
    patch: Number.parseInt(match[3], 10),
    normalized,
  };
}

export function compareNodeVersions(leftVersion, rightVersion) {
  const left = typeof leftVersion === 'string' ? parseNodeVersion(leftVersion) : leftVersion;
  const right = typeof rightVersion === 'string' ? parseNodeVersion(rightVersion) : rightVersion;

  if (left.major !== right.major) {
    return left.major - right.major;
  }

  if (left.minor !== right.minor) {
    return left.minor - right.minor;
  }

  return left.patch - right.patch;
}

function parseSupportedNodeRangeEntry(entry) {
  const trimmed = entry.trim();

  if (trimmed.startsWith('^')) {
    return {
      kind: 'caret',
      minimum: parseNodeVersion(trimmed.slice(1)),
    };
  }

  if (trimmed.startsWith('>=')) {
    return {
      kind: 'minimum',
      minimum: parseNodeVersion(trimmed.slice(2).trim()),
    };
  }

  return {
    kind: 'exact',
    minimum: parseNodeVersion(trimmed),
  };
}

export function parseSupportedNodeRange(enginesRange) {
  return enginesRange
    .split('||')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map(parseSupportedNodeRangeEntry);
}

export function isNodeVersionSupported(version, enginesRange) {
  const parsedVersion = typeof version === 'string' ? parseNodeVersion(version) : version;

  return parseSupportedNodeRange(enginesRange).some((entry) => {
    if (entry.kind === 'caret') {
      return (
        parsedVersion.major === entry.minimum.major &&
        compareNodeVersions(parsedVersion, entry.minimum) >= 0
      );
    }

    if (entry.kind === 'minimum') {
      return compareNodeVersions(parsedVersion, entry.minimum) >= 0;
    }

    return compareNodeVersions(parsedVersion, entry.minimum) === 0;
  });
}

export function formatSupportedNodeRange(enginesRange) {
  const parts = parseSupportedNodeRange(enginesRange).map((entry) => {
    if (entry.kind === 'minimum') {
      return `${entry.minimum.major}+`;
    }

    return `${entry.minimum.major}.${entry.minimum.minor}+`;
  });

  if (parts.length === 0) {
    return enginesRange;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0]} (or ${parts.slice(1).join(' / ')})`;
}

export function isBootstrapHostVersionSupported(version) {
  return parseNodeVersion(version).major >= BOOTSTRAP_MIN_NODE_MAJOR;
}

export function loadRuntimePolicy(rootDir = process.cwd()) {
  const packageJson = readPackageJson(rootDir);
  const enginesRange = packageJson.engines?.node;

  if (!enginesRange) {
    throw new Error('package.json is missing engines.node');
  }

  const nvmVersion = readRequiredTrimmedFile(rootDir, '.nvmrc');
  const nodeVersionFileVersion = readOptionalTrimmedFile(rootDir, '.node-version');

  return {
    rootDir,
    enginesRange,
    supportedRangeLabel: formatSupportedNodeRange(enginesRange),
    pinnedVersion: nvmVersion,
    nvmVersion,
    nodeVersionFileVersion,
  };
}

export function validateRuntimePolicy(policy) {
  const issues = [];

  if (!policy.nodeVersionFileVersion) {
    issues.push('Missing .node-version.');
  }

  if (
    policy.nodeVersionFileVersion &&
    normalizeNodeVersion(policy.nodeVersionFileVersion) !== normalizeNodeVersion(policy.nvmVersion)
  ) {
    issues.push(
      `.nvmrc (${policy.nvmVersion}) does not match .node-version (${policy.nodeVersionFileVersion}).`
    );
  }

  if (!isNodeVersionSupported(policy.pinnedVersion, policy.enginesRange)) {
    issues.push(
      `Pinned runtime ${policy.pinnedVersion} does not satisfy package.json engines.node (${policy.enginesRange}).`
    );
  }

  return issues;
}

export function getRuntimePolicyStatus({
  rootDir = process.cwd(),
  hostVersion = process.versions.node,
} = {}) {
  const policy = loadRuntimePolicy(rootDir);
  const normalizedHostVersion = normalizeNodeVersion(hostVersion);

  return {
    policy,
    policyIssues: validateRuntimePolicy(policy),
    hostVersion: normalizedHostVersion,
    hostSupported: isNodeVersionSupported(normalizedHostVersion, policy.enginesRange),
    hostBootstrapCapable: isBootstrapHostVersionSupported(normalizedHostVersion),
  };
}

export function formatManagerPathMessage(policy) {
  return `Manager path: use your preferred version manager to match \`.nvmrc\` / \`.node-version\` (\`${policy.pinnedVersion}\`), then rerun the command.`;
}

export function formatBootstrapPathMessage(policy, hostBootstrapCapable) {
  if (!hostBootstrapCapable) {
    return `Bootstrap path unavailable: the repo fallback requires host Node ${BOOTSTRAP_MIN_NODE_MAJOR}+ before it can download Node \`${policy.pinnedVersion}\`.`;
  }

  return 'Bootstrap path: on host Node 18+, run `npm run bootstrap:node`, then `npm run pinned -- run <task>`.';
}

export function formatRuntimePolicyIssues(status) {
  if (status.policyIssues.length === 0) {
    return [];
  }

  return ['Runtime policy configuration issues:', ...status.policyIssues.map((issue) => `- ${issue}`)];
}

export function formatRuntimeMismatchMessage({
  rootDir = process.cwd(),
  hostVersion = process.versions.node,
} = {}) {
  const status = getRuntimePolicyStatus({ rootDir, hostVersion });
  const lines = [
    `Unsupported Node.js runtime: v${status.hostVersion}`,
    `Supported range: ${status.policy.supportedRangeLabel}`,
    `Exact repo pin: ${status.policy.pinnedVersion}`,
    `Pin files: .nvmrc=${status.policy.nvmVersion}, .node-version=${status.policy.nodeVersionFileVersion ?? 'missing'}`,
    formatManagerPathMessage(status.policy),
    formatBootstrapPathMessage(status.policy, status.hostBootstrapCapable),
  ];

  return [...lines, ...formatRuntimePolicyIssues(status)].join('\n');
}

export class RuntimePolicyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RuntimePolicyError';
  }
}

export function assertHostRuntimeSupported(options = {}) {
  const status = getRuntimePolicyStatus(options);

  if (status.policyIssues.length > 0) {
    throw new RuntimePolicyError(formatRuntimeMismatchMessage(options));
  }

  if (!status.hostSupported) {
    throw new RuntimePolicyError(formatRuntimeMismatchMessage(options));
  }

  return status;
}
