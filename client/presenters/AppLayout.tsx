import { useCallback, useContext, useEffect, useMemo } from "react";

import { useCases } from "../bootstrap";
import { UiSettingsContext } from "./contexts/ui-settings/context";
import { Header, SplitPane } from "./headless";
import {
  ModernRepositoryDropdown,
  ModernRepositorySelectionMenu,
  ModernBranchDropdown,
  ModernSettingsMenu,
} from "./themed/modern";
import {
  RetroRepositoryDropdown,
  RetroBranchDropdown,
  RetroSettingsMenu,
  RetroRepositorySelectionMenu,
} from "./themed/retro";

export default function AppLayout() {
  const { theme } = useContext(UiSettingsContext);

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
    <div className="bg-retro flex h-screen w-screen items-center justify-center">
      <Header
        branchDropdown={branchDropdown}
        repositoryDropdown={repositoryDropdown}
        uiSettings={settingsMenu}
      />
    </div>
  );
}
