import { IpcRendererEvent } from "electron";

import { Commit } from "./domain/commit";
import { CurrentDiffFile } from "./domain/diff";
import { Repository, Branch } from "./domain/repository";
import { ActionResponse } from "./dto/action";
import { RepositorySelectionDto } from "./dto/repo-selection";

// src/global.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      sendMessage: (msg: string) => void;
      onReply: (cb: (event: any, msg: string) => void) => void;
      cloneRepository: (
        url: string,
      ) => Promise<ActionResponse<RepositorySelectionDto>>;
      commit: (
        message: string,
        description: string,
        repositoryPath: string,
      ) => Promise<ActionResponse<Commit>>;
      getBranchesForRepository: (
        path: string,
      ) => Promise<ActionResponse<Branch[]>>;
      getHistory: (
        page: number,
        pageSize: number,
        repositoryPath: string,
      ) => Promise<Commit[]>;
      getSavedRepositories: () => Promise<ActionResponse<Repository[]>>;
      refreshRepoDiff: (repositoryPath: string) => Promise<CurrentDiffFile[]>;
      selectRepositoryFromDisk: () => Promise<
        ActionResponse<RepositorySelectionDto>
      >;
      selectRepositoryFromSaved: (
        path: string,
      ) => Promise<ActionResponse<RepositorySelectionDto>>;
      toggleFileStaged: (
        repositoryPath: string,
        filePath: string,
      ) => Promise<void>;

      onGitError: (
        callback: (
          event: IpcRendererEvent,
          data: { message: string; command?: string },
        ) => void,
      ) => void;
    };
  }
}
