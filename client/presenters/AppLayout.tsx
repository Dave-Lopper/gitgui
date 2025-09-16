import { useCallback, useContext, useEffect, useMemo } from "react";

import { useCases } from "../bootstrap";
import { UiSettingsContext } from "./contexts/ui-settings/context";
import { Header, SplitPane, useRepositorySelection } from "./headless";
import {
  ModernRepositoryDropdown,
  ModernRepositorySelectionMenu,
  ModernBranchDropdown,
  ModernSettingsMenu,
} from "./themed/modern";
import {
  RetroRepositoryDropdown,
  RetroDivider,
  RetroBranchDropdown,
  RetroSettingsMenu,
  RetroRepositorySelectionMenu,
} from "./themed/retro";
import { RepoTabsContextProvider } from "./contexts/repo-tabs";
import RepositoryTabs from "./headless/RepositoryTabs";
import RetroRepositoryTab from "./themed/retro/RetroRepositoryTab";

export default function AppLayout() {
  const { theme } = useContext(UiSettingsContext);
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

  const settingsMenu = useMemo(
    () => (theme === "MODERN" ? <ModernSettingsMenu /> : <RetroSettingsMenu />),
    [theme],
  );

  return (
    <div className="bg-retro flex h-full max-h-full w-full max-w-full flex-col items-center justify-start">
      <Header
        className={theme === "RETRO" ? "max-h-13" : ""}
        branchDropdown={branchDropdown}
        repositoryDropdown={repositoryDropdown}
        uiSettings={settingsMenu}
      />

      {repositorySelection && (
        <RepoTabsContextProvider>
          <SplitPane
            leftPane={
              <div className="flex flex-col">
                <RepositoryTabs tab={RetroRepositoryTab} />
              </div>
            }
            rightPane={<>Some right pane</>}
            divider={<RetroDivider />}
          />
        </RepoTabsContextProvider>
      )}
    </div>
  );
}
