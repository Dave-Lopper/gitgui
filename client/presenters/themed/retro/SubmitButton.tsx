import HourglassIcon from "../../../icons/retro/Hourglass";
import { SubmitButtonProps } from "../../headless/types";
import RetroButton from "./Button";

export default function SubmitButton({
  disabled,
  onClick,
  isLoading,
  loadingText,
  text,
}: SubmitButtonProps) {
  return (
    <RetroButton
      className="h-8 px-4"
      disabled={disabled}
      isActive={false}
      sound
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center w-full justify-center">
          {loadingText ? loadingText : "Loading"}{" "}
          <span className="rotating ml-2">
            <HourglassIcon size={16} color="#000" />
          </span>
        </div>
      ) : (
        text
      )}
    </RetroButton>
  );
}
