import { useCases } from "../../../bootstrap";
import { Repository } from "../../../domain/repository";
import { SavedRepositories, useFocusable } from "../../headless";

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
      style={{ borderRight: "2px solid #404040", borderTop: "2px solid white" }}
      className="font-retro flex w-full flex-col items-center justify-between border-1 border-black py-8 text-black"
    >
      <div className="flex flex-col">
        <p className="font-retro mb-4 text-black">Saved repositories</p>
        <SavedRepositories
          repositoryOption={RepositoryOption}
          className="retro-borders-in flex flex-col border-2 bg-white"
        />
      </div>
    </div>
  );
}
