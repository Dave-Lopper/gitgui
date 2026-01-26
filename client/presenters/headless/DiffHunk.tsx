import { ComponentType } from "react";

import { DiffRepresentation, Hunk } from "../../domain/diff";
import { ContextMenuItemProps } from "./ContextMenu";
import DiffLine from "./DiffLine";

export default function DiffHunk({
  hunk,
  contextMenuOption: ContextMenuOption,
}: {
  contextMenuOption: ComponentType<ContextMenuItemProps>;
  hunk: Hunk<DiffRepresentation>;
}) {
  return (
    <div className=" flex flex-col items-start w-full">
      <div className="text-black bg-retro retro-borders border-2 px-2 py-[2px] w-full font-retro flex justify-start">
        @@ - {hunk.oldLineStart}
        {hunk.oldLineCount !== undefined ? (
          <>, {hunk.oldLineStart + hunk.oldLineCount}</>
        ) : (
          <> </>
        )}
        &gt; + {hunk.newLineStart}
        {hunk.newLineCount !== undefined ? (
          <>, {hunk.newLineStart + hunk.newLineCount}</>
        ) : (
          <> </>
        )}{" "}
        @@
        {hunk.enclosingBlock && (
          <span className="text-black ml-5">{hunk.enclosingBlock}</span>
        )}
      </div>

      <div className="flex flex-col items-start w-full border-retro border-b-1">
        {hunk.lines.map((line) => (
          <DiffLine line={line} contextMenuOption={ContextMenuOption} />
        ))}
      </div>
    </div>
  );
}
