import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      include: ['src'],
      exclude: ['src/serverless.ts', 'src/config.ts'],
      all: true,
      lines: 80,
      statements: 80,
      functions: 80,
      branches: 80,
    },
    useAtomics: true,
  },
});
