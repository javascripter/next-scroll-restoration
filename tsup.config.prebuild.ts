import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['src/inline-script.ts'],
  format: ['iife'],
  minify: true,
  outDir: './generated',
})
