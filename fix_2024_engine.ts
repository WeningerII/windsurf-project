import * as fs from 'fs';

let p = 'src/systems/dnd5e-2024/engine.ts';
let code = fs.readFileSync(p, 'utf8');

// The test 'applies exhaustion level 4 by halving max HP' is failing because that's a 2014 rule.
// In 2024, max HP isn't halved at level 4. The test itself needs to be updated or removed if it was accidentally copied from 2014.
// Let's check the test file.

