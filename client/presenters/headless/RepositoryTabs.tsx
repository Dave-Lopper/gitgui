import { ComponentType, useContext } from "react";
import { RepoTabsContext } from "../contexts/repo-tabs/context";

export type RepoTabProps = {
  active: boolean;
  copy: string;
  onClick: () => void;
};

export default function RepositoryTabs({
  tab: Tab,
}: {
  tab: ComponentType<RepoTabProps>;
}) {
  const { currentTab, setCurrentTab } = useContext(RepoTabsContext);

  return (
    <div className="flex w-full items-center justify-start z-0">
      <Tab
        active={currentTab === "DIFF"}
        copy="Diff"
        onClick={() => currentTab !== "DIFF" && setCurrentTab("DIFF")}
      />
      <Tab
        active={currentTab === "HISTORY"}
        copy="History"
        onClick={() => currentTab !== "HISTORY" && setCurrentTab("HISTORY")}
      />
    </div>
  );
}
