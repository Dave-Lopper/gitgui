import { useState } from "react";

import { useEventSubscription } from "../../../infra/react-bus-helper";
import { RepositorySelectionDto } from "../../../dto/repo-selection";

export function useRepositorySelection() {
  const [repositorySelection, setRepositorySelection] =
    useState<RepositorySelectionDto | null>(null);

  useEventSubscription(
    "RepositorySelected",
    (event) => setRepositorySelection(event.payload),
    [],
  );
  return { repositorySelection };
}
