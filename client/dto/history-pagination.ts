import { Commit } from "../domain/commit";
import { DiffFile } from "../domain/diff";

export type CommitDiffDto = Commit & { diff: DiffFile[] };

export type HistoryPaginationDto = {
  hasNextPage: boolean;
  history: CommitDiffDto[];
  page: number;
  pageSize: number;
  totalPages: number;
};
