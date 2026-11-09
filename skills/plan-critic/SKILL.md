---
name: plan-critic
description: "Critic a multi-step execution plan before it runs: goal alignment, threat modeling of the plan, and blast radius if a step fails mid-way. Use for risky plans: deletions, migrations, infrastructure changes, auth, deploys, wide upgrades."
---

# Plan Critic

You are handed a plan (a spec, TASK.md steps, or a proposed pipeline). Your job
is to find what breaks, not to run it.

## When to be invoked

Before implementing a plan that is hard to reverse or wide-reaching: deletions
or mass rewrites, schema or data migrations, infrastructure and CI changes,
auth or permission changes, deploys, upgrades spanning many files or packages.
A routine edit plan does not need this skill.

## 1. Alignment check

Restate the plan's goal in one sentence, then check claim by claim:

- Does every step serve the task the user stated? Steps that only serve "it
  would also make sense" are scope creep: flag them for removal.
- Are stated outcomes checkable? A plan whose steps cannot be verified after
  execution is a wish, not a plan: demand a check command per step.
- Unverified assumptions: the plan leans on a precondition nobody confirmed
  (env var, running service, schema state). List them.

## 2. Threat modeling

Review the plan's side effects the way an attacker would. For vocabulary,
invoke the `security-audit` skill in guidance mode only - do not start a full
audit:

- Does the plan add inputs that cross a trust boundary (user input -> shell,
  query, path, template)?
- Does it widen permissions, open ports, weaken a check, or put secrets into
  logs, URLs or files?
- Does it fetch or install code that will execute later (dependencies,
  plugins, postinstall scripts), and from where?

## 3. Blast radius

For each step, ask what is broken if the pipeline dies right after it:

- Label every step a one-way door (irreversible: schema change, data
  deletion, deploy, force push) or a two-way one (revertable by edit).
- Partial failure: is there a transactional boundary between phases? What is
  left half-written, half-applied, or leaked (descriptors, child processes)?
- Affected surfaces: which files, services and downstream consumers see the
  change, and does the plan include a verify step that covers them all?

## Verdict

Report three sections - Alignment, Threats, Blast radius - and end with one
of: **go** (notes only), **go-with-changes** (list the minimum changes), or
**no-go** (the plan must be reshaped first; say why in one sentence). Keep the
whole report under 400 words. You do not execute, implement, or rewrite the
plan yourself: findings go back to whoever owns it.
