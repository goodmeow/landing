# scripts Agent Guide

## Package Identity
- Node.js utilities that support build metadata; primary entry is `scripts/update-build-meta.mjs` invoked by npm scripts.
- Written in ESM and targeting Node 20+.

## Setup & Run
- `npm run version:meta` – run the metadata updater without a full build.
- `node ./scripts/update-build-meta.mjs` – direct execution for debugging.
- `npm run build` – exercises the script in its normal lifecycle (`prebuild` + build).

## Patterns & Conventions
- ✅ DO keep scripts ESM (`type: module`) and prefer native Node APIs as shown in `update-build-meta.mjs`.
- ✅ DO resolve paths relative to `import.meta.url` like the existing script to work regardless of CWD.
- ❌ DON'T resurrect the legacy CommonJS version `scripts/update_build_meta.js`; it remains for history only.
- ✅ Capture and surface errors with actionable messages (`console.error` + `process.exitCode = 1`).
- ✅ Respect repo boundaries—scripts should not write outside the repository root.

## Touch Points / Key Files
- Active build stamper: `scripts/update-build-meta.mjs`
- Historical reference (read-only): `scripts/update_build_meta.js`

## JIT Index Hints
- `rg -n "update-build-meta" -g"*.mjs" scripts` – find metadata related scripts.
- `rg -n "execSync" scripts` – inspect git interactions.
- `rg -n "process.env" scripts` – audit environment variable usage.

## Common Gotchas
- The script shells out to `git`; ensure commands work in CI environments or guard for shallow clones.
- Missing `<meta name="x-build">` in `index.html` throws—update the file before adjusting the script.
- Remember to mark executables with the proper shebang (`#!/usr/bin/env node`).

## Pre-PR Checks
- `npm run version:meta && npm run build`
