import { DiffFile } from "../../diff/domain/entities.js";
import { Commit } from "../domain/entities.js";

export type CommitDiffDto = Commit & { diff: DiffFile[] };

export type HistoryPaginationDto = {
  hasNextPage: boolean;
  history: CommitDiffDto[];
  page: number;
  pageSize: number;
  totalPages: number;
};
