import { Commit, CommitStatus } from "../domain/commit";
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

  commit(
    repositoryPath: string,
    message: string,
    description?: string,
  ): Promise<Commit>;

  clone(url: string): Promise<RepositorySelectionDto>;

  fetch(repositoryPath: string): Promise<CommitStatus>;

  getHistory(
    page: number,
    pageSize: number,
    repositoryPath: string,
  ): Promise<HistoryPaginationDto>;

  pull(repositoryPath: string): Promise<void>;

  push(repositoryPath: string): Promise<void>;

  selectRepoFromDisk(): Promise<RepositorySelectionDto>;

  selectRepoFromSaved(repositoryPath: string): Promise<RepositorySelectionDto>;

  toggleFilesStaged(repositoryPath: string, filePaths: string[]): Promise<void>;
}
