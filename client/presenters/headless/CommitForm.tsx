import {
  ChangeEvent,
  ComponentType,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useRepositorySelection } from "./hooks/repository-selection";
import { useCases } from "../../bootstrap";

type CommitFormInputProps = {
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

type CommitFormButtonProps = {
  disabled: boolean;
  text: string;
  onClick: () => Promise<void>;
};

export default function CommitForm({
  containerClassname,
  submitButton: SubmitButton,
  textInput: TextInput,
}: {
  containerClassname?: string;
  submitButton: ComponentType<CommitFormButtonProps>;
  textInput: ComponentType<CommitFormInputProps>;
}) {
  const { repositorySelection } = useRepositorySelection();
  const stagedFiles = useMemo(() => {
    return repositorySelection
      ? repositorySelection.diff.filter((file) => file.staged)
      : [];
  }, [repositorySelection]);

  const [commitMessage, setCommitMessage] = useState<string>();
  const [commitDescription, setCommitDescription] = useState<string>();

  const submit = useCallback(async () => {
    // await useCases.
  }, [repositorySelection]);

  return (
    <div
      className={`flex flex-col ${containerClassname ? containerClassname : ""}`}
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

      <SubmitButton text="Commit" onClick={() => {}} />
    </div>
  );
}
