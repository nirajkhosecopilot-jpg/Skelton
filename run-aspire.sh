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
