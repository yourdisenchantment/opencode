---
description: Run review on current changes or a given path. No production-code edits, only findings.
agent: build
subagent: false
---

## Context

!`git status --short`
!`git diff --stat`

If the user passed a path or file after `/review` - work on it, otherwise on
the whole repo.

Arguments: $ARGUMENTS

## Task

Delegate the review to the `@reviewer` subagent so the result comes back here.
Hand it precise context only: the task (from `tmp/TASK.md` if present), the
requirements, and the files / diff to check - not this session's history.

`@reviewer` should:

1. Find problems: bugs, style, security, performance, tests.
2. Group by severity: blocker / important / minor.
3. For each item: file, line, what is wrong, how to fix.
4. Record the findings in `tmp/REVIEW.md` (see the `workspace-docs` skill):
   append to the open round if it still has unresolved items, or start a fresh
   file if all previous fixes are done.

When it reports back, check the findings against the code (see "Handling Review
Feedback" in the global `AGENTS.md`) and show me the verified list. Do NOT edit
production code; if I ask for fixes, show a plan first and route them to
`@coder`.