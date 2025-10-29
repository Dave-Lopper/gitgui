import { Commit } from "../domain/commit";
import { File } from "../domain/diff";

export type CommitDiffDto = Commit & { diff: File[] };

export type HistoryPaginationDto = {
  hasNextPage: boolean;
  history: CommitDiffDto[];
  page: number;
  pageSize: number;
  totalPages: number;
};
