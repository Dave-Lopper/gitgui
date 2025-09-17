import { ComponentType, useContext } from "react";
import { RepoTabsContext } from "../contexts/repo-tabs/context";

export type RepoTabProps = {
  active: boolean;
  copy: string;
  isLast?: boolean;
  onClick: () => void;
};

export default function RepositoryTabs({
  tab: Tab,
}: {
  tab: ComponentType<RepoTabProps>;
}) {
  const { currentTab, setCurrentTab } = useContext(RepoTabsContext);

  return (
    <div className="z-0 flex w-full items-center justify-start">
      <Tab
        active={currentTab === "DIFF"}
        copy="Diff"
        onClick={() => currentTab !== "DIFF" && setCurrentTab("DIFF")}
      />
      <Tab
        active={currentTab === "HISTORY"}
        copy="History"
        isLast
        onClick={() => currentTab !== "HISTORY" && setCurrentTab("HISTORY")}
      />
    </div>
  );
}
