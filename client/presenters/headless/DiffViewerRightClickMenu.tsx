import { ComponentType, useCallback } from "react";

import { useCases } from "../../bootstrap";
import { DiffRepresentation, LinePart } from "../../domain/diff";

export type RightClickMenuOptionProps = {
  text: string;
  onClick: () => Promise<void>;
};

type DiffViewerOptionRightClickMenuProps = {
  containerClassname?: string;
  menuOption: ComponentType<RightClickMenuOptionProps>;
  position: number[] | null;
  clickedLine: LinePart<DiffRepresentation>[] | null;
};

export default function DiffFileOptionRightClickMenu({
  clickedLine,
  containerClassname,
  menuOption: MenuOption,
  position,
}: DiffViewerOptionRightClickMenuProps) {
  const copyLine = useCallback(async () => {}, []);

  return (
    <div
      className={`fixed flex flex-col ${containerClassname ? containerClassname : ""}`}
      style={
        position
          ? { top: `${position[1]}px`, left: `${position[0]}px` }
          : { display: "none" }
      }
    >
      <MenuOption text="Copy line to clipboard" onClick={copyLine} />
    </div>
  );
}
