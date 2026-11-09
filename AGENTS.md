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

The agreements themselves live in `RULES.md` ("Hard Constraints" and the rest).
opencode backs them up with the ordered `permissions` list in
`~/.config/opencode/opencode.jsonc` (last match wins): destructive shell commands,
shells used as interpreters (`sh`/`bash`/...), privileged commands (`sudo`...)
and global installs are denied; secrets are denied for every action; `git push`
and outside-project access are asks. The full mapping is in the config itself -
its comments explain each rule's intent, so go there instead of restating rules
here.

- The `chrome-devtools` MCP server is pinned to a version in `opencode.jsonc`.
  Bump it on purpose when you want a newer one.
- Agent files (`agents/*.md`) are appended after the global rules, so they list
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
   item into `tmp/TASK.md` (detailed, one active task). A plan that deletes,
   migrates, touches infrastructure or auth first runs the `plan-critic`
   skill; its fixes go back into `TASK.md`.
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
- `/task` drafts `tmp/TASK.md`; `/checkpoint` refreshes `tmp/OVERVIEW.md`;
  `/summary` rewrites `tmp/PROJECT.md` - a shareable project brief.
- `/review` runs `@reviewer` on the changes; `/verify` runs the whole lint,
  typecheck, test and build chain; `/lint` and `/test` check the modified files.
- `/commit` prepares commits; `/pr` drafts a PR description; `/handoff` writes
  a handoff document for another agent.
- `/docs` lists this config; `/learn`, `/rmslop`, `/spellcheck` are helpers.

Session helper files (`ROADMAP.md`, `TASK.md`, `REVIEW.md`, `OVERVIEW.md`,
`JOURNAL.md`, `commits/`) live in `tmp/` (gitignored, survive across sessions);
the `workspace-docs` skill defines their format and the `ship-log` skill owns
`JOURNAL.md`.

## Agent Ship's Log

Every project keeps `tmp/JOURNAL.md` (gitignored, survives across sessions).
It is mandatory for every agent:

- Before the first action, read the tail of `tmp/JOURNAL.md` (if it exists)
  and state in one line which entry you are continuing from. Create the file
  on first use if it is missing (header plus the format from the `ship-log`
  skill).
- After every meaningful action, assumption, fact, insight or decision, append
  one entry before reporting to the user. Read-only discovery that taught you
  something counts as meaningful.
- Entries are chronological, append-only, never rewritten; corrections are
  appended as new entries.
- Record the session id in each entry header for traceability.
- See the `ship-log` skill for the full format, examples and the "do not
  write" rules.

The project files `ROADMAP.md`, `TASK.md`, `REVIEW.md`, `OVERVIEW.md` keep
the structured plan; the journal is the continuous narrative counterpart.

## Recovery

If opencode refuses to start because of a broken config, `AGENTS.md`, `RULES.md`
or plugin, read `~/.config/opencode/RECOVERY.md` for the env vars that help and
tell me which one to try. After any config change I make, remind me to quit and
restart opencode - running sessions keep the config they already loaded.
