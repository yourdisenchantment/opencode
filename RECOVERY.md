# opencode recovery notes

Not loaded into sessions. The agent reads this file only when opencode fails to
start because of a broken config, `AGENTS.md`, `RULES.md`, or plugin, and tells me which
variable to try. The agent never sets these itself.

| Env var | Effect |
| --- | --- |
| `OPENCODE_DISABLE_PROJECT_CONFIG=1` | Skip the project's local config and start from globals only. Use to fix a broken local config from inside opencode. |
| `OPENCODE_CONFIG=/path/to/file.json` | Load an additional explicit config file, merged on top of normal precedence. |
| `OPENCODE_CONFIG_CONTENT='{...}'` | Inject inline JSON as a final local-scope merge. For one-off overrides. |
| `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1` | Skip scanning `~/.claude/skills/`. |

Checked against the V2 source (2026-10-28): the four variables above exist.
These were in the old notes but were not found in the V2 source, so they may be
V1-only. Verify before relying on them:

- `OPENCODE_DISABLE_DEFAULT_PLUGINS=1` - skip built-in default plugins.
- `OPENCODE_PURE=1` - skip external plugins.
- `OPENCODE_DISABLE_EXTERNAL_SKILLS=1` - skip `~/.claude/skills/` and
  `~/.agents/skills/`.

After any config change, quit and restart opencode: running sessions keep the
config they already loaded.
