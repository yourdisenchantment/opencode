---
name: local-tools
description: "Inventory of CLI utilities installed on this machine (security scanners, quality tools, search and data helpers) with agent usage rules. Use when choosing a local utility instead of hand-rolling one, and before running security scans."
---

Inventory of the CLI utilities installed on this machine and how an agent
should use them. Verify a tool is still present with `command -v <tool>`
before relying on it, and check `<tool> --help` when a flag is in doubt:
inventory entries below drift as tools get upgraded. Do not install anything
(see "Hard Constraints" in RULES.md) - installs are mine, and my package
manager commands run through safe-chain, which blocks known malware packages
and asks for confirmation on suspicious ones.

## Security scanning (you may run these)

- **gitleaks** (8.x): secrets in a worktree or git history.
  `gitleaks detect --source . --redact` scans the history of the repo and
  prints findings with secrets masked; `gitleaks protect --redact` checks
  staged changes only the way a pre-commit hook would. Scan output over full
  history is long: run it, but summarize findings instead of pasting whole
  reports. Writing a report file - only under `tmp/`.
- **osv-scanner** (2.x, with osv-scalibr): known CVEs per lockfiles and
  manifests. `osv-scanner scan -r .` recursive scan; the process exits
  non-zero when findings exist, which is convenient for scripts. The
  `dependency-audit` skill owns the audit workflow; this tool is the machine's
  scanner for it.
- **semgrep** (1.x, uv tool): rule-based code scan.
  `semgrep --config auto <path>` fetches the rule set from the server on each
  run, so a scan is not fully offline; ask me if that matters. Targeted scan
  (`semgrep <path>`) works offline with repo-local or default rules.
- **safe-chain** (1.x): not a scanner for you - it wraps my `npm`, `npx`,
  `pip`, `uv`, `bun`, `pdm` and friends so malware packages are blocked at
  install time. Suggest install commands in plain package-manager form; if a
  safe-chain block fires, report it and stop rather than working around it.

## Python and quality gates

- **ruff**: lint and `format --check` (fast first pass on modified Python).
- **pyright**: typecheck (`pyright <paths>`).
- **pre-commit**: `pre-commit run --files <paths>` on changed files,
  `--all-files` when a repo-wide pass is asked for.
- **commitizen** (`cz`): commit message style checks and `cz` changelog bumps
  for repos that use Conventional Commits or commitizen config.

## Search and data

- **rg**, **fd** for search and file discovery (also available as the agent's
  built-in grep/glob - prefer those, they respect .gitignore).
- **jq** for JSON in pipelines, **bat** for pretty printing, **tree** for a
  quick layout view, **sqlite3** for database poking (read queries only
  unless the task says otherwise).
- **magick** (ImageMagick) for image inspection and conversion in
  image-related tasks.

## Runtimes and runtimes-adjacent

- node (nvm-managed), bun, go, cargo/rustup - present for stack work; pick the
  version the project pins, not the global one.
- uv (with `uv tool list` for user-installed tools: ruff, pyright, semgrep,
  pre-commit, commitizen, ipython).
- ollama - local model server; the agent never starts long-running servers
  (see Hard Constraints), and model calls go through the configured providers.

## Apple fm serve (LAN Mac, http://192.168.1.24:1976)

Apple's own macOS 27 `fm` CLI, Foundation Models. OpenAI-compatible chat at
`http://192.168.1.24:1976/v1`, no auth. Two models:

- `system` - on-device AFM 3, fully local and free, but the window is only
  **4096 tokens** total (prompt framing, schema and question included; one
  image costs a flat ~187 tokens).
- `pcc` - Private Cloud Compute, ~32k window, but it answers only when fm
  serve was started from Terminal.app, and every request spends the
  account's PCC quota (check `GET /health`).

Use it for tasks that need privacy (nothing leaves the machine), run
offline-free, or just cost nothing: summarize or classify a private or bulky
batch of small texts one-shot each, describe a screenshot, draft a commit
message for a small diff. It is not for agent loops: the tool schemas of an
agent session exceed `system`'s window, and `pcc` spends quota. It is beta
software with quirks recorded in the provider config
(`compatibility.streamUsage: false`).

For agent-style summarization inside a session, the main model may offer a
one-step switch to `fm/pcc` for a self-contained formulate / summarize /
plan step; the switch criteria and the offer-first rule live in the global
`AGENTS.md`. `system` is a one-shot curl tool only - never a session model.

Licence note: `fm` requires accepting Apple's FM licence once
(`sudo fm license`), and its clause restricts programmatic access outside
expressly permitted uses - private use on your own network only, never a
product.

### One-shot curl patterns

- Summarize / classify with structured output:

```bash
curl -s http://192.168.1.24:1976/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"system","response_format":{"type":"json_schema",
      "json_schema":{"name":"t","schema":{"type":"object",
      "properties":{"category":{"type":"string"}},"required":["category"]}}},
      "messages":[{"role":"user","content":"..."}]}'
```

- Describe a screenshot (base64 in a data URL):

```bash
curl -s http://192.168.1.24:1976/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"system","messages":[{"role":"user",
      "content":[{"type":"text","text":"What is shown? Any UI errors?"},
                {"type":"image_url","image_url":{"url":"data:image/png;base64,<b64>"}}]}]}'
```

## Agent rules recap

- Scan and inspect freely; they are read-only by design (`gitleaks`/`osv-scanner`/`semgrep` do write nothing outside `tmp/` report output).
- Interactive utilities (`fzf` and friends) are mine, not the agent's.
- Installs, upgrades, `pre-commit install` hook registration - propose
  copy-paste commands, do not run.
