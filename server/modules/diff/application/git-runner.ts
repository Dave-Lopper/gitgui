export interface DiffGitRunner {
  discardFileChanges(repositoryPath: string, filePath: string): Promise<void>;

  getCommitDiff(repositoryPath: string, commitHash: string): Promise<string[]>;

  getRepoDiff(repositoryPath: string, staged: boolean): Promise<string[]>;

  getStagedFileByName(
    repositoryPath: string,
    filePath: string,
  ): Promise<string[]>;

  stageFile(repositoryPath: string, filePath: string): Promise<void>;

  unstageFile(repositoryPath: string, filePath: string): Promise<void>;
}
