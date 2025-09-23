import { useCallback, useState } from "react";

import { Event } from "../../../application/i-event-bus";
import { RepositorySelectionDto } from "../../../dto/repo-selection";
import { useEventSubscription } from "../../../infra/react-bus-helper";

export function useRepositorySelection() {
  const [repositorySelection, setRepositorySelection] =
    useState<RepositorySelectionDto | null>(null);

  const handler = useCallback(
    (event: Event) => setRepositorySelection(event.payload),
    [],
  );

  useEventSubscription("RepositorySelected", handler, [handler]);
  return { repositorySelection };
}
