import { ReactNode, useCallback, useEffect, useState } from "react";

import { useCases } from "../../../bootstrap";
import { DiffEntry } from "../../../domain/diff";
import { StatusEntry } from "../../../domain/status";
import { useEventSubscription } from "../../../infra/react-bus-helper";
import { useRepositorySelection } from "../../headless";
import {
  RepoTab,
  RepoTabsContext,
  StatusEntryWithIndex,
  defaultTab,
} from "./context";

export function RepoTabsContextProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<RepoTab>(defaultTab);
  const { repositorySelection } = useRepositorySelection();

  useEffect(() => {
    if (currentTab === "DIFF") {
      const resetViewedCommit = async () => {
        if (!repositorySelection) {
          return;
        }
        await useCases.viewCommit.execute(
          repositorySelection.repository.localPath,
          undefined,
        );
      };
      resetViewedCommit();
    }
  }, [currentTab, repositorySelection]);

  return (
    <RepoTabsContext.Provider
      value={{
        currentTab,
        setCurrentTab,
      }}
    >
      {children}
    </RepoTabsContext.Provider>
  );
}
