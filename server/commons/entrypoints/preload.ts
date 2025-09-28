import { CommitStatusDto } from "../../modules/commit/dto";

const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electronAPI", {
  addToGitignore: (repositoryPath: string, filePaths: string) =>
    electron.ipcRenderer.invoke(
      "diff:addToGitignore",
      JSON.stringify({ repositoryPath, filePaths }),
    ),
  batchAddToGitignore: (repositoryPath: string, extension: string) =>
    electron.ipcRenderer.invoke(
      "diff:batchAddToGitignore",
      JSON.stringify({ repositoryPath, extension }),
    ),
  batchDiscardFileModifications: (
    repositoryPath: string,
    filePaths: string[],
  ) =>
    electron.ipcRenderer.invoke(
      "diff:batchDiscardFileModifications",
      JSON.stringify({ repositoryPath, filePaths }),
    ),
  cloneRepository: (url: string) =>
    electron.ipcRenderer.invoke("repositories:clone", url),
  commit: (repositoryPath: string, message: string, description?: string) =>
    electron.ipcRenderer.invoke(
      "commits:commit",
      JSON.stringify({ repositoryPath, message, description }),
    ),
  fetch: (repositoryPath: string) =>
    electron.ipcRenderer.invoke("repositories:fetch", repositoryPath),
  pull: (repositoryPath: string) =>
    electron.ipcRenderer.invoke("repositories:pull", repositoryPath),
  getBranchesForRepository: (path: string) =>
    electron.ipcRenderer.invoke("repositories:getBranchesForRepository", path),
  getCommitHistory: (page: number, pageSize: number, repositoryPath: string) =>
    electron.ipcRenderer.invoke(
      "commits:getHistory",
      JSON.stringify({ page, pageSize, repositoryPath }),
    ),
  getSavedRepositories: () =>
    electron.ipcRenderer.invoke("repositories:getSaved"),
  selectRepositoryFromDisk: () =>
    electron.ipcRenderer.invoke("repositories:selectFromDisk"),
  selectRepositoryFromSaved: (path: string) =>
    electron.ipcRenderer.invoke("repositories:selectFromSaved", path),
  toggleFilesStaged: (repositoryPath: string, filePaths: string[]) =>
    electron.ipcRenderer.invoke(
      "diff:toggleFilesStaged",
      JSON.stringify({ repositoryPath, filePaths }),
    ),

  onRepositoryFetched: (
    cb: (event: Electron.IpcRendererEvent, data: CommitStatusDto) => void,
  ) => electron.ipcRenderer.on("repository:fetched", cb),
  onGitError: (
    cb: (
      event: Electron.IpcRendererEvent,
      data: { message: string; command?: string },
    ) => void,
  ) => electron.ipcRenderer.on("git-error", cb),
});
