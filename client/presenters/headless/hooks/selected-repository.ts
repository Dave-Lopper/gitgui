import { useState } from "react";

import { useEventSubscription } from "../../../infra/react-bus-helper";
import { RepositorySelectionDto } from "../../../dto/repo-selection";

export function useSelectedRepository() {
  const [selectedRepository, setSelectedRepository] =
    useState<RepositorySelectionDto>();

  useEventSubscription(
    "RepositorySelected",
    (event) => setSelectedRepository(event.payload),
    [],
  );
  return { selectedRepository };
}
