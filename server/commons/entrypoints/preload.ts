const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electronAPI", {
  cloneRepository: (url: string) =>
    electron.ipcRenderer.invoke("repositories:clone", url),
  getBranchesForRepository: (path: string) =>
    electron.ipcRenderer.invoke("repositories:getBranchesForRepository", path),
  getCommitHistory: (page: number, pageSize: number, repositoryPath: string) =>
    electron.ipcRenderer.invoke(
      "commits:getHistory",
      JSON.stringify({ page, pageSize, repositoryPath }),
    ),
  getSavedRepositories: () =>
    electron.ipcRenderer.invoke("repositories:getSaved"),
  refreshRepoDiff: (repositoryPath: string) =>
    electron.ipcRenderer.invoke("diff:refresh", repositoryPath),
  selectRepositoryFromDisk: () =>
    electron.ipcRenderer.invoke("repositories:selectFromDisk"),
  selectRepositoryFromSaved: (path: string) =>
    electron.ipcRenderer.invoke("repositories:selectFromSaved", path),
  toggleFileStaged: (repositoryPath: string, filePaths: string[]) =>
    electron.ipcRenderer.invoke(
      "diff:toggleFilesStaged",
      JSON.stringify({ repositoryPath, filePaths }),
    ),

  onGitError: (
    cb: (
      event: Electron.IpcRendererEvent,
      data: { message: string; command?: string },
    ) => void,
  ) => electron.ipcRenderer.on("git-error", cb),
});
