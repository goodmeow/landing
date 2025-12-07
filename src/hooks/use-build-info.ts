import { useEffect, useMemo, useState } from "react";

export type CommitInfo = {
  sha: string;
  url: string;
};

export function useBuildInfo() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    if (typeof document === "undefined") return;

    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="x-build"]',
    );

    if (meta?.content) {
      setVersion(meta.content);
    }
  }, []);

  const commitInfo = useMemo<CommitInfo | null>(() => {
    if (!version) return null;

    const parts = version.split("+");
    const sha = parts[1];

    if (!sha) return null;

    return {
      sha,
      url: `https://github.com/goodmeow/landing/commit/${sha}`,
    };
  }, [version]);

  return { version, commitInfo };
}
