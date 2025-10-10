import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { RepositoryGitRunner } from "../git-runner.js";

export class Push {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: RepositoryGitRunner,
  ) {}

  async execute(repositoryPath: string): Promise<void> {
    await safeGit(this.gitRunner.push(repositoryPath), this.eventEmitter);
  }
}
