import { useContext, useMemo } from "react";

import { UiSettingsContext } from "./contexts/ui-settings/context";
import { Header, SplitPane } from "./headless";
import {
  ModernRepositoryDropdown,
  ModernBranchDropdown,
  ModernSettingsMenu,
} from "./themed/modern";
import {
  RetroRepositoryDropdown,
  RetroBranchDropdown,
  RetroSettingsMenu,
} from "./themed/retro";

export default function AppLayout() {
  const { theme } = useContext(UiSettingsContext);

  const branchDropdown = useMemo(
    () =>
      theme === "MODERN" ? <ModernBranchDropdown /> : <RetroBranchDropdown />,
    [theme],
  );

  const repositoryDropdown = useMemo(
    () =>
      theme === "MODERN" ? (
        <ModernRepositoryDropdown />
      ) : (
        <RetroRepositoryDropdown />
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
