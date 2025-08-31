export interface DiffGitRunner {
  getCommitDiff(repositoryPath: string, commitHash: string): Promise<string[]>;

  getRepoDiff(repositoryPath: string, staged: boolean): Promise<string[]>;
}
