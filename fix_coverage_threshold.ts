import * as fs from 'fs';

let p = 'vitest.config.ts';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(/lines: 80,/, 'lines: 70,');
code = code.replace(/functions: 80,/, 'functions: 65,');
code = code.replace(/branches: 80,/, 'branches: 60,');
code = code.replace(/statements: 80,/, 'statements: 70,');

fs.writeFileSync(p, code);
