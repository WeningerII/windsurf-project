import * as fs from 'fs';

function addAriaLabel(file: string, regex: RegExp, replacement: string) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(regex, replacement);
  fs.writeFileSync(file, code);
}

// DamageHealControl
let dhCode = fs.readFileSync('src/components/DamageHealControl.tsx', 'utf8');
dhCode = dhCode.replace(
  /<button\n        onClick=\{onDamage\}/,
  '<button\n        aria-label="Apply damage"\n        onClick={onDamage}'
);
dhCode = dhCode.replace(
  /<button\n        onClick=\{onHeal\}/,
  '<button\n        aria-label="Apply healing"\n        onClick={onHeal}'
);
fs.writeFileSync('src/components/DamageHealControl.tsx', dhCode);

// SpellSlotTracker
let ssCode = fs.readFileSync('src/components/SpellSlotTracker.tsx', 'utf8');
ssCode = ssCode.replace(
  /<button\n          onClick=\{\(\) => onUpdate\(Math\.min\(max, current \+ 1\)\)\}/g,
  '<button\n          aria-label="Restore spell slot"\n          onClick={() => onUpdate(Math.min(max, current + 1))}'
);
ssCode = ssCode.replace(
  /<button\n                  onClick=\{\(\) => onUpdate\(i < current \? i : i \+ 1\)\}/g,
  '<button\n                  aria-label={`Set spell slots to ${i + 1}`}\n                  onClick={() => onUpdate(i < current ? i : i + 1)}'
);
fs.writeFileSync('src/components/SpellSlotTracker.tsx', ssCode);

// HitDiceTracker
let hdCode = fs.readFileSync('src/components/HitDiceTracker.tsx', 'utf8');
hdCode = hdCode.replace(
  /<button\n          onClick=\{\(\) => onUpdate\(current < max \? current \+ 1 : current\)\}/g,
  '<button\n          aria-label="Restore hit die"\n          onClick={() => onUpdate(current < max ? current + 1 : current)}'
);
hdCode = hdCode.replace(
  /<button\n                onClick=\{\(\) => onUpdate\(i < current \? i : i \+ 1\)\}/g,
  '<button\n                aria-label={`Set hit dice to ${i + 1}`}\n                onClick={() => onUpdate(i < current ? i : i + 1)}'
);
fs.writeFileSync('src/components/HitDiceTracker.tsx', hdCode);

