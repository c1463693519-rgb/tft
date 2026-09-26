import { defineConfig } from 'vitest/config';
import { workspaceSourceResolve } from '../../vitest.shared.ts';

export default defineConfig({
  ...workspaceSourceResolve,
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
  },
});
