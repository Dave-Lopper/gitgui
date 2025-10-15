import { useCallback, useState } from "react";

import { useCases } from "../../../bootstrap";
import { Branch } from "../../../domain/branch";
import { useEventSubscription } from "../../../infra/react-bus-helper";
import { useRepositorySelection } from "./repository-selection";
import { useSoundEffect } from "./sound-effect";

export function useCheckoutBranch() {
  const { repositorySelection } = useRepositorySelection();
  const [failedCheckoutBranch, setFailedCheckoutBranch] = useState<Branch>();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const errorSoundEffect = useSoundEffect("ERROR");

  const checkoutBranch = useCallback(
    async (branchIndex: number) => {
      if (!repositorySelection) {
        return;
      }

      setCheckoutLoading(true);
      await useCases.checkoutBranch.execute(
        repositorySelection.repository.localPath,
        repositorySelection.branches[branchIndex],
      );
    },
    [repositorySelection],
  );

  const stageStashAndCheckout = useCallback(async () => {
    if (!repositorySelection || !failedCheckoutBranch) {
      return;
    }

    setCheckoutLoading(true);
    await useCases.stageStashAndCheckout.execute(
      repositorySelection.repository.localPath,
      failedCheckoutBranch,
    );
  }, [repositorySelection, failedCheckoutBranch]);

  useEventSubscription(
    "CheckedOutBranchFailed",
    (event) => {
      errorSoundEffect.play();
      setCheckoutLoading(false);
      setFailedCheckoutBranch(event.payload.branch);
    },
    [errorSoundEffect],
    false,
  );

  useEventSubscription(
    "RepositorySelected",
    (event) => {
      setCheckoutLoading(false);
      setFailedCheckoutBranch(undefined);
    },
    [],
  );

  return {
    checkoutBranch,
    checkoutFailed: failedCheckoutBranch !== undefined,
    checkoutLoading,
    failedCheckoutBranch,
    resetFailedState: () => setFailedCheckoutBranch(undefined),
    stageStashAndCheckout,
  };
}
