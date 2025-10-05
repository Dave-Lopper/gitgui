export class GitError extends Error {
  constructor(
    public readonly code: number,
    public readonly message: string,
    public readonly command?: string,
  ) {
    super(message);
    this.name = "GitError";
  }
}
