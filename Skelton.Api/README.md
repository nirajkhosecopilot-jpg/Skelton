# Skelton API - Go Backend

A Go backend API service for the Skelton project that validates project descriptions and provides intelligent recommendations.

## Features

- **Project Description Validation**: Receives and validates project descriptions from the React UI
- **Missing Information Detection**: Identifies required and optional missing fields
- **Intelligent Recommendations**: Provides technology and architecture recommendations
- **Security Considerations**: Suggests security best practices based on project type
- **Effort Estimation**: Estimates project timeline based on requirements
- **ASPIRE Integration**: Integrated with .NET Aspire for orchestration and observability

## API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the API service.

### Project Validation
```
POST /api/project/validate
```
Validates a project description and returns missing information and recommendations.

**Request Body:**
```json
{
  "name": "My Project",
  "description": "A web application for...",
  "type": "web",
  "technologyStack": ["React", "Go"],
  "databaseType": "PostgreSQL",
  "authRequired": true,
  "deploymentPlatform": "AWS",
  "features": ["User authentication", "Data dashboard"],
  "teamSize": 5,
  "timeline": "3-6 months"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Project description validated successfully",
  "missingFields": [],
  "recommendations": ["..."],
  "estimatedEffort": "3-6 months",
  "suggestedTools": ["..."],
  "securityConsiderations": ["..."],
  "timestamp": "2026-01-19T..."
}
```

## Running Locally

### Prerequisites
- Go 1.22 or higher
- Docker (optional)

### Using Go
```bash
cd Skelton.Api
go mod download
go run main.go
```

The API will be available at `http://localhost:8080`

### Using Docker
```bash
cd Skelton.Api
docker build -t skelton-api .
docker run -p 8080:8080 skelton-api
```

### Using ASPIRE
```bash
cd ..
dotnet run --project Skelton.AppHost
```

Access the Aspire dashboard at `https://localhost:17219`

## Development

### Project Structure
```
Skelton.Api/
├── main.go              # Entry point and server setup
├── handlers/            # HTTP request handlers
│   └── project_handler.go
├── models/              # Data models and validation logic
│   └── project.go
├── middleware/          # HTTP middleware
│   └── cors.go
├── go.mod               # Go module definition
├── Dockerfile           # Container build instructions
└── README.md            # This file
```

### Adding New Endpoints
1. Add handler function in `handlers/` directory
2. Register route in `main.go`
3. Update this README with endpoint documentation

## Testing

```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...

# Test the health endpoint
curl http://localhost:8080/health

# Test the validation endpoint
curl -X POST http://localhost:8080/api/project/validate \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Test project","type":"web","technologyStack":["React"]}'
```

## Environment Variables

- `PORT`: Server port (default: 8080)

## Integration with React UI

The React frontend communicates with this API through the `/api/project/validate` endpoint. Configure the API URL in the frontend:

```javascript
const API_URL = process.env.VITE_API_URL || 'http://localhost:8080';
```

## CORS Configuration

CORS is configured to allow requests from the React frontend. The middleware automatically handles preflight requests and sets appropriate headers.

## License

Part of the Skelton project.
