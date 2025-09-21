import RetroCheckbox from "./Checkbox";
import { ThemedFileOptionProps } from "../../headless/ModifiedFilesList";

export default function RetroDiffFileOption({
  file,
  isSelected,
  onClick,
  onContextMenu,
  toggleStaging,
}: ThemedFileOptionProps) {
  return (
    <div
      className={`font-retro flex cursor-pointer items-center py-[4px] pl-2 ${isSelected ? "bg-retro-active text-white" : "hover:bg-retro-pressed bg-white text-black"}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      data-file-option="true"
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
