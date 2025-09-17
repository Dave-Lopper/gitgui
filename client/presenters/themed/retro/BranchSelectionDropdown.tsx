import { useEffect, useRef } from "react";

import {
  SelectDropdown as HeadlessSelectDropdown,
  useRepositorySelection,
} from "../../headless";
import RetroButton from "./Button";
import { DropdownTriggerProps } from "../../headless/SelectDropdown";

function RetroBranchDropdownTrigger({
  checkedOutBranchName,
  isActive,
  isFocused,
}: DropdownTriggerProps & { checkedOutBranchName: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) {
      return;
    }
    if (isFocused) {
      buttonRef.current.focus();
    } else {
      buttonRef.current.blur();
    }
  }, [isFocused]);

  return (
    <RetroButton
      isActive={isActive}
      ref={buttonRef}
      className="flex h-13 w-full flex-col justify-center px-8"
    >
      <span className="w-full text-left text-sm" style={{ lineHeight: "1" }}>
        Current branch
      </span>
      <span className="text-md/1 w-full text-left font-bold">
        {checkedOutBranchName}
      </span>
    </RetroButton>
  );
}

const options = ["branch1", "branch2", "branch3"];

export default function RetroBranchDropdown() {
  const { repositorySelection } = useRepositorySelection();
  console.log({ repositorySelection });

  if (!repositorySelection) {
    return (
      <div className="h-13" style={{ borderBottom: "2px solid white" }}></div>
    );
  }

  return (
    <HeadlessSelectDropdown
      animate={false}
      handleSelect={(val) => console.log(val, "selected")}
      children={repositorySelection.branches.map((branch) => {
        return (isSelected: boolean) => (
          <div
            key={branch.name}
            className={`${isSelected || branch.name === repositorySelection.repository.checkedOutBranch ? "bg-retro-active text-white" : "bg-white text-black"} hover:bg-retro-pressed cursor-pointer border-r border-l border-black border-solid`}
          >
            {branch.name}
          </div>
        );
      })}
      selectClassName="retro-scrollbar bg-white border-2 border-retro border-solid outline-1 outline-black outline-t-0 border-t-0"
      tabIndex={2}
      trigger={RetroBranchDropdownTrigger}
      checkedOutBranchName={repositorySelection.repository.checkedOutBranch}
    ></HeadlessSelectDropdown>
  );
}
