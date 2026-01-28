# Release Workflow

This document describes the recommended release workflow for the Cheesebox project. This is a suggestion for internal teams and contributors - adapt it to fit your needs.

## Branch Structure

```
feature branches → dev (via PRs) → release branch → main (release PR)
```

| Branch          | Purpose                                 |
|-----------------|-----------------------------------------|
| `main`          | Production-ready code, tagged releases  |
| `dev`           | Integration branch for ongoing work     |
| `release/x.x.x` | Temporary branch for preparing releases |

## Day-to-Day Development

1. Create feature/fix branches from `dev`
2. Open PRs targeting `dev`
3. Review and merge PRs into `dev`
4. **Don't update changelog yet** - changes are "in flight"

## Creating a Release

When ready to release:

```bash
# 1. Create release branch from dev
git checkout dev && git pull
git checkout -b release/1.9.0

# 2. Bump version in package.json
npm version minor --no-git-tag-version  # or patch/major

# 3. Update CHANGELOG.md
#    - Review commits since last release
#    - Add entries under new version header
git log v1.8.8..dev --oneline --no-merges

# 4. Commit version bump and changelog
git add package.json CHANGELOG.md
git commit -m "v1.9.0"

# 5. Push and create PR into main
git push -u origin release/1.9.0
gh pr create --base main --title "v1.9.0"
```

## After Merging to Main

```bash
# Tag the release
git checkout main && git pull
git tag v1.9.0
git push --tags

# Sync dev with main
git checkout dev
git merge main
git push
```

## Quick Reference

| Step                  | Branch        | Changelog    | Version      |
|-----------------------|---------------|--------------|--------------|
| Feature PRs           | → dev         | No           | No           |
| Create release branch | release/x.x.x | **Update**   | **Bump**     |
| Release PR            | → main        | Already done | Already done |
| After merge           | main          | Tag only     | —            |
| Sync back             | main → dev    | —            | —            |

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backwards compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backwards compatible

## Changelog Format

The changelog follows [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [1.9.0] - 2026-01-28
### Added
- New features

### Changed
- Changes to existing functionality

### Fixed
- Bug fixes

### Security
- Security improvements
```

## Viewing Changes Since Last Release

```bash
# See commits since last tag
git log v1.8.8..dev --oneline --no-merges

# See file changes
git diff v1.8.8..dev --stat
```
