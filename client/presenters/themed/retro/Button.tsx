import { forwardRef } from "react";

import { useButton, ButtonProps } from "../../headless";

import "./styles/Button.css";

export default forwardRef<
  HTMLButtonElement,
  ButtonProps & { isActive: boolean }
>(({ className, isActive, children, onClick }, ref) => {
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
      className={`bg-retro-menu font-retro retro-button h-12 cursor-pointer border-2 py-2 text-black ${className ? className : ""} ${isPressed || isActive ? "pressed" : ""}`}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
});
