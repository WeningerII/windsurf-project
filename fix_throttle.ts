import * as fs from 'fs';

let p = 'src/utils/performance.ts';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(/export function throttle[\s\S]*?\}\n\}/, `export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}`);

fs.writeFileSync(p, code);
