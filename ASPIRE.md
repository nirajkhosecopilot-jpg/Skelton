# Running with .NET Aspire

This project includes .NET Aspire orchestration support for easy running and management of the React application through the Aspire dashboard.

## What is .NET Aspire?

.NET Aspire is an opinionated, cloud-ready stack for building observable, production-ready, distributed applications. It provides:

- **Dashboard**: A web-based UI for monitoring and managing your applications
- **Service Discovery**: Automatic service discovery and configuration
- **Observability**: Built-in telemetry, logging, and tracing
- **Local Development**: Simplified local development experience
- **Cloud Ready**: Easy deployment to cloud environments

## Prerequisites

Before running with Aspire, ensure you have:

1. **.NET 9.0 SDK or later** - [Download here](https://dotnet.microsoft.com/download/dotnet/9.0)
2. **Node.js 20.19+ or 22.12+** (required for Vite) - [Download here](https://nodejs.org/)
3. **Docker Desktop** (optional, for containerization) - [Download here](https://www.docker.com/products/docker-desktop/)

> **Important**: This project uses Vite which requires Node.js 20.19+ or 22.12+. Older versions like Node.js 18 are not supported.

### Verify Installation

```bash
# Check .NET SDK
dotnet --version

# Check Node.js
node --version

# Check npm
npm --version
```

## Installation

### 1. Install Node.js Dependencies

```bash
npm install
```

> **Note**: This project uses .NET Aspire via NuGet packages. No workload installation is required - the Aspire SDK (version 9.2.0) will be automatically downloaded when you restore or run the project.

## Running the Application with Aspire

### Quick Start

**Recommended: Use helper scripts** (includes Node.js and .NET version checks):

```bash
./run-aspire.sh    # Linux/macOS
run-aspire.bat     # Windows
```

**Or run directly** from the root directory:

```bash
cd Skelton.AppHost
dotnet run
```

This will:
1. Start the Aspire AppHost
2. Launch the Aspire Dashboard (automatically opens in your browser)
3. Start the React application (via npm dev server)
4. Configure service endpoints and monitoring

### Accessing the Application

Once running, you can access:

- **Aspire Dashboard**: `https://localhost:17219` or `http://localhost:15219`
- **React Application**: `http://localhost:5173` (through Aspire dashboard links)

### Aspire Dashboard Features

The Aspire Dashboard provides:

1. **Resources View**: See all running services and their status
2. **Console Logs**: Real-time logs from all services
3. **Traces**: Distributed tracing information
4. **Metrics**: Performance metrics and monitoring
5. **Environment Variables**: View and manage configuration

## Project Structure

```
Skelton/
├── Skelton.AppHost/                      # Aspire orchestration project
│   ├── Program.cs                        # Aspire configuration
│   ├── Skelton.AppHost.csproj           # Project file
│   ├── Properties/
│   │   └── launchSettings.json          # Launch configuration
│   └── appsettings.json                 # App settings
├── Skelton.sln                          # Solution file
├── src/                                  # React application
├── package.json                          # Node.js dependencies
└── vite.config.js                       # Vite configuration
```

## Configuration

### Environment Variables

The backend API requires certain environment variables to be configured:

#### Required Environment Variables

**ANTHROPIC_API_KEY** - API key for Claude AI (Online Mode)
- Required for: Online mode with Claude AI
- Get your key at: https://console.anthropic.com/
- Format: `sk-ant-...`

**OLLAMA_API_URL** - URL for OLLAMA local instance (Offline Mode)
- Default: `http://localhost:11434` (or `http://host.docker.internal:11434` in Docker)
- Required for: Offline mode with OLLAMA
- Only needed if OLLAMA is running on a non-default port or remote host

#### Setting Environment Variables

**Option 1: User Secrets (Recommended for local development)**

```bash
cd Skelton.AppHost
dotnet user-secrets set "ANTHROPIC_API_KEY" "sk-ant-your-api-key-here"
dotnet user-secrets set "OLLAMA_API_URL" "http://localhost:11434"
```

**Option 2: Environment Variables (System-wide)**

```bash
# Linux/macOS
export ANTHROPIC_API_KEY="sk-ant-your-api-key-here"
export OLLAMA_API_URL="http://localhost:11434"

# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="sk-ant-your-api-key-here"
$env:OLLAMA_API_URL="http://localhost:11434"

# Windows (Command Prompt)
set ANTHROPIC_API_KEY=sk-ant-your-api-key-here
set OLLAMA_API_URL=http://localhost:11434
```

**Option 3: appsettings.json (Not recommended for secrets)**

Edit `Skelton.AppHost/appsettings.json`:

```json
{
  "ANTHROPIC_API_KEY": "sk-ant-your-api-key-here",
  "OLLAMA_API_URL": "http://localhost:11434"
}
```

> **Security Warning**: Never commit API keys to version control. Use user secrets or environment variables for sensitive data.

### Aspire AppHost Configuration

The `Program.cs` in `Skelton.AppHost` configures both the backend API and React frontend:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

// Add the Go backend API
var backend = builder.AddDockerfile("backend", "../Skelton.Api")
    .WithHttpEndpoint(port: 8080, targetPort: 8080, env: "PORT")
    .WithEnvironment("ANTHROPIC_API_KEY", builder.Configuration["ANTHROPIC_API_KEY"] ?? "")
    .WithEnvironment("OLLAMA_API_URL", builder.Configuration["OLLAMA_API_URL"] ?? "http://host.docker.internal:11434")
    .WithExternalHttpEndpoints();

// Add the React frontend application
var frontend = builder.AddNpmApp("frontend", "../", "dev:aspire")
    .WithHttpEndpoint(port: 5173, env: "PORT")
    .WithEnvironment("VITE_API_URL", backend.GetEndpoint("http"))
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
```

### Customizing Ports

To change the default ports, edit `Skelton.AppHost/Properties/launchSettings.json`:

```json
{
  "profiles": {
    "https": {
      "applicationUrl": "https://localhost:17219;http://localhost:15219",
      ...
    }
  }
}
```

## Development Workflow

### 1. Standard Aspire Development

```bash
# Terminal 1: Start Aspire
cd Skelton.AppHost
dotnet run

# Aspire will automatically start the React app
# Access the dashboard at https://localhost:17219
```

### 2. Watch Mode (Auto-restart on Changes)

```bash
cd Skelton.AppHost
dotnet watch run
```

### 3. Without Aspire (Direct React Development)

If you prefer running React directly without Aspire:

```bash
npm run dev
```

## Building for Production

### Build the React Application

```bash
npm run build
```

### Aspire Deployment

Aspire can generate deployment manifests for various cloud platforms:

```bash
cd Skelton.AppHost
dotnet run --publisher manifest --output-path ../aspire-manifest.json
```

This generates a manifest that can be used for deployment to:
- Azure Container Apps
- Kubernetes
- Docker Compose
- And other orchestration platforms

## Troubleshooting

### Issue: Aspire Dashboard Not Opening

**Solution**: Check if the ports are already in use:

```bash
# Check if port 15219 is in use
netstat -ano | findstr :15219  # Windows
lsof -i :15219                 # macOS/Linux

# Kill the process if needed or change the port in launchSettings.json
```

### Issue: React App Not Starting

**Solution**: Ensure npm dependencies are installed:

```bash
npm install
```

### Issue: .NET SDK Not Found

**Solution**: Install .NET 9.0 SDK:

```bash
# Download from https://dotnet.microsoft.com/download/dotnet/9.0
# Or use winget on Windows:
winget install Microsoft.DotNet.SDK.9

# Verify installation:
dotnet --version
```

### Issue: Node.js Version Too Old

**Error**: `TypeError: crypto.hash is not a function` or `Vite requires Node.js version 20.19+ or 22.12+`

**Solution**: Upgrade Node.js to version 20.19+ or 22.12+:

```bash
# Check current version
node --version

# Download latest LTS from https://nodejs.org/
# Recommended: Node.js 20.19+ (LTS) or 22.12+

# Windows - using winget
winget install OpenJS.NodeJS.LTS

# macOS - using Homebrew
brew install node@20

# Linux - using nvm
nvm install 20
nvm use 20
```

### Issue: Port 5173 Already in Use

**Solution**: Change the Vite port in `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 5174  // Change to available port
  }
})
```

Then update `Skelton.AppHost/Program.cs` accordingly.

### Issue: Claude API Not Working (Online Mode)

**Error**: `ANTHROPIC_API_KEY not configured` or API calls failing

**Solution**: Set the ANTHROPIC_API_KEY environment variable:

```bash
# Using user secrets (recommended)
cd Skelton.AppHost
dotnet user-secrets set "ANTHROPIC_API_KEY" "sk-ant-your-api-key-here"

# Or set environment variable before running
export ANTHROPIC_API_KEY="sk-ant-your-api-key-here"  # Linux/macOS
$env:ANTHROPIC_API_KEY="sk-ant-your-api-key-here"    # Windows PowerShell

# Then run Aspire
dotnet run
```

### Issue: OLLAMA Not Connecting (Offline Mode)

**Error**: `OLLAMA is not running` or connection timeout

**Solutions**:

1. **OLLAMA not installed or not running**:
   ```bash
   # Install OLLAMA from https://ollama.ai/

   # Start OLLAMA service
   ollama serve

   # Pull the required model
   ollama pull llama3.3:latest
   ```

2. **Docker networking issue** (when backend runs in Docker):

   The backend uses `host.docker.internal` to reach the host machine from Docker. If this doesn't work:

   ```bash
   # Option 1: Set custom OLLAMA URL
   cd Skelton.AppHost
   dotnet user-secrets set "OLLAMA_API_URL" "http://host.docker.internal:11434"

   # Option 2: Use host's IP address
   dotnet user-secrets set "OLLAMA_API_URL" "http://192.168.1.100:11434"
   ```

3. **OLLAMA running on different port**:
   ```bash
   cd Skelton.AppHost
   dotnet user-secrets set "OLLAMA_API_URL" "http://localhost:YOUR_PORT"
   ```

## Additional Resources

- [.NET Aspire Documentation](https://learn.microsoft.com/dotnet/aspire/)
- [Aspire GitHub Repository](https://github.com/dotnet/aspire)
- [Aspire Samples](https://github.com/dotnet/aspire-samples)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## Benefits of Using Aspire

1. **Unified Dashboard**: Monitor all services in one place
2. **Simplified Configuration**: Automatic service discovery and configuration
3. **Better Observability**: Built-in logging, tracing, and metrics
4. **Local Development**: Closely mimics production environment
5. **Cloud Deployment**: Easy deployment to cloud platforms
6. **Service Orchestration**: Manage multiple services together
7. **Environment Variables**: Centralized configuration management

## Next Steps

After running with Aspire, you can:

1. Add a backend API service to the Aspire configuration
2. Add a database service (PostgreSQL, MongoDB, etc.)
3. Add a messaging queue (RabbitMQ, Kafka, etc.)
4. Configure service-to-service communication
5. Deploy to Azure Container Apps or Kubernetes

Example of adding more services:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

// Add PostgreSQL database
var postgres = builder.AddPostgres("postgres")
    .WithPgAdmin();

var db = postgres.AddDatabase("projectdb");

// Add backend API
var backend = builder.AddProject<Projects.Skelton_Api>("backend")
    .WithReference(db);

// Add React frontend
var frontend = builder.AddNpmApp("frontend", "../", "dev")
    .WithHttpEndpoint(port: 5173, env: "PORT")
    .WithReference(backend)
    .WithExternalHttpEndpoints();

builder.Build().Run();
```
