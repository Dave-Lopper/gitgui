const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electronAPI", {
  addToGitignore: (repositoryPath: string, filePaths: string) =>
    electron.ipcRenderer.invoke(
      "diff:addToGitignore",
      JSON.stringify({ repositoryPath, filePaths }),
    ),
  authenticate: (password: string, repositoryPath: string, username: string) =>
    electron.ipcRenderer.invoke(
      "repositories:authenticate",
      JSON.stringify({ password, repositoryPath, username }),
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
  checkoutBranch: (repositoryPath: string, branchName: string) =>
    electron.ipcRenderer.invoke(
      "repositories:checkout-branch",
      JSON.stringify({ branchName, repositoryPath }),
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
  push: (repositoryPath: string) =>
    electron.ipcRenderer.invoke("repositories:push", repositoryPath),
  getBranchesForRepository: (path: string) =>
    electron.ipcRenderer.invoke("repositories:getBranchesForRepository", path),
  getCommitHistory: (page: number, pageSize: number, repositoryPath: string) =>
    electron.ipcRenderer.invoke(
      "commits:getHistory",
      JSON.stringify({ page, pageSize, repositoryPath }),
    ),
  getCommitFileDiff: (
    repositoryPath: string,
    commitHash: string,
    filePath: string,
  ) =>
    electron.ipcRenderer.invoke(
      "commits:getCommitFileDiff",
      JSON.stringify({ repositoryPath, commitHash, filePath }),
    ),
  getCommitStatus: (repositoryPath: string, commitHash: string) =>
    electron.ipcRenderer.invoke(
      "commits:getCommitStatus",
      JSON.stringify({ repositoryPath, commitHash }),
    ),
  getSavedRepositories: () =>
    electron.ipcRenderer.invoke("repositories:getSaved"),
  getTreeFileDiff: (
    repositoryPath: string,
    filePath: string,
    currentBranchName: string,
    remoteName: string,
    staged: boolean,
    status: string,
  ) =>
    electron.ipcRenderer.invoke(
      "diff:getTreeFileDiff",
      JSON.stringify({
        repositoryPath,
        filePath,
        currentBranchName,
        remoteName,
        staged,
        status,
      }),
    ),
  selectRepositoryFromDisk: () =>
    electron.ipcRenderer.invoke("repositories:selectFromDisk"),
  selectRepositoryFromSaved: (path: string) =>
    electron.ipcRenderer.invoke("repositories:selectFromSaved", path),
  stageAndStash: (repositoryPath: string) =>
    electron.ipcRenderer.invoke("diff:stageAndStash", repositoryPath),
  stashFile: (repositoryPath: string, filePath: string) =>
    electron.ipcRenderer.invoke(
      "diff:stashFile",
      JSON.stringify({ repositoryPath, filePath }),
    ),
  toggleFilesStaged: (repositoryPath: string, filePaths: string[]) =>
    electron.ipcRenderer.invoke(
      "diff:toggleFilesStaged",
      JSON.stringify({ repositoryPath, filePaths }),
    ),

  onRepositoryFetched: (
    cb: (event: Electron.IpcRendererEvent, data: any) => void,
  ) => electron.ipcRenderer.on("repository:fetched", cb),
  onGitAuth: (cb: (event: Electron.IpcRendererEvent) => void) =>
    electron.ipcRenderer.on("git:auth", cb),
  onGitError: (
    cb: (
      event: Electron.IpcRendererEvent,
      data: { message: string; command?: string },
    ) => void,
  ) => electron.ipcRenderer.on("git:error", cb),
});
