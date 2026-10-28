---
description: Remove AI code slop from the current branch. Reviews the diff against the default branch and strips extra comments, defensive checks, any-casts, emoji, and other AI tells.
---

Check the diff against the base branch, and remove all AI generated slop
introduced in this branch.

Base branch: the remote default, from
`git rev-parse --verify -q --abbrev-ref origin/HEAD` (e.g. `origin/dev`);
use `origin/main` if that prints nothing. Substitute it for `<base>` below.

This includes:

- Extra comments that a human would not add or that are inconsistent with the
  rest of the file
- Extra defensive checks or try/catch blocks that are abnormal for that area
  of the codebase (especially if called by trusted / validated codepaths)
- Casts to any to get around type issues
- Any other style that is inconsistent with the file
- Unnecessary emoji usage

Workflow:

1. Run `git diff <base>...HEAD --stat` to see what files changed.
2. For each file, run `git diff <base>...HEAD -- <file>` and read the diff.
3. Edit the file directly to remove slop. Match the surrounding style of the
   file. Do not refactor working code, do not reformat untouched lines.
4. After editing, run `git diff <file>` to confirm the change is a pure
   cleanup, not a behavioural change.

Do not run `git add`, `git commit`, or any mutating git command. The user
commits manually.

Report at the end with only a 1-3 sentence summary of what you changed.
