import { IRepositoryStore } from "../application/i-repository-store";
import { Repository } from "../domain/repository";

export class RepositoryStore implements IRepositoryStore {
  async getRepositories(): Promise<Repository[]> {
    const response = await window.electronAPI.getSavedRepositories();
    if (response.success === true) {
      return response.data;
    }
    throw new Error(response.message);
  }
}
