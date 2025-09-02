import { Branch } from "./branch";

export type Repository = {
  name: string;
  url: string;
  remoteName: string | undefined;
  lastFetchedAt: string | undefined;
  localPath: string;
  checkedOutBranch: string;
  branches: Branch[];
};
