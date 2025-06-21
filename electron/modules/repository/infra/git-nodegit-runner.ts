// import Git from "nodegit";

// import { GitRunner } from "../application/git-runner";
// import { Remote } from "../dto/remote";
// import { ChangedFile, ModType } from "../domain/changed-file";
// import { Branch } from "../domain/branch";
// import { RepositoryReferences } from "../dto/reference";

// type BranchRemote = {
//   branchName: string;
//   name: string;
//   remoteName: string | undefined;
//   refType: "head" | "remote";
// };

// export class GitNodeGitRunner implements GitRunner {
//   private readonly statusesToModType: { [status: string]: ModType } = {
//     wt_deleted: "REMOVED",
//     wt_modified: "MODIFIED",
//     wt_new: "ADDED",
//   };

//   async cloneRepository(url: string, path: string): Promise<string> {
//     await Git.Clone(url, path);
//     return path;
//   }

//   async isValidRepository(path: string): Promise<boolean> {
//     try {
//       await Git.Repository.open(path);
//       return true;
//     } catch (err) {
//       return false;
//     }
//   }

//   async getCurrentBranch(path: string): Promise<string> {
//     const repo = await Git.Repository.open(path);
//     const branch = await repo.getCurrentBranch();

//     return branch.name();
//   }

//   async getCurrentRemote(path: string): Promise<Remote> {
//     const repo = await Git.Repository.open(path);
//     const remotes = await repo.getRemotes();

//     return { name: remotes[0].name(), url: remotes[0].url() };
//   }

//   async getModifiedFiles(path: string): Promise<ChangedFile[]> {
//     const repo = await Git.Repository.open(path);
//     const fileStatuses = await repo.getStatus();
//     const files: ChangedFile[] = [];

//     for (let i = 0; i < fileStatuses.length; i++) {
//       const fileStatus = fileStatuses[i];
//       const status = fileStatus.status()[0]?.toLowerCase();

//       if (["wt_modified", "wt_deleted", "wt_new"].includes(status)) {
//         files.push({
//           path: fileStatus.path(),
//           modType: this.statusesToModType[status],
//         });
//       }
//     }
//     return files;
//   }

//   async getFileDiff(filePath: string, repositoryPath: string): Promise<void> {}

//   async listBranches(
//     path: string,
//     currentBranchName: string,
//   ): Promise<Branch[]> {
//     const repo = await Git.Repository.open(path);
//     const refs = await repo.getReferences();
//     const branches: Branch[] = [];
//     const cache: { [name: string]: BranchRemote[] } = {};

//     for (let i = 0; i < refs.length; i++) {
//       const ref = refs[i];
//       if (ref.isTag() || ref.isNote() || ref.isSymbolic()) {
//         continue;
//       }
//       let branchName: string;
//       let remoteName: string | undefined = undefined;
//       let refType: "head" | "remote";

//       if (ref.isBranch()) {
//         branchName = ref.name().replace("refs/heads/", "");
//         refType = "head";
//       } else if (ref.isRemote()) {
//         branchName = ref.name().replace("refs/remotes/origin/", "");
//         remoteName = ref.name().split("remotes/").pop()?.split("/")[0];
//         refType = "remote";
//       } else {
//         continue;
//       }

//       if (Object.keys(cache).includes(branchName)) {
//         cache[branchName].push({
//           branchName,
//           name: ref.name(),
//           refType,
//           remoteName,
//         });
//       } else {
//         cache[branchName] = [
//           { branchName, name: ref.name(), refType, remoteName },
//         ];
//       }
//     }

//     const refNames = Object.keys(cache);
//     for (let i = 0; i < refNames.length; i++) {
//       const branchRefs = cache[refNames[i]];

//       if (branchRefs.length === 1) {
//         branches.push({
//           isCurrent: branchRefs[0].branchName === currentBranchName,
//           isLocal: branchRefs[0].refType === "head",
//           name: branchRefs[0].branchName,
//           remote: branchRefs[0].remoteName,
//         });
//       } else {
//         const remoteBranch = branchRefs.find(
//           (branchRef) => branchRef.refType === "remote",
//         );
//         const isLocal =
//           branchRefs.filter((branchRef) => branchRef.refType === "head")
//             .length > 0;

//         branches.push({
//           isCurrent: branchRefs[0].branchName === currentBranchName,
//           isLocal,
//           name: branchRefs[0].branchName,
//           remote: remoteBranch?.remoteName,
//         });
//       }
//     }

//     return branches;
//   }

//   async listRefs(path: string): Promise<RepositoryReferences> {
//     const rv: RepositoryReferences = { local: [], remote: [] };
//     const repo = await Git.Repository.open(path);
//     const refs = await repo.getReferences();

//     for (let i = 0; i < refs.length; i++) {
//       const ref = refs[i];
//       if (ref.isTag() || ref.isNote() || ref.isSymbolic()) {
//         continue;
//       }

//       if (ref.isHead()) {
//         rv.local.push({ name: ref.name().replace("refs/heads/", "") });
//       } else if (ref.isRemote()) {
//         const remoteBranchName = ref.name().split("refs/remotes/").pop();
//         if (!remoteBranchName) {
//           console.warn(`Seemingly malformed remote ref name: ${ref.name()}`);
//           continue;
//         }

//         const remoteBranchNameParts = remoteBranchName.split("/");
//         const remoteName = remoteBranchNameParts.shift();
//         const branchName = remoteBranchNameParts.join("/");
//         if (!remoteName || !branchName) {
//           console.warn(`Seemingly malformed remote ref name: ${ref.name()}`);
//           continue;
//         }

//         rv.remote.push({ name: branchName, remoteName });
//       }
//     }
//     return rv;
//   }
// }
