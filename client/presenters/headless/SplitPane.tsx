import { ReactNode } from "react";

import { useSplitPane } from "./hooks/split-pane";

export default function SplitPane({
  divider,
  leftPane,
  leftPaneClassName,
  rightPane,
  rightPaneClassName,
}: {
  divider: ReactNode;
  leftPane: ReactNode;
  leftPaneClassName?: string;
  rightPane: ReactNode;
  rightPaneClassName?: string;
}) {
  const { containerRef, handleMouseDown, splitPercentage } = useSplitPane({
    initialSplitPercentage: 50,
    minPercentage: 15,
  });

  return (
    <div ref={containerRef} className="flex h-full w-full">
      <div
        className={`overflow-hidden ${leftPaneClassName ? leftPaneClassName : ""}`}
        style={{ width: `${splitPercentage}%` }}
      >
        {leftPane}
      </div>

      <div onMouseDown={handleMouseDown}>{divider}</div>

      <div
        className={`flex-1 overflow-hidden ${rightPaneClassName ? rightPaneClassName : ""}`}
        style={{ width: `${100 - splitPercentage}%` }}
      >
        {rightPane}
      </div>
    </div>
  );
}
