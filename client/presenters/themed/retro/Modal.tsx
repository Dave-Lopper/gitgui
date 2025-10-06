import { CloseRetroIcon } from "../../../icons/retro";
import { ModalProps } from "../../headless/types";
import Button from "./Button";

export default function RetroModal({
  children,
  close,
  modalClassname,
  title,
}: ModalProps) {
  return (
    <div
      className={`absolute retro-borders border-2 bg-retro p-[2px] flex flex-col justify-start w-1/3 top-1/3 ${modalClassname ? modalClassname : ""}`}
    >
      <div className="h-[28px] w-full bg-retro-active flex justify-between items-center font-retro text-white font-bold  pl-[4px]">
        {title}
        <Button className="p-[2px] mr-[2px]" isActive={false} onClick={close} sound>
          <CloseRetroIcon size={14} color="#000" cursor="pointer" />
        </Button>
      </div>
      <div className="p-4 flex flex-col">{children}</div>
    </div>
  );
}
