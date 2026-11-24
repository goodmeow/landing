export type CommitInfo = {
  sha: string;
  url: string;
};

function readBuildInfo(): { version: string; commitInfo: CommitInfo | null } {
  if (typeof document === "undefined") {
    return { version: "", commitInfo: null };
  }

  const version =
    document.querySelector<HTMLMetaElement>('meta[name="x-build"]')?.content ??
    "";
  const sha = version.split("+")[1];

  return {
    version,
    commitInfo: sha
      ? { sha, url: `https://github.com/goodmeow/landing/commit/${sha}` }
      : null,
  };
}

const BUILD_INFO = readBuildInfo();

export function useBuildInfo() {
  return BUILD_INFO;
}
