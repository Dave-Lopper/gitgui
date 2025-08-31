import { useCallback, useEffect, useState } from "react";

import { Diff, Header, RepoDropdown } from "./components/organisms";
import {
  BranchDropdown,
  CommitForm,
  ErrorPopup,
  Files,
} from "./components/molecules";
import { Actiontype, FileDiff, GitError, Repository, RepositorySelection } from "./types";

import "./App.css";
import { ActionResponse } from "../electron/commons/action";

export default function App() {
  const [checkedOutBranch, setCheckedOutBranch] = useState<
    string | undefined
  >();
  const [currentAction, setCurrentAction] = useState<Actiontype | undefined>();
  const [currentDiff, setCurrentDiff] = useState<FileDiff[]>([]);
  const [currentFile, setCurrentFile] = useState<FileDiff | undefined>();
  const [currentRepository, setCurrentRepository] = useState<
    Repository | undefined
  >();
  const [gitErrors, setGitErrors] = useState<GitError[]>([]);
  const [savedRepositories, setSavedRepositories] = useState<Repository[]>([]);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const selectRepositoryFromDisk = useCallback(async () => {
    const response = await window.electronAPI.selectRepositoryFromDisk();
    if (response.success) {
      repositorySelectionCallback(response.data);
    }
  }, []);

  const selectRepositoryFromSaved = useCallback(async (path: string) => {
    const response = await window.electronAPI.selectRepositoryFromSaved(path);
    if (response.success) {
      repositorySelectionCallback(response.data);
    }
  }, []);

  const commit = useCallback((name: string, description?: string) => {}, []);

  useEffect(() => {
    const fetchRepositories = async () => {
      const response = await window.electronAPI.getSavedRepositories();
      if (response.success) {
        setSavedRepositories(response.data);
      }
    };

    fetchRepositories();
    window.electronAPI.onGitError((event, message) => {
      setGitErrors([...gitErrors, message]);
      setShowErrorPopup(true);
    });
  }, []);

  const repositorySelectionCallback = useCallback((data: RepositorySelection) => {
     setCurrentRepository({
        ...data.repository,
        branches: data.branches,
      });
      setCheckedOutBranch(data.repository.checkedOutBranch);
      setCurrentDiff(data.diff);
      setCurrentFile(data.diff[0]);
      setCurrentAction(undefined);
  }, [])

  return (
    <div className="m-0 h-full w-full p-0">
      {showErrorPopup && (
        <ErrorPopup errors={gitErrors} hide={() => setShowErrorPopup(false)} />
      )}
      <Header
        setCurrentAction={setCurrentAction}
        checkedOutBranch={checkedOutBranch}
        currentAction={currentAction}
        currentRepository={currentRepository}
      />
      <div className="flex w-full p-0">
        <div className="flex h-screen w-1/2 flex-col border-r-1 border-r-white pt-22">
          <RepoDropdown
            cloneRepoCallback={repositorySelectionCallback}
            currentAction={currentAction}
            currentRepository={currentRepository}
            savedRepositories={savedRepositories}
            selectRepositoryFromDisk={selectRepositoryFromDisk}
            selectRepositoryFromSaved={selectRepositoryFromSaved}
            setCurrentAction={setCurrentAction}
          />
          {currentRepository && (
            <>
              <Files
                currentFile={currentFile}
                setCurrentFile={setCurrentFile}
                files={currentDiff}
              />
              <CommitForm commit={commit} />
            </>
          )}
        </div>

        <main className="flex h-screen w-1/2 pt-22">
          <BranchDropdown
            currentAction={currentAction}
            currentRepository={currentRepository}
          />
          {currentFile && <Diff diff={currentFile} />}
        </main>
      </div>
    </div>
  );
}
