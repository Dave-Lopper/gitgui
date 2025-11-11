import { IpcRendererEvent } from "electron";

import { Commit, CommitStatus } from "./domain/commit";
import { DiffEntry, DiffFile } from "./domain/diff";
import { Branch, Repository } from "./domain/repository";
import { ActionResponse } from "./dto/action";
import { HistoryPaginationDto } from "./dto/history-pagination";
import { RepositorySelectionDto } from "./dto/repo-selection";

// src/global.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      sendMessage: (msg: string) => void;
      onReply: (cb: (event: any, msg: string) => void) => void;
      addToGitignore: (
        repositoryPath: string,
        filePaths: string[],
      ) => Promise<void>;
      authenticate: (
        password: string,
        repositoryPath: string,
        username: string,
      ) => Promise<boolean>;
      batchAddToGitignore: (
        repositoryPath: string,
        extension: string,
      ) => Promise<void>;
      batchDiscardFileModifications: (
        repositoryPath: string,
        filePaths: string[],
      ) => Promise<void>;
      checkoutBranch: (
        repositoryPath: string,
        branchName: string,
        remoteName?: string,
      ) => Promise<boolean>;
      cloneRepository: (
        url: string,
      ) => Promise<ActionResponse<RepositorySelectionDto>>;
      commit: (
        repositoryPath: string,
        message: string,
        description?: string,
      ) => Promise<Commit>;
      fetch: (repositoryPath: string) => Promise<CommitStatus>;
      getBranchesForRepository: (
        path: string,
      ) => Promise<ActionResponse<Branch[]>>;
      getCommitHistory: (
        page: number,
        pageSize: number,
        repositoryPath: string,
      ) => Promise<HistoryPaginationDto>;
      getSavedRepositories: () => Promise<ActionResponse<Repository[]>>;
      getTreeFileDiff: (
        repositoryPath: string,
        filePath: string,
        staged: boolean,
      ) => Promise<DiffEntry>;
      pull: (repositoryPath: string) => Promise<void>;
      push: (repositoryPath: string) => Promise<void>;
      selectRepositoryFromDisk: () => Promise<
        ActionResponse<RepositorySelectionDto>
      >;
      selectRepositoryFromSaved: (
        path: string,
      ) => Promise<ActionResponse<RepositorySelectionDto>>;
      stageAndStash: (repositoryPath: string) => Promise<void>;
      toggleFilesStaged: (
        repositoryPath: string,
        filePaths: string[],
      ) => Promise<void>;

      onRepositoryFetched: (
        callback: (event: IpcRendererEvent, data: CommitStatus) => void,
      ) => void;
      onGitAuth: (callback: (event: IpcRendererEvent) => void) => void;
      onGitError: (
        callback: (
          event: IpcRendererEvent,
          data: { message: string; command?: string },
        ) => void,
      ) => void;
    };
  }
}
