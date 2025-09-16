import { ReactNode, useState } from "react";

import { defaultTab, RepoTabsContext, RepoTab } from "./context";

export function RepoTabsContextProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<RepoTab>(defaultTab);

  return (
    <RepoTabsContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </RepoTabsContext.Provider>
  );
}
