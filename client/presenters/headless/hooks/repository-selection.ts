import { useCallback, useContext, useState } from "react";

import { Event } from "../../../application/i-event-bus";
import { useCases } from "../../../bootstrap";
import { RepositorySelectionDto } from "../../../dto/repo-selection";
import { useEventSubscription } from "../../../infra/react-bus-helper";
import { RepoTabsContext } from "../../contexts/repo-tabs";

export function useRepositorySelection(listenStaging: boolean = false) {
  const [repositorySelection, setRepositorySelection] =
    useState<RepositorySelectionDto | null>(null);

  const handler = useCallback(
    async (event: Event) => setRepositorySelection(event.payload),
    [],
  );

  let event: string | string[];
  if (listenStaging) {
    event = ["RepositorySelected", "FileStaged"];
  } else {
    event = "RepositorySelected";
  }

  useEventSubscription(event, handler, [handler]);
  useEventSubscription(
    "RepositorySelected",
    async () => {
      if (!repositorySelection) {
        return;
      }
      await useCases.modifyFileDiffSelection.execute(
        repositorySelection.repository.localPath,
        repositorySelection.repository.remoteName || "origin",
        repositorySelection.repository.checkedOutBranch,
        new Set(),
        undefined,
      );
    },
    [handler],
  );

  return { repositorySelection };
}
