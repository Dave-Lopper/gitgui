import { ReactNode } from "react";

import { useSplitPane } from "../controlers/split-pane";

export default function SplitPane({
  divider,
  leftPane,
  rightPane,
}: {
  divider: ReactNode;
  leftPane: ReactNode;
  rightPane: ReactNode;
}) {
  const { containerRef, handleMouseDown, splitPercentage } = useSplitPane({
    initialSplitPercentage: 50,
    minPercentage: 15,
  });

  return (
    <div ref={containerRef} className="flex h-full w-full">
      <div className="overflow-hidden" style={{ width: `${splitPercentage}%` }}>
        {leftPane}
      </div>

      <div onMouseDown={handleMouseDown}>{divider}</div>

      <div
        className="flex-1 overflow-hidden"
        style={{ width: `${100 - splitPercentage}%` }}
      >
        {rightPane}
      </div>
    </div>
  );
}
