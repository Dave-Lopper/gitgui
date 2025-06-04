const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electronAPI", {
  cloneRepository: (url: string) =>
    electron.ipcRenderer.invoke("repositories:clone", url),
  getBranchesForRepository: (path: string) =>
    electron.ipcRenderer.invoke("repositories:getBranchesForRepository", path),
  getSavedRepositories: () =>
    electron.ipcRenderer.invoke("repositories:getSaved"),
  selectRepositoryFromDisk: () =>
    electron.ipcRenderer.invoke("repositories:selectFromDisk"),
  selectRepositoryFromSaved: (path: string) =>
    electron.ipcRenderer.invoke("repositories:selectFromSaved", path),

  onGitError: (
    cb: (
      event: Electron.IpcRendererEvent,
      data: { message: string; command?: string },
    ) => void,
  ) => electron.ipcRenderer.on("git-error", cb),
});
