import { FileDiff, getDiffFileName } from "../../types";

export default function Diff({ diff }: { diff: FileDiff }) {
  return (
    <div className="flex-1 flex-col overflow-y-auto" style={{ flex: 1 }}>
      <div className="fixed right-0 h-10 w-1/2 border-b-1 border-white bg-stone-800 p-2 text-right">
        {getDiffFileName(diff)}
      </div>

      {diff.hunks.map((hunk, index) => (
        <div className={`flex flex-col ${index === 0 && "mt-10"}`}>
          <div className="text-md pl-2 text-left font-[consolas]">
            @@ {hunk.oldStart},{hunk.oldLines} {hunk.newStart},{hunk.newLines}{" "}
            @@
          </div>
          <div className="mt-2 mb-2 flex flex-col border-t-1 border-b-1 border-white">
            {hunk.lines.map((line) => {
              let lineColor: string;
              switch (line.type) {
                case "added":
                  lineColor = "rgba(41, 234, 105, 0.3)";
                  break;
                case "removed":
                  lineColor = "rgba(234, 41, 102, 0.3)";
                  break;
                default:
                  lineColor = "transparent";
                  break;
              }
              return (
                <div className="grid w-full grid-cols-24">
                  <div className="border-r-1 border-white p-1 font-[consolas] text-xs">
                    {line.oldLineNumber}
                  </div>
                  <div className="border-r-1 border-white p-1 font-[consolas] text-xs">
                    {line.newLineNumber}
                  </div>
                  <div
                    className="col-span-22 w-full pl-2 text-left font-[consolas] whitespace-pre"
                    style={{ backgroundColor: lineColor }}
                    dangerouslySetInnerHTML={{
                      __html: line.content
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#39;")
                        .replace(
                          /\{\{\+\}\}/g,
                          `<span style="background-color: rgba(41, 234, 105, 0.5);white-space: pre;">`,
                        )
                        .replace(
                          /\{\{\-\}\}/g,
                          `<span style="background-color: rgba(234, 41, 102, 0.5);white-space: pre;">`,
                        )
                        .replace(/\{\{\/\+\}\}/g, "</span>")
                        .replace(/\{\{\/\-\}\}/g, "</span>"),
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
