---
description: Create or refresh tmp/OVERVIEW.md - a checkpoint of project state and work done, for the next session.
agent: build
subagent: false
---

## Context

!`ls -la tmp/ 2>/dev/null || echo "no tmp/ yet"`

!`head -60 tmp/ROADMAP.md 2>/dev/null || echo "no ROADMAP.md"`

!`head -60 tmp/TASK.md 2>/dev/null || echo "no TASK.md"`

## Task

Create or refresh `tmp/OVERVIEW.md` as a checkpoint for the next session,
following the `workspace-docs` skill. Summarize from ROADMAP/TASK above plus the
current repo state: what the project is, current state, what is done, what is
next, known issues. Keep it concise and factual - do not invent progress.

Extra context from the user, if any: $ARGUMENTS
