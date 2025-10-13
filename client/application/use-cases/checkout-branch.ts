import { Branch } from "../../domain/branch";
import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class CheckoutBranch {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string, branch: Branch): Promise<void> {
    if (branch.isCurrent) {
      return;
    }

    let remoteName = undefined;
    if (!branch.isLocal) {
      remoteName = branch.remote;
    }

    const success = await this.gitService.checkoutBranch(
      repositoryPath,
      branch.name,
      remoteName,
    );

    if (!success) {
      this.eventBus.emit({
        type: "CheckedOutBranchFailed",
        payload: { branch },
      });
    } else {
      const dto = await this.gitService.selectRepoFromSaved(repositoryPath);
      this.eventBus.emit({ type: "RepositorySelected", payload: dto });
    }
  }
}
