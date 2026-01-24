import { IGitService } from "../application/i-git-service";
import { Branch } from "../domain/branch";
import { Commit, CommitStatus } from "../domain/commit";
import { DiffEntry, DiffRepresentation } from "../domain/diff";
import { FileStatus, StatusEntry } from "../domain/status";
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

  async checkoutBranch(
    repositoryPath: string,
    branch: Branch,
  ): Promise<boolean> {
    return await window.electronAPI.checkoutBranch(
      repositoryPath,
      branch.name,
      branch.remote,
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

  async getCommitFileDiff(
    repositoryPath: string,
    commitHash: string,
    filePath: string,
  ): Promise<DiffEntry<DiffRepresentation>> {
    return await window.electronAPI.getCommitFileDiff(
      repositoryPath,
      commitHash,
      filePath,
    );
  }

  async getCommitStatus(
    repositoryPath: string,
    commitHash: string,
  ): Promise<StatusEntry[]> {
    return await window.electronAPI.getCommitStatus(repositoryPath, commitHash);
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

  async getTreeFileDiff(
    repositoryPath: string,
    filePath: string,
    currentBranchName: string,
    remoteName: string,
    staged: boolean,
    status: FileStatus,
  ): Promise<DiffEntry<DiffRepresentation>> {
    return await window.electronAPI.getTreeFileDiff(
      repositoryPath,
      filePath,
      currentBranchName,
      remoteName,
      staged,
      status,
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

  async stageAndStash(repositoryPath: string): Promise<void> {
    await window.electronAPI.stageAndStash(repositoryPath);
  }

  async toggleFilesStaged(
    repositoryPath: string,
    filePaths: string[],
  ): Promise<void> {
    await window.electronAPI.toggleFilesStaged(repositoryPath, filePaths);
  }
}
