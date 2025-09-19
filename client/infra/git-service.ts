import { IGitService } from "../application/i-git-service";
import { Commit } from "../domain/commit";
import { DiffFile, DiffFileStatus } from "../domain/diff";
import { RepositorySelectionDto } from "../dto/repo-selection";

export class GitService implements IGitService {
  async clone(url: string): Promise<RepositorySelectionDto> {
    const results = await window.electronAPI.cloneRepository(url);
    if (!results.success) {
      throw new Error(results.message);
    }
    return results.data;
  }

  async commit(
    message: string,
    description: string,
    repositoryPath: string,
  ): Promise<Commit> {
    const result = await window.electronAPI.commit(
      message,
      description,
      repositoryPath,
    );
    if (!result.success) {
      throw new Error(result.message);
    }
    return result.data;
  }

  async getHistory(
    page: number,
    pageSize: number,
    repositoryPath: string,
  ): Promise<Commit[]> {
    return await window.electronAPI.getHistory(page, pageSize, repositoryPath);
  }

  async refreshRepoDiff(repositoryPath: string): Promise<DiffFile[]> {
    return await window.electronAPI.refreshRepoDiff(repositoryPath);
  }

  async selectRepoFromDisk(): Promise<RepositorySelectionDto> {
    const result = await window.electronAPI.selectRepositoryFromDisk();
    if (!result.success) {
      throw new Error(result.message);
    }
    return result.data;
  }

  async selectRepoFromSaved(
    repositoryPath: string,
  ): Promise<RepositorySelectionDto> {
    const result =
      await window.electronAPI.selectRepositoryFromSaved(repositoryPath);
    if (!result.success) {
      throw new Error(result.message);
    }
    return result.data;
  }

  async toggleFilesStaged(
    repositoryPath: string,
    filePaths: string[],
  ): Promise<void> {
    await window.electronAPI.toggleFilesStaged(repositoryPath, filePaths);
  }
}
