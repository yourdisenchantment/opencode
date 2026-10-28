---
description: Run linter and formatter on modified files. Check only, no auto-fixes to production code.
agent: build
subagent: false
---

## Context

Modified files:

!`git status --short`

If there are no staged changes - check the working tree via `git diff --name-only`.

## Task

Run linter and formatter on the modified files following the `lint-checker`
skill rules:

1. Determine the stack linter/formatter (ruff, eslint+prettier, clippy+fmt,
   golangci-lint+gofmt).
2. Run only on the modified files.
3. Show linter errors, suggest a fix, but do not edit production code yourself.
4. Formatting - report from the check / diff output; do not run a formatter that
   writes files (hand over the command instead).

Skip if only `.md`/`.txt` or non-code files were changed.