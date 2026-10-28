---
name: test-runner
description: Runs tests for modified files after edits. Use after edit/write when code with tests was changed.
---

Run the tests relevant to the modified files (find them with
`git status --short` if the list is not already in context). Skip if only
documentation or non-logic configs changed.

1. Prefer the project's own test command (`package.json` scripts,
   `pyproject.toml`, `Makefile`, CI config). Otherwise detect the stack and test
   runner:
   - Python (uv): `uv run pytest <paths>` or `uv run pytest`
   - Python (pip/poetry): `pytest <paths>` or `pytest`
   - Node: `npm test -- <paths>` or `pnpm test -- <paths>`
   - Rust: `cargo test`
   - Go: `go test ./...`
2. Run only on the modified files/packages where possible (faster).
3. If everything is green - report briefly, with the command and the result
   (pass/skip counts, exit code). Do not create a `tests/` directory or invent a
   test setup if the project has none; say so instead.
4. If something failed - show the failing assertions and suggest a fix, but do
   NOT edit yourself (that is `@coder`'s job).
