import { ComponentType, useCallback, useMemo, useState } from "react";

import { useCases } from "../../bootstrap";
import { useRepositorySelection } from "./hooks/repository-selection";
import { SubmitButtonProps, TextInputProps } from "./types";

export default function CommitForm({
  containerClassname,
  submitButton: SubmitButton,
  textInput: TextInput,
}: {
  containerClassname?: string;
  submitButton: ComponentType<SubmitButtonProps>;
  textInput: ComponentType<TextInputProps>;
}) {
  const { repositorySelection } = useRepositorySelection();

  const stagedFiles = useMemo(() => {
    return repositorySelection
      ? repositorySelection.diff.filter((file) => file.staged)
      : [];
  }, [repositorySelection]);

  const [commitMessage, setCommitMessage] = useState<string>();
  const [commitDescription, setCommitDescription] = useState<string>();

  const isSubmitDisabled = useMemo(
    () =>
      repositorySelection === null ||
      stagedFiles.length === 0 ||
      commitMessage === undefined ||
      commitMessage.length === 0,
    [repositorySelection, stagedFiles, commitMessage],
  );

  const submit = useCallback(async () => {
    if (!repositorySelection || isSubmitDisabled || !commitMessage) {
      return;
    }
    await useCases.commit.execute(
      repositorySelection.repository.localPath,
      commitMessage,
      commitDescription,
    );
  }, [repositorySelection]);

  return (
    <div
      className={`flex flex-col absolute bottom-0 w-full ${containerClassname ? containerClassname : ""}`}
    >
      <TextInput
        placeholder="Commit message"
        value={commitMessage}
        onChange={(e) => setCommitMessage(e.target.value)}
      />
      <TextInput
        placeholder="Commit description"
        value={commitDescription}
        onChange={(e) => setCommitDescription(e.target.value)}
      />

      <SubmitButton
        disabled={isSubmitDisabled}
        text="Commit"
        onClick={submit}
      />
    </div>
  );
}
