---
description: Write a handoff document for another agent (tmp/handoff-<date>-<slug>.md) from the current conversation and workspace state.
agent: build
subagent: false
---

## Context

!`ls tmp/handoff-*.md 2>/dev/null | tail -3 || echo "no handoffs yet"`

!`tail -40 tmp/JOURNAL.md 2>/dev/null || echo "no JOURNAL.md yet"`

!`head -60 tmp/TASK.md 2>/dev/null || echo "no TASK.md"`

## Task

Write the handoff document following the `handoff` skill: a summary a fresh agent
can continue from, saved to `tmp/handoff-<date>-<slug>.md`. Pull state from the
journal tail and TASK.md above rather than re-deriving it; reference
ROADMAP/TASK/REVIEW/OVERVIEW and `tmp/JOURNAL.md` by path instead of copying
them. Include the "continue from" line and "suggested skills" section. Redact
secrets. Report the path when done.

What the next session should focus on (if any): $ARGUMENTS

Do not commit or push anything.