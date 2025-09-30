#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getVersion() {
  if (process.env.VERSION) return process.env.VERSION;
  const now = new Date();
  const date = `${now.getUTCFullYear().toString().padStart(4, '0')}.${(now.getUTCMonth() + 1)
    .toString()
    .padStart(2, '0')}.${now.getUTCDate().toString().padStart(2, '0')}`;
  const sha = execSync('git rev-parse --short=7 HEAD').toString().trim();
  return `${date}+${sha}`;
}

function updateFile(filePath, version) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Skipping ${filePath} (not found)`);
    return false;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const metaRegex = /(meta\s+name="x-build"\s+content=")([^"]*)(")/i;
  if (!metaRegex.test(original)) {
    throw new Error(`Missing x-build meta tag in ${filePath}`);
  }

  const updated = original.replace(metaRegex, `$1${version}$3`);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    console.log(`Updated ${filePath} -> ${version}`);
    return true;
  }

  console.log(`No changes needed in ${filePath}`);
  return false;
}

function run() {
  try {
    const version = getVersion();
    const repoRoot = path.resolve(__dirname, '..');
    const targets = [path.join(repoRoot, 'frontend', 'index.html')];

    let changed = false;
    for (const target of targets) {
      try {
        changed = updateFile(target, version) || changed;
      } catch (error) {
        throw error;
      }
    }

    if (!changed) {
      console.log('x-build meta already up to date');
    }
  } catch (error) {
    console.error('Failed to update x-build meta:', error.message);
    process.exitCode = 1;
  }
}

run();
