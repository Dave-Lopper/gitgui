import { ReactNode, useState } from "react";

import { defaultTab, RepoTabsContext, RepoTab } from "./context";
import { CurrentDiffFile } from "../../../domain/diff";

export function RepoTabsContextProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<RepoTab>(defaultTab);
  const [currentFile, setCurrentFile] = useState<CurrentDiffFile>();

  return (
    <RepoTabsContext.Provider
      value={{ currentFile, currentTab, setCurrentFile, setCurrentTab }}
    >
      {children}
    </RepoTabsContext.Provider>
  );
}
