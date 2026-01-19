# Skelton API - Go Backend

A Go backend API service for the Skelton project that validates project descriptions and provides intelligent recommendations.

## Features

- **AI-Powered Project Assessment**: Uses LLM (OpenAI or Anthropic) to intelligently evaluate project descriptions
- **Configurable LLM Providers**: Support for multiple LLM providers (OpenAI, Anthropic) with easy model selection
- **Smart Missing Information Detection**: AI identifies required and optional missing fields from implementation perspective
- **Dynamic Placeholder Generation**: Generates contextual placeholders for users to fill in missing information
- **Intelligent Recommendations**: Provides technology and architecture recommendations based on project context
- **Security Considerations**: Suggests security best practices based on project type
- **Effort Estimation**: Estimates project timeline based on requirements
- **Fallback Static Validation**: Automatically falls back to static validation if LLM is unavailable
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

## How It Works

### LLM-Powered Assessment

The API uses Large Language Models to intelligently assess project descriptions:

1. **Project Analysis**: The LLM analyzes the project description from an implementation perspective
2. **Gap Identification**: Identifies missing critical information needed for development
3. **Contextual Placeholders**: Generates specific placeholders for each missing piece of information
4. **Recommendations**: Provides tailored recommendations based on project type and requirements
5. **Smart Validation**: Assesses completeness and suggests improvements

### Assessment Flow

```
User Input → Go API → LLM Service → Provider (OpenAI/Anthropic)
                ↓
         LLM Response
                ↓
    Parse & Structure → Frontend Display
                ↓
    Pre-filled Placeholders (Optional User Input)
```

### Static Fallback

If the LLM service is unavailable (no API key or network issues), the system automatically falls back to static validation logic that checks for common missing fields.

## Development

### Project Structure
```
Skelton.Api/
├── main.go              # Entry point and server setup
├── handlers/            # HTTP request handlers
│   └── project_handler.go
├── models/              # Data models and validation logic
│   └── project.go
├── services/            # External service integrations
│   └── llm_service.go  # LLM provider integration (OpenAI, Anthropic)
├── config/              # Configuration management
│   └── config.go       # LLM configuration and model selection
├── middleware/          # HTTP middleware
│   └── cors.go
├── go.mod               # Go module definition
├── .env.example         # Environment variable template
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

### Server Configuration
- `PORT`: Server port (default: 8080)

### LLM Configuration
Configure these environment variables to enable AI-powered project assessment:

- `LLM_PROVIDER`: LLM provider to use (`openai` or `anthropic`, default: `openai`)
- `LLM_API_KEY`: API key for your chosen LLM provider (required for LLM features)
- `LLM_MODEL`: Specific model to use (optional, uses provider defaults if not set)
  - OpenAI models: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-3.5-turbo`
  - Anthropic models: `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`, `claude-3-opus-20240229`
- `LLM_ENDPOINT`: Custom endpoint URL (optional, for custom deployments)

### Getting API Keys
- **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Anthropic**: Get your API key from [Anthropic Console](https://console.anthropic.com/settings/keys)

### Example Configuration
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
# Edit .env with your API key
```

The Go service will automatically load the `.env` file on startup using the `godotenv` package.

**Note**: If `LLM_API_KEY` is not set, the API will automatically fall back to static validation logic.

## Integration with React UI

The React frontend communicates with this API through the `/api/project/validate` endpoint. Configure the API URL in the frontend:

```javascript
const API_URL = process.env.VITE_API_URL || 'http://localhost:8080';
```

## CORS Configuration

CORS is configured to allow requests from the React frontend. The middleware automatically handles preflight requests and sets appropriate headers.

## License

Part of the Skelton project.
