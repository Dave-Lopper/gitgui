import { useEffect, useRef, useState } from "react";

import {
  SelectDropdown as HeadlessSelectDropdown,
  useRepositorySelection,
} from "../../headless";
import { DropdownTriggerProps } from "../../headless/SelectDropdown";
import { useCheckoutBranch } from "../../headless/hooks/checkout-branch";
import RetroButton from "./Button";
import Button from "./Button";
import RetroLabel from "./Label";
import RetroModal from "./Modal";

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

export default function RetroBranchDropdown() {
  const { repositorySelection } = useRepositorySelection();
  const {
    checkoutBranch,
    checkoutFailed,
    failedCheckoutBranchName,
    resetFailedState,
  } = useCheckoutBranch();

  if (!repositorySelection) {
    return (
      <div className="h-13" style={{ borderBottom: "2px solid white" }}></div>
    );
  }

  return (
    <>
      {checkoutFailed && (
        <RetroModal
          close={resetFailedState}
          modalClassname="top-1/3 z-99"
          title="Branch checkout failed"
        >
          <div className="flex flex-col">
            <div className="flex items-center">
              <img src="error.ico" className="mr-4 w-8 h-8" />
              <p className="font-retro text-black">
                Uncommitted changes detected, please stage and stash your local
                changes before switching branches to avoid losing your work
              </p>
            </div>
            <div className="w-full flex justify-center mt-6 mb-2">
              <Button
                className="w-1/3 mr-4 "
                isActive={false}
                onClick={() => console.log("Stage and stash")}
                sound
              >
                Stage & stash
              </Button>
              <Button
                className="w-1/3 mr-4 "
                isActive={false}
                onClick={resetFailedState}
                sound
              >
                Cancel
              </Button>
            </div>
          </div>
        </RetroModal>
      )}
      <HeadlessSelectDropdown
        animate={false}
        handleSelect={async (branchIndex) => {
          if (branchIndex !== null) {
            await checkoutBranch(branchIndex);
          }
        }}
        children={repositorySelection.branches.map((branch) => {
          return (isSelected: boolean) => (
            <div
              key={branch.name}
              className={`${isSelected || branch.name === repositorySelection.repository.checkedOutBranch ? "bg-retro-active text-white" : "bg-white text-black"} hover:bg-retro-pressed cursor-pointer border-r border-l border-solid border-black`}
            >
              {branch.name}
            </div>
          );
        })}
        selectClassName="retro-scrollbar bg-white border-2 border-retro border-solid outline-1 outline-black outline-t-0 border-t-0"
        tabIndex={2}
        trigger={RetroBranchDropdownTrigger}
        checkedOutBranchName={repositorySelection.repository.checkedOutBranch}
      />
    </>
  );
}
