import { CheckboxProps } from "../../headless/types";
import "./styles/RetroCheckbox.css";

export default function RetroCheckbox({
  className,
  isChecked,
  onClick,
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={`cursor-pointer ${className ? className : ""}`}
      checked={isChecked}
      onClick={onClick}
    />
  );
}
