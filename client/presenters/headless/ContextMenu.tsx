import { ComponentType, useEffect } from "react";
import { createPortal } from "react-dom";

export type ContextMenuItemProps = {
  text: string;
  onClick: () => Promise<void>;
  onMouseEnter?: () => Promise<void>;
  onMouseLeave?: () => Promise<void>;
};
export type ContextMenuProps = {
  containerClassName?: string;
  isOpen: boolean;
  itemComponent: ComponentType<ContextMenuItemProps>;
  items: ContextMenuItemProps[];
  position: { x: number; y: number };
  onClose: () => void;
};

export default function ContextMenu({
  containerClassName,
  isOpen,
  itemComponent: ItemComponent,
  items,
  position,
  onClose,
}: ContextMenuProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = () => onClose();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
      }}
      className={`context-menu ${containerClassName ? containerClassName : ""}`}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {items.map((item) => (
        <ItemComponent
          key={item.text}
          onClick={async () => {
            await item.onClick();
            onClose();
          }}
          onMouseEnter={item.onMouseEnter}
          onMouseLeave={item.onMouseLeave}
          text={item.text}
        />
      ))}
    </div>,
    document.body,
  );
}
