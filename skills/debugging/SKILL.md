---
name: debugging
description: Root-cause debugging process. Use for any bug, test failure, build failure or unexpected behavior, before proposing or making a fix - especially when a quick fix looks obvious or a previous fix did not work.
---

Find the root cause before changing code. A fix that only hides the symptom is
not a fix. No fix until phase 1 is done.

This skill never commits, pushes, or deletes anything. Git and file removal stay
with the user.

## 1. Investigate

- Read the full error and stack trace. Note file paths, line numbers, codes.
- Reproduce it reliably and write down the exact steps. If it is not
  reproducible, gather more data instead of guessing.
- Check what changed recently: `git diff`, `git log`, dependencies, config,
  environment.
- In a multi-component system (CI -> build -> script, API -> service -> DB), log
  what enters and leaves each boundary once, and find which layer breaks before
  touching any of them.
- Deep in a call stack: trace the bad value backward to where it originates and
  fix it there, not where it surfaces.

## 2. Compare

- Find similar code that works in the same codebase and list every difference
  from the broken one, however small.
- When following a reference or documented pattern, read it completely. Check
  library behavior with the `context7` MCP instead of assuming.

## 3. Hypothesize and test

- State one hypothesis: "X is the root cause because Y".
- Test it with the smallest possible change, one variable at a time. Do not
  stack several fixes.
- Wrong? Form a new hypothesis from what you learned. Do not add more changes on
  top of the failed one.
- If you do not understand something, say so instead of pretending.

## 4. Fix

- Have a reproduction first: an automated test if the project has a test setup,
  otherwise a small script. If a proper failing test is needed, ask `@reviewer`
  to write it - `@coder` does not write tests.
- One change that addresses the root cause. No "while I am here" cleanup, no
  bundled refactoring.
- Prove it: the original reproduction now passes and nothing else broke. Show
  the command and its output (see "Verification" in AGENTS.md).

## Three failed fixes

If three fixes in a row failed, or each fix exposes a new problem elsewhere,
stop. This is probably an architecture problem, not a bad hypothesis. Report
what was tried and what each attempt showed, then discuss with me before a
fourth attempt.

## Stop signs

Return to phase 1 if you catch yourself thinking: "quick fix now, investigate
later", "just try changing X", "it is probably X", "one more attempt" after two
failures, or proposing a fix before tracing the data flow.

If the investigation shows the cause is environmental, timing-dependent or
external, say so, document what you checked, and propose handling (retry,
timeout, clearer error, logging).
