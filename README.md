# opencode config

Personal global configuration for opencode, kept in git to track changes between
opencode releases. It lives in `~/.config/opencode/`.

## Layout

| Path | What it is |
| --- | --- |
| `opencode.jsonc` | Main config: provider policy, permission rules, MCP servers, experimental flags |
| `cli.json` | Client settings: theme, mouse, scroll, attention sounds |
| `CORE.md` | General rules for any task, in Russian (single source for Claude Code, opencode and chats) |
| `RULES.md` | Coding layer on top of `CORE.md`: code style, hard constraints, git, verification |
| `AGENTS.md` | opencode-specific part: how rules are enforced, subagents, commands, workflow |
| `agents/` | Subagents: `coder`, `reviewer`, `commit-collector` |
| `commands/` | Slash commands (`/verify`, `/review`, `/commit`, ...) |
| `skills/` | Skills loaded on demand (`debugging`, `commit-message`, ...) |
| `RECOVERY.md` | Env vars for recovering from a config that will not start; not loaded into sessions |
| `scripts/check.ts` | Read-only sanity check of this folder |

## Not tracked (see `.gitignore`)

- `service.json` holds the credential of the local background server. Never
  commit it.
- `node_modules/`, `package.json` and lockfiles are created by opencode for
  plugins.

## Working on this config

- Restart opencode after a change; running sessions keep the config they loaded.
- Agent rules are appended after the global permission rules and the last match
  wins, so agents list only deviations. A blanket `allow` there lifts every
  global `deny`.
- The `chrome-devtools` MCP server is pinned to a version in `opencode.jsonc`.
  Bump it on purpose when you want a newer one.

## Setting up on another machine

1. Clone this repository into `~/.config/opencode/`.
2. Export `CONTEXT7_API_KEY` and `KEENABLE_API_KEY` (referenced from
   `opencode.jsonc` as `{env:NAME}`). An unset variable becomes an empty header;
   whether the `keenable` server still works without its key is unverified.
3. Start opencode; it creates `service.json` itself.
4. Run `bun scripts/check.ts`.
