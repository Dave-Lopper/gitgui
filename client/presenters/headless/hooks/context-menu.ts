import { useState } from "react";

export function useContextMenu() {
  const [isOpen, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const open = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  const close = () => setOpen(false);

  return {
    isOpen,
    position,
    open,
    close,
  };
}
