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
    const res = await repositoryUseCases.cloneRepository.execute(
      message,
      window,
    );
    return res;
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
    "repositories:selectFromDisk",
    async (event, message) =>
      await repositoryUseCases.selectRepositoryFromDisk.execute(window),
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

  ipcMain.handle("diff:addToGitignore", async (event, message) => {
    const parseMessage = JSON.parse(message);
    await diffUseCases.addToGitignore.execute(
      parseMessage.repositoryPath,
      parseMessage.filePaths,
    );
  });

  ipcMain.handle("diff:batchAddToGitignore", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    await diffUseCases.batchAddToGitignore.execute(
      parsedMessage.repository,
      parsedMessage.extension,
    );
  });

  ipcMain.handle(
    "diff:batchDiscardFileModifications",
    async (event, message) => {
      const parsedMessage = JSON.parse(message);
      await diffUseCases.batchDiscardFileModifications.execute(
        parsedMessage.repositoryPath,
        parsedMessage.filePaths,
      );
    },
  );

  ipcMain.handle("diff:toggleFilesStaged", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    await diffUseCases.toggleFileStaged.execute(
      parsedMessage.repositoryPath,
      parsedMessage.filePaths,
    );
  });
}

app.commandLine.appendSwitch("disable-features", "AudioServiceOutOfProcess");
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
app.whenReady().then(createWindow);
