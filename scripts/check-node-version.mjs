const raw = process.versions.node;
const [majorStr = '0', minorStr = '0'] = raw.split('.');
const major = Number.parseInt(majorStr, 10);
const minor = Number.parseInt(minorStr, 10);

const isValid =
  (major === 20 && minor >= 19) ||
  (major === 22 && minor >= 12) ||
  major >= 24;

if (!isValid) {
  console.error(
    [
      `Unsupported Node.js runtime: v${raw}`,
      'Required: ^20.19.0 || ^22.12.0 || >=24.0.0',
      'Use `.nvmrc` (20.19.0) or install a compatible Node version before running build/coverage/e2e.',
    ].join('\n')
  );
  process.exit(1);
}

console.log(`Node.js runtime OK: v${raw}`);
