import { TreeStatus } from "../../status/domain/entities.js";
import { Branch } from "../domain/entities.js";
import { Repository } from "../domain/entities.js";

export type RepositorySelectionDto = {
  repository: Repository;
  branches: Branch[];
  treeStatus: TreeStatus;
};
