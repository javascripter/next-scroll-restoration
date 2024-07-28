import { defineConfig } from 'tsup'
import fs from 'node:fs'

export default defineConfig([
  {
    entry: ['src/index.tsx', '!src/**/*.test.{ts,tsx}'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    define: {
      $$INLINE_SCRIPT: JSON.stringify(
        fs.readFileSync('./generated/inline-script.global.js').toString()
      ),
    },
  },
])
