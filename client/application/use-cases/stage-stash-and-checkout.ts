import { Branch } from "../../domain/branch";
import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class StageStashAndCheckout {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string, branch: Branch): Promise<void> {
    await this.gitService.stageAndStash(repositoryPath);
    const result = await this.gitService.checkoutBranch(repositoryPath, branch);
    if (result) {
      const dto = await this.gitService.selectRepoFromSaved(repositoryPath);
      await this.eventBus.emit({ type: "RepositorySelected", payload: dto });
    } else {
      console.error(
        "Unexpectedly failed to checkout after staging and stashing",
      );
    }
  }
}
