import { CommitStatusDto } from "../../commit/dto/commit-status.js";
import { DiffFile } from "../../diff/domain/entities.js";
import { Branch } from "../domain/entities.js";
import { Repository } from "../domain/entities.js";

export type RepositorySelectionDto = {
  commitStatus: CommitStatusDto;
  repository: Repository;
  branches: Branch[];
  diff: (DiffFile & { staged: boolean })[];
};
