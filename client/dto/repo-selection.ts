import { Branch } from "../domain/branch";
import { Repository } from "../domain/repository";
import { TreeStatus } from "../domain/status";

export type RepositorySelectionDto = {
  branches: Branch[];
  treeStatus: TreeStatus;
  repository: Repository;
};
