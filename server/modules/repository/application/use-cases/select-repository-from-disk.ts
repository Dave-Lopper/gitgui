import os from "os";
import path from "path";

import { BrowserWindow, dialog } from "electron";

import { ActionResponse } from "../../../../commons/dto/action.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { Repository } from "../../domain/entities.js";
import { RepositorySelectionDto } from "../../dto/repository-selection.js";
import { RepositoryGitRunner } from "../git-runner.js";
import { RepositoryStore } from "../store.js";
import { dedupRefs } from "../../domain/services.js";
import { RepoDiffService } from "../../../diff/application/repo-diff-service.js";

export type SelectRepositoryFromDiskStatus =
  | "canceled"
  | "invalidRepo"
  | "success";

export class SelectRepositoryFromDisk {
  constructor(
    private readonly gitRunner: RepositoryGitRunner,
    private readonly repoDiffService: RepoDiffService,
    private readonly store: RepositoryStore,
  ) {}

  async execute(
    window: BrowserWindow,
  ): Promise<ActionResponse<RepositorySelectionDto>> {
    const result: any = dialog.showOpenDialog(window, {
      properties: ["openDirectory"],
      defaultPath: os.homedir(),
    });
    if (result.canceled) {
      return {
        status: "canceled",
        action: "selectRepositoryFromDisk",
        success: false,
        message: "Action canceled by user",
      };
    }

    const repositoryPath = result.filePaths[0];
    const isRepoValid = await this.gitRunner.isValidRepository(repositoryPath);
    if (!isRepoValid) {
      return {
        status: "invalidRepo",
        success: false,
        action: "selectRepositoryFromDisk",
      };
    }

    const repositoryName = path.basename(repositoryPath);
    const branchName = await safeGit(
      this.gitRunner.getCurrentBranch(repositoryPath),
      window,
    );
    const remote = await safeGit(
      this.gitRunner.getCurrentRemote(repositoryPath),
      window,
    );
    const repository: Repository = {
      checkedOutBranch: branchName,
      localPath: repositoryPath,
      name: repositoryName,
      remoteName: remote.name,
      url: remote.url,
    };
    const refs = await safeGit(this.gitRunner.listRefs(repositoryPath), window);
    const branches = dedupRefs(branchName, refs);
    const diff = await this.repoDiffService.execute(repositoryPath, window);

    if (!(await this.store.exists(repository))) {
      await this.store.save(repository);
    }
    return {
      action: "selectRepositoryFromDisk",
      status: "success",
      success: true,
      data: { repository, branches, diff },
    };
  }
}
