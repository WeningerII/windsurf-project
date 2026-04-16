import { createHash } from 'node:crypto';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pipeline } from 'node:stream/promises';
import {
  BOOTSTRAP_MIN_NODE_MAJOR,
  RuntimePolicyError,
  isBootstrapHostVersionSupported,
  loadRuntimePolicy,
  normalizeNodeVersion,
} from './runtime-policy.mjs';

function normalizePlatformForDist(platform) {
  if (platform === 'win32') {
    return 'win';
  }

  return platform;
}

export function resolveNodeDistribution({
  version,
  platform = process.platform,
  arch = process.arch,
}) {
  const normalizedPlatform = normalizePlatformForDist(platform);

  if (!['darwin', 'linux', 'win'].includes(normalizedPlatform)) {
    throw new RuntimePolicyError(`Unsupported platform for repo bootstrap: ${platform}`);
  }

  if (!['x64', 'arm64'].includes(arch)) {
    throw new RuntimePolicyError(`Unsupported architecture for repo bootstrap: ${arch}`);
  }

  const archiveType = normalizedPlatform === 'win' ? 'zip' : 'tar.gz';
  const directoryName = `node-v${version}-${normalizedPlatform}-${arch}`;
  const fileName = `${directoryName}.${archiveType}`;
  const distBaseUrl = `https://nodejs.org/dist/v${version}`;

  return {
    version,
    platform,
    arch,
    distPlatform: normalizedPlatform,
    archiveType,
    directoryName,
    fileName,
    downloadUrl: `${distBaseUrl}/${fileName}`,
    shasumsUrl: `${distBaseUrl}/SHASUMS256.txt`,
  };
}

export function getRuntimeCachePaths(rootDir, distribution) {
  const distDir = path.join(rootDir, '.cache', 'node-dist');
  const runtimeDir = path.join(
    rootDir,
    '.cache',
    'node-runtime',
    `v${distribution.version}`,
    `${distribution.distPlatform}-${distribution.arch}`
  );

  return {
    distDir,
    runtimeParentDir: path.dirname(runtimeDir),
    runtimeDir,
    archivePath: path.join(distDir, distribution.fileName),
    shasumsPath: path.join(distDir, `SHASUMS256-v${distribution.version}.txt`),
  };
}

export function parseShasumsFile(contents) {
  const checksums = new Map();

  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^([a-f0-9]{64})\s+\*?(.+)$/i);
    if (match) {
      checksums.set(match[2], match[1]);
    }
  }

  return checksums;
}

export function computeFileSha256(filePath) {
  const hash = createHash('sha256');
  hash.update(readFileSync(filePath));
  return hash.digest('hex');
}

export function verifyArchiveChecksum({ archivePath, shasumsText, fileName }) {
  const checksums = parseShasumsFile(shasumsText);
  const expectedChecksum = checksums.get(fileName);

  if (!expectedChecksum) {
    throw new RuntimePolicyError(`Missing checksum entry for ${fileName} in SHASUMS256.txt`);
  }

  const actualChecksum = computeFileSha256(archivePath);
  if (actualChecksum !== expectedChecksum) {
    try {
      unlinkSync(archivePath);
    } catch {
      // Ignore cleanup failures; the main error is the checksum mismatch.
    }

    throw new RuntimePolicyError(`Checksum mismatch for ${fileName}`);
  }
}

async function requestResponse(url, redirectCount = 0) {
  if (redirectCount > 5) {
    throw new RuntimePolicyError(`Too many redirects while downloading ${url}`);
  }

  return await new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const { statusCode = 0, headers } = response;

        if (statusCode >= 300 && statusCode < 400 && headers.location) {
          response.resume();
          const redirectedUrl = new URL(headers.location, url).toString();
          resolve(requestResponse(redirectedUrl, redirectCount + 1));
          return;
        }

        if (statusCode !== 200) {
          response.resume();
          reject(new RuntimePolicyError(`Download failed for ${url}: HTTP ${statusCode}`));
          return;
        }

        resolve(response);
      })
      .on('error', (error) =>
        reject(new RuntimePolicyError(`Download failed for ${url}: ${error.message}`))
      );
  });
}

export async function downloadText(url) {
  const response = await requestResponse(url);
  const chunks = [];
  for await (const chunk of response) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString('utf8');
}

export async function downloadFile(url, destinationPath) {
  const response = await requestResponse(url);
  await pipeline(response, createWriteStream(destinationPath));
}

function ensureDirectory(directoryPath) {
  mkdirSync(directoryPath, { recursive: true });
}

function writeTextAtomically(targetPath, contents) {
  ensureDirectory(path.dirname(targetPath));
  const tempDir = mkdtempSync(path.join(path.dirname(targetPath), '.tmp-'));
  const tempPath = path.join(tempDir, path.basename(targetPath));

  try {
    writeFileSync(tempPath, contents);
    if (!existsSync(targetPath)) {
      renameSync(tempPath, targetPath);
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }

  return readFileSync(targetPath, 'utf8');
}

async function ensureTextFile({ filePath, url, downloadTextImpl }) {
  if (existsSync(filePath)) {
    return readFileSync(filePath, 'utf8');
  }

  const contents = await downloadTextImpl(url);
  return writeTextAtomically(filePath, contents);
}

async function ensureDownloadedArchive({ archivePath, url, downloadFileImpl }) {
  if (existsSync(archivePath)) {
    return archivePath;
  }

  ensureDirectory(path.dirname(archivePath));
  const tempDir = mkdtempSync(path.join(path.dirname(archivePath), '.tmp-'));
  const tempArchivePath = path.join(tempDir, path.basename(archivePath));

  try {
    await downloadFileImpl(url, tempArchivePath);
    if (!existsSync(archivePath)) {
      renameSync(tempArchivePath, archivePath);
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }

  return archivePath;
}

export function resolveBundledNodePaths(runtimeDir, platform = process.platform) {
  const nodePath =
    platform === 'win32' ? path.join(runtimeDir, 'node.exe') : path.join(runtimeDir, 'bin', 'node');
  const npmCliCandidates =
    platform === 'win32'
      ? [
          path.join(runtimeDir, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
          path.join(runtimeDir, 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
        ]
      : [path.join(runtimeDir, 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js')];
  const npmCliPath = npmCliCandidates.find((candidate) => existsSync(candidate));

  if (!existsSync(nodePath) || !npmCliPath) {
    throw new RuntimePolicyError(`Extracted runtime is incomplete in ${runtimeDir}`);
  }

  return {
    nodePath,
    npmCliPath,
  };
}

function resolvePathEnvironmentKey(env) {
  return Object.keys(env).find((key) => key.toLowerCase() === 'path') ?? 'PATH';
}

export function buildPinnedNodeSpawnEnv({
  runtimeDir,
  nodePath,
  env = process.env,
  platform = process.platform,
} = {}) {
  const pathKey = resolvePathEnvironmentKey(env);
  const runtimeBinDir = platform === 'win32' ? runtimeDir : path.dirname(nodePath);
  const existingPath = env[pathKey] ?? '';
  const nextPath = [runtimeBinDir, ...existingPath.split(path.delimiter).filter(Boolean)].filter(
    (entry, index, entries) => entries.indexOf(entry) === index
  );

  return {
    ...env,
    [pathKey]: nextPath.join(path.delimiter),
    npm_config_scripts_prepend_node_path: 'true',
  };
}

function locateExtractedRuntimeRoot(extractionDir, distribution) {
  const directCandidate = path.join(extractionDir, distribution.directoryName);
  if (existsSync(directCandidate) && statSync(directCandidate).isDirectory()) {
    return directCandidate;
  }

  const childDirectories = readdirSync(extractionDir)
    .map((entry) => path.join(extractionDir, entry))
    .filter((entryPath) => statSync(entryPath).isDirectory());

  if (childDirectories.length === 1) {
    return childDirectories[0];
  }

  throw new RuntimePolicyError(
    `Could not locate extracted Node runtime for ${distribution.fileName}`
  );
}

export function commitPreparedRuntime(preparedRuntimeDir, finalRuntimeDir) {
  ensureDirectory(path.dirname(finalRuntimeDir));

  try {
    renameSync(preparedRuntimeDir, finalRuntimeDir);
  } catch (error) {
    if (existsSync(finalRuntimeDir)) {
      rmSync(preparedRuntimeDir, { recursive: true, force: true });
      return finalRuntimeDir;
    }

    throw error;
  }

  return finalRuntimeDir;
}

export function extractArchive({
  archivePath,
  destinationDir,
  archiveType,
  platform = process.platform,
}) {
  ensureDirectory(destinationDir);

  if (archiveType === 'tar.gz') {
    try {
      execFileSync('tar', ['-xzf', archivePath, '-C', destinationDir], { stdio: 'ignore' });
    } catch {
      throw new RuntimePolicyError(
        `Failed to extract ${path.basename(archivePath)} with system tar. Install tar or use a version manager.`
      );
    }
    return;
  }

  if (platform !== 'win32') {
    throw new RuntimePolicyError(
      `Zip extraction is only supported on Windows hosts: ${archivePath}`
    );
  }

  try {
    execFileSync(
      'powershell.exe',
      [
        '-NoProfile',
        '-Command',
        `Expand-Archive -LiteralPath '${archivePath.replace(/'/g, "''")}' -DestinationPath '${destinationDir.replace(/'/g, "''")}' -Force`,
      ],
      { stdio: 'ignore' }
    );
  } catch {
    throw new RuntimePolicyError(
      `Failed to extract ${path.basename(archivePath)} with PowerShell Expand-Archive. Install PowerShell or use a version manager.`
    );
  }
}

export async function ensurePinnedNodeRuntime({
  rootDir = process.cwd(),
  hostVersion = process.versions.node,
  platform = process.platform,
  arch = process.arch,
  downloadTextImpl = downloadText,
  downloadFileImpl = downloadFile,
  extractArchiveImpl = extractArchive,
} = {}) {
  const normalizedHostVersion = normalizeNodeVersion(hostVersion);
  if (!isBootstrapHostVersionSupported(normalizedHostVersion)) {
    throw new RuntimePolicyError(
      `Repo bootstrap requires host Node ${BOOTSTRAP_MIN_NODE_MAJOR}+; found v${normalizedHostVersion}.`
    );
  }

  const policy = loadRuntimePolicy(rootDir);
  const distribution = resolveNodeDistribution({
    version: policy.pinnedVersion,
    platform,
    arch,
  });
  const cachePaths = getRuntimeCachePaths(rootDir, distribution);

  if (existsSync(cachePaths.runtimeDir)) {
    return {
      version: policy.pinnedVersion,
      runtimeDir: cachePaths.runtimeDir,
      archivePath: cachePaths.archivePath,
      shasumsPath: cachePaths.shasumsPath,
      distribution,
      ...resolveBundledNodePaths(cachePaths.runtimeDir, platform),
    };
  }

  ensureDirectory(cachePaths.distDir);
  ensureDirectory(cachePaths.runtimeParentDir);

  const shasumsText = await ensureTextFile({
    filePath: cachePaths.shasumsPath,
    url: distribution.shasumsUrl,
    downloadTextImpl,
  });
  await ensureDownloadedArchive({
    archivePath: cachePaths.archivePath,
    url: distribution.downloadUrl,
    downloadFileImpl,
  });
  verifyArchiveChecksum({
    archivePath: cachePaths.archivePath,
    shasumsText,
    fileName: distribution.fileName,
  });

  const extractionDir = mkdtempSync(path.join(cachePaths.runtimeParentDir, '.tmp-'));
  try {
    extractArchiveImpl({
      archivePath: cachePaths.archivePath,
      destinationDir: extractionDir,
      archiveType: distribution.archiveType,
      platform,
    });
    const preparedRuntimeDir = locateExtractedRuntimeRoot(extractionDir, distribution);
    commitPreparedRuntime(preparedRuntimeDir, cachePaths.runtimeDir);
  } catch (error) {
    throw new RuntimePolicyError(
      error instanceof Error ? error.message : 'Failed to prepare the pinned Node runtime.'
    );
  } finally {
    rmSync(extractionDir, { recursive: true, force: true });
  }

  return {
    version: policy.pinnedVersion,
    runtimeDir: cachePaths.runtimeDir,
    archivePath: cachePaths.archivePath,
    shasumsPath: cachePaths.shasumsPath,
    distribution,
    ...resolveBundledNodePaths(cachePaths.runtimeDir, platform),
  };
}
