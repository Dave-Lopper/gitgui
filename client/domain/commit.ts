export type Commit = {
  authoredAt: Date;
  authorName: string;
  hash: string;
  shortHash: string;
  subject: string;

  authorEmail?: string;
};

export type CommitStatus = {
  remoteUnpulled: number;
  localUnpushed: number;
};
