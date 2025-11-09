export interface GitStatusRunner {
  getRepoStatus(repositoryPath: string): Promise<string[]>;

  getCommitStatus(
    repositoryPath: string,
    commitHash: string,
  ): Promise<string[]>;
}
