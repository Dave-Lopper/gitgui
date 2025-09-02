import { IpcRendererEvent } from "electron";

import { Branch, FileDiff, Repository } from "./types";
import { Commit } from "./domain/commit";
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
      getDiff: (path: string) => Promise<ActionResponse<FileDiff[]>>;
      getHistory: (
        page: number,
        pageSize: number,
        repositoryPath: string,
      ) => Promise<Commit[]>;
      getSavedRepositories: () => Promise<ActionResponse<Repository[]>>;
      selectRepositoryFromDisk: () => Promise<
        ActionResponse<RepositorySelectionDto>
      >;
      selectRepositoryFromSaved: (
        path: string,
      ) => Promise<ActionResponse<RepositorySelectionDto>>;

      onGitError: (
        callback: (
          event: IpcRendererEvent,
          data: { message: string; command?: string },
        ) => void,
      ) => void;
    };
  }
}
