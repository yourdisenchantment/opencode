// Read-only sanity check of this opencode config. Run from this folder:
//   bun scripts/check.ts
// Exits with code 1 when it finds a problem. It never writes or runs anything else.
import path from "path"

const root = path.resolve(import.meta.dir, "..")
const problems: string[] = []
const warnings: string[] = []
const problem = (message: string) => problems.push(message)

// Third-party skills may legitimately quote typographic characters.
const asciiSkip = ["skills/stop-slop/"]
const effects = ["allow", "deny", "ask"]
const builtinAgents = ["explore", "general", "build", "plan"]
const builtinCommands = ["init"]

const files = (pattern: string) => Array.fromAsync(new Bun.Glob(pattern).scan({ cwd: root, dot: false }))
const text = (file: string) => Bun.file(path.join(root, file)).text()

function frontmatter(file: string, content: string) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(content)
  if (!match) return problem(`${file}: missing frontmatter`)
  return Bun.YAML.parse(match[1]) as Record<string, unknown>
}

function checkRules(file: string, rules: unknown) {
  if (!Array.isArray(rules)) return problem(`${file}: permissions is not a list`)
  rules.forEach((rule, index) => {
    const ok =
      typeof rule?.action === "string" && typeof rule?.resource === "string" && effects.includes(rule?.effect)
    if (!ok) problem(`${file}: permission rule #${index + 1} is malformed: ${JSON.stringify(rule)}`)
  })
}

// 1. JSON configs parse and their permission rules are well formed.
const jsonc = Bun.JSONC.parse(await text("opencode.jsonc")) as Record<string, any>
checkRules("opencode.jsonc", jsonc.permissions)
Bun.JSONC.parse(await text("cli.json"))
// Extra instruction files must exist; `~` is expanded the way opencode expands it.
await Promise.all(
  (jsonc.instructions ?? []).map(async (entry: string) => {
    const file = entry.startsWith("~/") ? path.join(process.env.HOME ?? "", entry.slice(2)) : entry
    if (!(await Bun.file(file).exists())) problem(`opencode.jsonc: instructions file not found: ${entry}`)
  }),
)
Object.entries(jsonc.mcp?.servers ?? {}).forEach(([name, server]: [string, any]) => {
  if (JSON.stringify(server.command ?? "").includes("@latest")) warnings.push(`mcp ${name}: unpinned @latest`)
})

// 2. Frontmatter of agents, commands and skills.
const agents = await files("agents/*.md")
const commands = await files("commands/*.md")
const skills = await files("skills/*/SKILL.md")
const agentNames = agents.map((file) => path.basename(file, ".md"))
const commandNames = commands.map((file) => path.basename(file, ".md"))
const skillNames = skills.map((file) => path.basename(path.dirname(file)))

await Promise.all(
  [...agents, ...commands, ...skills].map(async (file) => {
    const data = frontmatter(file, await text(file))
    if (!data) return
    if (typeof data.description !== "string" || !data.description) problem(`${file}: description is missing`)
    if (file.startsWith("skills/") && data.name !== path.basename(path.dirname(file)))
      problem(`${file}: name "${data.name}" does not match the folder`)
    if (file.startsWith("agents/")) {
      if (!["subagent", "primary", "all"].includes(String(data.mode))) problem(`${file}: bad mode "${data.mode}"`)
      if (data.permissions !== undefined) checkRules(file, data.permissions)
    }
    if (file.startsWith("commands/")) {
      if (data.subagent !== undefined && typeof data.subagent !== "boolean") problem(`${file}: subagent must be true or false`)
      if (data.agent !== undefined && ![...agentNames, ...builtinAgents].includes(String(data.agent)))
        problem(`${file}: unknown agent "${data.agent}"`)
    }
  }),
)

// 3. Text hygiene: ASCII plus Russian letters, no yo, no unfilled placeholders.
const allowed = /[\x00-\x7FЀЂ-ѐђ-ӿ]/
const textFiles = (await Promise.all(["*.md", "*.json", "*.jsonc", "*/*.md", "*/*/*.md", "*/*/*/*.md"].map(files))).flat()
await Promise.all(
  textFiles
    .filter((file) => !asciiSkip.some((skip) => file.startsWith(skip)))
    .map(async (file) => {
      const content = await text(file)
      content.split("\n").forEach((line, index) => {
        const bad = [...line].find((char) => !allowed.test(char))
        if (bad) problem(`${file}:${index + 1}: character U+${bad.codePointAt(0)!.toString(16).toUpperCase()} is not allowed`)
      })
      if (/PINNED_VERSION|TODO:|FIXME/.test(content)) problem(`${file}: unfilled placeholder`)
    }),
)

// 4. References between the pieces resolve.
const referencing = [...agents, ...commands, ...skills, "AGENTS.md", "RULES.md"]
await Promise.all(
  referencing.map(async (file) => {
    const content = await text(file)
    for (const match of content.matchAll(/`([a-z][a-z0-9-]*)` skill/g))
      if (!skillNames.includes(match[1])) problem(`${file}: unknown skill "${match[1]}"`)
    for (const match of content.matchAll(/`@([a-z][a-z0-9-]*)`|(?<![\w`/])@([a-z][a-z0-9-]*)\b/g)) {
      const name = match[1] ?? match[2]
      if (!agentNames.includes(name) && !builtinAgents.includes(name)) problem(`${file}: unknown agent "@${name}"`)
    }
    if (file === "AGENTS.md")
      for (const match of content.matchAll(/`\/([a-z][a-z0-9-]*)`/g))
        if (!commandNames.includes(match[1]) && !builtinCommands.includes(match[1]))
          problem(`${file}: unknown command "/${match[1]}"`)
  }),
)

// 5. The local server credential must stay out of git.
const gitignore = await text(".gitignore")
if (!gitignore.split("\n").includes("service.json")) problem(".gitignore: service.json is not ignored")
if (gitignore.split("\n").includes(".gitignore")) problem(".gitignore: ignores itself")

warnings.forEach((warning) => console.log(`warn  ${warning}`))
problems.forEach((entry) => console.log(`FAIL  ${entry}`))
console.log(
  problems.length === 0
    ? `ok: ${agents.length} agents, ${commands.length} commands, ${skills.length} skills checked`
    : `${problems.length} problem(s)`,
)
process.exit(problems.length === 0 ? 0 : 1)
