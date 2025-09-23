import {
  SelectDropdown as HeadlessSelectDropdown,
  useRepositorySelection,
} from "../../headless";
import { DropdownTriggerProps } from "../../headless/SelectDropdown";
import ModernDropdownTrigger from "./DropdownTrigger";

function BranchDropdownTrigger({
  isActive,
  isFocused,
  checkedOutBranchName,
}: DropdownTriggerProps & { checkedOutBranchName: string }) {
  return (
    <ModernDropdownTrigger
      copy={
        <div className="mr-4 flex flex-col justify-center">
          <span className="text-left text-sm text-neutral-500">
            Current branch
          </span>
          <span className="text-md text-left text-white">
            {checkedOutBranchName}
          </span>
        </div>
      }
      isActive={isActive}
      isFocused={isFocused}
    />
  );
}

export default function RetroBranchDropdown() {
  const { repositorySelection } = useRepositorySelection();

  if (!repositorySelection) {
    return (
      <div className="border-b-modern-dark-border bg-modern-dark-pri h-24 border-b-1 border-solid"></div>
    );
  }

  return (
    <HeadlessSelectDropdown
      animate
      handleSelect={(val) => console.log(val, "selected")}
      children={repositorySelection.branches.map(
        (branch) => (isSelected: boolean) => (
          <div
            key={branch.name}
            className={`${isSelected || branch.name === repositorySelection.repository.checkedOutBranch ? "bg-modern-dark-qua" : "bg-modern-dark-ter hover:bg-modern-dark-qua"} cursor-pointer py-2 text-white transition-colors`}
          >
            {branch.name}
          </div>
        ),
      )}
      selectClassName="modern-scrollbar bg-modern-dark-ter"
      tabIndex={2}
      trigger={BranchDropdownTrigger}
      checkedOutBranchName={repositorySelection.repository.checkedOutBranch}
    ></HeadlessSelectDropdown>
  );
}
