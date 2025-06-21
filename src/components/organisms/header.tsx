import { HeaderRepoSelection } from "../atoms";
import { HeaderBranchSelection } from "../molecules";
import { Actiontype, Repository } from "../../types";

export default function Header({
  checkedOutBranch,
  currentAction,
  currentRepository,
  setCurrentAction,
}: {
  setCurrentAction: (action?: Actiontype) => void;
  checkedOutBranch?: string;
  currentAction?: Actiontype;
  currentRepository?: Repository;
}) {
  return (
    <header className="fixed flex h-22 w-full flex-row items-center border-b-1 border-white bg-stone-800">
      <HeaderRepoSelection
        currentAction={currentAction}
        setCurrentAction={setCurrentAction}
        currentRepository={currentRepository}
      />
      {currentRepository && (
        <HeaderBranchSelection
          currentAction={currentAction}
          currentRepository={currentRepository}
          checkedOutBranch={checkedOutBranch}
          setCurrentAction={setCurrentAction}
        />
      )}
    </header>
  );
}
