import { Commit } from "../domain/commit";
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

  selectRepoFromDisk(): Promise<RepositorySelectionDto>;

  selectRepoFromSaved(repositoryPath: string): Promise<RepositorySelectionDto>;
}
