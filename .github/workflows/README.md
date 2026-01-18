# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD automation.

## Available Workflows

### 1. Test on Pull Request (`test-on-pr.yml`)

**Trigger:** Runs automatically on pull requests to the `develop` branch

**Purpose:** Ensures all tests pass before merging code

**Steps:**
- Checkout code
- Setup Node.js (tests on versions 20.x and 22.x)
- Install dependencies with `npm ci`
- Run ESLint linting
- Run test suite with `npm test`
- Upload test results as artifacts

**Status:** ✅ Required check - PRs cannot be merged if tests fail

### 2. Build on Pull Request (`build-on-pr.yml`)

**Trigger:** Runs automatically on pull requests to the `develop` branch

**Purpose:** Ensures the application builds successfully before merging

**Steps:**
- Checkout code
- Setup Node.js (tests on versions 20.x and 22.x)
- Install dependencies with `npm ci`
- Build application with `npm run build`
- Upload build artifacts

**Status:** ✅ Required check - PRs cannot be merged if build fails

## Test Matrix

Both workflows test against multiple Node.js versions to ensure compatibility:
- Node.js 20.x
- Node.js 22.x

## Viewing Results

1. Navigate to the **Actions** tab in the GitHub repository
2. Select the workflow run you want to view
3. Click on the specific job to see detailed logs
4. Download artifacts (test results, build files) from the workflow summary

## Local Development

Before pushing your PR, you can run the same checks locally:

```bash
# Run linting
npm run lint

# Run tests
npm test

# Run build
npm run build
```

## Modifying Workflows

To modify these workflows:
1. Edit the `.yml` files in this directory
2. Test your changes using [act](https://github.com/nektos/act) (local GitHub Actions runner)
3. Commit and push changes
4. Workflows will be updated automatically

## Required Status Checks

To make these workflows required:
1. Go to repository **Settings** → **Branches**
2. Add branch protection rule for `develop`
3. Enable "Require status checks to pass before merging"
4. Select the following checks:
   - Test Status Check
   - Build Status Check

This ensures that all tests and builds must pass before PRs can be merged into develop.
