import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/http/controllers/**/*.spec.ts'],
    globals: true,
    environment: './prisma/vitest-environment-prisma/prisma-test-environment.ts',
  },
  resolve: {
    tsconfigPaths: true,
  },
})