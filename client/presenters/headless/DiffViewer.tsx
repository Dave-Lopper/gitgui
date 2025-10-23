import { DiffFile } from "../../domain/diff";

// import "./App.css";

export default function DiffViewer({ diff }: { diff: DiffFile }) {
  console.log({ diff });
  let status = "";
  let path = "";
  if (diff.oldPath && diff.newPath && diff.oldPath == diff.newPath) {
    status = "MODIFIED";
    path = diff.newPath;
  } else if (diff.oldPath === null && diff.newPath) {
    status = "ADDED";
    path = diff.newPath;
  } else if (diff.newPath === null && diff.oldPath) {
    status = "REMOVED";
    path = diff.oldPath;
  } else {
    status = "MOVED";
    path = `${diff.oldPath} -> ${diff.newPath}`;
  }

  let colorClass = "";
  if (status === "MODIFIED") {
    colorClass = "text-amber-600";
  } else if (status === "ADDED") {
    colorClass = "text-emerald-600";
  } else if (status === "MOVED") {
    colorClass = "text-sky-600";
  } else {
    colorClass = "text-rose-600";
  }

  return (
    <div className="m-0 flex h-full w-full flex-col items-start justify-start p-4 bg-white select-text overflow-auto">
      <div className="mt-2 flex flex-col items-start justify-start">
        <div className="mt-4 flex flex-col items-start">
          <div className="mt-2 flex flex-col items-start">
            {diff.hunks.map((hunk) => (
              <div className="mt-2 flex flex-col items-start">
                <div className="text-black">
                  @@ {hunk.oldLineStart},{hunk.oldLineStart + hunk.oldLineCount}{" "}
                  -&gt; {hunk.newLineStart},
                  {hunk.newLineStart + hunk.newLineCount} @@
                </div>
                {hunk.enclosingBlock && (
                  <span className="text-black">{hunk.enclosingBlock}</span>
                )}
                <div className="flex flex-col items-start bg-red-400 mb-2">
                  {hunk.beforeDiff &&
                    hunk.beforeDiff.map((line) => (
                      <div className="flex items-start font-semibold text-white LINE">
                        {line.parts.map((part) => {
                          if (part.status === "UNCHANGED") {
                            return (
                              <span className="whitespace-pre">
                                {part.content}
                              </span>
                            );
                          }
                          if (part.status === "REMOVED") {
                            return (
                              <span className="bg-red-600 whitespace-pre">
                                {part.content}
                              </span>
                            );
                          }
                        })}
                      </div>
                    ))}
                </div>

                <div className="flex flex-col items-start flex-center bg-emerald-400 mb-2">
                  {hunk.afterDiff &&
                    hunk.afterDiff.map((line) => (
                      <div className="flex items-start font-semibold text-white LINE">
                        <div className="flex">
                          {line.parts.map((part: any) => {
                            if (part.status === "UNCHANGED") {
                              return (
                                <span className="whitespace-pre-wrap">
                                  {part.content}
                                </span>
                              );
                            }
                            if (part.status === "ADDED") {
                              return (
                                <span className="bg-green-600 whitespace-pre-wrap">
                                  {part.content}
                                </span>
                              );
                            }
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
