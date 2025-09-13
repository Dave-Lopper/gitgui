import { forwardRef } from "react";

import { useButton, ButtonProps } from "../../headless";

import "./styles/Button.css";

export default forwardRef<
  HTMLButtonElement,
  ButtonProps & { disabled?: boolean }
>(({ className, disabled, isActive, children, onClick, tabIndex }, ref) => {
  const {
    isPressed,
    handleKeyDown,
    handleKeyUp,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
  } = useButton(onClick);

  return (
    <button
      className={`font-retro retro-button h-12 ${disabled ? "bg-retro-menu-pressed cursor-not-allowed" : "bg-retro-menu cursor-pointer"} border-2 py-2 text-black ${className ? className : ""} ${isPressed || isActive ? "pressed" : ""}`}
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
});
