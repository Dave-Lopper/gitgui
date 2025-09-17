import { DiffFileProps } from "../../headless/ModifiedFilesList";

export default function ModernDiffFile({
  file,
  isSelected,
  onClick,
}: DiffFileProps) {
  return (
    <div
      className={`font-modern py-[6px] pl-2 text-left transition-colors duration-500 ${isSelected ? "bg-modern-dark-qua text-white" : "hover:bg-modern-dark-qui bg-modern-dark-sec cursor-pointer text-white hover:text-black"}`}
      onClick={onClick}
    >
      {file.displayPaths[0]}
    </div>
  );
}
