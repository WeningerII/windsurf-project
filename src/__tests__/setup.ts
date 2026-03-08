import { expect, afterEach } from 'vitest';
import { cleanup, configure } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
configure({ asyncUtilTimeout: 10000 });

afterEach(() => {
  cleanup();
});
