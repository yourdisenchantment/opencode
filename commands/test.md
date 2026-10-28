---
description: Run tests for a given file or the whole project and collect the result.
agent: build
subagent: false
---

## Context

If the user passed a path or pattern after `/test` - work on it, otherwise
on the whole project.

Arguments: $ARGUMENTS

## Task

1. Determine the project stack and the test command:
   - Python (uv/pytest): `uv run pytest`
   - Python (pip/poetry): `pytest`
   - Node: `npm test` or `pnpm test`
   - Rust: `cargo test`
   - Go: `go test ./...`
2. Run tests with a reasonable timeout.
3. If tests fail - show the failing assertions and the most likely cause.
4. If they fail flakily - rerun once, mark as flaky.

Do not edit code unless asked. Run + report only.