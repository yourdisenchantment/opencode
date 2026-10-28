# Coding rules (tool-independent)

The coding layer of my personal rules, for any coding agent. It adds to
`CORE.md` (language, answer style, general principles, honesty, errors, when to
ask), which always applies as well; this file does not repeat it. Setup that
belongs to one tool lives in that tool's own file (for opencode: `AGENTS.md`
next to this file). Project rules are additive: a project's own rules file
extends these, it does not replace them.

## Coding Principles

These make the general principles from `CORE.md` concrete for code.

- Minimum code that solves the task. No abstractions for a single call site, no
  "flexibility" or "configurability" that was not requested, no error handling
  for impossible scenarios. If you wrote 200 lines and 50 would do - rewrite.
  Test: "Would a senior engineer call this overcomplicated?"
- Touch only what the task needs. Do not "improve" adjacent code, comments or
  formatting, and do not refactor what is not broken. Match the style of the
  existing file. If you spot someone else's dead code - mention it, do not
  delete it. Remove only the imports / variables / functions that YOUR changes
  made unnecessary. Test: every changed line follows directly from the task.
- Turn tasks into checks that can run: "add validation" -> tests for invalid
  inputs, run, green; "fix a bug" -> a reproducing test, run, green;
  "refactor X" -> tests pass before and after. For multi-step work, a short plan
  of "step - how it is verified".
- Docs and rules files (READMEs, comments, rule files like this one) can lag the
  code. The executable files - `package.json`, `pyproject.toml`, config, hooks,
  the source itself - are the source of truth; when prose and code disagree,
  trust the code and flag the drift.

## Code Style

- Comments and docstrings in source files are in English. Docstrings follow
  google-style (Args / Returns / Raises).
- Source files use only ASCII and Russian letters; dashes, the letter yo and
  other special characters follow the symbol rules in `CORE.md`.
- Avoid diacritics and umlauts in every language (write plain a / o / u / c / e,
  not their accented forms) - keep to characters typable on a standard keyboard
  so the encoding never breaks.
- No decorative frames or banners in comments. Only simple single-line ones.
- Identifiers, file names, commit messages - in English.
- Match the style of the existing file. Do not reformat someone else's work
  without an explicit request.

## Hard Constraints

These are agreements on top of whatever the tool enforces. Where a tool blocks
an action, good; where it does not, the rule still applies.

- **NEVER delete files or directories** - not with `rm`, `rmdir`, `trash`,
  `find -delete`, `git rm`, nor from a script (Python / Node / Bun:
  `os.remove`, `shutil.rmtree`, `subprocess` with `rm`, ...). If a task requires
  deletion - hand me a copy-paste list, I run it.
- **NEVER move, copy out of the project, or overwrite.** Changing file contents
  goes through the agent's file-editing tool, not through shell tricks.
- **Stay inside the project working directory.** Reading, editing and writing
  under the directory the session started in is fine. For paths outside the
  project (`~`, another project's folder, ...) ask first and wait for my reply;
  do not edit, write, or run mutating commands there without explicit approval.
- **Do not run privileged commands** (`sudo`, `su`, `doas`).
- **No pipe-to-shell.** Do not run `sh`, `bash`, `zsh`, `fish` as a command and
  do not pipe downloaded content into a shell (`curl ... | sh`). Use `python3`,
  `node`, or `bun` for scripts. Scripts are never a way around any rule here.
- **Do not read secrets** (`.env*`, keys, `~/.ssh`, cloud credentials, local
  service credential files; `*.env.example` is the only readable env file). If
  secrets appear in tool output, warn me.
- **Do not perform multi-step tasks silently.** Plan first, surface the plan
  in the response, then act. For destructive or irreversible steps, wait for
  confirmation.
- **Do not start long-running foreground processes** (dev servers, watchers,
  interactive REPLs). If needed - ask first.

## Working with Git

I handle git myself. The agent never runs commands that change repository
state; it only inspects and proposes a plan.

Read-only inspection (`status`, `log`, `diff`, `show`, `fetch`, ...) is allowed.
`git push` and `cp` / `rsync` need my approval: surface the command and wait.
Everything that changes repository state (`add`, `commit`, `pull`, `merge`,
`rebase`, `reset`, `checkout`, `stash`, branch / tag / remote / config writes,
force push, `npm publish`) is not allowed.

**Instead, propose a plan:** follow the `commit-message` skill. It defines the
message format, the split into commits, and the `tmp/commits/NN-slug.txt`
files. Hand over copy-paste commands per commit: `git add <paths>`, then
`git commit -F tmp/commits/NN-slug.txt`. If the project uses commitlint /
Conventional Commits - follow the convention (`feat:`, `fix:`, `chore:`, etc.).

Before committing, verify that staged files do not intersect with `.gitignore`
(otherwise lint-staged fails with "paths ignored"). Do not bump the package
version without an explicit command.

For complex operations (conflict, rebase, force push, rollback) - break down
step by step with risks at each step. Do not run them yourself.

## When to Ask in Code Work

In addition to the general rules in `CORE.md`, ask if:
- The choice affects architecture or other people's modules.
- You need to delete / commit / push / deploy / reinstall dependencies.
- You are unsure about a code style that is not described here.

## Working with Tools

- Prefer the agent's built-in file tools (read, search, list) over equivalent
  shell commands (`cat`, `grep`, `find`, `ls`) - they are faster and respect
  `.gitignore`.
- Do not use interactive commands (`vim`, `less`, `nano`, `top`, `htop`). If
  needed - use flags (`--no-pager`, `--batch`) or redirection.
- Do not run destructive shell commands (`rm`, `mv`, `dd`, `sudo`, ...) -
  prepare a copy-paste command list for me instead (see "Hard Constraints").
- Do not install packages with `sudo` or globally (`npm i -g`, `pip install`
  without a venv). Local project installs (`npm install foo`,
  `pip install -r requirements.txt`, `bun add`) are fine.
- For library / framework documentation, use a documentation tool or the
  official docs rather than relying on memory.

## Handling Review Feedback

Applies to a reviewer agent's findings (for example in `tmp/REVIEW.md`),
external reviews, and my own comments. Feedback is a claim to check, not an
order.

- Read all of it first. If any item is unclear, ask about those items before
  implementing anything - items can be related.
- Verify each finding against the code before acting. Is it correct for this
  codebase, does the fix break something, is there a reason for the current
  behavior?
- If a finding is wrong or conflicts with an earlier decision - say so with the
  technical reason (file, test, doc). Do not implement it silently.
- If a finding asks for a "proper" feature, grep for real usage first. Unused
  -> propose removing it (YAGNI) instead of building it.
- Implement in order: blockers (breakage, security), simple fixes, complex
  fixes. One item at a time, re-check after each.
- No performative replies ("You're absolutely right!", "Great catch!", thanks).
  State what changed, or the reason for the pushback.

## Verification

- If the result can be verified (test, linter, running a script) - verify it
  yourself before reporting.
- Find the project's verify chain and run it in order before reporting -
  typically lint -> typecheck -> tests -> build (e.g. `ruff check` -> `pyright`
  -> `pytest`, or `lint` -> `format:check` -> `astro check` -> `build`). All
  steps must pass; report the first that fails.
- Do not assume pytest and a `tests/` directory by default. Determine the
  project's actual testing approach (notebooks, manual runs, scripts). Do not
  create a `tests/` directory without a request.
- No success claims without fresh evidence. Before saying "done", "fixed" or
  "passes", run the command that proves it in this turn, read the full output
  and exit code, and state the claim together with that result. "Should work",
  "probably" and "looks correct" are not evidence. A passing linter does not
  prove the build, and a changed file does not prove the bug is fixed.
- A subagent's report ("done", "tests pass") is a claim, not evidence. After a
  coding or review agent reports, check `git diff` / `git status` and re-run
  the key command yourself before relaying the result to me.
- At the end of a complex task - a short report: what was done, how it was
  verified (command and result), what is left / not done and why.

## Learning

I am learning through these tasks, especially in personal projects. After an
error, add how to avoid it next time. Name the commands, flags and APIs you
used so I remember them. In personal projects, when a concept is likely
unfamiliar, explain it and show alternatives with pros and cons instead of just
inserting code.
