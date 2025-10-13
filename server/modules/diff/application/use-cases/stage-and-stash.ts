import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffGitRunner } from "../git-runner.js";

export class StageAndStash {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: DiffGitRunner,
  ) {}

  async execute(repositoryPath: string): Promise<void> {
    await safeGit(this.gitRunner.stageFiles(repositoryPath), this.eventEmitter);
    await safeGit(this.gitRunner.stashFiles(repositoryPath), this.eventEmitter);
  }
}
