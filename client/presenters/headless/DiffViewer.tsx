import { useMemo } from "react";

import { ChangedLineStatus, DiffEntry, File } from "../../domain/diff";

// import "./App.css";

export default function DiffViewer({ diff }: { diff: DiffEntry }) {
  console.log({ diff });

  const diffColors = useMemo<{
    ADDED: { bg: string; highlight: string };
    REMOVED: { bg: string; highlight: string };
  }>(
    () => ({
      ADDED: { bg: "bg-emerald-400", highlight: "bg-green-600" },
      REMOVED: { bg: "bg-red-400", highlight: "bg-red-600" },
    }),
    [],
  );

  return (
    <div className="m-0 flex h-full w-full flex-col items-start justify-start bg-white select-text overflow-auto font-[consolas]">
      <div className="flex flex-col items-start justify-start w-full">
        <div className=" flex flex-col items-start w-full">
          <div className="flex flex-col items-start w-full">
            {diff.hunks.map((hunk) => (
              <div className="mb-2 flex flex-col items-start w-full">
                <div className="text-black bg-retro retro-borders border-2 px-2 py-[2px] w-full font-retro">
                  @@ {hunk.oldLineStart},{hunk.oldLineStart + hunk.oldLineCount}{" "}
                  -&gt; {hunk.newLineStart},
                  {hunk.newLineStart + hunk.newLineCount} @@
                </div>
                {hunk.enclosingBlock && (
                  <span className="text-black">{hunk.enclosingBlock}</span>
                )}
                <div className="flex flex-col items-start mb-2 w-full">
                  {hunk.lines.map((line) => (
                    <div className="flex items-start font-semibold text-white LINE w-full">
                      {line.type === "CONTEXT" ? (
                        <span className="whitespace-pre text-black">
                          {line.content}
                        </span>
                      ) : (
                        <div
                          className={`flex w-full ${diffColors[line.type].bg}`}
                        >
                          {line.parts.map((part) => (
                            <span
                              className={`
                                ${
                                  part.type === "DIFF"
                                    ? diffColors[line.type].highlight
                                    : ""
                                } whitespace-pre
                              `}
                            >
                              {part.content}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* {line.parts.map((part) => {
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
                        })} */}
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
