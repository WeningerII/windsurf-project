/**
 * Validate all D&D 5e class data
 *
 * Run with: npx ts-node src/scripts/validate-classes.ts
 */

import { dnd5eClasses } from '../data/dnd/5e-2014/classes/index.js';
import { validateClasses, printValidationResults } from '../validation/class-validator.js';

console.log('🔍 Validating D&D 5e Class Data...\n');

const results = validateClasses(dnd5eClasses);

printValidationResults(results);

// Exit with error code if any classes have errors
const hasErrors = Array.from(results.values()).some((r) => !r.valid);
if (hasErrors) {
  console.log('\n❌ Validation failed! Please fix errors above.');
  process.exit(1);
} else {
  console.log('\n✅ All classes passed validation!');
  process.exit(0);
}
