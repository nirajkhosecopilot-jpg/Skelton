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

# Check if Aspire workload is installed
if ! dotnet workload list | grep -q "aspire"; then
    echo ""
    echo "Warning: Aspire workload may not be installed."
    echo "To install, run: dotnet workload install aspire"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
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
