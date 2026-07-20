#!/usr/bin/env node

/**
 * Launch-blocker gate (SEC-1): no provider secret may be committed to source, and
 * no server-side secret may be smuggled into the client bundle via a `VITE_`-
 * prefixed env var (Vite statically inlines every `import.meta.env.VITE_*` into
 * the shipped JS, so a secret-bearing VITE_ name is a public-disclosure bug).
 *
 * This is a pure-local, offline, AST-free text scan over committed source. It
 * runs with only node:fs / node:path (no dependencies, no network).
 *
 * PRIVACY: like check-legal-notices.mjs, this reads files only to test SHORT
 * marker patterns. It reports file + line + which rule fired and NEVER prints
 * the matched secret body — echoing a leaked credential into CI logs would
 * widen the exposure it exists to catch.
 *
 * Exit 1 with a summary on any hit; silent exit 0 on a clean repo.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

// The guard's own source is excluded: it necessarily contains the very regex
// literals it hunts for. (Those pattern strings do not actually match a real
// credential, but skipping self keeps the scan free of meta-surprises.)
const selfRelative = path.relative(root, new URL(import.meta.url).pathname);

// Directories that are generated, vendored, or build output — never source.
const skipDirs = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  'graphify-out',
  'playwright-report',
  'test-results',
  '.netlify',
  '.cache',
]);

// Recursive scan roots plus repo-root config files (scanned non-recursively).
const scanDirs = ['src', 'scripts', 'netlify'];
const rootConfigExt = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.mts',
  '.cts',
  '.json',
  '.toml',
  '.yml',
  '.yaml',
]);

// Extensions worth scanning inside the recursive roots.
const scanExt = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.mts',
  '.cts',
  '.json',
  '.html',
  '.css',
  '.toml',
  '.yml',
  '.yaml',
  '.txt',
]);

/**
 * Secret-pattern rules. Each is applied line-by-line so a hit yields a line
 * number without the surrounding body being retained. Patterns are deliberately
 * scoped to avoid the repo's known-safe PUBLIC names (VITE_SUPABASE_ANON_KEY,
 * VITE_SENTRY_DSN, VITE_SUPABASE_URL) and boolean flags (VITE_AI_ENABLED,
 * VITE_TELEMETRY_ENABLED).
 */
const rules = [
  { id: 'openai-secret-key', re: /sk-[A-Za-z0-9]{20,}/ },
  { id: 'google-api-key', re: /AIza[0-9A-Za-z_\-]{35}/ },
  { id: 'aws-access-key-id', re: /AKIA[0-9A-Z]{16}/ },
  // Hardcoded bearer token — a real token literal, not `Bearer ${var}` / `Bearer ' + x`.
  { id: 'hardcoded-bearer-token', re: /Bearer\s+(?!\$\{)[A-Za-z0-9._\-]{16,}/ },
  // api_key / apiKey / api-key assigned a quoted literal of credential length
  // (>= 16 chars). Short dummy values ('k', 'test') in fixtures are not secrets,
  // and any real provider key long enough to matter is also caught by the
  // format-specific rules above.
  { id: 'hardcoded-api-key-literal', re: /api[_-]?key\s*[:=]\s*['"][^'"]{16,}['"]/i },
  { id: 'pem-private-key', re: /-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/ },
  // Server secret leaked to the client bundle via a secret-suffixed VITE_ name.
  {
    id: 'client-inlined-vite-secret',
    re: /VITE_[A-Z0-9_]*(?:SECRET|PRIVATE|SERVICE_ROLE|PASSWORD|TOKEN|API_KEY)[A-Z0-9_]*/,
  },
];

const findings = [];

function record(relPath, lineNo, ruleId) {
  findings.push({ file: relPath, line: lineNo, rule: ruleId });
}

function scanText(relPath, text) {
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    for (const rule of rules) {
      if (rule.re.test(line)) {
        record(relPath, i + 1, rule.id);
      }
    }
  }
}

// A committed `.env` (not an example/sample/template) that carries real values.
function isExampleEnv(basename) {
  return /^\.env\.(example|sample|template|dist|defaults?)$/.test(basename);
}

function scanEnvFile(relPath, text) {
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) continue;
    // KEY=<nonempty> where the value is not an empty string / bare placeholder.
    const m = line.match(/^[A-Za-z_][A-Za-z0-9_]*\s*=\s*(.*)$/);
    if (!m) continue;
    const value = m[1].trim().replace(/^['"]|['"]$/g, '');
    if (value !== '') {
      record(relPath, i + 1, 'committed-env-with-value');
    }
  }
}

function considerFile(absPath) {
  const relPath = path.relative(root, absPath);
  if (relPath === selfRelative) return;
  const basename = path.basename(absPath);

  // Dedicated handling for env files anywhere in the scan set.
  if (basename === '.env' || (basename.startsWith('.env') && !isExampleEnv(basename))) {
    const text = readFileSync(absPath, 'utf8');
    scanEnvFile(relPath, text);
    return;
  }

  const ext = path.extname(absPath);
  if (!scanExt.has(ext)) return;
  scanText(relPath, readFileSync(absPath, 'utf8'));
}

function walk(absDir) {
  let entries;
  try {
    entries = readdirSync(absDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      walk(path.join(absDir, entry.name));
    } else if (entry.isFile()) {
      considerFile(path.join(absDir, entry.name));
    }
  }
}

// 1. Recursive scan roots.
for (const dir of scanDirs) {
  const abs = path.join(root, dir);
  try {
    if (statSync(abs).isDirectory()) walk(abs);
  } catch {
    // Missing root is not a failure; nothing to scan.
  }
}

// 2. Repo-root config files (non-recursive) plus any root-level env files.
try {
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const abs = path.join(root, entry.name);
    if (
      entry.name === '.env' ||
      (entry.name.startsWith('.env') && !isExampleEnv(entry.name)) ||
      rootConfigExt.has(path.extname(entry.name))
    ) {
      considerFile(abs);
    }
  }
} catch {
  // Root unreadable — nothing further to scan.
}

if (findings.length > 0) {
  console.error(`Secret-exposure guard FAILED: ${findings.length} potential exposure(s).\n`);
  for (const f of findings) {
    // Report location + rule only. The matched secret body is intentionally omitted.
    console.error(`  - [${f.rule}] ${f.file}:${f.line}`);
  }
  console.error(
    '\nRemove the credential from source (use a server-side env var — never a ' +
      'VITE_*-prefixed one, which Vite inlines into the public client bundle), ' +
      'then re-run `npm run check:secret-exposure`.'
  );
  process.exit(1);
}

// Clean repo: silent success.
process.exit(0);
