import { test, expect } from 'vitest'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

test('build script produces correct output', async () => {
  // Clean up before test
  execSync('rm -rf dist generated')

  // Run build script
  execSync('bun run build')

  // Check if dist directory exists
  expect(fs.existsSync('dist')).toBe(true)

  // Check if all expected files are present
  const expectedFiles = [
    'index.cjs',
    'index.cjs.map',
    'index.d.cts',
    'index.d.ts',
    'index.js',
    'index.js.map',
  ]
  expectedFiles.forEach((file) => {
    expect(fs.existsSync(path.join('dist', file))).toBe(true)
  })

  // Read the content of index.cjs and index.js
  const cjsContent = fs.readFileSync('dist/index.cjs', 'utf-8')
  const esContent = fs.readFileSync('dist/index.js', 'utf-8')

  // Check that $$INLINE_SCRIPT does not appear in the output
  expect(cjsContent).not.toContain('$$INLINE_SCRIPT')
  expect(esContent).not.toContain('$$INLINE_SCRIPT')

  // Check that ResizeObserver is included in the inlined script
  expect(cjsContent).toContain('ResizeObserver')
  expect(esContent).toContain('ResizeObserver')

  // Clean up after test
  execSync('rm -rf dist generated')
})
