# Web Versioning

- HTML head carries `<meta name="x-build" content="YYYY.MM.DD+shortSHA" />`.
- Stylesheet link uses cache-busting query `styles.css?v=<version>` set from the same string.
- GitHub Action `.github/workflows/build-version.yml` updates both values on every push to `main` by composing `$(date -u +'%Y.%m.%d')+${GITHUB_SHA::7}` and writing it back to `index.html`.
- Local workflow: run `DRY_RUN=1 scripts/ci_build_version_local.sh` to preview, or `scripts/ci_build_version_local.sh` to apply.

# License

- Content licensed under CC BY-SA 4.0; see `LICENSE.md` for details.
