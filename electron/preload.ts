const { contextBridge, ipcRenderer } = require("electron");

console.log("PRELOADING");
contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (msg: string) => ipcRenderer.send("toMain", msg),
  onReply: (cb: () => void) => ipcRenderer.on("fromMain", cb),

  getBranchesForRepository: (repositoryPath: string, remoteName: string) =>
    ipcRenderer.send(
      "getBranchesForRepository",
      JSON.stringify({ repositoryPath, remoteName }),
    ),
});
