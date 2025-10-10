import { useCallback, useEffect, useState } from "react";

import { useCases } from "../../../bootstrap";
import { CommitStatus } from "../../../domain/commit";
import { useEventSubscription } from "../../../infra/react-bus-helper";
import { ContextualAction } from "../types";
import { useRepositorySelection } from "./repository-selection";

export function useContextualMenu() {
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [commitStatus, setCommitStatus] = useState<CommitStatus>();
  const [contextualAction, setContextualAction] =
    useState<ContextualAction>(null);

  const { repositorySelection } = useRepositorySelection();

  useEventSubscription(
    "RepositorySelected",
    (event) => setIsFetchLoading(true),
    [],
  );

  useEventSubscription(
    "RepositoryFetched",
    (event) => {
      setIsFetchLoading(false);
      setCommitStatus(event.payload);
    },
    [],
  );

  useEventSubscription(
    ["Pushed", "Pull"],
    async (event) => {
      if (!repositorySelection) {
        return;
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

  const onActionClick = useCallback(async () => {
    if (!contextualAction || !repositorySelection) {
      return;
    }

    if (contextualAction === "PULL") {
      await useCases.pull.execute(repositorySelection.repository.localPath);
    } else if (contextualAction === "PUSH") {
      await useCases.push.execute(repositorySelection.repository.localPath);
    } else {
      setIsFetchLoading(true);
      await useCases.fetch.execute(repositorySelection.repository.localPath);
    }
  }, [contextualAction, repositorySelection]);

  return { onActionClick, isFetchLoading, contextualAction, commitStatus };
}
