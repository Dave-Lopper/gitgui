import { PastDiffFile } from "./diff";

export type Commit = {
  authoredAt: Date;
  authorName: string;
  hash: string;
  shortHash: string;
  subject: string;
  diff: PastDiffFile[];

  authorEmail?: string;
};

export type CommitStatus = {
  remoteUnpulled: number;
  localUnpushed: number;
};
