import { execSync } from "child_process";
import { statSync } from "fs";

export function remarkCreatedTime() {
  return function (tree, file) {
    const filepath = file.history[0];
    const gitresult = execSync(`git log --pretty="format:%cI" "${filepath}" | tail -1`).toString();
    const fsresult = statSync(filepath).birthtime.toISOString();
    file.data.astro.frontmatter.created = gitresult ?? fsresult;
  }
}
