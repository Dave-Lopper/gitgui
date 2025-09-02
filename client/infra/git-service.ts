import { IGitService } from "../application/i-git-service";
import { Commit } from "../domain/commit";
import { RepositorySelectionDto } from "../dto/repo-selection";

export class GitService implements IGitService {
  async clone(url: string): Promise<RepositorySelectionDto> {
    const results = await window.electronAPI.cloneRepository(url);
    if (!results.success) {
      throw new Error(results.message);
    }
    return results.data;
  }

  async commit(
    message: string,
    description: string,
    repositoryPath: string,
  ): Promise<Commit> {
    const result = await window.electronAPI.commit(
      message,
      description,
      repositoryPath,
    );
    if (!result.success) {
      throw new Error(result.message);
    }
    return result.data;
  }
}
