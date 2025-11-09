import { useCallback, useContext, useState } from "react";

import { Event } from "../../../application/i-event-bus";
import { RepositorySelectionDto } from "../../../dto/repo-selection";
import { useEventSubscription } from "../../../infra/react-bus-helper";
import { RepoTabsContext } from "../../contexts/repo-tabs";

export function useRepositorySelection(listenStaging: boolean = false) {
  const [repositorySelection, setRepositorySelection] =
    useState<RepositorySelectionDto | null>(null);

  const handler = useCallback(
    (event: Event) => setRepositorySelection(event.payload),
    [],
  );

  const { emptyFileSelection } = useContext(RepoTabsContext);

  let event: string | string[];
  if (listenStaging) {
    event = ["RepositorySelected", "FileStaged"];
  } else {
    event = "RepositorySelected";
  }

  useEventSubscription(event, handler, [handler]);
  useEventSubscription("RepositorySelected", () => emptyFileSelection(), [
    handler,
  ]);

  return { repositorySelection };
}
