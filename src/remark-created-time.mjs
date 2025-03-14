import { execSync } from "child_process"

export function remarkCreatedTime() {
  return function (tree, file) {
    const filepath = file.history[0]
    const result = execSync(
      `git log --pretty="format:%cI" "${filepath}" | tail -1`,
    )
    file.data.astro.frontmatter.created = result.toString()
  }
}
