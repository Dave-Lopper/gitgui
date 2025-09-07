import { ComponentType } from "react";

export type ButtonProps = {
  isActive: boolean;
  isFocused: boolean;
  onClick: () => void;
};

export type MainMenuProps = {
  soundTogglerButton: ComponentType<ButtonProps>;
};

export default function MainMenu({ soundTogglerButton }: MainMenuProps) {
  return <div className="flex">
    
  </div>;
}
