import * as fs from 'fs';

function addAriaLabel(file: string, regex: RegExp, replacement: string) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(regex, replacement);
  fs.writeFileSync(file, code);
}

// 1. ThemeToggle
addAriaLabel(
  'src/components/ui/ThemeToggle.tsx',
  /<button\n      onClick=\{toggleTheme\}/,
  '<button\n      aria-label="Toggle theme"\n      onClick={toggleTheme}'
);

// 2. SpellBrowser
addAriaLabel(
  'src/components/SpellBrowser.tsx',
  /<button\n            onClick=\{onClose\}/,
  '<button\n            aria-label="Close spell browser"\n            onClick={onClose}'
);

// 3. FeatBrowser
addAriaLabel(
  'src/components/FeatBrowser.tsx',
  /<button\n                      onClick=\{\(\) => onAddFeat\(feat\.id\)\}/,
  '<button\n                      aria-label={`Add ${feat.name} feat`}\n                      onClick={() => onAddFeat(feat.id)}'
);

// 4. EquipmentBrowser
addAriaLabel(
  'src/components/EquipmentBrowser.tsx',
  /<button\n          onClick=\{onClose\}/,
  '<button\n          aria-label="Close equipment browser"\n          onClick={onClose}'
);

// 5. InventoryManager
let invCode = fs.readFileSync('src/components/InventoryManager.tsx', 'utf8');
invCode = invCode.replace(
  /<button\n        onClick=\{\(\) => setIsOpen\(true\)\}/,
  '<button\n        aria-label="Open inventory manager"\n        onClick={() => setIsOpen(true)}'
);
invCode = invCode.replace(
  /<button\n            onClick=\{\(\) => setIsOpen\(false\)\}/,
  '<button\n            aria-label="Close inventory manager"\n            onClick={() => setIsOpen(false)}'
);
invCode = invCode.replace(
  /<button\n            onClick=\{\(\) => setIsAdding\(true\)\}/,
  '<button\n            aria-label="Add item"\n            onClick={() => setIsAdding(true)}'
);
invCode = invCode.replace(
  /<button\n                onClick=\{\(\) => handleRemoveItem\(item\.id\)\}/g,
  '<button\n                aria-label={`Remove ${item.name}`}\n                onClick={() => handleRemoveItem(item.id)}'
);
fs.writeFileSync('src/components/InventoryManager.tsx', invCode);

// 6. MonsterBrowser
addAriaLabel(
  'src/components/MonsterBrowser.tsx',
  /<button\n          onClick=\{onClose\}/,
  '<button\n          aria-label="Close monster browser"\n          onClick={onClose}'
);

