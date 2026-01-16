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
2. **Node.js 18 or later** - [Download here](https://nodejs.org/)
3. **Docker Desktop** (optional, for containerization) - [Download here](https://www.docker.com/products/docker-desktop/)

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

### 1. Install .NET Aspire Workload

```bash
dotnet workload update
dotnet workload install aspire
```

### 2. Install Node.js Dependencies

```bash
npm install
```

## Running the Application with Aspire

### Quick Start

From the root directory of the project:

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

### Aspire AppHost Configuration

The `Program.cs` in `Skelton.AppHost` configures the React application:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

// Add the React frontend application
var frontend = builder.AddNpmApp("frontend", "../", "dev")
    .WithHttpEndpoint(port: 5173, env: "PORT")
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

### Issue: Aspire Workload Not Installed

**Solution**: Install the Aspire workload:

```bash
dotnet workload install aspire
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
