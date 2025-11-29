import { ComponentType, ReactNode, useContext, useState } from "react";

import { useCases } from "../../bootstrap";
import { Commit } from "../../domain/commit";
import { useEventSubscription } from "../../infra/react-bus-helper";
import { RepoTabsContext } from "../contexts/repo-tabs";
import { useRepositorySelection } from "./hooks/repository-selection";
import { CurrentCommitProps } from "./types";

type HeaderProps = {
  branchDropdown: ReactNode;
  className?: string;
  contextualMenu: ReactNode;
  currentCommit: ComponentType<CurrentCommitProps>;
  repositoryDropdown: ReactNode;
  uiSettings: ReactNode;
};

export default function Header({
  branchDropdown,
  className,
  contextualMenu,
  currentCommit: CurrentCommit,
  repositoryDropdown,
  uiSettings,
}: HeaderProps) {
  const [viewedCommit, setViewedCommit] = useState<Commit>();

  useEventSubscription(
    "CommitViewed",
    async (event) => setViewedCommit(event.payload?.commit),
    [],
  );

  return (
    <header className={`flex w-full ${className ? className : ""}`}>
      <div className="flex max-h-full w-4/6">
        <div className="max-h-full w-1/3">{repositoryDropdown}</div>
        <div className="max-h-full w-1/3">{branchDropdown}</div>

        <div className="max-h-full w-1/3">
          <CurrentCommit
            commit={viewedCommit}
            close={async () =>
              viewedCommit && (await useCases.exitViewedCommit.execute())
            }
          />
        </div>
      </div>
      <div className="flex w-2/6 justify-end">
        <div className={`max-h-full w-1/3`}>{contextualMenu}</div>
        <div className="max-h-full w-2/3">{uiSettings}</div>
      </div>
    </header>
  );
}
