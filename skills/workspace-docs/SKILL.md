---
name: workspace-docs
description: Conventions for the tmp/ workspace files - ROADMAP, TASK, REVIEW, OVERVIEW, commits. Use when creating or updating any of them.
---

The tmp/ workspace holds the working files for a project (gitignored, survives
across sessions). Keep them in `tmp/` unless the user points to another "dump"
folder. Write them in English.

Status markers used across the files: `[ ]` todo, `[~]` in progress, `[x]` done,
`[!]` blocked / needs attention.

## tmp/ROADMAP.md - the global plan

- The full list of tasks for the project (not the repo's own root `ROADMAP.md`).
- When a task is finished, add a short report right under its item: what was
  done and how it was verified.

## tmp/TASK.md - the current task

- A detailed, actionable description of the task currently being worked on, one
  active task at a time.
- Start with a map of the files to create or change and what each one is
  responsible for. Follow the project's existing structure; propose a split only
  for a file that has grown unwieldy.
- Write steps as one action each with a checkable result ("add X to `a.py`",
  "run `<command>`, expect 0 failures"). Name exact files, names and commands -
  decisions the implementer cannot guess.
- Size subtasks so each ends in an independently testable result that a
  reviewer could accept or reject on its own. Fold setup, config and docs into
  the subtask that needs them.
- May grow with subtasks discovered during the work.
- On completion, add a short report at the bottom: what was done, how verified,
  what remains.

## tmp/REVIEW.md - review findings

- The problems the reviewer found: one item each with `file:line` and a fix
  suggestion.
- Findings feed back as fixes (into `TASK.md`) or spawn a new `TASK.md`.
- Add a short report when a review round closes.

## tmp/OVERVIEW.md - the checkpoint

- A high-level snapshot for the next session so it starts with context.
- Sections: what the project is, current state, what is done, what is next,
  known issues.
- Refresh it at the end of a work chunk or session. Do not invent progress.

## tmp/handoff-<date>-<slug>.md - session handoff

- Written by the `handoff` skill for a fresh agent to continue the work. It
  references other artifacts by path instead of copying them.

## tmp/commits/ - commit messages

- Per-commit message files `NN-slug.txt` for the current batch (see the
  `commit-message` skill).

Create each file the first time it is actually needed - do not scaffold them all
up front.
