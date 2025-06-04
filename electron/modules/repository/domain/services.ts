export function getRepositoryNameFromRemoteUrl(remoteUrl: string) {
  remoteUrl = remoteUrl.trim().replace(/\.git$/, "");

  if (remoteUrl.includes("@") && remoteUrl.includes(":")) {
    const parts = remoteUrl.split(":");
    if (parts.length === 2) {
      return parts[1].split("/").pop();
    }
  }

  try {
    const url = new URL(remoteUrl);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments[segments.length - 1];
  } catch (e) {
    const parts = remoteUrl.split("/");
    return parts[parts.length - 1];
  }
}
