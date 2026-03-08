import * as fs from 'fs';

let p = 'README.md';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  /├── components\/\s+# React UI components\n├── __tests__\/\s+# Test suite\n└── utils\/\s+# Helper functions/g,
  `├── components/           # React UI components
├── hooks/                # Custom React hooks
├── registry/             # System registry and definitions
├── systems/              # System-specific engines and sheets
├── utils/                # Helper functions
└── __tests__/            # Test suite`
);

fs.writeFileSync(p, code);
