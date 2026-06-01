import { relative, resolve, sep } from 'node:path'

// Path used for the GitHub `::error file=` annotation. GitHub resolves it from the repo root
// (GITHUB_WORKSPACE), but under lerna/nx the cwd is the package dir, so a cwd-relative path won't
// map onto the PR diff. Anchor to GITHUB_WORKSPACE in CI so the annotation lands on the right file.
// GitHub matches annotation paths with POSIX separators, so emit forward slashes even on Windows
// runners (where node:path would otherwise produce backslashes that never match the repo file).
export const resolveAnnotationFile = (rawFile, { cwd, CI, GITHUB_WORKSPACE }) => {
  const absolute = resolve(cwd, rawFile)
  const base = CI && GITHUB_WORKSPACE ? GITHUB_WORKSPACE : cwd
  return relative(base, absolute).split(sep).join('/')
}
