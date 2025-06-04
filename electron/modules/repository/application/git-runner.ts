import { ChangedFile } from "../domain/changed-file.js";
import { RepositoryRemote } from "../dto/remote.js";

export interface GitRunner {
  cloneRepository(url: string, path: string): Promise<string>;

  isValidRepository(path: string): Promise<boolean>;

  getCurrentRemote(path: string): Promise<RepositoryRemote>;

  getCurrentBranch(path: string): Promise<string>;

  getFileDiff(filePath: string, repositoryPath: string): Promise<void>;

  getModifiedFiles(path: string): Promise<ChangedFile[]>;

  listBranches(path: string, remoteName: string): Promise<string[]>;
}
