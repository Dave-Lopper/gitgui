import { useCallback, useContext, useEffect, useMemo } from "react";

import { useCases } from "../bootstrap";
import { UiSettingsContext } from "./contexts/ui-settings/context";
import {
  DiffFileOption,
  Header,
  SplitPane,
  useRepositorySelection,
} from "./headless";
import {
  ModernRepositoryDropdown,
  ModernRepositorySelectionMenu,
  ModernRepositoryTab,
  ModernModifiedFilesCounter,
  ModernBranchDropdown,
  ModernSettingsMenu,
  ModernDivider,
  // ModernDiffFile,
} from "./themed/modern";
import {
  RetroRepositoryDropdown,
  RetroDiffFileOption,
  RetroDivider,
  RetroBranchDropdown,
  RetroModifiedFilesCounter,
  RetroSettingsMenu,
  RetroRepositorySelectionMenu,
  RetroCheckbox,
} from "./themed/retro";
import { RepoTabsContext } from "./contexts/repo-tabs";
import RepositoryTabs from "./headless/RepositoryTabs";
import RetroRepositoryTab from "./themed/retro/RepositoryTab";
import { RepositorySelectionDto } from "../dto/repo-selection";

function ModifiedFilesList({
  repositorySelection,
}: {
  repositorySelection: RepositorySelectionDto;
}) {
  const { emptyFileSelection, selectFiles, selectFile, selectedFiles } =
    useContext(RepoTabsContext);

  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "KeyA") {
        selectFiles(
          repositorySelection.diff.map((file, idx) => ({
            ...file,
            index: idx,
          })),
        );
      } else if (e.code === "Escape" && selectedFiles.size > 0) {
        emptyFileSelection();
      } else if (e.code === "ArrowDown" && selectedFiles.size > 0) {
        const indexSorted = Array.from(selectedFiles).sort(
          (a, b) => b.index - a.index,
        );
        const maxSelectedIndex = indexSorted[0].index;
        if (maxSelectedIndex < repositorySelection.diff.length - 1) {
          emptyFileSelection();
          selectFile({
            ...repositorySelection.diff[maxSelectedIndex + 1],
            index: maxSelectedIndex + 1,
          });
        }
      } else if (e.code === "ArrowUp" && selectedFiles.size > 0) {
        const indexSorted = Array.from(selectedFiles).sort(
          (a, b) => a.index - b.index,
        );
        const minSelectedIndex = indexSorted[0].index;
        if (minSelectedIndex > 0) {
          emptyFileSelection();
          selectFile({
            ...repositorySelection.diff[minSelectedIndex - 1],
            index: minSelectedIndex - 1,
          });
        }
      }
    },
    [selectedFiles, repositorySelection],
  );

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [keyDownHandler]);

  return repositorySelection?.diff.map((file, idx) => (
    <DiffFileOption
      key={file.displayPaths.join("+")}
      file={file}
      fileIndex={idx}
      repositorySelection={repositorySelection}
      themedFileOption={RetroDiffFileOption}
    />
  ));
}

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

  // const diffFile = useMemo(
  //   () => (theme === "MODERN" ? ModernDiffFile : RetroDiffFile),
  //   [theme, repositorySelection],
  // );

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
            <div
              className={`${theme === "MODERN" ? "bg-modern-dark-ter" : "bg-retro-desktop"} flex h-full flex-col`}
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
                    />
                  </div>
                </div>
              ) : (
                <>HISTORY</>
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
