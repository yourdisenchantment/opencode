---
description: Show the user's opencode config structure - list of agents, commands, skills, plus opencode.jsonc, cli.json, AGENTS.md, CORE.md, RULES.md. With an argument, print the named file in full.
---

Print a documentation snapshot of the opencode config that the user keeps
under `~/.config/opencode/`.

## Without arguments

Print a structured listing of everything in the config. Use the `read`,
`glob`, and `grep` tools to walk the directory and pull the `description` /
`name` frontmatter from each file.

Show:

1. **Top-level files** - one line per file with a one-line summary of its
   purpose:
   - `opencode.jsonc` - main config (permission rules, MCP servers, etc.)
   - `cli.json` - client/TUI settings (theme, scroll, mouse, attention)
   - `AGENTS.md` - opencode-specific global rules loaded into every session
   - `CORE.md` - general rules for any task (Russian), loaded via `instructions`
   - `RULES.md` - coding layer on top of `CORE.md`, loaded via `instructions`

2. **Subagents** (from `agents/<name>.md`) - name + `description` from
   frontmatter + 1-line summary of what the agent does.

3. **Slash-commands** (from `commands/<name>.md`) - name + `description` from
   frontmatter. If `subagent` is set in frontmatter, note that the command
   runs in a subagent.

4. **Skills** (from `skills/<name>/SKILL.md`) - name + `description` from
   frontmatter.

5. **MCP servers** - read `opencode.jsonc`, list the keys of the `mcp`
   object, with a one-line summary of what each one does (the URL hints at
   the provider).

6. **Custom themes** - list files in `themes/`, if any.

Format the listing as a clean markdown table or a grouped bullet list. Keep
it scannable - one line per item, no full file dumps here.

End with a pointer: "To see a specific file in full, run `/docs <name>` -
for example `/docs commit` for `commands/commit.md`, or
`/docs handoff` for `skills/handoff/SKILL.md`."

## With an argument

The user typed `/docs <something>`. Resolve `<something>` to a file path
under `~/.config/opencode/`.
Use a case-insensitive prefix match against:

- Command name -> `commands/<name>.md`
- Skill name -> `skills/<name>/SKILL.md`
- Subagent name -> `agents/<name>.md`
- Top-level file aliases: `opencode.jsonc`, `cli.json`, `agents`, `commands`,
  `skills`, `themes`, `mcp`, `permissions` -> show the relevant file(s) or
  the matching key in `opencode.jsonc`.
- If `<something>` matches a `description` substring in frontmatter, list
  the candidates and ask the user to disambiguate.

Once resolved, `read` the file and print it in full, with the file path as
a header. Do not summarize - the user asked for the file.

If nothing matches, list the available names (commands, skills, subagents)
and stop.

$1
