export class GitError extends Error {
  constructor(
    public readonly message: string,
    public readonly command?: string,
  ) {
    super(message);
    this.name = "GitError";
  }
}
