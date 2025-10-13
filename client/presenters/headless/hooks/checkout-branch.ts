import { useCallback, useState } from "react";

import { useCases } from "../../../bootstrap";
import { useEventSubscription } from "../../../infra/react-bus-helper";
import { useRepositorySelection } from "./repository-selection";

export function useCheckoutBranch() {
  const { repositorySelection } = useRepositorySelection();
  const [failedCheckoutBranchName, setFailedCheckoutBranchName] = useState();

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

  useEventSubscription(
    "CheckedOutBranchFailed",
    (event) => setFailedCheckoutBranchName(event.payload.branch.name),
    [],
  );

  return {
    checkoutBranch,
    checkoutFailed: failedCheckoutBranchName !== undefined,
    failedCheckoutBranchName,
    resetFailedState: () => setFailedCheckoutBranchName(undefined),
  };
}
