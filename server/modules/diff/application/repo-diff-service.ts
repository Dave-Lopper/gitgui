import { DiffFile } from "../domain/entities.js";

export interface RepoDiffService {
  execute(repositoryPath: string): Promise<(DiffFile & { staged: boolean })[]>;
}
