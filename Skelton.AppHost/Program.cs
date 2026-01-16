var builder = DistributedApplication.CreateBuilder(args);

// Add the React frontend application
var frontend = builder.AddNpmApp("frontend", "../", "dev")
    .WithHttpEndpoint(port: 5173, env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
