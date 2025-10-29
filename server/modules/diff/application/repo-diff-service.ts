import { File } from "../domain/entities.js";

export interface RepoDiffService {
  execute(repositoryPath: string): Promise<(File & { staged: boolean })[]>;
}
