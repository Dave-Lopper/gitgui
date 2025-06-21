import { CheckMarkIcon } from "../../icons";
import { Repository } from "../../types";

export default function SavedRepoSelection({
  currentRepository,
  savedRepositories,
  selectRepository,
}: {
  currentRepository?: Repository;
  savedRepositories: Repository[];
  selectRepository: (path: string) => void;
}) {
  return (
    <>
      {savedRepositories.length > 0 && (
        <div className="mx-auto flex w-3/4 flex-col">
          <label className="mb-4">Saved repositories</label>

          {savedRepositories.map((repository) => (
            <div className="flex items-center justify-start">
              <div
                key={repository.name}
                className={`${currentRepository?.name === repository.name ? "relative mr-6 cursor-default" : "cursor-pointer"} relative mb-2 flex w-4/5 items-center justify-between rounded-md bg-stone-700 p-2 text-sm`}
                onClick={() => selectRepository(repository.localPath)}
              >
                <div className="flex flex-col items-start">
                  <div>{repository.name}</div>
                  <div className="text-left text-xs text-stone-400">
                    {repository.localPath}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-xs text-emerald-500">
                    {repository.remoteName}
                  </div>
                  <div className="text-xs text-stone-400">
                    {repository.checkedOutBranch}
                  </div>
                </div>
              </div>
              {currentRepository?.name === repository.name && (
                <div>
                  <CheckMarkIcon />
                </div>
              )}
            </div>
          ))}
          {savedRepositories.length > 0 && <div className="h-8 w-full"></div>}
        </div>
      )}
    </>
  );
}
