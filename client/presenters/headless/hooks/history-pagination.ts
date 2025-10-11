import { useCallback, useEffect, useMemo, useState } from "react";

import { useCases } from "../../../bootstrap";
import { Commit } from "../../../domain/commit";
import { useEventSubscription } from "../../../infra/react-bus-helper";
import { useRepositorySelection } from "./repository-selection";

export function useHistoryPagination(pageSize: number) {
  const [history, setHistory] = useState<Commit[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>();
  const { repositorySelection } = useRepositorySelection();

  const hasPreviousPage = useMemo(() => currentPage > 1, [currentPage]);
  const hasNextPage = useMemo(
    () => totalPages && currentPage < totalPages,
    [currentPage, totalPages],
  );

  useEffect(() => {
    const fetchHistory = async () =>
      repositorySelection &&
      (await useCases.getCommitHistory.execute(
        currentPage,
        pageSize,
        repositorySelection.repository.localPath,
      ));

    fetchHistory();
  }, [repositorySelection, currentPage, pageSize]);

  useEventSubscription(
    "CommitHistoryFetched",
    (event) => {
      setHistory(event.payload.history);
      setCurrentPage(event.payload.page);
      setTotalPages(event.payload.totalPages);
    },
    [],
  );

  const fetchNextPage = useCallback(async () => {
    if (!repositorySelection || !hasNextPage) {
      return;
    }
    await useCases.getCommitHistory.execute(
      currentPage + 1,
      pageSize,
      repositorySelection.repository.localPath,
    );
  }, [repositorySelection, hasNextPage, currentPage]);

  const fetchPreviousPage = useCallback(async () => {
    if (!repositorySelection || !hasPreviousPage) {
      return;
    }
    await useCases.getCommitHistory.execute(
      currentPage - 1,
      pageSize,
      repositorySelection.repository.localPath,
    );
  }, [repositorySelection, hasNextPage, currentPage]);

  return {
    currentPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    history,
    totalPages,
  };
}
