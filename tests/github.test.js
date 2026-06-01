import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveAnnotationFile } from '../bin/github.js'

// GitHub resolves `::error file=...` annotation paths from the repo root (GITHUB_WORKSPACE).
// lerna/nx run each package with cwd = the package dir, so a cwd-relative path points at the wrong
// place and the annotation never lands on the PR diff. In CI the path must be workspace-relative.
const GITHUB_WORKSPACE = '/home/runner/work/repo/repo'
const cwd = `${GITHUB_WORKSPACE}/packages/foo` // what lerna/nx hands the reporter
const absFile = `${cwd}/src/bar.test.js`

test('CI annotation path is repo-root-relative so it lands on the PR diff', () => {
  const file = resolveAnnotationFile(absFile, { cwd, CI: '1', GITHUB_WORKSPACE })
  assert.equal(file, 'packages/foo/src/bar.test.js')
})

test('a relative input is resolved against cwd before anchoring to the workspace', () => {
  const file = resolveAnnotationFile('src/bar.test.js', { cwd, CI: '1', GITHUB_WORKSPACE })
  assert.equal(file, 'packages/foo/src/bar.test.js')
})

test('outside CI the path stays cwd-relative (local runs are unchanged)', () => {
  assert.equal(
    resolveAnnotationFile(absFile, { cwd, CI: undefined, GITHUB_WORKSPACE }),
    'src/bar.test.js'
  )
  assert.equal(
    resolveAnnotationFile(absFile, { cwd, CI: '1', GITHUB_WORKSPACE: undefined }),
    'src/bar.test.js'
  )
})
