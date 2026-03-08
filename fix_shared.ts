import * as fs from 'fs';

let p = 'src/systems/dnd5e-shared/engine.ts';
let code = fs.readFileSync(p, 'utf8');

// The backticks were escaped incorrectly when writing via EOF
code = code.replace(/\\`d\\\$\\{hitDieSize\\(cl\.classId\\)\\}\\`/g, '`d${hitDieSize(cl.classId)}`');
code = code.replace(/\\\$/g, '$');
code = code.replace(/\\`/g, '`');

fs.writeFileSync(p, code);
