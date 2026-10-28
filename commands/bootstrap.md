---
description: Set up the project workspace - ensure tmp/ exists and is gitignored, report which service files are present. Does not create the md files.
agent: build
subagent: false
---

## Context

tmp/ contents:

!`ls -la tmp/ 2>/dev/null || echo "tmp/ does not exist yet"`

.gitignore rule for tmp/:

!`grep -nE '^/?tmp/?$' .gitignore 2>/dev/null || echo "no tmp/ rule in .gitignore"`

MCP capability keys (presence only - the value is never printed):

!`[ -n "$CONTEXT7_API_KEY" ] && echo "CONTEXT7_API_KEY: set" || echo "CONTEXT7_API_KEY: MISSING (context7 docs will 401)"`
!`[ -n "$KEENABLE_API_KEY" ] && echo "KEENABLE_API_KEY: set" || echo "KEENABLE_API_KEY: missing (keenable still works keyless at a lower rate limit)"`

## Task

Prepare the project workspace. Run this once when starting work in a project
(after `/init`).

1. If `tmp/` is missing, create it (`mkdir -p tmp`). Leave it empty - the
   service files below are written on demand, not now.
2. Ensure `.gitignore` ignores `tmp/`. If there is no `tmp/` rule, add a single
   `tmp/` line (create `.gitignore` if absent). Do not duplicate an existing
   rule.
3. Report which of the service files under `tmp/` already exist and which are
   missing. Do NOT create them - each is written the first time it is actually
   needed, and lives only in `tmp/` (gitignored, survives across sessions):
   - `TASK.md` - the currently active tasks only. Create it at the start of a
     multi-step task; `coder` and `reviewer` read and update it.
   - `ROADMAP.md` - the full development plan and the archive of finished work.
     Create it once the work spans more than one session; move completed
     `TASK.md` items here.
   - `REVIEW.md` - the latest review / current-state assessment. `reviewer`
     writes here; create it when a review happens.
   - `OVERVIEW.md` - a high-level map of the project. Create it for a codebase
     big enough that a quick orientation saves re-reading files.
   - `commits/` - per-commit message files (`NN-slug.txt`), written when
     preparing commits.
   Their formats live in the `workspace-docs` skill.
4. Report agent capabilities so the session knows what it can rely on:
   - context7 (docs) and keenable (web) are configured in opencode.jsonc and
     available to coder/reviewer. From the check above, note whether the API
     keys are present (presence only - never print or read the values). A
     missing CONTEXT7_API_KEY means context7 calls will fail.

Finish with a short report: tmp/ status, .gitignore status, a present / missing
list for the workspace files, and the agent-capabilities summary.
