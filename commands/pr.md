---
description: Generate PR description (title + body) from the current branch diff. Does not push and does not open a PR.
agent: build
subagent: false
---

## Context

Branch and base (base = the remote default branch, `origin/main` if unknown):

!`BASE=$(git rev-parse --verify -q --abbrev-ref origin/HEAD || echo origin/main); echo "branch: $(git rev-parse --abbrev-ref HEAD), base: $BASE"; git log --oneline "$BASE"..HEAD; git diff "$BASE"...HEAD --stat`

Context from the user (if any): $ARGUMENTS

## Task

Compose a Pull Request description from the diff above following the
`pr-description` skill rules:

- Title: one English line, <= 65 chars, imperative, no trailing period; follow
  the project's PR title convention if it has one (see the skill).
- Body: sections `## Summary`, `## Changes`, `## Testing`.
- Describe only what is actually in the diff. Do not invent anything.
- If there are no changes - report and stop.

Do NOT run `git push`, `gh pr create`, or any mutating commands. Output the
ready title and body for copy-paste.