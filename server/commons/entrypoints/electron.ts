import path from "path";
import { fileURLToPath } from "url";

import { BrowserWindow, app, ipcMain, screen } from "electron";

import { bootstrap as commitBootstrap } from "../../modules/commit/bootstrap.js";
import { bootstrap as diffBootstrap } from "../../modules/diff/bootstrap.js";
import { bootstrap as repositoryBootstrap } from "../../modules/repository/bootstrap.js";

let window: Electron.BrowserWindow;
let commitUseCases: ReturnType<typeof commitBootstrap>;
let diffUseCases: ReturnType<typeof diffBootstrap>;
let repositoryUseCases: Awaited<ReturnType<typeof repositoryBootstrap>>;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception in main process:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection in main process:", err);
});

async function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  window = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  console.log("NODE ENV", process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    window.loadURL("http://localhost:5173");
    window.webContents.session.clearCache();
    window.webContents.openDevTools();
  } else {
    window.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  repositoryUseCases = await repositoryBootstrap(window);
  commitUseCases = commitBootstrap(window);
  diffUseCases = diffBootstrap(window);

  ipcMain.handle("repositories:clone", async (event, message) => {
    const res = await repositoryUseCases.cloneRepository.execute(message);
    return res;
  });

  ipcMain.handle("repositories:authenticate", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    return await repositoryUseCases.authenticate.execute(
      parsedMessage.repositoryPath,
      parsedMessage.username,
      parsedMessage.password,
    );
  });

  ipcMain.handle("repositories:checkout-branch", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    return await repositoryUseCases.checkoutBranch.execute(
      parsedMessage.repositoryPath,
      parsedMessage.branchName,
    );
  });

  ipcMain.handle(
    "repositories:fetch",
    async (event, message) => await repositoryUseCases.fetch.execute(message),
  );

  ipcMain.handle(
    "repositories:getBranchesForRepository",
    async (event, message) =>
      await repositoryUseCases.getBranchesForRepository.execute(message),
  );

  ipcMain.handle(
    "repositories:getSaved",
    async (event, message) =>
      await repositoryUseCases.getSavedRepositories.execute(),
  );

  ipcMain.handle(
    "repositories:pull",
    async (event, message) => await repositoryUseCases.pull.execute(message),
  );

  ipcMain.handle(
    "repositories:push",
    async (event, message) => await repositoryUseCases.push.execute(message),
  );

  ipcMain.handle(
    "repositories:selectFromDisk",
    async (event, message) =>
      await repositoryUseCases.selectRepositoryFromDisk.execute(),
  );

  ipcMain.handle(
    "repositories:selectFromSaved",
    async (event, message) =>
      await repositoryUseCases.selectRepositoryFromSaved.execute(message),
  );

  ipcMain.handle("commits:commit", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    return await commitUseCases.commit.execute(
      parsedMessage.repositoryPath,
      parsedMessage.message,
      parsedMessage.description,
    );
  });

  ipcMain.handle("commits:getHistory", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    return await commitUseCases.getHistory.execute(
      parsedMessage.page,
      parsedMessage.pageSize,
      parsedMessage.repositoryPath,
    );
  });

  ipcMain.handle("commits:getCommitFileDiff", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    return await commitUseCases.getCommitFileDiff.execute(
      parsedMessage.repositoryPath,
      parsedMessage.commitHash,
      parsedMessage.filePath,
    );
  });

  ipcMain.handle("commits:getCommitStatus", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    return await commitUseCases.getCommitStatus.execute(
      parsedMessage.repositoryPath,
      parsedMessage.commitHash,
    );
  });

  ipcMain.handle("diff:addToGitignore", async (event, message) => {
    const parseMessage = JSON.parse(message);
    await diffUseCases.addToGitignore.execute(
      parseMessage.repositoryPath,
      parseMessage.filePaths,
    );
  });

  ipcMain.handle("diff:batchAddToGitignore", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    return await diffUseCases.batchAddToGitignore.execute(
      parsedMessage.repository,
      parsedMessage.extension,
    );
  });

  ipcMain.handle(
    "diff:batchDiscardFileModifications",
    async (event, message) => {
      const parsedMessage = JSON.parse(message);
      return await diffUseCases.batchDiscardFileModifications.execute(
        parsedMessage.repositoryPath,
        parsedMessage.filePaths,
      );
    },
  );

  ipcMain.handle("diff:getTreeFileDiff", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    return await diffUseCases.getTreeFileDiff.execute(
      parsedMessage.repositoryPath,
      parsedMessage.filePath,
      parsedMessage.currentBranchName,
      parsedMessage.remoteName,
      parsedMessage.staged,
      parsedMessage.status,
    );
  });

  ipcMain.handle(
    "diff:stageAndStash",
    async (event, message) => await diffUseCases.stageAndStash.execute(message),
  );

  ipcMain.handle("diff:toggleFilesStaged", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    return await diffUseCases.toggleFileStaged.execute(
      parsedMessage.repositoryPath,
      parsedMessage.filePaths,
    );
  });

  ipcMain.handle("diff:stashFile", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    return await diffUseCases.stashFile.execute(
      parsedMessage.repositoryPath,
      parsedMessage.filePath,
    );
  });

  window.webContents.on("render-process-gone", (event, details) => {
    console.error("Renderer process crashed:", details);
  });
}

app.commandLine.appendSwitch("disable-features", "AudioServiceOutOfProcess");
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
app.whenReady().then(createWindow);
