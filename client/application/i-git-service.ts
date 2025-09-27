import { Commit } from "../domain/commit";
import { RepositorySelectionDto } from "../dto/repo-selection";

export interface IGitService {
  addToGitignore(repositoryPath: string, filePaths: string[]): Promise<void>;

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

  getHistory(
    page: number,
    pageSize: number,
    repositoryPath: string,
  ): Promise<Commit[]>;

  selectRepoFromDisk(): Promise<RepositorySelectionDto>;

  selectRepoFromSaved(repositoryPath: string): Promise<RepositorySelectionDto>;

  toggleFilesStaged(repositoryPath: string, filePaths: string[]): Promise<void>;
}
