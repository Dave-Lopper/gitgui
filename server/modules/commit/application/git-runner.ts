import { HeadHashesDto } from "../dto/head-hashes.js";

export interface CommitGitRunner {
  commit(repositoryPath: string, message: string): Promise<void>;

  getCommitDiff(repositoryPath: string, commitHash: string): Promise<string[]>;

  getCommitFileDiff(
    repositoryPath: string,
    commitHash: string,
    filePath: string,
  ): Promise<string>;

  getCommitfilePatch(
    repositoryPath: string,
    commitHash: string,
    filePath: string,
  ): Promise<string>;

  getCommitFileStats(
    repositoryPath: string,
    commitHash: string,
    filePath: string,
  ): Promise<string[]>;

  getCommitFiles(repositoryPath: string, commitHash: string): Promise<string[]>;

  getTreeStatus(repositoryPath: string): Promise<string[]>;

  getCommitsCount(repositoryPath: string): Promise<string[]>;

  getHeadHashes(repositoryPath: string): Promise<HeadHashesDto>;

  getHistory(
    repositoryPath: string,
    page: number,
    pageSize: number,
  ): Promise<string[]>;
}
