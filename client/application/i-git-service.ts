import { Commit } from "../domain/commit";
import { DiffFile, DiffFileStatus } from "../domain/diff";
import { RepositorySelectionDto } from "../dto/repo-selection";

export interface IGitService {
  commit(
    message: string,
    description: string,
    repositoryPath: string,
  ): Promise<Commit>;

  clone(url: string): Promise<RepositorySelectionDto>;

  getHistory(
    page: number,
    pageSize: number,
    repositoryPath: string,
  ): Promise<Commit[]>;

  refreshRepoDiff(repositoryPath: string): Promise<DiffFile[]>;

  selectRepoFromDisk(): Promise<RepositorySelectionDto>;

  selectRepoFromSaved(repositoryPath: string): Promise<RepositorySelectionDto>;

  toggleFilesStaged(repositoryPath: string, filePaths: string[]): Promise<void>;
}
