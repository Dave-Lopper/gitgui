import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { RepositoryGitRunner } from "../git-runner.js";

export class Authenticate {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: RepositoryGitRunner,
  ) {}

  async execute(
    repositoryPath: string,
    username: string,
    password: string,
  ): Promise<boolean> {
    const remote = await safeGit(
      this.gitRunner.getCurrentRemote(repositoryPath),
      this.eventEmitter,
    );
    const remoteHost = new URL(remote.url).hostname;
    await safeGit(
      this.gitRunner.storeCredentials(
        password,
        remoteHost,
        repositoryPath,
        username,
      ),
      this.eventEmitter,
    );

    const credentialsTestResult =
      await this.gitRunner.testCredentials(repositoryPath);

    if (!credentialsTestResult) {
      await this.gitRunner.removeCredentials(
        remoteHost,
        repositoryPath,
        username,
      );
    }

    return credentialsTestResult;
  }
}
