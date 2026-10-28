---
description: Draft tmp/TASK.md for the next item - from a ROADMAP item or the argument.
agent: build
subagent: false
---

## Context

!`head -80 tmp/ROADMAP.md 2>/dev/null || echo "no ROADMAP.md - describe the task in the argument"`

## Task

Draft (or refresh) `tmp/TASK.md` for the item I name, following the
`workspace-docs` skill: a detailed, actionable description of one task, with a
short step list and how each step is verified. Pull the item from ROADMAP.md
above, or from my argument if given.

Which item / task: $ARGUMENTS
