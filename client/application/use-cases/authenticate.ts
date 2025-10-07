import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class Authenticate {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    password: string,
    repositoryPath: string,
    username: string,
  ): Promise<void> {
    const result = await this.gitService.authenticate(
      password,
      repositoryPath,
      username,
    );
    this.eventBus.emit({
      type: "Authenticated",
      payload: { success: result },
    });
  }
}
