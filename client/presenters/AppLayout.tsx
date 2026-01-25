import {
  use,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useCases } from "../bootstrap";
import { StatusEntry } from "../domain/status";
import RetroCloseIcon from "../icons/retro/Close";
import { useEventSubscription } from "../infra/react-bus-helper";
import { RepoTabsContext } from "./contexts/repo-tabs";
import { UiSettingsContext } from "./contexts/ui-settings/context";
import {
  Header,
  ModifiedFilesList,
  SplitPane,
  useRepositorySelection,
} from "./headless";
import DiffViewer from "./headless/DiffViewer";
import { CurrentCommitProps } from "./headless/types";
import {
  ModernBranchDropdown,
  ModernDivider,
  ModernModifiedFilesCounter,
  ModernRepositoryDropdown,
  ModernRepositorySelectionMenu,
  ModernSettingsMenu,
} from "./themed/modern";
import {
  RetroAuthModal,
  RetroBranchDropdown,
  RetroCommitForm,
  RetroContextualMenu,
  RetroDiffFileOption,
  RetroDiffFileOptionRightClickFilesCounter,
  RetroDivider,
  RetroModifiedFilesCounter,
  RetroModifiedFilesEmptyState,
  RetroRepositoryDropdown,
  RetroRepositorySelectionMenu,
  RetroSettingsMenu,
  RetroSubHeader,
} from "./themed/retro";
import RetroDiffFileListRightClickMenuOption from "./themed/retro/DiffFileListRightClickMenuOption";
import History from "./themed/retro/History";
import { truncateString } from "./utils";

function RetroCurrentCommit({ commit, close }: CurrentCommitProps) {
  const { repositorySelection } = useRepositorySelection();

  if (!repositorySelection) {
    return (
      <div className="h-full w-full flex border-[2px] border-b-white border-l-0 border-r-0"></div>
    );
  }

  return (
    <div className="h-full flex justify-between font-retro items-center text-black text-sm relative">
      {commit ? (
        <>
          <div className="flex flex-col pl-8">
            <span className="text-left font-bold">Viewed commit</span>
            <span className="text-left">
              {commit.shortHash}: {truncateString(commit.subject, 30)}
            </span>
          </div>
          <span onClick={close}>
            <RetroCloseIcon
              size={14}
              color="#000"
              className="absolute top-[10px] right-[10px] cursor-pointer"
            />
          </span>
        </>
      ) : (
        <span className="px-8">Working tree</span>
      )}
    </div>
  );
}

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

  const [viewedCommit, setViewedCommit] = useState<
    { hash: string; entries: StatusEntry[] } | undefined
  >(undefined);
  useEventSubscription(
    "CommitViewed",
    async (event) => {
      if (event.payload) {
        setViewedCommit({
          hash: event.payload.commit.hash,
          entries: event.payload.status,
        });
      } else {
        setViewedCommit(undefined);
      }
    },
    [],
  );

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
        currentCommit={RetroCurrentCommit}
        branchDropdown={branchDropdown}
        contextualMenu={<RetroContextualMenu />}
        repositoryDropdown={repositoryDropdown}
        uiSettings={settingsMenu}
      />
      {repositorySelection && theme === "RETRO" && <RetroSubHeader />}

      {repositorySelection && (
        <SplitPane
          leftPane={
            <div
              className={`${theme === "MODERN" ? "bg-modern-dark-ter" : "bg-retro-desktop"} relative flex h-full flex-col max-h-full`}
            >
              {currentTab === "DIFF" ? (
                <div className="flex flex-col h-full">
                  <ModifiedFilesCounter
                    count={repositorySelection.treeStatus.entries.length}
                  />
                  <ModifiedFilesList
                    containerClassname="overflow-auto retro-scrollbar"
                    repositorySelection={repositorySelection}
                    themedFileOption={ModifiedFileOption}
                    themedEmptyState={RetroModifiedFilesEmptyState}
                    rightClickMenuClassname="bg-retro font-retro retro-borders absolute w-[300px] border-[2px] text-black"
                    rightClickMenuOption={RetroDiffFileListRightClickMenuOption}
                    rightClickMenuFilesCounter={
                      RetroDiffFileOptionRightClickFilesCounter
                    }
                    statusEntries={repositorySelection.treeStatus.entries}
                    commitHash={undefined}
                  />
                  <RetroCommitForm />
                </div>
              ) : viewedCommit ? (
                <div className="flex flex-col h-full">
                  <ModifiedFilesCounter count={viewedCommit.entries.length} />
                  <ModifiedFilesList
                    repositorySelection={repositorySelection}
                    themedFileOption={ModifiedFileOption}
                    rightClickMenuClassname="bg-retro font-retro retro-borders absolute w-[300px] border-[2px] text-black"
                    rightClickMenuOption={RetroDiffFileListRightClickMenuOption}
                    rightClickMenuFilesCounter={
                      RetroDiffFileOptionRightClickFilesCounter
                    }
                    statusEntries={viewedCommit.entries}
                    commitHash={viewedCommit.hash}
                    containerClassname={
                      theme === "RETRO" ? "retro-scrollbar" : ""
                    }
                  />
                </div>
              ) : (
                <History />
              )}
            </div>
          }
          leftPaneClassName="bg-red h-full"
          rightPane={<DiffViewer />}
          divider={divider}
        />
      )}
    </div>
  );
}
