# scripts Agent Guide

## Package Identity
- Build metadata is injected by the Vite plugin in `vite.config.ts`; this directory is reserved for future Node.js utilities.
- Written in ESM and targeting Node 20+.

## Setup & Run
- `npm run build` – exercises the Vite build metadata injection.

## Patterns & Conventions
- ✅ DO keep scripts ESM (`type: module`) and prefer native Node APIs.
- ✅ DO resolve paths relative to `import.meta.url` like the existing script to work regardless of CWD.
- ❌ DON'T add source-mutating build stamp scripts; metadata belongs in the Vite build transform.
- ✅ Capture and surface errors with actionable messages (`console.error` + `process.exitCode = 1`).
- ✅ Respect repo boundaries—scripts should not write outside the repository root.

## Touch Points / Key Files
- Build metadata plugin: `vite.config.ts`

## JIT Index Hints
- `rg -n "x-build|buildVersion" vite.config.ts src` – find metadata related code.
- `rg -n "execSync" scripts` – inspect git interactions.
- `rg -n "process.env" scripts` – audit environment variable usage.

## Common Gotchas
- Build metadata should not dirty source `index.html`; inject it into `dist/index.html`.
- Missing `<meta name="x-build">` in `index.html` leaves the footer without build metadata.
- Remember to mark executables with the proper shebang (`#!/usr/bin/env node`).

## Pre-PR Checks
- `npm run build`
