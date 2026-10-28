---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
---

Write a handoff document summarising the current conversation so a fresh agent can
continue the work. Save to `tmp/handoff-<date>-<slug>.md` (the project's `tmp/`
folder, gitignored, persists across sessions) - not the OS temp directory.

Include a "suggested skills" section in the document, listing skills that the next
agent should invoke (per the SKILL.md names installed in the project).

Do not duplicate content already captured in other artifacts (specs, plans,
ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally
identifiable information.

If the user passed arguments, treat them as a description of what the next
session will focus on and tailor the doc accordingly.
