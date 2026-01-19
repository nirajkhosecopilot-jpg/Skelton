var builder = DistributedApplication.CreateBuilder(args);

// Add the Go backend API
var backend = builder.AddDockerfile("backend", "../Skelton.Api")
    .WithHttpEndpoint(port: 8080, targetPort: 8080, env: "PORT")
    .WithExternalHttpEndpoints();

// Add the React frontend application
var frontend = builder.AddNpmApp("frontend", "../", "dev:aspire")
    .WithHttpEndpoint(port: 5173, env: "PORT")
    .WithEnvironment("VITE_API_URL", backend.GetEndpoint("http"))
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
