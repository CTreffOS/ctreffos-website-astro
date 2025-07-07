import { execSync } from "child_process";
import { statSync } from "fs";

export function remarkModifiedTime() {
  return function (tree, file) {
    const filepath = file.history[0];
    const gitresult = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`).toString();
    const fsresult = statSync(filepath).mtime.toISOString();
    file.data.astro.frontmatter.lastModified = gitresult ?? fsresult;
  }
}
