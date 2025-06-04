import { GitRunner } from "../git-runner.js";
import { ActionResponse } from "../../../../commons/action.js";

export class GetLocalChangesDiff {
  constructor(private readonly gitRunner: GitRunner) {}
  async execute(repositoryPath: string): Promise<ActionResponse<null>> {
    const changedFiles = await this.gitRunner.getModifiedFiles(repositoryPath);
    return { action: "getLocalChangesDiff", success: true, data: null };
  }
}
