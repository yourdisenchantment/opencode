---
name: lint-checker
description: Code-quality pass on modified files - linter, formatter, and basic writing practices. Use before committing or when you suspect style issues.
---

Run a code-quality pass on the modified files (find them with
`git status --short` if the list is not already in context). Skip if only
`.md`/`.txt` or non-code files changed.

## Linter and formatter

Prefer the project's own configured commands (`package.json` scripts,
`pyproject.toml`, `Makefile`, pre-commit config) over the defaults below, scoped
to the modified files where the tool allows it. Otherwise detect the stack and
run on the modified files only:

- Python: `ruff check <paths>` and `ruff format --check <paths>` (or
  `uv run ruff ...`)
- JS/TS: `eslint <paths>` and `prettier --check <paths>`
- Rust: `cargo clippy -- -D warnings` and `cargo fmt --check`
- Go: `golangci-lint run` and `gofmt -l <paths>`

- Show linter errors and suggest a fix, but do NOT edit production code yourself.
- Formatting issues: report them from the check / diff output (`--check`,
  `--diff`). Do not run a formatter that writes files - it can reformat lines
  the task did not touch. Hand over the format command for me to run.
- Report the exact command and its result for each tool (see "Verification" in
  the global `AGENTS.md`). If a tool is missing, say so instead of skipping it
  silently.

## Writing practices

Also flag (do not auto-fix) practice issues per the global `AGENTS.md`:

- Naming that does not say what the thing is; unclear or misleading names.
- Needless complexity - abstractions for a single call site, config nobody asked
  for, error handling for impossible cases.
- Edits that stray outside the task, or reformatting of untouched code.
- Comments/docstrings not in English, or non-ASCII characters (see Code Style).

Report findings grouped as: linter, formatter, practices.
