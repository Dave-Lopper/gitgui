import { useCallback, useMemo, useState } from "react";

import { useCases } from "../../../bootstrap";
import { useEventSubscription } from "../../../infra/react-bus-helper";
import { useRepositorySelection } from "./repository-selection";

export function useCommitForm() {
  const { repositorySelection } = useRepositorySelection(true);

  const stagedFiles = useMemo(() => {
    return repositorySelection
      ? repositorySelection.treeStatus.entries.filter((file) => file.staged)
      : [];
  }, [repositorySelection]);

  const [commitMessage, setCommitMessage] = useState<string>();
  const [commitDescription, setCommitDescription] = useState<string>();
  const [isCommitLoading, setIsCommitLoading] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    return (
      repositorySelection === null ||
      stagedFiles.length === 0 ||
      commitMessage === undefined ||
      commitMessage.length === 0
    );
  }, [repositorySelection, stagedFiles, commitMessage]);

  const commit = useCallback(async () => {
    if (!repositorySelection || isSubmitDisabled || !commitMessage) {
      return;
    }
    setIsCommitLoading(true);
    await useCases.commit.execute(
      repositorySelection.repository.localPath,
      commitMessage,
      commitDescription,
    );
  }, [commitDescription, commitMessage, isSubmitDisabled, repositorySelection]);

  useEventSubscription("Commited", async () => setIsCommitLoading(false), []);

  return {
    commit,
    commitDescription,
    commitMessage,
    isCommitLoading,
    isSubmitDisabled,
    setCommitDescription,
    setCommitMessage,
  };
}
