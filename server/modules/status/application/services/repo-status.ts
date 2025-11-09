import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { TreeStatus } from "../../domain/entities";
import { parseRepoStatus } from "../../domain/services.js";
import { GitStatusRunner } from "../git-runner.js";

export class RepoStatusService {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: GitStatusRunner,
  ) {}

  async execute(repositoryPath: string): Promise<TreeStatus> {
    const statusLines = await safeGit(
      this.gitRunner.getRepoStatus(repositoryPath),
      this.eventEmitter,
    );
    const treeStatus = parseRepoStatus(statusLines);
    return treeStatus;
  }
}
