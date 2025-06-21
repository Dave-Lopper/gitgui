import { RepositoryReferences } from "../dto/reference.js";
import { Branch } from "./branch.js";

export function getRepositoryNameFromRemoteUrl(remoteUrl: string) {
  remoteUrl = remoteUrl.trim().replace(/\.git$/, "");

  if (remoteUrl.includes("@") && remoteUrl.includes(":")) {
    const parts = remoteUrl.split(":");
    if (parts.length === 2) {
      return parts[1].split("/").pop();
    }
  }

  try {
    const url = new URL(remoteUrl);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments[segments.length - 1];
  } catch (e) {
    const parts = remoteUrl.split("/");
    return parts[parts.length - 1];
  }
}

export function dedupRefs(
  currentBranch: string,
  refs: RepositoryReferences,
): Branch[] {
  const branchesMap = new Map<string, Branch>();

  for (let i = 0; i < refs.remote.length; i++) {
    const ref = refs.remote[i];

    branchesMap.set(ref.name, {
      isCurrent: ref.name === currentBranch,
      isLocal: false,
      name: ref.name,
      remote: ref.remoteName,
    });
  }

  for (let j = 0; j < refs.local.length; j++) {
    const ref = refs.remote[j];

    if (branchesMap.has(ref.name)) {
      const existingBranch = branchesMap.get(ref.name)!;

      existingBranch.isLocal = true;
      branchesMap.set(ref.name, existingBranch);
    } else {
      branchesMap.set(ref.name, {
        isCurrent: ref.name === currentBranch,
        isLocal: true,
        name: ref.name,
        remote: undefined,
      });
    }
  }

  return Array.from(branchesMap.values());
}
