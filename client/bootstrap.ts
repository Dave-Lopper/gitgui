import {
  AddFileTypeToGitignore,
  AddToGitignore,
  BatchDiscardFileModifications,
  CloneRepository,
  ConsultCommitDiff,
  ConsultFileDiff,
  GetCommitHistory,
  GetSavedRepositories,
  SelectRepositoryFromDisk,
  SelectRepositoryFromSaved,
  ToggleFilesStaged,
} from "./application/use-cases";
import { EventBus } from "./infra/event-bus";
import { GitService } from "./infra/git-service";
import { RepositoryStore } from "./infra/repository-store";

export const eventBus = new EventBus();
const gitService = new GitService();
const repositoryStore = new RepositoryStore();

export const useCases = {
  addFileTypeToGitignore: new AddFileTypeToGitignore(gitService, eventBus),
  addToGitignore: new AddToGitignore(gitService, eventBus),
  batchDiscardFileModifications: new BatchDiscardFileModifications(
    gitService,
    eventBus,
  ),
  cloneRepository: new CloneRepository(gitService, eventBus),
  consultCommitDiff: new ConsultCommitDiff(eventBus),
  consultFileDiff: new ConsultFileDiff(eventBus),
  getCommitHistory: new GetCommitHistory(gitService, eventBus),
  getSavedRepositories: new GetSavedRepositories(repositoryStore, eventBus),
  selectRepositoryFromDisk: new SelectRepositoryFromDisk(gitService, eventBus),
  selectRepositoryFromSaved: new SelectRepositoryFromSaved(
    gitService,
    eventBus,
  ),
  toggleFilesStaged: new ToggleFilesStaged(gitService, eventBus),
};
