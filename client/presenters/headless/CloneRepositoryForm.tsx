import { ChangeEvent, ComponentType, useCallback, useState } from "react";

import { useCases } from "../../bootstrap";

type CloneRepositoryFormProps = {
  className?: string;
  repoUrlInput: ComponentType<{
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }>;
  submitButton: ComponentType<{ onClick: () => void; disabled: boolean }>;
};

export default function CloneRepositoryForm({
  className,
  repoUrlInput: RepoUrlInput,
  submitButton: SubmitButton,
}: CloneRepositoryFormProps) {
  const [repoUrl, setRepoUrl] = useState<string>();

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setRepoUrl(e.target.value),
    [],
  );
  const cloneRepo = useCallback(
    async () => repoUrl && (await useCases.cloneRepository.execute(repoUrl)),
    [repoUrl, useCases],
  );

  return (
    <div className={`flex items-center ${className ? className : ""}`}>
      <RepoUrlInput onChange={onChange} />{" "}
      <SubmitButton
        onClick={async () => await cloneRepo()}
        disabled={!repoUrl}
      />
    </div>
  );
}
