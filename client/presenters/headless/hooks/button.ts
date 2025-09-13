import { MouseEvent, ReactNode, useState, useCallback } from "react";

import { useSoundEffect } from "./sound-effect";

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  isActive: boolean;
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
  tabIndex?: number;
};

export function useButton(
  sound: boolean,
  disabled: boolean,
  onClick?: () => void,
) {
  const [isPressed, setIsPressed] = useState(false);
  const buttonPressedSoundEffect = useSoundEffect("BUTTON_PRESSED");
  const buttonDisabledSoundEffect = useSoundEffect("BUTTON_DISABLED");

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" && !disabled) {
        e.preventDefault();
        if (sound) {
          buttonPressedSoundEffect.play();
        }
        setIsPressed(true);
      } else if (e.key === "Enter" && disabled && sound) {
        buttonDisabledSoundEffect.play();
      }
    },
    [disabled, sound],
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" && !disabled) {
        setIsPressed(false);
        if (onClick) {
          onClick();
        }
      }
    },
    [disabled],
  );

  const handleMouseDown = useCallback(() => {
    if (!disabled) {
      if (sound) {
        buttonPressedSoundEffect.play();
      }
      setIsPressed(true);
    } else if (sound) {
      buttonDisabledSoundEffect.play();
    }
  }, [disabled, sound]);
  const handleMouseUp = useCallback(
    () => !disabled && setIsPressed(false),
    [disabled],
  );
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
