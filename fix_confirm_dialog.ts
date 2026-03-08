import * as fs from 'fs';

let p = 'src/components/ui/ConfirmDialog.tsx';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  /<div className="relative bg-card border rounded-xl shadow-lg p-6 max-w-md w-full mx-4 space-y-4 animate-in fade-in zoom-in-95">/,
  '<div role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-desc" className="relative bg-card border rounded-xl shadow-lg p-6 max-w-md w-full mx-4 space-y-4 animate-in fade-in zoom-in-95">'
);

code = code.replace(
  /<h3 className="text-lg font-semibold">\{title\}<\/h3>/,
  '<h3 id="dialog-title" className="text-lg font-semibold">{title}</h3>'
);

code = code.replace(
  /<p className="text-sm text-muted-foreground mt-1">\{description\}<\/p>/,
  '<p id="dialog-desc" className="text-sm text-muted-foreground mt-1">{description}</p>'
);

// Add basic focus trap logic to existing keydown effect
code = code.replace(
  /const handleKey = \(e: KeyboardEvent\) => \{\n\s*if \(e\.key === 'Escape'\) onCancel\(\);\n\s*\};/,
  `const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !el.closest('[aria-hidden="true"]') && el.closest('[role="alertdialog"]')
        ) as HTMLElement[];
        
        if (focusable.length === 0) return;
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };`
);

fs.writeFileSync(p, code);
