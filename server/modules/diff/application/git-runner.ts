export interface DiffGitRunner {
  discardFileChanges(repositoryPath: string, filePath: string): Promise<void>;

  getAddedFileDiff(repositoryPath: string, filePath: string): Promise<string[]>;

  getCommitDiff(repositoryPath: string, commitHash: string): Promise<string[]>;

  getFileDiff(
    repositoryPath: string,
    filePath: string,
    staged: boolean,
  ): Promise<string>;

  getFilePatch(
    repositoryPath: string,
    filePath: string,
    staged: boolean,
  ): Promise<string>;

  getFileNumStats(
    repositoryPath: string,
    filePath: string,
    staged: boolean,
  ): Promise<string>;

  getHeadFileContents(
    branchName: string,
    remoteName: string,
    repositoryPath: string,
    filePath: string,
  ): Promise<string>;

  getRepoDiff(repositoryPath: string, staged: boolean): Promise<string>;

  getRepoStatus(repositoryPath: string): Promise<string[]>;

  getStagedFileByName(
    repositoryPath: string,
    filePath: string,
  ): Promise<string[]>;

  stageFile(repositoryPath: string, filePath: string): Promise<void>;

  stageFiles(repositoryPath: string): Promise<void>;

  stashFiles(repositoryPath: string): Promise<void>;

  unstageFile(repositoryPath: string, filePath: string): Promise<void>;
}
