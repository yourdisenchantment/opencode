---
name: pr-description
description: Generates a PR description (title + body) from the current branch diff. Does not push and does not open a PR.
---

Compose a Pull Request description from the current branch's diff. If the diff
is not already in context, gather it first:

- base: the remote default branch, `git rev-parse --verify -q --abbrev-ref origin/HEAD`
  (use `origin/main` if that prints nothing)
- branch: `git rev-parse --abbrev-ref HEAD`
- commits: `git log --oneline <base>..HEAD`
- diff stat: `git diff <base>...HEAD --stat`

### Title

- One English line, <= 65 chars, imperative.
- No trailing period. No `[WIP]` prefix.
- Follow the project's PR title convention if it has one (project `AGENTS.md`,
  `CONTRIBUTING.md`, commitlint config, recent merged PR titles). If it requires
  Conventional Commits, use `type(scope): summary`; otherwise no type prefix.

### Body

```
## Summary
- What this PR changes (1-3 bullets).

## Changes
- Concrete list of changes, grouped by topic (not by file).

## Testing
- How it was tested: commands, scenarios. If not tested - say so explicitly.
```

Rules:

- Describe only what is actually in the diff. Do not invent anything.
- If there are no changes - report and stop.
- Reference an issue/ticket if the user gave a number.

Do NOT run `git push`, `gh pr create`, or any mutating command. Output the ready
title and body for copy-paste.
