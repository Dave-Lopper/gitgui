import { useContext } from "react";

import { RepoTabsContext } from "../../contexts/repo-tabs/context";
import RepositoryTab from "./RepositoryTab";

export type RepoTabProps = {
  active: boolean;
  copy: string;
  isLast?: boolean;
  onClick: () => void;
};

export default function RepositoryTabs() {
  const { currentTab, setCurrentTab } = useContext(RepoTabsContext);

  return (
    <div className="z-0 flex w-full items-center justify-start">
      <RepositoryTab
        active={currentTab === "DIFF"}
        copy="Diff"
        onClick={() => currentTab !== "DIFF" && setCurrentTab("DIFF")}
      />
      <RepositoryTab
        active={currentTab === "HISTORY"}
        copy="History"
        isLast
        onClick={() => currentTab !== "HISTORY" && setCurrentTab("HISTORY")}
      />
    </div>
  );
}
