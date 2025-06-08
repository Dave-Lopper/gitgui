import { Branch } from "../domain/branch.js";
import { ChangedFile } from "../domain/changed-file.js";
import { RepositoryReferences } from "../dto/reference.js";
import { Remote } from "../dto/remote.js";

export interface GitRunner {
  cloneRepository(url: string, path: string): Promise<string>;

  isValidRepository(path: string): Promise<boolean>;

  getCurrentRemote(path: string): Promise<Remote>;

  getCurrentBranch(path: string): Promise<string>;

  getFileDiff(filePath: string, repositoryPath: string): Promise<void>;

  getModifiedFiles(path: string): Promise<ChangedFile[]>;

  listRefs(path: string): Promise<RepositoryReferences>;
}
