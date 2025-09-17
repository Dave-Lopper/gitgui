import { DiffFileProps } from "../../headless/ModifiedFilesList";

export default function RetroDiffFile({
  file,
  isSelected,
  onClick,
}: DiffFileProps) {
  return (
    <div
      className={`font-retro py-[2px] pl-2 text-left ${isSelected ? "bg-retro-active text-white" : "hover:bg-retro-pressed cursor-pointer bg-white text-black"}`}
      onClick={onClick}
    >
      {file.displayPaths[0]}
    </div>
  );
}
