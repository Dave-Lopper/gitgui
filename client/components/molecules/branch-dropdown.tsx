import { Branches, SlidingVerticalBar } from "../atoms";
import { Actiontype, Repository } from "../../types";

export default function BranchDropdown({
  currentAction,
  currentRepository,
}: {
  currentAction?: Actiontype;
  currentRepository?: Repository;
}) {
  return (
    <SlidingVerticalBar
      show={currentAction === "BranchSelection"}
      position="right"
    >
      {currentRepository?.branches && (
        <div className="flex flex-col p-4">
          <Branches branches={currentRepository?.branches} />
        </div>
      )}
    </SlidingVerticalBar>
  );
}
