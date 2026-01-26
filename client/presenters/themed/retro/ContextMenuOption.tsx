import { ContextMenuItemProps } from "../../headless/ContextMenu";

export default function RetroContextMenuOption({
  onClick,
  onMouseEnter,
  onMouseLeave,
  text,
}: ContextMenuItemProps) {
  return (
    <div
      role="button"
      className="hover:bg-retro-active w-full cursor-pointer py-[2px] pl-2 text-left hover:text-white"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {text}
    </div>
  );
}
