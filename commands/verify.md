---
description: Run the project's full verify chain (lint, typecheck, tests, build) and report each step with evidence. Check only, no code edits.
agent: build
subagent: false
---

## Context

Project markers:

!`ls package.json pyproject.toml Cargo.toml go.mod Makefile 2>/dev/null || echo "no known project file in cwd"`

Arguments (a package, path, or step to limit to): $ARGUMENTS

## Task

Find the project's real verify chain and run it in order, following the
"Verification" rules in the global `AGENTS.md`:

1. Determine the commands from the executable files (`package.json` scripts,
   `pyproject.toml`, `Makefile`, CI config), not from READMEs. Typical order:
   lint -> format check -> typecheck -> tests -> build. Skip steps the project
   does not have; do not invent commands and do not create a `tests/` directory.
2. Run each step fresh, with a reasonable timeout. Do not reuse earlier output.
3. For each step record the exact command, exit code, and the key result
   (pass/fail counts, first error with `file:line`).
4. Stop at the first failing step: report it with the relevant output and the
   most likely cause. Do not edit code unless I ask.

Report as a table: step | command | result. End with one line: all green, or
the first step that failed. Never write "should pass" - only what the commands
showed. Do not run git commands that change repository state.
