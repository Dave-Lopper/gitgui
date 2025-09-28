export type CommitStatusDto = {
  branchName: string;
  localUnpushed: number;
  remoteName: string;
  remoteUnpulled: number;
};
