export type RepositoryConfig = {
  name: string;
  localPath: string;
  url: string;

  checkedOutBranch?: string;
  lastFetchedAt?: Date;
  remoteName?: string;
};

export class Repository {
  private name: string;
  private localPath: string;
  private url: string;

  private checkedOutBranch?: string;
  private lastFetchedAt?: Date;
  private remoteName?: string;

  constructor({
    name,
    lastFetchedAt,
    localPath,
    remoteName,
    url,
    checkedOutBranch,
  }: RepositoryConfig) {
    this.name = name;
    this.localPath = localPath;
    this.remoteName = remoteName;
    this.url = url;
    this.checkedOutBranch = checkedOutBranch;
    this.lastFetchedAt = lastFetchedAt;
  }

  public getName(): string {
    return this.name;
  }

  public getLastFetchedAt(): Date | undefined {
    return this.lastFetchedAt;
  }

  public setLastFetchedAt(at: Date) {
    this.lastFetchedAt = at;
  }

  public getLocalPath(): string {
    return this.localPath;
  }

  public getRemoteName(): string | undefined {
    return this.remoteName;
  }

  public getCheckedOutBranch(): string | undefined {
    return this.checkedOutBranch;
  }

  public setCheckedOutBranch(branch: string): void {
    this.checkedOutBranch = branch;
  }

  public getUrl(): string {
    return this.url;
  }

  public toJson() {
    return JSON.stringify({
      name: this.name,
      localPath: this.localPath,
      remoteName: this.remoteName,
      url: this.url,
      checkedOutBranch: this.checkedOutBranch,
    });
  }
}
