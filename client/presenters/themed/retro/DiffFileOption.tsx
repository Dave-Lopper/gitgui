import { FileStatus } from "../../../domain/diff";
import { ThemedFileOptionProps } from "../../headless/ModifiedFilesList";
import RetroCheckbox from "./Checkbox";

export default function RetroDiffFileOption({
  file,
  isSelected,
  onClick,
  onContextMenu,
  showStaged,
  toggleStaging,
}: ThemedFileOptionProps) {
  const colors: { [K in FileStatus]: string[] } = {
    ADDED: ["border-green-500", "bg-green-500"],
    MODIFIED: ["border-yellow-400", "bg-yellow-400"],
    MOVED: ["border-blue-600", "bg-blue-600"],
    REMOVED: ["border-rose-700", "bg-rose-700"],
  };

  return (
    <div
      className={`font-retro flex cursor-pointer items-center py-[4px] pl-2 ${isSelected ? "bg-retro-active text-white" : "hover:bg-retro-pressed bg-white text-black"}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      data-file-option="true"
    >
      {showStaged && (
        <RetroCheckbox
          isChecked={file.staged}
          onClick={toggleStaging}
          className="mr-2"
        />
      )}

      <span
        className={`h-[20px] w-[20px] border-[2px] ${colors[file.status][0]} flex items-center justify-center mr-3 ml-1`}
      >
        <span
          className={`h-[8px] w-[8px] rounded-full ${colors[file.status][1]}`}
        ></span>
      </span>

      {file.path}
    </div>
  );
}
