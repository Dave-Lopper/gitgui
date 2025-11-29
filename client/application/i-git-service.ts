import { Branch } from "../domain/branch";
import { Commit, CommitStatus } from "../domain/commit";
import { DiffEntry } from "../domain/diff";
import { StatusEntry } from "../domain/status";
import { HistoryPaginationDto } from "../dto/history-pagination";
import { RepositorySelectionDto } from "../dto/repo-selection";

export interface IGitService {
  addToGitignore(repositoryPath: string, filePaths: string[]): Promise<void>;

  authenticate(
    password: string,
    repositoryPath: string,
    username: string,
  ): Promise<boolean>;

  batchAddToGitignore(repositoryPath: string, extension: string): Promise<void>;

  batchDiscardFileModifications(
    repositoryPath: string,
    filePaths: string[],
  ): Promise<void>;

  checkoutBranch(repositoryBranch: string, branch: Branch): Promise<boolean>;

  commit(
    repositoryPath: string,
    message: string,
    description?: string,
  ): Promise<Commit>;

  clone(url: string): Promise<RepositorySelectionDto>;

  fetch(repositoryPath: string): Promise<CommitStatus>;

  getCommitFileDiff(
    repositoryPath: string,
    commitHash: string,
    filePath: string,
  ): Promise<DiffEntry>;

  getCommitStatus(
    repositoryPath: string,
    commitHash: string,
  ): Promise<StatusEntry[]>;

  getHistory(
    page: number,
    pageSize: number,
    repositoryPath: string,
  ): Promise<HistoryPaginationDto>;

  getTreeFileDiff(
    repositoryPath: string,
    filePath: string,
    staged: boolean,
  ): Promise<DiffEntry>;

  pull(repositoryPath: string): Promise<void>;

  push(repositoryPath: string): Promise<void>;

  selectRepoFromDisk(): Promise<RepositorySelectionDto>;

  selectRepoFromSaved(repositoryPath: string): Promise<RepositorySelectionDto>;

  stageAndStash(repositoryPath: string): Promise<void>;

  toggleFilesStaged(repositoryPath: string, filePaths: string[]): Promise<void>;
}
