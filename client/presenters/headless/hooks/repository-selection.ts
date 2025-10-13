import { useCallback, useState } from "react";

import { Event } from "../../../application/i-event-bus";
import { useCases } from "../../../bootstrap";
import { RepositorySelectionDto } from "../../../dto/repo-selection";
import { useEventSubscription } from "../../../infra/react-bus-helper";

export function useRepositorySelection(listenStaging: boolean = false) {
  const [repositorySelection, setRepositorySelection] =
    useState<RepositorySelectionDto | null>(null);

  const handler = useCallback(
    (event: Event) => setRepositorySelection(event.payload),
    [],
  );

  let event: string | string[];
  if (listenStaging) {
    event = ["RepositorySelected", "FileStaged"];
  } else {
    event = "RepositorySelected";
  }

  useEventSubscription(event, handler, [handler]);

  const checkoutBranch = useCallback(
    async (branchIndex: number) => {
      if (!repositorySelection) {
        return;
      }

      await useCases.checkoutBranch.execute(
        repositorySelection.repository.localPath,
        repositorySelection.branches[branchIndex],
      );
    },
    [repositorySelection],
  );

  return { checkoutBranch, repositorySelection };
}
