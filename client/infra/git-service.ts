import { IGitService } from "../application/i-git-service";
import { Commit, CommitStatus } from "../domain/commit";
import { HistoryPaginationDto } from "../dto/history-pagination";
import { RepositorySelectionDto } from "../dto/repo-selection";

export class GitService implements IGitService {
  async addToGitignore(
    repositoryPath: string,
    filePaths: string[],
  ): Promise<void> {
    await window.electronAPI.addToGitignore(repositoryPath, filePaths);
  }

  async authenticate(
    password: string,
    repositoryPath: string,
    username: string,
  ): Promise<boolean> {
    return await window.electronAPI.authenticate(
      password,
      repositoryPath,
      username,
    );
  }

  async batchAddToGitignore(
    repositoryPath: string,
    extension: string,
  ): Promise<void> {
    await window.electronAPI.batchAddToGitignore(repositoryPath, extension);
  }

  async batchDiscardFileModifications(
    repositoryPath: string,
    filePaths: string[],
  ): Promise<void> {
    await window.electronAPI.batchDiscardFileModifications(
      repositoryPath,
      filePaths,
    );
  }

  async clone(url: string): Promise<RepositorySelectionDto> {
    const results = await window.electronAPI.cloneRepository(url);
    if (!results.success) {
      throw new Error(results.message);
    }
    return results.data;
  }

  async commit(
    repositoryPath: string,
    message: string,
    description?: string,
  ): Promise<Commit> {
    return await window.electronAPI.commit(
      repositoryPath,
      message,
      description,
    );
  }

  async fetch(repositoryPath: string): Promise<CommitStatus> {
    return await window.electronAPI.fetch(repositoryPath);
  }

  async getHistory(
    page: number,
    pageSize: number,
    repositoryPath: string,
  ): Promise<HistoryPaginationDto> {
    return await window.electronAPI.getCommitHistory(
      page,
      pageSize,
      repositoryPath,
    );
  }

  async pull(repositoryPath: string): Promise<void> {
    await window.electronAPI.pull(repositoryPath);
  }

  async push(repositoryPath: string): Promise<void> {
    await window.electronAPI.push(repositoryPath);
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
