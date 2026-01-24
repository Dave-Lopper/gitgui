import { useMemo, useState } from "react";

import { DiffEntry, DiffRepresentation } from "../../domain/diff";
import { useEventSubscription } from "../../infra/react-bus-helper";
import { StatusEntryWithIndex } from "../contexts/repo-tabs/context";
import "./syntax-highlighting.css";

export default function DiffViewer() {
  const [fileSelection, setFileSelection] = useState<StatusEntryWithIndex[]>();
  const [viewedDiff, setViewedDiff] = useState<
    DiffEntry<DiffRepresentation> | undefined
  >();

  // useEventSubscription(
  //   "DiffSelectionModified",
  //   async (event) => {
  //     setFileSelection(event.payload);
  //     if (event.payload.length === 1) {
  //       setViewedDiff(event.payload[0]);
  //       console.log({ diff: event.payload[0] });
  //     } else {
  //       setViewedDiff(undefined);
  //     }
  //   },
  //   [],
  // );

  useEventSubscription(
    "DiffViewed",
    async (event) => {
      setViewedDiff(event.payload);
    },
    [],
  );

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

  if (!viewedDiff && fileSelection && fileSelection.length > 1) {
    return <div>{fileSelection.length} files selected</div>;
  } else if (!viewedDiff && (!fileSelection || fileSelection.length === 0)) {
    return <div>No file selected</div>;
  }
  console.log({ viewedDiff });

  return (
    <div className="m-0 flex h-full w-full flex-col items-start justify-start bg-retro-desktop select-text overflow-auto font-[consolas] retro-scrollbar">
      <div className="flex flex-col items-start justify-start w-full">
        <div className=" flex flex-col items-start w-full">
          <div className="flex flex-col items-start w-full">
            {viewedDiff?.hunks.map((hunk) => (
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
                    <span className="text-black ml-5">
                      {hunk.enclosingBlock}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start w-full border-retro border-b-1">
                  {hunk.lines.map((line) => (
                    <div className="flex items-start font-semibold LINE w-full cursor-pointer">
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
                          className={`flex w-full ${diffColors[line.type].hover} ${diffColors[line.type].bg} cursor-pointer`}
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
                              {Array.isArray(part.content) ? (
                                part.content.map((token) => (
                                  <pre className={token.type}>
                                    {token.value}
                                  </pre>
                                ))
                              ) : (
                                <pre>{part.content}</pre>
                              )}
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
