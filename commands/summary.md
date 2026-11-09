---
description: Create or refresh tmp/PROJECT.md - a shareable project brief (idea, stack, nuances, process, current stage) to copy or hand out.
agent: build
subagent: false
---

## Context

!`head -60 tmp/OVERVIEW.md 2>/dev/null || echo "no OVERVIEW.md"`

!`head -40 tmp/JOURNAL.md 2>/dev/null || echo "no JOURNAL.md yet"`

!`git log --oneline -5 2>/dev/null || echo "no git"`

Arguments (focus, sections to emphasize, or language override): $ARGUMENTS

## Task

Create or refresh `tmp/PROJECT.md` - a self-contained project brief for
sharing outside the workspace (copy-paste the text or hand the file over).
Rewrite it wholesale on every run from the sources below; it is a generated
artifact, not a workspace doc to patch incrementally.

Sources, in order: `README.md` and the manifest files (`package.json`,
`pyproject.toml`, `Cargo.toml`, `go.mod`, ...) for the stack; `tmp/OVERVIEW.md`
and `tmp/ROADMAP.md` for state; recent git log; the project's own
`AGENTS.md`/`RULES.md`/`CLAUDE.md` for nuances. Fill remaining gaps from the
current conversation, and mark anything not backed by a source "(assumption)".

Sections, exact headers:

- `## Idea` - what the project is and why it exists (2-4 sentences).
- `## Stack` - languages, frameworks, runtimes, key services; one line each,
  taken from the manifest files, not from memory.
- `## Nuances` - non-obvious conventions, pitfalls, gotchas (1-5 bullets; from
  the project's rules files or discovered during work).
- `## Process` - how work flows here: build/test commands, branch setup,
  deploy - facts only, from the executables (scripts, CI config), not READMEs.
- `## Current stage` - what is done, what is in flight right now - fresh facts,
  do not invent progress.

Rules:

- Language: English by default; an explicit argument wins (e.g. pass
  "на русском" to get Russian).
- Facts only. Do not duplicate tmp/ work-state docs by path-referencing them
  here - this file must read standalone.
- Do not touch other tmp/ files. Do not commit anything.

Report the path when done.