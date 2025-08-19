import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules', 'cdk.out', 'dist'],
    globals: true,
    pool: 'forks',
    setupFiles: ['./vitest.setup.ts']
  },
  resolve: {
    conditions: ['node'],
  },
}); 