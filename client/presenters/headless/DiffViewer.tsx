import { ComponentType, useState } from "react";

import { DiffEntry, DiffRepresentation } from "../../domain/diff";
import { useEventSubscription } from "../../infra/react-bus-helper";
import { StatusEntryWithIndex } from "../contexts/repo-tabs/context";
import RetroDiffFileListRightClickMenuOption from "../themed/retro/ContextMenuOption";
import ContextMenu, { ContextMenuItemProps } from "./ContextMenu";
import DiffHunk from "./DiffHunk";
import { useContextMenu } from "./hooks/context-menu";
import "./syntax-highlighting.css";

export default function DiffViewer({
  contextMenuOption: ContextMenuOption,
}: {
  contextMenuOption: ComponentType<ContextMenuItemProps>;
}) {
  const [fileSelection, setFileSelection] = useState<StatusEntryWithIndex[]>();
  const contextMenu = useContextMenu();
  const [viewedDiff, setViewedDiff] = useState<
    DiffEntry<DiffRepresentation> | undefined
  >();

  useEventSubscription(
    "DiffViewed",
    async (event) => {
      setViewedDiff(event.payload);
    },
    [],
  );

  useEventSubscription(
    "DiffSelectionModified",
    async (event) => setFileSelection(event.payload),
    [],
  );

  if (!viewedDiff && fileSelection && fileSelection.length > 1) {
    return <div>{fileSelection.length} files selected</div>;
  } else if (!viewedDiff && (!fileSelection || fileSelection.length === 0)) {
    return <div>No file selected</div>;
  }

  return (
    <div className="m-0 flex h-full w-full flex-col items-start justify-start bg-retro-desktop select-text overflow-auto font-[consolas] retro-scrollbar">
      <ContextMenu
        containerClassName="bg-retro font-retro retro-borders absolute w-[300px] border-[2px] text-black"
        isOpen={contextMenu.isOpen}
        itemComponent={RetroDiffFileListRightClickMenuOption}
        items={[
          {
            text: "Copy line to clipboard",
            onClick: async () => console.log("COPY"),
          },
        ]}
        position={contextMenu.position}
        onClose={contextMenu.close}
      />
      <div className="flex flex-col items-start justify-start w-full">
        <div className=" flex flex-col items-start w-full">
          <div className="flex flex-col items-start w-full">
            {viewedDiff?.hunks.map((hunk) => (
              <DiffHunk hunk={hunk} contextMenuOption={ContextMenuOption} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
