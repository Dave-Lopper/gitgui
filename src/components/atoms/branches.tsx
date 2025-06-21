import { useMemo } from "react";

import { OnDiskIcon } from "../../icons";
import { Branch } from "../../types";

export default function Branches({ branches }: { branches: Branch[] }) {
  const colors = useMemo(
    () => [
      "text-green-500",
      "text-indigo-600",
      "text-amber-600",
      "text-rose-500",
    ],
    [],
  );
  const distinctRemotes = useMemo(() => {
    const remotes = branches.map((branch) => branch.remote).filter((_) => _);
    const distinctRemotes = [...new Set(remotes)];
    return distinctRemotes;
  }, [branches]);

  return (
    <>
      <label className="text-md w-full text-start">Checkout:</label>
      <div className="averflow-y-scroll w-full">
        {branches.map((branch) => {
          let colorIndex: number;
          const uniqueRemoteIndex = distinctRemotes.indexOf(branch.remote);
          if (uniqueRemoteIndex < colors.length && uniqueRemoteIndex > -1) {
            colorIndex = uniqueRemoteIndex;
          } else {
            const multiple = Math.floor(uniqueRemoteIndex / colors.length);
            colorIndex = uniqueRemoteIndex - colors.length * multiple;
          }

          return (
            <div
              className="relative cursor-pointer p-2 text-right transition-colors hover:bg-stone-600"
              onClick={() => console.log(branch.remote)}
            >
              <div className="absolute top-2 left-2 flex text-xs">
                {branch.isLocal && <OnDiskIcon size={24} color="grey" />}
                <span
                  className={`${branch.isLocal && "ml-2"} ${colors[colorIndex]}`}
                >
                  {branch.remote}
                </span>
              </div>

              {branch.name}
            </div>
          );
        })}
      </div>
    </>
  );
}
