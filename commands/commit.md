---
description: Turn the working tree into a clean series of commits. Prepares messages and commands, does not run git.
agent: build
subagent: false
---

## Working tree

!`git status --short`

!`git diff --stat`

## Task

Turn the current working tree into a clean series of commits for me to run,
following the `commit-message` skill for each message. Do the work here; for a
large or messy batch you may hand it to the `@commit-collector` subagent.

Steps:

1. Group the changes into logical commits (one topic each; if it is all one
   change, that is a single commit).
2. Write each message to `tmp/commits/NN-slug.txt` (NN = 01, 02, ... in commit
   order). Create `tmp/commits/` if missing.
3. Output the ordered copy-paste commands - per commit: `git add <paths>` then
   `git commit -F tmp/commits/NN-slug.txt`.

Extra context from the user, if any: $ARGUMENTS

Do NOT run git add, git commit, or any mutating command. If there are no
changes, say so and stop.
