import { forwardRef } from "react";

import { useButton } from "../../headless";
import type { ButtonProps } from "../../headless";

import "./styles/RetroButton.css";

export default forwardRef<
  HTMLButtonElement,
  ButtonProps & { disabled?: boolean; sound?: boolean }
>(
  (
    { className, disabled, isActive, children, onClick, sound, tabIndex },
    ref,
  ) => {
    const {
      isPressed,
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
        className={`font-retro retro-button ${disabled ? "bg-retro-pressed cursor-not-allowed text-neutral-500" : "bg-retro cursor-pointer text-black"} border-2 ${className ? className : ""} ${isPressed || isActive ? "pressed" : ""}`}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        ref={ref}
        tabIndex={tabIndex}
      >
        {children}
      </button>
    );
  },
);
