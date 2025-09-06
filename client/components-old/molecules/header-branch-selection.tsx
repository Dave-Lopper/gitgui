import { ChevronDownIcon } from "../../icons";
import { Actiontype, Repository } from "../../types";
import Branches from "../atoms/branches";

export default function HeaderBranchSelection({
  checkedOutBranch,
  currentAction,
  currentRepository,
  setCurrentAction,
}: {
  setCurrentAction: (action?: Actiontype) => void;

  currentAction?: Actiontype;
  checkedOutBranch?: string;
  currentRepository?: Repository;
}) {
  return (
    <>
      <div
        className={`flex h-full w-1/2 cursor-pointer items-center justify-between border-r-1 border-gray-400 p-4`}
        onClick={() =>
          setCurrentAction(
            currentAction === "BranchSelection" ? undefined : "BranchSelection",
          )
        }
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
    </>
  );
}
