import { RightClickMenuOptionProps } from "../../headless/DiffFileOptionRightClickMenu";

export default function RetroDiffFileListRightClickMenuOption({
  onClick,
  text,
}: RightClickMenuOptionProps) {
  return (
    <span
      role="button"
      className="hover:bg-retro-active w-full cursor-pointer py-[2px] pl-2 text-left hover:text-white"
      onClick={onClick}
    >
      {text}
    </span>
  );
}
