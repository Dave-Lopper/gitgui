import { execSync } from "child_process";
import fs from "fs";
import path from "path";

async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.promises.access(path);
    return true;
  } catch {
    return false;
  }
}

export const isValidGitRepository = async (
  selectedPath: string,
): Promise<boolean> => {
  const promises = [
    pathExists(path.resolve(selectedPath, ".git")),
    pathExists(path.resolve(selectedPath, ".git", "HEAD")),
    pathExists(path.resolve(selectedPath, ".git", "config")),
  ];
  const results = await Promise.all(promises);
  return !results.includes(false);
};

export const getBranchName = async (repoPath: string) => {
  const headRef = await fs.promises.readFile(
    path.join(repoPath, ".git", "HEAD"),
    "utf-8",
  );

  const branchName = headRef.split("/").pop()?.replace("\n", "");
  if (!branchName) {
    throw new Error(`Couldn't parse branch name from repo ${repoPath}`);
  }
  return branchName;
};

export const getBranchesForRepository = async (
  repositoryPath: string,
  remoteName: string,
): Promise<string[]> => {
  // TODO: Sanitize for command injection
  const rv = execSync(`git ls-remote ${remoteName}`, {
    cwd: repositoryPath,
    encoding: "utf-8",
  });
  console.warn({ rv });
  const lines = rv.split("\n").filter((_) => _);
  const branches: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const splitted = line.split("\t");
    if (splitted.length < 2) {
      console.warn(`Malformed git ls-remote line: ${line}`);
      continue;
    }

    let refName = splitted[1];
    refName = refName.replace("\n", "").trim();
    if (refName.startsWith("refs/heads/")) {
      branches.push(refName.replace("refs/heads/", ""));
    }
  }
  return branches;
};
