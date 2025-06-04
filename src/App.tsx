import { useCallback, useEffect, useState, MouseEventHandler } from "react";

import { GitError, Repository } from "./types";
import { CheckMarkIcon, ChevronDownIcon, CloseIcon, PlusIcon } from "./icons";
import CloneRepositoryInput from "./components/clone-repository-input";
import "./App.css";
import ErrorPopup from "./components/error-popup";

type Actiontype =
  | "CloneUrlInput"
  | "RepoMethodSelection"
  | "LocalRepoSelection"
  | "RemoteRepoSelection"
  | "BranchSelection";

function App() {
  const [response, setResponse] = useState<string>();
  const [savedRepositories, setSavedRepositories] = useState<Repository[]>([]);
  const [invalidRepoSelected, setInvalidRepoSelected] = useState(false);
  const [currentRepository, setCurrentRepository] = useState<Repository>();
  const [currentRepositoryBranches, setCurrentRepositoryBranches] = useState<
    string[]
  >([]);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<Actiontype>();
  const [gitErrors, setGitErrors] = useState<GitError[]>([]);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [checkedOutBranch, setCheckedOutBranch] = useState<string>();

  const selectRepositoryFromDisk = useCallback(async () => {
    const response = await window.electronAPI.selectRepositoryFromDisk();
    if (response.success) {
      setCurrentRepository(response.data.repository);
      setCheckedOutBranch(response.data.repository.checkedOutBranch);
      setCurrentRepositoryBranches(response.data.branches);
      setCurrentAction(undefined);
    }
  }, []);

  const selectRepositoryFromSaved = useCallback(async (path: string) => {
    const response = await window.electronAPI.selectRepositoryFromSaved(path);
    if (response.success) {
      setCurrentRepository(response.data.repository);
      setCheckedOutBranch(response.data.repository.checkedOutBranch);
      setCurrentRepositoryBranches(response.data.branches);
      setCurrentAction(undefined);
    }
  }, []);

  useEffect(() => {
    const fetchRepositories = async () => {
      const response = await window.electronAPI.getSavedRepositories();
      if (response.success) {
        console.log({ data: response.data[0] });
        setSavedRepositories(response.data);
      }
    };

    fetchRepositories();
    window.electronAPI.onGitError((event, message) => {
      setGitErrors([...gitErrors, message]);
      setShowErrorPopup(true);
    });
  }, []);

  const checkout = useCallback((branch: string) => {
    setIsCheckoutLoading(true);
    // window.electronAPI.checkoutBranch(
    //   currentRepository?.localPath!,
    //   currentRepository?.name!,
    //   branch,
    // );
  }, []);

  return (
    <div className="flex w-full flex-col">
      {showErrorPopup && (
        <ErrorPopup errors={gitErrors} hide={() => setShowErrorPopup(false)} />
      )}
      <div className="flex h-22 w-full flex-row items-center border-b-1 border-white">
        {currentRepository === undefined ? (
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
        ) : (
          <div className="flex h-full w-1/2 cursor-pointer items-center justify-between border-r-1 border-gray-400 p-4">
            <div className="flex flex-col items-start">
              <strong>Repository</strong>
              <div>
                {currentRepository?.name ||
                  "Select a repository to get started"}
              </div>
            </div>

            <div
              className="cursor-pointer"
              onClick={() => setCurrentAction("RepoMethodSelection")}
            >
              <ChevronDownIcon />
            </div>
          </div>
        )}
        {currentRepository !== undefined && (
          <div
            className={`flex h-full w-1/2 items-center justify-between border-r-1 border-gray-400 p-4`}
            onClick={() => setCurrentAction("BranchSelection")}
          >
            <div
              className={`flex flex-col items-start ${currentRepository !== undefined ? "cursor-pointer" : ""}`}
            >
              <strong>Branch</strong>
              <div>{checkedOutBranch}</div>
            </div>

            <ChevronDownIcon
              cursor={currentRepository !== undefined ? "pointer" : "default"}
            />
          </div>
        )}
      </div>

      <div
        className="absolute top-22 bottom-0 left-1/2 flex w-1/2 flex-col items-center justify-start border-white bg-stone-800 p-4 transition-transform"
        style={{
          transformOrigin: "top",
          transform: `scaleY(${currentAction && currentAction === "BranchSelection" ? 1 : 0})`,
        }}
      >
        <label className="text-md w-full text-start">Checkout:</label>
        <div className="w-full overflow-y-scroll">
          {currentRepositoryBranches.map((branch) => (
            <div
              className="m-2 cursor-pointer text-right transition-colors hover:bg-stone-600"
              onClick={() => checkout(branch)}
            >
              {branch}
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute top-22 bottom-0 left-0 flex w-1/2 flex-col items-center justify-evenly border-r-1 border-emerald-200 bg-stone-800 transition-transform"
        style={{
          transformOrigin: "top",
          transform: `scaleY(${currentAction && ["RepoMethodSelection", "LocalRepoSelection", "CloneUrlInput"].includes(currentAction) ? 1 : 0})`,
        }}
      >
        {currentAction === "CloneUrlInput" ? (
          <CloneRepositoryInput
            callback={(repository, branches) => {
              setCurrentRepository(repository);
              setCurrentRepositoryBranches(branches);
              setCheckedOutBranch(repository.checkedOutBranch);
              setCurrentAction(undefined);
            }}
          />
        ) : (
          <>
            {savedRepositories.length > 0 && (
              <div className="mb-8 flex w-3/4 flex-col">
                <label className="mb-4">Saved repositories</label>

                {savedRepositories.map((repository) => (
                  <div className="flex items-center justify-start">
                    <div
                      key={repository.name}
                      className={`${currentRepository?.name === repository.name ? "relative mr-6 cursor-default" : "cursor-pointer"} relative mb-2 flex w-4/5 items-center justify-between rounded-md bg-stone-700 p-2 text-sm`}
                      onClick={() =>
                        selectRepositoryFromSaved(repository.localPath)
                      }
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
              </div>
            )}
            <div className="w-1/2">
              <div className="flex flex-col">Add a repository</div>
              <div
                className="mt-4 cursor-pointer rounded-md bg-stone-700 pt-2 pr-6 pb-2 pl-6 transition-colors hover:bg-stone-600"
                onClick={selectRepositoryFromDisk}
              >
                Start from a local repository
              </div>
              <div
                className="mt-6 cursor-pointer rounded-md bg-stone-700 pt-2 pr-6 pb-2 pl-6 transition-colors hover:bg-stone-600"
                onClick={() => setCurrentAction("CloneUrlInput")}
              >
                Clone a remote repository
              </div>
            </div>
          </>
        )}
        <div
          className="absolute top-2.5 right-2.5"
          onClick={() => setCurrentAction(undefined)}
        >
          <CloseIcon size={28} cursor="pointer" />
        </div>
      </div>
    </div>
  );
}

export default App;
