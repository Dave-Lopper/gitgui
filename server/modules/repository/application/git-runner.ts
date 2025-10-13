import { Branch, ChangedFile } from "../domain/entities.js";
import { RepositoryReferences } from "../dto/reference.js";
import { Remote } from "../dto/remote.js";

export interface RepositoryGitRunner {
  checkoutBranch(
    branchName: string,
    repositoryPath: string,
    remoteName?: string,
  ): Promise<void>;

  cloneRepository(url: string, path: string): Promise<string>;

  fetch(path: string): Promise<void>;

  getCurrentRemote(path: string): Promise<Remote>;

  getCurrentBranch(path: string): Promise<string>;

  getModifiedFiles(path: string): Promise<ChangedFile[]>;

  isValidRepository(path: string): Promise<boolean>;

  listBranches(path: string, currentBranchName: string): Promise<Branch[]>;

  listRefs(path: string): Promise<RepositoryReferences>;

  pull(path: string): Promise<void>;

  push(path: string): Promise<void>;

  removeCredentials(
    remoteHost: string,
    repositoryPath: string,
    username: string,
  ): Promise<void>;

  storeCredentials(
    password: string,
    remoteHost: string,
    repositoryPath: string,
    username: string,
  ): Promise<void>;

  testCredentials(repositoryPath: string): Promise<boolean>;
}
