import { useButton } from "../../headless";
import type { ButtonProps } from "../../headless";

export default function ModernButton({
  className,
  children,
  disabled,
  onClick,
  sound,
  tabIndex,
}: ButtonProps & { disabled?: boolean; sound?: boolean }) {
  const {
    handleKeyDown,
    handleKeyUp,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
  } = useButton(
    sound === undefined ? false : sound,
    disabled === undefined ? false : disabled,
    onClick,
  );

  return (
    <button
      className={`${disabled ? "bg-modern-dark-qui cursor-not-allowed text-neutral-400" : "bg-modern-dark-ter hover:bg-modern-dark-qua cursor-pointer text-white"} font-modern rounded-md transition-colors focus:border-none focus:outline-offset-0 focus:outline-sky-500 focus:outline-solid ${className ? className : ""}`}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {children}
    </button>
  );
}
