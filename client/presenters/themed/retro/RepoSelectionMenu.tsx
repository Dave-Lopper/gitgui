import { useCases } from "../../../bootstrap";
import { Repository } from "../../../domain/repository";
import {
  SavedRepositories,
  CloneRepositoryForm,
  useFocusable,
} from "../../headless";
import RetroButton from "./Button";
import TextInput from "./TextInput";

function SubmitButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <RetroButton
      className="h-8 px-4"
      disabled={disabled}
      isActive={false}
      sound
      onClick={onClick}
    >
      Clone repository
    </RetroButton>
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
  return (
    <div
      className="font-retro hover:bg-retro-active focus:bg-retro-active w-full cursor-pointer px-4 text-black hover:text-white focus:border-none focus:text-white focus:outline-none"
      onKeyDown={handleKeyDown}
      ref={ref}
      role="button"
      tabIndex={tabIndex}
    >
      {repository.localPath}
    </div>
  );
}

export default function RetroRepoSelectionMenu() {
  return (
    <div
      style={{
        borderRight: "2px solid #404040",
        borderTop: "2px solid white",
      }}
      className="bg-retro font-retro flex min-h-full w-full flex-col items-center justify-evenly border-1 border-black py-8 text-black"
    >
      <SavedRepositories
        label={<p className="font-retro mb-4 text-black">Saved repositories</p>}
        repositoryOption={RepositoryOption}
        className="retro-borders-in retro-scrollbar flex max-h-24 flex-col overflow-auto border-2 bg-white"
      />

      <RetroButton
        className="my-18 h-12 px-4"
        isActive={false}
        sound
        onClick={async () => await useCases.selectRepositoryFromDisk.execute()}
      >
        Select from disk
      </RetroButton>

      <CloneRepositoryForm
        repoUrlInput={TextInput}
        submitButton={SubmitButton}
      />
    </div>
  );
}
