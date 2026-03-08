import * as fs from 'fs';

let p = 'README.md';
let code = fs.readFileSync(p, 'utf8');

// Badges
code = code.replace(
  /\[!\[CI\]\(https:\/\/github\.com\/<owner>\/<repo>\/actions\/workflows\/ci\.yml\/badge\.svg\)\]\(https:\/\/github\.com\/<owner>\/<repo>\/actions\/workflows\/ci\.yml\)\n\[!\[Coverage\]\(https:\/\/codecov\.io\/gh\/<owner>\/<repo>\/branch\/main\/graph\/badge\.svg\)\]\(https:\/\/codecov\.io\/gh\/<owner>\/<repo>\)/g,
  ''
);

// Implemented Systems claim
code = code.replace(
  /Select from 6 fully implemented RPG systems/g,
  'Select from 7 registered RPG systems (6 production, 1 scaffold)'
);

// Project structure diagram
code = code.replace(
  /├── components\/\s+# React UI components\n├── __tests__\/\s+# Test suite\n└── utils\/\s+# Helper functions/g,
  `├── components/           # React UI components
├── hooks/                # Custom React hooks
├── registry/             # System registry and definitions
├── systems/              # System-specific engines and sheets
├── utils/                # Helper functions
└── __tests__/            # Test suite`
);

// Lazy loading claim
code = code.replace(
  /✅ Performance — Code splitting, lazy loading, gzip\/brotli compression/g,
  '✅ Performance — Code splitting, partial lazy loading (sheet-internal components), gzip/brotli compression'
);

// SRD_COMPLIANCE.md
code = code.replace(
  /See `SRD_COMPLIANCE\.md` for detailed mapping/g,
  'See documentation on Open Content Policy'
);

// shadcn/ui
code = code.replace(
  /- \*\*UI:\*\* React, Tailwind CSS, shadcn\/ui, Lucide Icons/g,
  '- **UI:** React, Tailwind CSS, shadcn/ui-inspired components, Lucide Icons'
);

fs.writeFileSync(p, code);
