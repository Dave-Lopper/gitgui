import { useCallback, useContext, useEffect, useMemo } from "react";

import { useCases } from "../bootstrap";
import { UiSettingsContext } from "./contexts/ui-settings/context";
import {
  Header,
  SplitPane,
  useRepositorySelection,
  ModifiedFilesCounter,
} from "./headless";
import {
  ModernRepositoryDropdown,
  ModernRepositorySelectionMenu,
  ModernRepositoryTab,
  ModernModifiedFilesCounter,
  ModernBranchDropdown,
  ModernSettingsMenu,
  ModernDivider,
} from "./themed/modern";
import {
  RetroRepositoryDropdown,
  RetroDivider,
  RetroBranchDropdown,
  RetroModifiedFilesCounter,
  RetroSettingsMenu,
  RetroRepositorySelectionMenu,
} from "./themed/retro";
import { RepoTabsContext } from "./contexts/repo-tabs";
import RepositoryTabs from "./headless/RepositoryTabs";
import RetroRepositoryTab from "./themed/retro/RepositoryTab";

export default function AppLayout() {
  const { theme } = useContext(UiSettingsContext);
  const { currentTab } = useContext(RepoTabsContext);
  const { repositorySelection } = useRepositorySelection();

  const startupCallback = useCallback(async () => {
    await useCases.getSavedRepositories.execute();
  }, []);

  useEffect(() => {
    startupCallback();
  }, [startupCallback, theme]);

  const branchDropdown = useMemo(
    () =>
      theme === "MODERN" ? <ModernBranchDropdown /> : <RetroBranchDropdown />,
    [theme],
  );

  const divider = useMemo(
    () => (theme === "MODERN" ? <ModernDivider /> : <RetroDivider />),
    [theme],
  );

  const modifiedFilesCounter = useMemo(
    () =>
      theme === "MODERN"
        ? ModernModifiedFilesCounter
        : RetroModifiedFilesCounter,
    [theme],
  );

  const repositoryDropdown = useMemo(
    () =>
      theme === "MODERN" ? (
        <ModernRepositoryDropdown
          repoSelectionMenu={<ModernRepositorySelectionMenu />}
        />
      ) : (
        <RetroRepositoryDropdown
          repoSelectionMenu={<RetroRepositorySelectionMenu />}
        />
      ),
    [theme],
  );

  const repositoryTab = useMemo(
    () => (theme === "MODERN" ? ModernRepositoryTab : RetroRepositoryTab),
    [theme],
  );

  const settingsMenu = useMemo(
    () => (theme === "MODERN" ? <ModernSettingsMenu /> : <RetroSettingsMenu />),
    [theme],
  );

  return (
    <div className="bg-retro flex h-full max-h-full w-full max-w-full flex-col items-center justify-start">
      <Header
        className={theme === "RETRO" ? "max-h-13" : "max-h-24"}
        branchDropdown={branchDropdown}
        repositoryDropdown={repositoryDropdown}
        uiSettings={settingsMenu}
      />

      {repositorySelection && (
        <SplitPane
          leftPane={
            <div className="flex flex-col">
              <RepositoryTabs tab={repositoryTab} />
              {currentTab === "DIFF" ? (
                <div className="flex flex-col">
                  <ModifiedFilesCounter counter={modifiedFilesCounter} />
                </div>
              ) : (
                <>HISTORY</>
              )}
            </div>
          }
          rightPane={<>Some right pane</>}
          divider={divider}
        />
      )}
    </div>
  );
}
