export type Commit = {
  authoredAt: Date;
  authorName: string;

  hash: string;
  shortHash: string;
  subject: string;

  authorEmail?: string;
};
