import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [diff, setDiff] = useState<any>();
  useEffect(() => {
    fetch("/diff-serialized.json")
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        setDiff(data);
      })
      .catch((err) => console.log({ err }));
  }, []);

  if (!diff) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-0 flex h-full w-full flex-col items-start justify-start p-4">
      Files:
      <div className="mt-2 flex flex-col items-start justify-start">
        {diff.map((file: any) => {
          let status = "";
          let path = "";
          if (file.oldPath && file.newPath && file.oldPath == file.newPath) {
            status = "MODIFIED";
            path = file.newPath;
          } else if (file.oldPath === null && file.newPath) {
            status = "ADDED";
            path = file.newPath;
          } else if (file.newPath === null && file.oldPath) {
            status = "REMOVED";
            path = file.oldPath;
          } else {
            status = "MOVED";
            path = `${file.oldPath} -> ${file.newPath}`;
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
            <div className="mt-4 flex flex-col items-start">
              <div className="flex">
                <span className={`${colorClass} w-20`}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </span>
                {path}
              </div>

              <div className="mt-2 flex flex-col items-start">
                {file.hunks.map((hunk: any) => (
                  <div className="mt-2 flex flex-col items-start">
                    <div>
                      @@ {hunk.oldStart},{hunk.oldStart + hunk.oldLineCount}{" "}
                      -&gt; {hunk.newStart},{hunk.newStart + hunk.newLineCount}{" "}
                      @@
                    </div>
                    {hunk.enclosingBlock && <span>{hunk.enclosingBlock}</span>}
                    <div className="flex flex-col items-start">
                      {hunk.lines.filter((line: any) =>
                        line.parts.some(
                          (part: any) => part.status === "REMOVED",
                        ),
                      ).length > 0 && (
                        <div className="mb-2 flex flex-col items-start bg-red-400 font-semibold text-white">
                          {hunk.lines.map((line: any) => (
                            <div className="">
                              {line.parts.map((part: any) => {
                                if (part.status === "UNCHANGED") {
                                  return part.content;
                                }
                                if (part.status === "REMOVED") {
                                  return (
                                    <span className="bg-red-600">
                                      {part.content}
                                    </span>
                                  );
                                }
                              })}
                            </div>
                          ))}
                        </div>
                      )}
                      {hunk.lines.filter((line: any) =>
                        line.parts.some((part: any) => part.status === "ADDED"),
                      ).length > 0 && (
                        <div className="mb-2 flex flex-col items-start bg-emerald-400 font-semibold text-white">
                          {hunk.lines.map((line: any) => (
                            <div className="">
                              {line.parts.map((part: any) => {
                                if (part.status === "UNCHANGED") {
                                  return part.content;
                                }
                                if (part.status === "ADDED") {
                                  return (
                                    <span className="bg-green-600">
                                      {part.content}
                                    </span>
                                  );
                                }
                              })}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
