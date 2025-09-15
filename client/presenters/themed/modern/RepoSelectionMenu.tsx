import { Repository } from "../../../domain/repository";
import { useCases } from "../../../bootstrap";
import {
  CloneRepositoryForm,
  SavedRepositories,
  useFocusable,
} from "../../headless";

import { FolderIcon } from "../../../icons/modern";
import ModernButton from "./Button";
import TextInput from "./TextInput";

function SubmitButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <ModernButton
      className="h-8 px-4"
      disabled={disabled}
      isActive={false}
      sound
      onClick={onClick}
    >
      Clone repository
    </ModernButton>
  );
}

function RepositoryOption({
  repository,
  tabIndex,
}: {
  repository: Repository;
  tabIndex?: number;
}) {
  const { ref, handleKeyDown } = useFocusable(
    async () =>
      await useCases.selectRepositoryFromSaved.execute(repository.localPath),
  );
  const pathParts = repository.localPath.split("/");
  const repoName = pathParts.pop();
  const path = pathParts.join("/");

  return (
    <div
      className="bg-modern-dark-ter font-modern hover:bg-modern-dark-qua flex cursor-pointer items-center justify-between rounded-md p-4 mb-4 transition-colors focus:border-none focus:outline-offset-0 focus:outline-sky-500 focus:outline-solid"
      onKeyDown={handleKeyDown}
      ref={ref}
      role="button"
      tabIndex={tabIndex}
    >
      <div className="flex flex-col items-start">
        <span className="text-left text-white">{repoName}</span>
        <span className="text-left text-neutral-400">{path}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-xs">{repository.checkedOutBranch}</span>
        <span className="text-emerald-400">{repository.remoteName}</span>
      </div>
    </div>
  );
}

export default function ModernRepositorySelectionMenu() {
  return (
    <div className="font-modern bg-modern-dark-sec flex h-full w-full flex-col items-center justify-between text-white">
      <SavedRepositories
        className="modern-scrollbar max-h-48 overflow-auto flex flex-col p-4"
        label={
          <p className="font-modern mt-12 text-white">Saved repositories</p>
        }
        repositoryOption={RepositoryOption}
      />

      <ModernButton
        className="my-18 flex h-12 items-center justify-between px-4"
        isActive={false}
        sound
        onClick={async () => await useCases.selectRepositoryFromDisk.execute()}
      >
        <span className="mr-2">Select from disk</span>{" "}
        <FolderIcon size={22} color="white" />
      </ModernButton>

      <CloneRepositoryForm
        className="mb-12"
        inputPlaceholder="Repository url"
        submitButton={SubmitButton}
        repoUrlInput={TextInput}
      />
    </div>
  );
}
