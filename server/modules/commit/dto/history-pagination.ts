import { Commit } from "../domain/entities.js";

export type HistoryPaginationDto = {
  hasNextPage: boolean;
  history: Commit[];
  page: number;
  pageSize: number;
  totalPages: number;
};
