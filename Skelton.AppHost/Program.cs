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
