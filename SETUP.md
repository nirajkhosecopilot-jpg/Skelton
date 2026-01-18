# Setup Guide

## Prerequisites

This project requires:
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher

## Troubleshooting npm install Issues

### Error: "Class extends value undefined is not a constructor or null"

This error typically occurs when:
1. You're using an outdated Node.js version
2. Your npm cache is corrupted
3. There are conflicting package versions

### Solution Steps (Windows)

#### 1. Check Your Node.js Version

```cmd
node --version
```

If you see a version lower than v20.0.0, you need to upgrade Node.js.

#### 2. Upgrade Node.js

**Option A: Download from Official Website**
- Visit https://nodejs.org/
- Download and install Node.js v20 LTS or v22 Current
- Restart your terminal after installation

**Option B: Use nvm-windows (Recommended)**
```cmd
# Install nvm-windows from: https://github.com/coreybutler/nvm-windows/releases

# After installation, use the .nvmrc file:
nvm install 20
nvm use 20
```

#### 3. Clean npm Cache and Reinstall

After upgrading Node.js, run these commands:

```cmd
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rmdir /s /q node_modules
del package-lock.json

# Reinstall dependencies
npm install
```

#### 4. Alternative: Use Specific npm Registry

If you still encounter issues, try using a different registry:

```cmd
npm install --registry=https://registry.npmjs.org/
```

### Solution Steps (macOS/Linux)

#### 1. Check Your Node.js Version

```bash
node --version
```

#### 2. Upgrade Node.js

**Using nvm (Recommended):**
```bash
# Install nvm if you haven't: https://github.com/nvm-sh/nvm

# Use the .nvmrc file:
nvm install
nvm use

# Or manually:
nvm install 20
nvm use 20
```

**Using Homebrew (macOS):**
```bash
brew install node@20
```

#### 3. Clean and Reinstall

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

## Running the Project

After successful installation:

### With Aspire (.NET 9)

```bash
cd Skelton.AppHost
dotnet run
```

Then open the Aspire dashboard URL shown in the terminal.

### Without Aspire (Direct Vite)

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

## Verification

After installation, verify everything works:

```bash
# Check all packages are installed
npm list --depth=0

# Try running the dev server
npm run dev
```

You should see output like:
```
VITE v7.2.4  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

## Common Issues

### Issue: "Cannot find module 'vite'"

**Solution:**
```bash
npm install
```

### Issue: "Port 5173 is already in use"

**Solution:**
The port is already in use. Either:
1. Stop the other process using port 5173
2. Or let Vite find another port (it will prompt you)

### Issue: Tailwind CSS not working

**Solution:**
Make sure PostCSS is installed:
```bash
npm install -D postcss autoprefixer
```

## Getting Help

If you continue to experience issues:
1. Check Node.js version: `node --version` (should be ≥ v20.0.0)
2. Check npm version: `npm --version` (should be ≥ v10.0.0)
3. Share the complete error message from the npm log file
4. Try the clean install steps above again
