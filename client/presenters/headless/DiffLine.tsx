import { ComponentType, useMemo, useRef, useState } from "react";

import { useCases } from "../../bootstrap";
import { DiffLine as DiffLineType } from "../../domain/diff";
import ContextMenu, { ContextMenuItemProps } from "./ContextMenu";
import { useContextMenu } from "./hooks/context-menu";

export default function DiffLine({
  contextMenuOption: ContextMenuOption,
  line,
}: {
  contextMenuOption: ComponentType<ContextMenuItemProps>;
  line: DiffLineType;
}) {
  const [isSelected, setIsSelected] = useState(false);
  const diffColors = useMemo<{
    ADDED: { bg: string; highlight: string; hover: string };
    REMOVED: { bg: string; highlight: string; hover: string };
  }>(
    () => ({
      ADDED: {
        bg: "bg-emerald-400",
        highlight: "bg-green-600",
        hover: "hover:bg-green-600",
      },
      REMOVED: {
        bg: "bg-red-400",
        highlight: "bg-red-600",
        hover: "hover:bg-red-600",
      },
    }),
    [],
  );

  const contextMenuItems = useMemo<ContextMenuItemProps[]>(
    () => [
      {
        text: "Copy line to clipboard",
        onClick: async () => await useCases.copyDiffLine.execute(line),
        onMouseEnter: async () => {
          setIsSelected(true);
        },
        onMouseLeave: async () => {
          setIsSelected(false);
        },
      },
    ],
    [],
  );

  const contextMenu = useContextMenu();
  const isContextMenuOpen = useRef(false);

  return (
    <div
      className="flex items-start font-semibold w-full cursor-pointer"
      onMouseEnter={() => setIsSelected(true)}
      onMouseLeave={() => !isContextMenuOpen.current && setIsSelected(false)}
      onContextMenu={(e) => {
        isContextMenuOpen.current = true;
        setIsSelected(true);
        contextMenu.open(e);
        e.preventDefault();
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <ContextMenu
        containerClassName="bg-retro font-retro retro-borders absolute w-[300px] border-[2px] text-black"
        isOpen={contextMenu.isOpen}
        itemComponent={ContextMenuOption}
        items={contextMenuItems}
        position={contextMenu.position}
        onClose={() => {
          isContextMenuOpen.current = false;
          setIsSelected(false);
          contextMenu.close();
        }}
      />
      {line.type === "CONTEXT" ? (
        <div className="flex item-start justify-start hover:bg-retro-pressed w-full bg-white">
          <span className="bg-retro border-black font-retro text-black font-thin flex text-xs">
            <span className="border-r-[1px]  w-6 h-6 flex justify-center items-center ">
              {line.oldN}
            </span>
            <span className="border-r-[1px] w-6 h-6 flex justify-center items-center ">
              {line.newN}
            </span>
          </span>

          <span className="whitespace-pre text-black flex flex-row">
            {Array.isArray(line.content) ? (
              line.content.map((token) => (
                <pre className={token.type}>{token.value}</pre>
              ))
            ) : (
              <pre>{line.content}</pre>
            )}
          </span>
        </div>
      ) : (
        <div
          className={`flex w-full ${isSelected ? diffColors[line.type].highlight : diffColors[line.type]} ${diffColors[line.type].bg} cursor-pointer`}
        >
          <span className="bg-retro border-black font-retro text-black font-thin flex text-xs">
            <span className="border-r-[1px]  w-6 h-6 flex justify-center items-center ">
              {line.type === "ADDED" && line.n}
            </span>
            <span className="border-r-[1px] w-6 h-6 flex justify-center items-center ">
              {line.type === "REMOVED" && line.n}
            </span>
          </span>
          {line.parts.map((part) => (
            <span
              className={`
                                ${
                                  part.type === "DIFF"
                                    ? diffColors[line.type].highlight
                                    : ""
                                } whitespace-pre flex flex-row
                              `}
            >
              {typeof part.content === "string" ? (
                <pre>{part.content}</pre>
              ) : (
                part.content.map((token) => (
                  <pre className={token.type}>{token.value}</pre>
                ))
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
