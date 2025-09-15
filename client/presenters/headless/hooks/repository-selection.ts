import { useState } from "react";

import { useEventSubscription } from "../../../infra/react-bus-helper";
import { RepositorySelectionDto } from "../../../dto/repo-selection";

export function useRepositorySelection() {
  const [repositorySelection, setRepositorySelection] =
    useState<RepositorySelectionDto | null>(null);

  useEventSubscription(
    "RepositorySelected",
    (event) => {
      console.log("Repo selected", event);
      setRepositorySelection(event.payload);
    },
    [],
  );
  return { repositorySelection };
}
