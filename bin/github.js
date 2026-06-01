import { relative, resolve } from 'node:path'

// Path used for the GitHub `::error file=` annotation. GitHub resolves it from the repo root
// (GITHUB_WORKSPACE), but under lerna/nx the cwd is the package dir, so a cwd-relative path won't
// map onto the PR diff. Anchor to GITHUB_WORKSPACE in CI so the annotation lands on the right file.
export const resolveAnnotationFile = (rawFile, { cwd, CI, GITHUB_WORKSPACE }) => {
  const absolute = resolve(cwd, rawFile)
  return CI && GITHUB_WORKSPACE ? relative(GITHUB_WORKSPACE, absolute) : relative(cwd, absolute)
}
