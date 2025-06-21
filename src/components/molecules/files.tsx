import { useMemo } from "react";

import { FileDiff } from "../../types";
import { File } from "../atoms";

export default function Files({
  currentFile,
  setCurrentFile,
  files,
}: {
  currentFile: FileDiff | undefined;
  setCurrentFile: (v: FileDiff) => void;
  files: FileDiff[];
}) {
  const colors = useMemo(
    () => ({
      modified: "yellow",
      added: "green",
      deleted: "red",
      renamed: "blue",
    }),
    [],
  );

  return (
    <div className="flex-1 flex-col overflow-y-auto border-r-1 border-r-white">
      <div className="fixed left-0 h-10 w-1/2 border-r-1 border-b-1 border-white bg-stone-800 p-2 text-right">
        {files.length} file(s) changed
      </div>
      <div className="mt-10">
        {files.map((file, index) => {
          return (
            <File
              bgColor={colors[file.changeType]}
              currentFile={currentFile}
              file={file}
              setCurrentFile={setCurrentFile}
            />
          );
        })}
      </div>
    </div>
  );
}
