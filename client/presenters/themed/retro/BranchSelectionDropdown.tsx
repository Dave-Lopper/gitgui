import { useEffect, useRef, useState } from "react";

import { eventBus } from "../../../bootstrap";
import { RepositorySelectionDto } from "../../../dto/repo-selection";
import {
  SelectDropdown as HeadlessSelectDropdown,
  useSelectedRepository,
} from "../../headless";
import RetroButton from "./Button";
import { DropdownTriggerProps } from "../../headless/SelectDropdown";

function RetroBranchDropdownTrigger({
  isActive,
  isFocused,
}: DropdownTriggerProps) {
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
      className="h-12 w-full px-8 py-2"
    >
      Select branch
    </RetroButton>
  );
}

const options = ["branch1", "branch2", "branch3"];

export default function RetroBranchDropdown() {
  const { selectedRepository } = useSelectedRepository();

  if (!selectedRepository) {
    return (
      <div className="h-12" style={{ borderBottom: "2px solid white" }}></div>
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
