import { Actiontype, Repository, RepositorySelection } from "../../types";
import {
  Button,
  CloneInput,
  SavedRepoSelection,
  SlidingVerticalBar,
} from "../atoms";

export default function RepoDropdown({
  cloneRepoCallback,
  currentAction,
  currentRepository,
  savedRepositories,
  selectRepositoryFromDisk,
  selectRepositoryFromSaved,
  setCurrentAction,
}: {
  cloneRepoCallback: (data: RepositorySelection) => void;
  currentAction?: Actiontype;
  currentRepository?: Repository;
  savedRepositories: Repository[];
  selectRepositoryFromDisk: () => void;
  selectRepositoryFromSaved: (path: string) => void;
  setCurrentAction: (action: Actiontype) => void;
}) {
  return (
    <>
      <SlidingVerticalBar
        show={currentAction === "CloneUrlInput"}
        position="left"
      >
        <CloneInput callback={cloneRepoCallback} />
      </SlidingVerticalBar>
      <SlidingVerticalBar
        show={currentAction === "RepoMethodSelection"}
        position="left"
      >
        <div className="my-auto">
          <SavedRepoSelection
            currentRepository={currentRepository}
            savedRepositories={savedRepositories}
            selectRepository={selectRepositoryFromSaved}
          />
          <div className="flex flex-col">Add a repository</div>
          <div className="mt-4 flex flex-col items-center">
            <Button onClick={selectRepositoryFromDisk}>
              Start from a local repository
            </Button>
            <div className="h-4 w-full"></div>
            <Button onClick={() => setCurrentAction("CloneUrlInput")}>
              Clone a remote repository
            </Button>
          </div>
        </div>
      </SlidingVerticalBar>
    </>
  );
}
