import { useEffect, useRef, useState } from "react";

import { eventBus } from "../../../bootstrap";
import { RepositorySelectionDto } from "../../../dto/repo-selection";
import { SelectDropdown as HeadlessSelectDropdown } from "../../headless";
import RetroButton from "./Button";

function RetroBranchDropdownTrigger({
  isActive,
  isFocused,
}: {
  isActive: boolean;
  isFocused: boolean;
}) {
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
    <RetroButton isActive={isActive} ref={buttonRef} className="w-full px-8">
      Select branch
    </RetroButton>
  );
}

const options = ["branch1", "branch2", "branch3"];

export default function RetroBranchDropdown() {
  const [repositorySelection, setRepositorySelection] =
    useState<RepositorySelectionDto>();

  eventBus.subscribe("RepositorySelected", (event) =>
    setRepositorySelection(event.payload),
  );

  if (!repositorySelection) {
    return (
      <div className="h-12" style={{ borderBottom: "1px solid #404040" }}></div>
    );
  }

  return (
    <HeadlessSelectDropdown
      animate={false}
      handleSelect={(val) => console.log(val, "selected")}
      children={options.map((option) => (isSelected: boolean) => (
        <div
          key={option}
          className={`${isSelected ? "bg-retro-active text-white" : ""} hover:bg-retro-pressed bg-retro cursor-pointer text-black`}
        >
          {option}
        </div>
      ))}
      className="w-full"
      tabIndex={2}
      trigger={RetroBranchDropdownTrigger}
    ></HeadlessSelectDropdown>
  );
}
