import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useCases } from "../bootstrap";
import { RepoTabsContext } from "./contexts/repo-tabs";
import { UiSettingsContext } from "./contexts/ui-settings/context";
import {
  Header,
  ModifiedFilesList,
  SplitPane,
  useRepositorySelection,
} from "./headless";
import CommitForm from "./headless/CommitForm";
import ContextualMenu from "./headless/ContextualMenu";
import RepositoryTabs from "./headless/RepositoryTabs";
import {
  ModernBranchDropdown,
  ModernDivider,
  ModernModifiedFilesCounter,
  ModernRepositoryDropdown,
  ModernRepositorySelectionMenu,
  ModernRepositoryTab,
  ModernSettingsMenu,
} from "./themed/modern";
import {
  RetroAuthModal,
  RetroBranchDropdown,
  RetroContextualMenu,
  RetroDiffFileOption,
  RetroDiffFileOptionRightClickFilesCounter,
  RetroDivider,
  RetroLabel,
  RetroModal,
  RetroModifiedFilesCounter,
  RetroRepositoryDropdown,
  RetroRepositorySelectionMenu,
  RetroSettingsMenu,
  RetroSubmitButton,
  RetroTextInput,
} from "./themed/retro";
import RetroDiffFileListRightClickMenuOption from "./themed/retro/DiffFileListRightClickMenuOption";
import History from "./themed/retro/History";
import RetroRepositoryTab from "./themed/retro/RepositoryTab";

export default function AppLayout() {
  const { theme } = useContext(UiSettingsContext);
  const { currentTab } = useContext(RepoTabsContext);
  const { repositorySelection } = useRepositorySelection(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const startupCallback = useCallback(async () => {
    await useCases.getSavedRepositories.execute();
    window.electronAPI.onGitAuth(() => setShowAuthModal(true));
  }, []);

  useEffect(() => {
    startupCallback();
  }, [startupCallback]);

  const branchDropdown = useMemo(
    () =>
      theme === "MODERN" ? <ModernBranchDropdown /> : <RetroBranchDropdown />,
    [theme, repositorySelection],
  );

  const divider = useMemo(
    () => (theme === "MODERN" ? <ModernDivider /> : <RetroDivider />),
    [theme],
  );

  const ModifiedFilesCounter = useMemo(
    () =>
      theme === "MODERN"
        ? ModernModifiedFilesCounter
        : RetroModifiedFilesCounter,
    [theme, repositorySelection],
  );

  const ModifiedFileOption = useMemo(
    () => RetroDiffFileOption,
    [repositorySelection],
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
    [repositorySelection, theme],
  );

  const repositoryTab = useMemo(
    () => (theme === "MODERN" ? ModernRepositoryTab : RetroRepositoryTab),
    [repositorySelection, theme],
  );

  const settingsMenu = useMemo(
    () => (theme === "MODERN" ? <ModernSettingsMenu /> : <RetroSettingsMenu />),
    [theme],
  );

  return (
    <div className="bg-retro flex h-full max-h-full w-full max-w-full flex-col items-center justify-start">
      {showAuthModal && (
        <RetroAuthModal close={() => setShowAuthModal(false)} />
      )}
      <Header
        className={theme === "RETRO" ? "max-h-13" : "max-h-24"}
        contextualMenu={
          <ContextualMenu menu={RetroContextualMenu}></ContextualMenu>
        }
        branchDropdown={branchDropdown}
        repositoryDropdown={repositoryDropdown}
        uiSettings={settingsMenu}
      />

      {repositorySelection && (
        <SplitPane
          leftPane={
            <div
              className={`${theme === "MODERN" ? "bg-modern-dark-ter" : "bg-retro-desktop"} relative flex h-full flex-col max-h-full`}
            >
              <RepositoryTabs tab={repositoryTab} />
              {currentTab === "DIFF" ? (
                <div className="flex flex-col">
                  <ModifiedFilesCounter
                    count={repositorySelection.diff.length}
                  />
                  <div className="flex flex-col bg-white">
                    <ModifiedFilesList
                      repositorySelection={repositorySelection}
                      themedFileOption={ModifiedFileOption}
                      rightClickMenuClassname="bg-retro font-retro retro-borders absolute w-[300px] border-[2px] text-black"
                      rightClickMenuOption={
                        RetroDiffFileListRightClickMenuOption
                      }
                      rightClickMenuFilesCounter={
                        RetroDiffFileOptionRightClickFilesCounter
                      }
                    />
                    <CommitForm
                      submitButton={RetroSubmitButton}
                      textInput={RetroTextInput}
                    />
                  </div>
                </div>
              ) : (
                <History />
              )}
            </div>
          }
          leftPaneClassName="bg-red h-full"
          rightPane={<>Some right pane</>}
          divider={divider}
        />
      )}
    </div>
  );
}
