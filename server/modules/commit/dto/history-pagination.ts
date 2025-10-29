import { File } from "../../diff/domain/entities.js";
import { Commit } from "../domain/entities.js";

export type CommitDiffDto = Commit & { diff: File[] };

export type HistoryPaginationDto = {
  hasNextPage: boolean;
  history: CommitDiffDto[];
  page: number;
  pageSize: number;
  totalPages: number;
};
