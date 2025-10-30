#!/usr/bin/env node

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getVersion() {
  if (process.env.VERSION) {
    return process.env.VERSION;
  }

  const now = new Date();
  const year = now.getUTCFullYear().toString().padStart(4, "0");
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = now.getUTCDate().toString().padStart(2, "0");
  const sha = execSync("git rev-parse --short=7 HEAD").toString().trim();

  return `${year}.${month}.${day}+${sha}`;
}

function updateFile(filePath, version) {
  if (!existsSync(filePath)) {
    console.warn(`Skipping ${filePath} (not found)`);
    return false;
  }

  const original = readFileSync(filePath, "utf8");
  const metaRegex = /<meta[^>]*name=["']x-build["'][^>]*>/i;
  const match = original.match(metaRegex);

  if (!match) {
    throw new Error(`Missing x-build meta tag in ${filePath}`);
  }

  const currentTag = match[0];
  const contentRegex = /content=["'][^"']*["']/i;
  let updatedTag;

  if (contentRegex.test(currentTag)) {
    updatedTag = currentTag.replace(contentRegex, `content="${version}"`);
  } else {
    const insertPosition = currentTag.length - 1;
    updatedTag = `${currentTag.slice(0, insertPosition)} content="${version}"${currentTag.slice(insertPosition)}`;
  }

  if (updatedTag === currentTag) {
    console.log(`No changes needed in ${filePath}`);
    return false;
  }

  const updated = original.replace(currentTag, updatedTag);
  writeFileSync(filePath, updated);
  console.log(`Updated ${filePath} -> ${version}`);
  return true;
}

function run() {
  try {
    const version = getVersion();
    const repoRoot = resolve(__dirname, "..");
    const targets = [resolve(repoRoot, "index.html")];

    let changed = false;
    for (const target of targets) {
      changed = updateFile(target, version) || changed;
    }

    if (!changed) {
      console.log("x-build meta already up to date");
    }
  } catch (error) {
    console.error("Failed to update x-build meta:", error.message);
    process.exitCode = 1;
  }
}

run();
