import { FileDiff } from "../../file/domain.js";
import { Branch } from "../domain/branch.js";
import { Repository } from "../domain/repository.js";

export type RepositorySelectionDto = {
  repository: Repository;
  branches: Branch[];
  diff: (FileDiff & { staged: boolean })[];
};
