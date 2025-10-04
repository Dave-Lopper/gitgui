import { IEventEmitter } from "../../../commons/application/i-event-emitter.js";
import { CommitStatusDto } from "../dto/commit-status.js";

export interface CommitStatusService {
  execute(
    repositoryPath: string,
    eventEmitter: IEventEmitter,
  ): Promise<CommitStatusDto>;
}
