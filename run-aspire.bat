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

REM Check if Aspire workload is installed
dotnet workload list | findstr /C:"aspire" >nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Warning: Aspire workload may not be installed.
    echo To install, run: dotnet workload install aspire
    echo.
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i not "%CONTINUE%"=="y" exit /b 1
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
