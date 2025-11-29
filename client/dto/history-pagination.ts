import { Commit } from "../domain/commit";

export type HistoryPaginationDto = {
  hasNextPage: boolean;
  history: Commit[];
  page: number;
  pageSize: number;
  totalPages: number;
};
