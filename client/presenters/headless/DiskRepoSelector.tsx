import { ReactNode, useCallback } from "react";

import { useCases } from "../../bootstrap";

export default function DiskRepositorySelector({
  children,
  tabIndex,
}: {
  children: ReactNode;
  tabIndex?: number;
}) {
  const selectRepository = useCallback(
    async () => await useCases.selectRepositoryFromDisk.execute(),
    [useCases],
  );

  return (
    <span
      className="cursor-pointer"
      role="button"
      tabIndex={tabIndex || 0}
      onClick={async () => await selectRepository()}
    >
      {children}
    </span>
  );
}
