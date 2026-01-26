import {
  AddFileTypeToGitignore,
  AddToGitignore,
  Authenticate,
  BatchDiscardFileModifications,
  CheckoutBranch,
  CloneRepository,
  ConsultCommitDiff,
  ConsultFileDiff,
  CopyAbsoluteFilePath,
  CopyDiffLine,
  CopyRelativeFilePath,
  EmptyDiffFilesSelection,
  ExitViewedCommit,
  Fetch,
  GetCommitHistory,
  GetSavedRepositories,
  GetTreeFileDiff,
  ModifyFileDiffSelection,
  Pull,
  Push,
  RepositoryFetched,
  SelectDiffFile,
  SelectDiffFiles,
  SelectRepositoryFromDisk,
  SelectRepositoryFromSaved,
  StageStashAndCheckout,
  ToggleDiffFileSelection,
  ToggleFileStaged,
  ViewCommit,
} from "./application/use-cases";
import { Commit } from "./application/use-cases/commit";
import { ObservableEventBus } from "./infra/event-bus";
import { GitService } from "./infra/git-service";
import { RepositoryStore } from "./infra/repository-store";

export const eventBus = new ObservableEventBus();
const gitService = new GitService();
const repositoryStore = new RepositoryStore();

export const useCases = {
  addFileTypeToGitignore: new AddFileTypeToGitignore(gitService, eventBus),
  addToGitignore: new AddToGitignore(gitService, eventBus),
  authenticate: new Authenticate(gitService, eventBus),
  batchDiscardFileModifications: new BatchDiscardFileModifications(
    gitService,
    eventBus,
  ),
  checkoutBranch: new CheckoutBranch(gitService, eventBus),
  cloneRepository: new CloneRepository(gitService, eventBus),
  commit: new Commit(gitService, eventBus),
  consultCommitDiff: new ConsultCommitDiff(eventBus),
  consultFileDiff: new ConsultFileDiff(eventBus),
  copyAbsoluteFilePath: new CopyAbsoluteFilePath(),
  copyDiffLine: new CopyDiffLine(),
  copyRelativeFilePath: new CopyRelativeFilePath(),
  emptyDiffFilesSelection: new EmptyDiffFilesSelection(eventBus),
  exitViewedCommit: new ExitViewedCommit(eventBus),
  fetch: new Fetch(gitService, eventBus),
  getCommitHistory: new GetCommitHistory(gitService, eventBus),
  getSavedRepositories: new GetSavedRepositories(repositoryStore, eventBus),
  getTreeFileDiff: new GetTreeFileDiff(gitService, eventBus),
  modifyFileDiffSelection: new ModifyFileDiffSelection(eventBus, gitService),
  pull: new Pull(gitService, eventBus),
  push: new Push(gitService, eventBus),
  selectDiffFile: new SelectDiffFile(eventBus),
  selectDiffFiles: new SelectDiffFiles(eventBus),
  selectRepositoryFromDisk: new SelectRepositoryFromDisk(gitService, eventBus),
  repositoryFetched: new RepositoryFetched(eventBus),
  selectRepositoryFromSaved: new SelectRepositoryFromSaved(
    gitService,
    eventBus,
  ),
  stageStashAndCheckout: new StageStashAndCheckout(gitService, eventBus),
  toggleDiffFileSelection: new ToggleDiffFileSelection(eventBus),
  toggleFilesStaged: new ToggleFileStaged(gitService, eventBus),
  viewCommit: new ViewCommit(eventBus, gitService),
};
