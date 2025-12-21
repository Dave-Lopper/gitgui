import { useCommitForm } from "../../headless/hooks/commit-form";
import SubmitButton from "./SubmitButton";
import TextInput from "./TextInput";

export default function CommitForm() {
  const {
    commit,
    commitDescription,
    commitMessage,
    isCommitLoading,
    isSubmitDisabled,
    setCommitDescription,
    setCommitMessage,
  } = useCommitForm();

  return (
    <div className="flex flex-col w-full absolute bottom-0">
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
        isLoading={isCommitLoading}
        loadingText="Committing"
        text="Commit"
        onClick={commit}
      />
    </div>
  );
}
