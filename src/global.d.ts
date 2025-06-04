import { IpcRendererEvent } from "electron";

import { Branch, Repository, RepositorySelection } from "./types";
import { ActionResponse } from "../electron/commons/action";

// src/global.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      sendMessage: (msg: string) => void;
      onReply: (cb: (event: any, msg: string) => void) => void;
      cloneRepository: (
        url: string,
      ) => Promise<ActionResponse<RepositorySelection>>;
      getBranchesForRepository: (
        path: string,
      ) => Promise<ActionResponse<Branch[]>>;
      getSavedRepositories: () => Promise<ActionResponse<Repository[]>>;
      selectRepositoryFromDisk: () => Promise<
        ActionResponse<RepositorySelection>
      >;
      selectRepositoryFromSaved: (
        path: string,
      ) => Promise<ActionResponse<RepositorySelection>>;

      onGitError: (
        callback: (
          event: IpcRendererEvent,
          data: { message: string; command?: string },
        ) => void,
      ) => void;
    };
  }
}
