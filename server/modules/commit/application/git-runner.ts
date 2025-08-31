export interface CommitGitRunner {
  getHistory(
    repositoryPath: string,
    page: number,
    pageSize: number,
  ): Promise<string[]>;

  getCommitDiff(repositoryPath: string, commitHash: string): Promise<string[]>;
}
