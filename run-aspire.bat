@echo off
REM Run with .NET Aspire
REM This script starts the application using Aspire orchestration

echo Starting Project Description Form with .NET Aspire...
echo.

REM Check if .NET SDK is installed
where dotnet >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: .NET SDK is not installed.
    echo Please install .NET 9.0 SDK or later from: https://dotnet.microsoft.com/download
    pause
    exit /b 1
)

REM Check .NET version
for /f "tokens=*" %%i in ('dotnet --version') do set DOTNET_VERSION=%%i
echo Using .NET SDK version: %DOTNET_VERSION%
echo.
echo Note: This project uses Aspire via NuGet packages (no workload required)

REM Check Node.js version
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error: Node.js is not installed.
    echo Please install Node.js 20.19+ or 22.12+ from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Using Node.js version: %NODE_VERSION%

REM Parse Node.js version
for /f "tokens=1,2 delims=.v" %%a in ("%NODE_VERSION%") do (
    set NODE_MAJOR=%%a
    set NODE_MINOR=%%b
)

REM Vite requires Node.js 20.19+ or 22.12+
if %NODE_MAJOR% LSS 20 (
    echo.
    echo Error: Node.js version %NODE_VERSION% is not supported.
    echo Vite requires Node.js 20.19+ or 22.12+.
    echo Please upgrade Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

if %NODE_MAJOR% EQU 20 (
    if %NODE_MINOR% LSS 19 (
        echo.
        echo Error: Node.js version %NODE_VERSION% is not supported.
        echo Vite requires Node.js 20.19+ or 22.12+.
        echo Please upgrade Node.js from: https://nodejs.org/
        pause
        exit /b 1
    )
)

if %NODE_MAJOR% EQU 21 (
    echo.
    echo Warning: Node.js 21 is not an LTS version.
    echo Consider using Node.js 20.19+ or 22.12+ for better stability.
    echo.
)

if %NODE_MAJOR% EQU 22 (
    if %NODE_MINOR% LSS 12 (
        echo.
        echo Error: Node.js version %NODE_VERSION% is not supported.
        echo Vite requires Node.js 22.12+ if using Node.js 22.x.
        echo Please upgrade Node.js from: https://nodejs.org/
        pause
        exit /b 1
    )
)

REM Check if node_modules exists
if not exist "node_modules\" (
    echo.
    echo Installing npm dependencies...
    call npm install
)

REM Navigate to AppHost and run
echo.
echo Starting Aspire AppHost...
echo The Aspire Dashboard will open automatically at: https://localhost:17219
echo.

cd Skelton.AppHost
dotnet run

pause
