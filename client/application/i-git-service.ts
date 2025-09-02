import { Commit } from "../domain/commit";
import { RepositorySelectionDto } from "../dto/repo-selection";

export interface IGitService {
  commit(
    message: string,
    description: string,
    repositoryPath: string,
  ): Promise<Commit>;

  clone(url: string): Promise<RepositorySelectionDto>;

  consultCommitDiff(commitHash: string): Promise<void>;

  getHistory(
    page: number,
    pageSize: number,
    repositoryPath: string,
  ): Promise<Commit[]>;

  selectRepoFromDisk(repositoryPath: string): Promise<RepositorySelectionDto>;

  selectRepoFromSaved(repositoryPath: string): Promise<RepositorySelectionDto>;
}
