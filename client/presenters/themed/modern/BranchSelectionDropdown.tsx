import { useState } from "react";

import { eventBus } from "../../../bootstrap";
import { RepositorySelectionDto } from "../../../dto/repo-selection";
import { SelectDropdown as HeadlessSelectDropdown } from "../../headless";
import { DropdownTriggerProps } from "../../headless/SelectDropdown";
import ModernDropdownTrigger from "./DropdownTrigger";

function BranchDropdownTrigger({ isActive, isFocused }: DropdownTriggerProps) {
  return (
    <ModernDropdownTrigger
      copy="Select branch"
      isActive={isActive}
      isFocused={isFocused}
    />
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
      <div className="border-b-modern-dark-border bg-modern-dark-pri h-24 border-b-1 border-solid"></div>
    );
  }

  return (
    <HeadlessSelectDropdown
      animate={false}
      handleSelect={(val) => console.log(val, "selected")}
      children={options.map((option) => (isSelected: boolean) => (
        <div
          key={option}
          className={`bg-modern-sec cursor-pointer text-white hover:underline`}
        >
          {option}
        </div>
      ))}
      className="w-full"
      tabIndex={2}
      trigger={BranchDropdownTrigger}
    ></HeadlessSelectDropdown>
  );
}
