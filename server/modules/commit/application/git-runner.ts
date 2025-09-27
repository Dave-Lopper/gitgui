import { HeadHashesDto } from "../../dto";

export interface CommitGitRunner {
  commit(repositoryPath: string, message: string): Promise<void>;

  getHeadHashes(repositoryPath: string): Promise<HeadHashesDto>;

  getHistory(
    repositoryPath: string,
    page: number,
    pageSize: number,
  ): Promise<string[]>;

  getCommitDiff(repositoryPath: string, commitHash: string): Promise<string[]>;
}
