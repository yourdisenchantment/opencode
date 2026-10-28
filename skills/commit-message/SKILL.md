---
name: commit-message
description: Rules for composing commit messages and splitting the working tree into logical commits. Only proposes text, never runs git.
---

Compose a commit message for each commit. If the diff is not already in
context, inspect it with `git status --short`, `git diff`, and
`git diff --staged` first.

Format (per commit):

- First line: English imperative, <= 65 chars, no trailing period.
  Example: "Add retry logic to fetch client".
- Blank line.
- Body: English bullets stating what changed per the diff (not why). Items are
  short.

Splitting:

- Group changes into logical, self-contained commits - one topic per commit, do
  not mix unrelated changes. If everything is one change, that is one commit.
- Describe only what is actually in the diff. Do not invent anything.
- If there are no changes - report and stop.

Do NOT run git commit, git add, or any mutating command - the user commits.
Write each ready message to `tmp/commits/NN-slug.txt` (NN = 01, 02, ... in
commit order; slug = short kebab-case from the subject; a single commit is just
`01-slug.txt`). Create `tmp/commits/` if missing. Give the copy-paste command
per commit:

```
git commit -F tmp/commits/NN-slug.txt
```

Do not use multi-line `-m` - quotes break in the shell, and the `commit-msg`
hook rejects a malformed message.
