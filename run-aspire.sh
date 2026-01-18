#!/bin/bash

# Run with .NET Aspire
# This script starts the application using Aspire orchestration

echo "Starting Project Description Form with .NET Aspire..."
echo ""

# Check if .NET SDK is installed
if ! command -v dotnet &> /dev/null; then
    echo "Error: .NET SDK is not installed."
    echo "Please install .NET 9.0 SDK or later from: https://dotnet.microsoft.com/download"
    exit 1
fi

# Check .NET version
DOTNET_VERSION=$(dotnet --version)
echo "Using .NET SDK version: $DOTNET_VERSION"
echo ""
echo "Note: This project uses Aspire via NuGet packages (no workload required)"

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo ""
    echo "Error: Node.js is not installed."
    echo "Please install Node.js 20.19+ or 22.12+ from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
NODE_MINOR=$(echo $NODE_VERSION | cut -d. -f2)

echo "Using Node.js version: v$NODE_VERSION"

# Vite requires Node.js 20.19+ or 22.12+
if [ "$NODE_MAJOR" -lt 20 ]; then
    echo ""
    echo "Error: Node.js version $NODE_VERSION is not supported."
    echo "Vite requires Node.js 20.19+ or 22.12+."
    echo "Please upgrade Node.js from: https://nodejs.org/"
    exit 1
elif [ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -lt 19 ]; then
    echo ""
    echo "Error: Node.js version $NODE_VERSION is not supported."
    echo "Vite requires Node.js 20.19+ or 22.12+."
    echo "Please upgrade Node.js from: https://nodejs.org/"
    exit 1
elif [ "$NODE_MAJOR" -eq 21 ]; then
    echo ""
    echo "Warning: Node.js 21 is not an LTS version."
    echo "Consider using Node.js 20.19+ or 22.12+ for better stability."
elif [ "$NODE_MAJOR" -eq 22 ] && [ "$NODE_MINOR" -lt 12 ]; then
    echo ""
    echo "Error: Node.js version $NODE_VERSION is not supported."
    echo "Vite requires Node.js 22.12+ if using Node.js 22.x."
    echo "Please upgrade Node.js from: https://nodejs.org/"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo "Installing npm dependencies..."
    npm install
fi

# Navigate to AppHost and run
echo ""
echo "Starting Aspire AppHost..."
echo "The Aspire Dashboard will open automatically at: https://localhost:17219"
echo ""

cd Skelton.AppHost
dotnet run
