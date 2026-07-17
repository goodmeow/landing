import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

const repoRoot = dirname(fileURLToPath(import.meta.url));

function readGitShaFromDisk() {
  const gitDir = resolve(repoRoot, ".git");
  const headPath = resolve(gitDir, "HEAD");

  if (!existsSync(headPath)) return "";

  const head = readFileSync(headPath, "utf8").trim();

  if (/^[0-9a-f]{40}$/i.test(head)) {
    return head.slice(0, 7);
  }

  const ref = head.match(/^ref: (.+)$/)?.[1];

  if (!ref) return "";

  const refPath = resolve(gitDir, ref);

  if (existsSync(refPath)) {
    return readFileSync(refPath, "utf8").trim().slice(0, 7);
  }

  const packedRefsPath = resolve(gitDir, "packed-refs");

  if (!existsSync(packedRefsPath)) return "";

  const packedRef = readFileSync(packedRefsPath, "utf8")
    .split("\n")
    .find((line) => line.endsWith(` ${ref}`));

  return packedRef?.slice(0, 7) ?? "";
}

function getBuildVersion() {
  if (process.env.VERSION) {
    return process.env.VERSION;
  }

  const now = new Date();
  const year = now.getUTCFullYear().toString().padStart(4, "0");
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = now.getUTCDate().toString().padStart(2, "0");

  try {
    const sha = execFileSync("git", ["rev-parse", "--short=7", "HEAD"])
      .toString()
      .trim();

    return `${year}.${month}.${day}+${sha}`;
  } catch {
    const sha = readGitShaFromDisk() || "unknown";

    return `${year}.${month}.${day}+${sha}`;
  }
}

function buildVersionPlugin() {
  return {
    name: "goodmeow-build-version",
    transformIndexHtml(html: string) {
      return html.replace(/<meta([^>]*name=["']x-build["'][^>]*)>/i, (tag) => {
        if (tag.includes("content=")) {
          return tag.replace(
            /content=["'][^"']*["']/i,
            `content="${getBuildVersion()}"`,
          );
        }

        return tag.replace(/\/?>$/, ` content="${getBuildVersion()}" />`);
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss(), buildVersionPlugin()],
});
