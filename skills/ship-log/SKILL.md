---
name: ship-log
description: "Mandatory, universal: keep a running ship's log (tmp/JOURNAL.md) so any agent can pick up after the last recorded step. Read the tail before starting work; append one short entry after every meaningful action, assumption, fact, insight or decision. Applies to every project and every agent."
---

# Agent Ship's Log

## Purpose

`tmp/JOURNAL.md` in the project root is the durable short-term memory of the
work. It survives sessions, agents and models. Every agent that touches a
project reads its tail before acting and appends a short entry after each
meaningful step, so a later or different agent can continue without re-running
discovery.

The file is gitignored and lives under `tmp/`. For broader `tmp/` conventions
see the `workspace-docs` skill (`ROADMAP.md`, `TASK.md`, `REVIEW.md`,
`OVERVIEW.md`, `commits/`).

## Mandatory loop

Before the first action of a session:

1. If `tmp/JOURNAL.md` does not exist, create it (header plus format below).
2. Read its tail (last 10-20 entries / last ~40-60 lines). Treat it as the
   current known context: what was attempted, what worked, open blockers.
3. State in one line which entry you are continuing from (or that there is
   none).

After each meaningful action, assumption, fact, insight or decision:

1. Append one entry to `tmp/JOURNAL.md`. Append at the end - never rewrite
   history. Never batch two distinct events into one entry.
2. Report to the user only after the entry is written.

"Meaningful" includes: reading files, searching, running commands, forming
an assumption, discovering a gotcha, making or changing a decision, writing or
editing code, testing, fixing, reviewing. Read-only exploration that taught
you something is meaningful. Pure chatter or restating already-known context
is not.

## Entry format

Chronological, append-only. Each entry is a level-2 heading followed by 1-6
short bullets; keep the whole entry under ~8 lines. Write in English (see
`workspace-docs` / global rules). Compose: only bullets that add information.

```markdown
## <ISO-8601 UTC> - <agent> - session:<id> - task:<slug>
- **did**: <one line, what was done>
- **found**: <facts/insights/discoveries a later agent must know>
- **decided**: <choices made and why, briefly>
- **files**: <changed paths, +/- lines if useful>
- **verify**: <command -> result, or "n/a">
- **next**: <next step, or "done">
- **blockers**: <issues, or "none">
```

Always keep **did** and **next**; omit bullets that add nothing. Timestamps in
UTC (`2026-10-31T12:34:56Z`).

## When not to write

- The action produced no new information and no change in state. (A learned
  fact counts as information - write it.)
- The exactly same fact was recorded in the immediately preceding entry and
  nothing changed.

## Reading the tail

Prefer the last 10-20 entries; full reads are expensive and the file can grow.
When continuing "from the last step", the most recent entry's **next** line is
your starting point.

## Interplay with other `tmp/` files

- `ROADMAP.md`, `TASK.md`, `REVIEW.md`, `OVERVIEW.md` and `commits/` keep the
  structured plan. The journal is the *narrative* counterpart and must not
  duplicate them fully: reference them by path.
- The `handoff` skill still writes a one-shot snapshot; the journal is
  continuous and is not replaced when a handoff is written.

## Cross-agent handoff

When you are a fresh agent taking over a project:

1. Read the journal tail and `OVERVIEW.md` before any discovery work.
2. Trust recorded facts; do not re-discover them.
3. If an earlier entry is wrong, correct it by appending a "correction"
   entry - never by editing history.
4. Record the prior session id from the tail for traceability.

## Example of a good entry

```markdown
## 2026-10-31T12:34:56Z - agent/coder - session:ses_abc - task:wildcard-tests
- **did**: implemented unit tests for Wildcard.match
- **found**: `?` matches `/` and surrogate pairs (2 code units); no `u` flag
- **decided**: keep `/`-crossing behavior, matches POSIX glob; add u-flag as TODO
- **files**: packages/core/test/util/wildcard.test.ts (+98)
- **verify**: `cd packages/core && bun test util/wildcard` -> 24 pass
- **next**: permission.ts integration test
- **blockers**: none
```

## Example of a bad entry

```markdown
## 2026-10-31T12:34:56Z - agent/coder - session:ses_abc - task:wildcard-tests
- **did**: worked on tests
- **verify**: passed
```
Too vague: gives the next agent no facts and no pointers. Always name what
was learned and where to continue.