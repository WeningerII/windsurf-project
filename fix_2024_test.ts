import * as fs from 'fs';

let p = 'src/__tests__/engines/dnd5e-2024-engine.test.ts';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  /it\('applies exhaustion level 4 by halving max HP', \(\) => \{\n      const doc = makeDoc\(\{[\s\S]*?\}\);\n      const result = engine\.prepareData\(doc\);\n      expect\(result\.system\.hitPoints\.max\)\.toBe\(11\);\n      expect\(result\.system\.hitPoints\.current\)\.toBe\(11\);\n    \}\);/,
  `it('does not halve max HP at exhaustion level 4 (2024 rules)', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
        classLevels: [{ classId: 'fighter', level: 2, hitDieRolls: [10, 8] }],
        exhaustionLevel: 4,
        hitPoints: { current: 99, max: 99, temp: 0 },
      });
      const result = engine.prepareData(doc);
      // 10 + 8 = 18 + (2 * 2 CON mod) = 22. In 2024 rules, exhaustion does not halve HP.
      expect(result.system.hitPoints.max).toBe(22);
    });`
);

fs.writeFileSync(p, code);
