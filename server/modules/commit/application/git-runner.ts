import { HeadHashesDto } from "../dto/head-hashes.js";

export interface CommitGitRunner {
  commit(repositoryPath: string, message: string): Promise<void>;

  getCommitDiff(repositoryPath: string, commitHash: string): Promise<string[]>;

  getCommitStatus(repositoryPath: string): Promise<string[]>;

  getCommitsCount(repositoryPath: string): Promise<string[]>;

  getHeadHashes(repositoryPath: string): Promise<HeadHashesDto>;

  getHistory(
    repositoryPath: string,
    page: number,
    pageSize: number,
  ): Promise<string[]>;
}
