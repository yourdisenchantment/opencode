# Global opencode rules

The opencode-specific part of my personal rules. The tool-independent rules are
in this folder and are loaded through `instructions` in `opencode.jsonc`:
`CORE.md` (language, answer style, general principles, honesty, errors, when to
ask - for any task) and `RULES.md` (the coding layer: code style, hard
constraints, git, verification, review feedback). Applied to all sessions
unless the project has its own `AGENTS.md` (then the project file is additive,
not a replacement).

---

## How the rules are enforced here

The full permission policy lives in `~/.config/opencode/opencode.jsonc` under
`permissions` (ordered rules, the last match wins). `RULES.md` states what I
agree on; this is how opencode backs it up:

- Deleting and moving files: `rm`, `rmdir`, `trash`, `unlink`, `shred`,
  `git rm`, `find -delete`, `mv` are `deny`; `cp` and `rsync` are `ask`, `scp`
  is `deny`. Editing through the `edit` tool is the sanctioned way to change
  file contents.
- Outside the project: `external_directory` is `ask`. The agent waits for my
  reply.
- Privileged commands: `sudo`, `su`, `doas` are `deny`.
- Shells: `sh`, `bash`, `zsh`, `fish` are `deny` as a top-level command (the
  matcher splits on `;` `|` `&` `&&` `||`, so `curl ... | sh` is blocked at the
  `sh` part). Use `python3`, `node` or `bun` for scripts.
- Secrets: `.env*`, keys, `~/.ssh`, `~/.aws`, `~/.gcp`, `~/.gnupg`, `.netrc`
  and this folder's `service.json` are `deny`; `*.env.example` is readable.
- Git: read-only commands are allowed, `git push` is `ask`, everything that
  changes repository state and every force push is `deny`.
- Global installs (`npm i -g`, `bun add -g`, `pip install`, ...) are `deny`.

Agent files (`agents/*.md`) are appended after the global rules, so they list
only deviations. The built-in `plan`, `explore` and `general` limits are
restored in the `agents` block of `opencode.jsonc`.

## Working with Tools

- Prefer built-in tools (`read`, `grep`, `glob`, `list`) over `cat`, `grep`,
  `find`, `ls`.
- **Web access** is split:
  - Built-in `webfetch` is `allow` - the agent fetches a URL directly when
    it knows the page (docs, GitHub raw, etc.).
  - Built-in `websearch` is `deny` - web search goes through the
    `keenable` MCP (`keenable_search_web_pages`, `keenable_fetch_page_content`).
    This keeps a single auditable web backend with key-based rate limits.
- For library / framework documentation, use the `context7` MCP tools
  (resolve the library, then query its docs) rather than relying on memory.
- The shell deny list blocks destructive commands; prepare a copy-paste list
  for me instead (see "Hard Constraints" in `RULES.md`).

## Specialized Subagents

Use `@<name>` to invoke. Descriptions and rules live in `agents/<name>.md`.

- **@coder** - implementation by plan. Takes one item at a time, edits code
  strictly within the plan scope, runs linter/stack tests, reports briefly.
  Does not go outside the scope without confirmation.
- **@reviewer** - review after coder. Reads the diff, writes tests, runs
  them, looks for bugs/style/perf/security. Does not edit production code.
- **@commit-collector** - groups the working tree into commits and writes the
  `tmp/commits/` message files. Never runs git.
- Built-in: **@explore** (read-only codebase search), **@general** (multi-step
  tasks); modes `build` (default) and `plan` (read-only, for design talk).

Delegate by size. The main agent orchestrates larger work and does small work
itself. Before editing for a real change, route it:
- Work of three or more plan steps, or edits across several files -> hand it to
  `@coder`, one plan item at a time.
- After a delegated or multi-file change -> `@reviewer` checks it before you
  report it done.
- Broad search across the codebase -> `@explore` (or `@general`).
- A small change (one file or a few lines, one obvious fix) you make yourself,
  and still prove it with the evidence rule in "Verification" (`RULES.md`).
Questions and analysis you can answer directly need no delegation.

Spread the load across the whole toolset - subagents, MCP tools, and skills -
rather than letting one agent carry everything. If a specialized subagent, a
skill, or a command handles a step better, route it there.

### Loop for Complex Tasks

1. The main session drafts `tmp/ROADMAP.md` (the global task list) and pulls one
   item into `tmp/TASK.md` (detailed, one active task).
2. `@coder` implements the task, may add subtasks to `TASK.md`, and writes a
   short report at the bottom (`[~]` -> `[x]`).
3. `@reviewer` checks it and writes findings to `tmp/REVIEW.md` (`[x]` or `[!]`).
   When calling it, hand over precise context - the task from `TASK.md`, the
   requirements, and which files / diff to look at - not the session history.
4. If `[!]` - the findings feed back into `TASK.md` (or a new one) and `@coder`
   runs again.
5. When the item is done, add a short report under it in `tmp/ROADMAP.md`, then
   take the next item. Refresh `tmp/OVERVIEW.md` as a checkpoint at the end of a
   chunk or session (`/checkpoint`).

Use `@commit-collector` (or `/commit`) to turn finished work into commits.

When starting in a new project, run `/init` first (generates the rules file),
then `/bootstrap` (prepares the `tmp/` workspace).

Commands (in `commands/`; suggest the right one when it fits):
- `/task` drafts `tmp/TASK.md`; `/checkpoint` refreshes `tmp/OVERVIEW.md`.
- `/review` runs `@reviewer` on the changes; `/verify` runs the whole lint,
  typecheck, test and build chain; `/lint` and `/test` check the modified files.
- `/commit` prepares commits; `/pr` drafts a PR description.
- `/docs` lists this config; `/learn`, `/rmslop`, `/spellcheck` are helpers.

Session helper files (`ROADMAP.md`, `TASK.md`, `REVIEW.md`, `OVERVIEW.md`,
`commits/`) live in `tmp/` (gitignored, survive across sessions); the
`workspace-docs` skill defines their format.

## Recovery

If opencode refuses to start because of a broken config, `AGENTS.md`, `RULES.md`
or plugin, read `~/.config/opencode/RECOVERY.md` for the env vars that help and
tell me which one to try. After any config change I make, remind me to quit and
restart opencode - running sessions keep the config they already loaded.
