import { DiffFile } from "../../../domain/diff";
import RetroCheckbox from "./Checkbox";

export default function RetroDiffFileOption({
  file,
  isSelected,
  toggleSelection,
  toggleStaging,
}: {
  file: DiffFile;
  isSelected: boolean;
  toggleSelection: () => void;
  toggleStaging: () => void;
}) {
  return (
    <div
      className={`font-retro flex cursor-pointer items-center py-[4px] pl-2 ${isSelected ? "bg-retro-active text-white" : "hover:bg-retro-pressed bg-white text-black"}`}
      onClick={toggleSelection}
    >
      <RetroCheckbox
        isChecked={file.staged}
        onClick={toggleStaging}
        className="mr-2"
      />
      {file.displayPaths.join("->")}
    </div>
  );
}
