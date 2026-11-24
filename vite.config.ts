import { execFileSync } from "node:child_process";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

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
    return `${year}.${month}.${day}+unknown`;
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
