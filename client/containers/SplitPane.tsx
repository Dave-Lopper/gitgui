import { ReactNode } from "react";

import { useSplitPane } from "../controlers/split-pane";

export default function SplitPane({
  leftPane,
  rightPane,
}: {
  leftPane: ReactNode;
  rightPane: ReactNode;
}) {
  const { containerRef, handleMouseDown, isDragging, splitPercentage } =
    useSplitPane({
      initialSplitPercentage: 50,
      minPercentage: 15,
    });

  return (
    <div ref={containerRef} className="flex h-full w-full">
      <div className="overflow-hidden" style={{ width: `${splitPercentage}%` }}>
        {leftPane}
      </div>

      <div
        className={`group relative w-1 flex-shrink-0 cursor-col-resize bg-gray-300 transition-colors duration-150 hover:bg-blue-400 ${isDragging ? "bg-blue-500" : ""} `}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 transform opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-8 w-0.5 rounded bg-white shadow-sm"></div>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-hidden"
        style={{ width: `${100 - splitPercentage}%` }}
      >
        {rightPane}
      </div>
    </div>
  );
}
