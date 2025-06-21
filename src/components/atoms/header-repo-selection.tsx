import { ChevronDownIcon, PlusIcon } from "../../icons";
import { Actiontype, Repository } from "../../types";

export default function HeaderRepoSelection({
  currentAction,
  currentRepository,
  setCurrentAction,
}: {
  setCurrentAction: (action?: Actiontype) => void;
  currentAction?: Actiontype;
  currentRepository?: Repository;
}) {
  if (currentRepository) {
    return (
      <div
        className="flex h-full w-1/2 cursor-pointer items-center justify-between border-r-1 border-gray-400 p-4"
        onClick={() =>
          setCurrentAction(
            currentAction === "RepoMethodSelection"
              ? undefined
              : "RepoMethodSelection",
          )
        }
      >
        <div className="flex flex-col items-start">
          <strong>Repository</strong>
          <div>
            {currentRepository?.name || "Select a repository to get started"}
          </div>
        </div>

        <ChevronDownIcon cursor="pointer" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-1/2 items-center justify-center border-r-1 border-gray-400 text-sm">
      <div className="mr-2 flex cursor-pointer">
        <div
          className="mr-4 flex items-center text-sm"
          onClick={() => setCurrentAction("RepoMethodSelection")}
        >
          Select a repository to get started
        </div>{" "}
        <PlusIcon cursor="pointer" />
      </div>{" "}
    </div>
  );
}
