import { useCallback, useEffect, useState } from "react";

import { useCases } from "../../../bootstrap";
import { CommitStatus } from "../../../domain/commit";
import { useEventSubscription } from "../../../infra/react-bus-helper";
import { ContextualAction } from "../types";
import { useRepositorySelection } from "./repository-selection";

export function useContextualMenu() {
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isPullLoading, setIsPullLoading] = useState(false);
  const [isPushLoading, setIsPushLoading] = useState(false);
  const [commitStatus, setCommitStatus] = useState<CommitStatus>();
  const [contextualAction, setContextualAction] =
    useState<ContextualAction>(null);

  const { repositorySelection } = useRepositorySelection();

  useEventSubscription(
    "RepositorySelected",
    async (event) => setIsFetchLoading(true),
    [],
  );

  useEventSubscription(
    "RepositoryFetched",
    async (event) => {
      setIsFetchLoading(false);
      setCommitStatus(event.payload);
    },
    [],
  );

  useEventSubscription(
    ["Pushed", "Pulled"],
    async (event) => {
      if (!repositorySelection) {
        return;
      }

      if (event.type === "Pulled") {
        setIsPullLoading(false);
      }
      if (event.type === "Pushed") {
        setIsPushLoading(false);
      }

      await useCases.selectRepositoryFromSaved.execute(
        repositorySelection?.repository.localPath,
      );
    },
    [repositorySelection],
  );

  useEffect(() => {
    if (!commitStatus || !repositorySelection) {
      return;
    }

    if (commitStatus.remoteUnpulled > 0) {
      setContextualAction("PULL");
    } else if (commitStatus.localUnpushed > 0) {
      setContextualAction("PUSH");
    } else {
      setContextualAction("REFRESH");
    }
  }, [commitStatus]);

  const pull = useCallback(async () => {
    if (contextualAction !== "PULL" || !repositorySelection) {
      return;
    }
    setIsPullLoading(true);
    await useCases.pull.execute(repositorySelection.repository.localPath);
  }, [contextualAction, repositorySelection]);

  const push = useCallback(async () => {
    if (contextualAction !== "PUSH" || !repositorySelection) {
      return;
    }
    setIsPushLoading(true);
    await useCases.push.execute(repositorySelection.repository.localPath);
  }, [contextualAction, repositorySelection]);

  const refetch = useCallback(async () => {
    if (contextualAction !== "REFRESH" || !repositorySelection) {
      return;
    }
    setIsFetchLoading(true);
    await useCases.fetch.execute(repositorySelection.repository.localPath);
  }, [contextualAction, repositorySelection]);

  return {
    contextualAction,
    commitStatus,
    isFetchLoading,
    isPullLoading,
    isPushLoading,
    pull,
    push,
    refetch,
  };
}
