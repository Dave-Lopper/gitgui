export type Repository = {
  name: string;
  url: string;
  remoteName: string | undefined;
  lastFetchedAt: string | undefined;
  localPath: string;
  checkedOutBranch: string;
};

export type Branch = {
  name: string;
  isCurrent: boolean;
};

export type RepositorySelection = {
  repository: Repository;
  branches: string[];
};

export type GitError = {
  command?: string;
  message: string;
};
