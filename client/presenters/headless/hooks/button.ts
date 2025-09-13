import { MouseEvent, ReactNode, useState, useCallback } from "react";

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  isActive: boolean;
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
  tabIndex?: number;
};

export function useButton(onClick?: () => void) {
  const [isPressed, setIsPressed] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsPressed(true);
      }
    },
    [],
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        setIsPressed(false);
        if (onClick) {
          onClick();
        }
      }
    },
    [],
  );

  const handleMouseDown = useCallback(() => setIsPressed(true), []);
  const handleMouseUp = useCallback(() => setIsPressed(false), []);
  const handleMouseLeave = useCallback(() => setIsPressed(false), []);

  return {
    handleKeyDown,
    handleKeyUp,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    isPressed,
  };
}
