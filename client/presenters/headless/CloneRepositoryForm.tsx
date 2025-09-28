import { ChangeEvent, ComponentType, useCallback, useState } from "react";

import { useCases } from "../../bootstrap";
import { SubmitButtonProps } from "./types";

type CloneRepositoryFormProps = {
  className?: string;
  inputPlaceholder?: string;
  repoUrlInput: ComponentType<{
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }>;
  submitButton: ComponentType<SubmitButtonProps>;
};

export default function CloneRepositoryForm({
  className,
  inputPlaceholder,
  repoUrlInput: RepoUrlInput,
  submitButton: SubmitButton,
}: CloneRepositoryFormProps) {
  const [repoUrl, setRepoUrl] = useState<string>();

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setRepoUrl(e.target.value),
    [],
  );
  const cloneRepo = useCallback(async () => {
    if (!repoUrl) {
      return;
    }
    await useCases.cloneRepository.execute(repoUrl);
  }, [repoUrl, useCases]);

  return (
    <div className={`flex items-center ${className ? className : ""}`}>
      <RepoUrlInput onChange={onChange} placeholder={inputPlaceholder} />{" "}
      <SubmitButton
        onClick={async () => await cloneRepo()}
        disabled={!repoUrl}
        text="Clone repository"
      />
    </div>
  );
}
