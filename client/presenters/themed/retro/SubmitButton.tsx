import { SubmitButtonProps } from "../../headless/types";
import RetroButton from "./Button";

export default function SubmitButton({
  disabled,
  onClick,
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
      {text}
    </RetroButton>
  );
}
