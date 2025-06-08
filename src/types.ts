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
  isLocal: boolean;
  remoteName: string;
};

export type RepositorySelection = {
  repository: Repository;
  branches: Branch[];
};

export type GitError = {
  command?: string;
  message: string;
};
