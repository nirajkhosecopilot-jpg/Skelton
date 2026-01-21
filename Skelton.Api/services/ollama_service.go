package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"

	"skelton-api/models"
)

const (
	defaultOllamaAPIURL = "http://localhost:11434"
	ollamaModel         = "llama3.3:latest"
)

// OllamaService handles interactions with local OLLAMA
type OllamaService struct {
	httpClient *http.Client
	baseURL    string
}

// NewOllamaService creates a new OLLAMA service instance
func NewOllamaService() *OllamaService {
	// Get OLLAMA base URL from environment or use default
	baseURL := os.Getenv("OLLAMA_API_URL")
	if baseURL == "" {
		baseURL = defaultOllamaAPIURL
	}

	// Remove trailing slash if present
	baseURL = strings.TrimSuffix(baseURL, "/")

	fmt.Printf("OLLAMA service configured with base URL: %s\n", baseURL)

	return &OllamaService{
		httpClient: &http.Client{
			Timeout: 300 * time.Second, // Longer timeout for local LLM
		},
		baseURL: baseURL,
	}
}

// OllamaRequest represents the request to OLLAMA API
type OllamaRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	Stream bool   `json:"stream"`
}

// OllamaResponse represents the response from OLLAMA API
type OllamaResponse struct {
	Model     string `json:"model"`
	CreatedAt string `json:"created_at"`
	Response  string `json:"response"`
	Done      bool   `json:"done"`
}

// IsOllamaRunning checks if OLLAMA is running
func (s *OllamaService) IsOllamaRunning() bool {
	url := fmt.Sprintf("%s/api/tags", s.baseURL)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return false
	}

	client := &http.Client{Timeout: 2 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	return resp.StatusCode == http.StatusOK
}

// StartOllama attempts to start OLLAMA service
func (s *OllamaService) StartOllama() error {
	fmt.Println("Checking if OLLAMA is running...")

	if s.IsOllamaRunning() {
		fmt.Println("OLLAMA is already running")
		return s.EnsureModelExists()
	}

	fmt.Println("OLLAMA is not running. Attempting to start...")

	// Try to run ollama serve in background
	cmd := exec.Command("ollama", "serve")
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start OLLAMA: %w", err)
	}

	// Wait for OLLAMA to start (max 30 seconds)
	for i := 0; i < 30; i++ {
		time.Sleep(1 * time.Second)
		if s.IsOllamaRunning() {
			fmt.Println("OLLAMA started successfully")
			return s.EnsureModelExists()
		}
	}

	return fmt.Errorf("OLLAMA did not start within timeout period")
}

// EnsureModelExists checks if the model exists and pulls it if not
func (s *OllamaService) EnsureModelExists() error {
	fmt.Printf("Checking if model %s exists...\n", ollamaModel)

	// Check if model exists
	url := fmt.Sprintf("%s/api/tags", s.baseURL)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to check models: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %w", err)
	}

	// Parse models list
	var modelsResp struct {
		Models []struct {
			Name string `json:"name"`
		} `json:"models"`
	}

	if err := json.Unmarshal(body, &modelsResp); err != nil {
		return fmt.Errorf("failed to parse models: %w", err)
	}

	// Check if our model exists
	modelExists := false
	for _, model := range modelsResp.Models {
		if strings.Contains(model.Name, "llama3.3") {
			modelExists = true
			fmt.Printf("Model %s found\n", ollamaModel)
			break
		}
	}

	if !modelExists {
		fmt.Printf("Model %s not found. Pulling model...\n", ollamaModel)
		// Pull the model
		cmd := exec.Command("ollama", "pull", ollamaModel)
		output, err := cmd.CombinedOutput()
		if err != nil {
			return fmt.Errorf("failed to pull model: %w, output: %s", err, string(output))
		}
		fmt.Printf("Model %s pulled successfully\n", ollamaModel)
	}

	return nil
}

// GenerateProjectSpecification generates folder structure and technical specification using OLLAMA
func (s *OllamaService) GenerateProjectSpecification(projectData models.CompleteProjectData) (*models.AIGeneratedContent, error) {
	if !s.IsOllamaRunning() {
		return nil, fmt.Errorf("OLLAMA is not running. Please start OLLAMA service")
	}

	// Generate the prompt (reuse the same prompt builder)
	prompt := s.buildPrompt(projectData)

	// Create OLLAMA API request
	ollamaReq := OllamaRequest{
		Model:  ollamaModel,
		Prompt: prompt,
		Stream: false,
	}

	// Marshal request
	reqBody, err := json.Marshal(ollamaReq)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	generateURL := fmt.Sprintf("%s/api/generate", s.baseURL)
	req, err := http.NewRequest("POST", generateURL, bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")

	// Execute request
	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	// Check status code
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned status %d: %s", resp.StatusCode, string(body))
	}

	// Parse OLLAMA response
	var ollamaResp OllamaResponse
	if err := json.Unmarshal(body, &ollamaResp); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	// Extract AI response text
	if ollamaResp.Response == "" {
		return nil, fmt.Errorf("empty response from OLLAMA")
	}

	// Parse AI response into structured data
	aiContent, err := s.parseAIResponse(ollamaResp.Response)
	if err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %w", err)
	}

	aiContent.Timestamp = time.Now()
	aiContent.Status = "success"
	aiContent.Message = "AI-generated project specification completed successfully (OLLAMA)"

	return aiContent, nil
}

// buildPrompt constructs the prompt for OLLAMA (same as Claude)
func (s *OllamaService) buildPrompt(projectData models.CompleteProjectData) string {
	// Add AI recommendations if no additional info provided
	additionalInfo := projectData.AdditionalInfo
	if additionalInfo == "" {
		additionalInfo = "No additional information provided. Please provide comprehensive recommendations based on best practices."
	}

	prompt := fmt.Sprintf(`You are a senior software architect and technical documentation expert. Based on the project information provided, generate a comprehensive project folder structure and detailed technical specification document.

Project Information:
-------------------
Project Description: %s

Technology Stack:
- Backend Framework: %s
- Frontend Framework: %s
- Database: %s
- Messaging Queue: %s

Architecture Details:
- Architecture Pattern: %s
- Deployment Strategy: %s
- Infrastructure: %s
- Scaling Approach: %s
- Architectural Notes: %s

Additional Information:
%s

Tasks:
------
1. Design a comprehensive folder structure for this project that follows best practices
2. Create a complete technical specification document including:
   - Project overview and goals
   - System architecture with detailed component descriptions
   - Technology stack justification
   - Data management strategy
   - Security strategy
   - Deployment plan
   - Development guidelines
   - Testing strategy
   - Monitoring and logging approach

Output Format:
-------------
Please provide your response in JSON format with the following structure:

{
  "folderStructure": {
    "rootFolder": "project-name",
    "tree": [
      {
        "name": "folder-name",
        "type": "folder",
        "description": "Description of this folder",
        "path": "/folder-name",
        "children": [...]
      }
    ],
    "metadata": {
      "totalFolders": 0,
      "totalFiles": 0,
      "structure": "monorepo"
    }
  },
  "technicalSpecification": {
    "projectOverview": {
      "title": "Project Title",
      "description": "Detailed description",
      "goals": ["goal1", "goal2"],
      "scope": ["scope1", "scope2"],
      "stakeholders": ["stakeholder1", "stakeholder2"]
    },
    "systemArchitecture": {
      "pattern": "%s",
      "description": "Architecture description",
      "components": [
        {
          "name": "component-name",
          "type": "service|api|frontend|database|queue",
          "description": "Component description",
          "dependencies": ["dep1", "dep2"]
        }
      ],
      "dataFlow": "Description of data flow",
      "integrations": ["integration1", "integration2"]
    },
    "technologyStack": {
      "backend": {
        "name": "%s",
        "version": "recommended version",
        "purpose": "Purpose description",
        "justification": "Why this technology",
        "alternatives": ["alt1", "alt2"]
      },
      "frontend": {
        "name": "%s",
        "version": "recommended version",
        "purpose": "Purpose description",
        "justification": "Why this technology",
        "alternatives": ["alt1", "alt2"]
      },
      "database": {
        "name": "%s",
        "version": "recommended version",
        "purpose": "Purpose description",
        "justification": "Why this technology",
        "alternatives": ["alt1", "alt2"]
      },
      "messagingQueue": {
        "name": "%s",
        "version": "recommended version",
        "purpose": "Purpose description",
        "justification": "Why this technology",
        "alternatives": ["alt1", "alt2"]
      },
      "additionalTools": [
        {
          "name": "tool-name",
          "purpose": "tool purpose",
          "category": "devops|testing|monitoring"
        }
      ]
    },
    "dataManagement": {
      "strategy": "Data management approach",
      "models": [
        {
          "name": "model-name",
          "description": "Model description",
          "relationships": ["rel1", "rel2"]
        }
      ],
      "migrations": "Migration strategy",
      "backup": "Backup strategy"
    },
    "security": {
      "authentication": "Auth approach",
      "authorization": "Authorization approach",
      "dataProtection": "Data protection measures",
      "vulnerabilities": ["Common vulnerability mitigations"]
    },
    "deployment": {
      "strategy": "%s",
      "infrastructure": "%s",
      "cicd": "CI/CD pipeline description",
      "environments": ["dev", "staging", "production"],
      "rollback": "Rollback strategy"
    },
    "development": {
      "guidelines": ["guideline1", "guideline2"],
      "conventions": {
        "naming": "Naming conventions",
        "codeStyle": "Code style guide",
        "gitWorkflow": "Git workflow description"
      },
      "tools": ["tool1", "tool2"]
    },
    "testing": {
      "strategy": "Testing approach",
      "types": ["unit", "integration", "e2e"],
      "coverage": "Coverage requirements",
      "automation": "Test automation approach"
    },
    "monitoring": {
      "logging": {
        "approach": "Logging strategy",
        "tools": ["log-tool1", "log-tool2"],
        "levels": ["DEBUG", "INFO", "WARNING", "ERROR"]
      },
      "metrics": {
        "approach": "Metrics collection approach",
        "tools": ["metric-tool1", "metric-tool2"],
        "kpis": ["kpi1", "kpi2"]
      },
      "alerting": {
        "approach": "Alerting strategy",
        "channels": ["channel1", "channel2"],
        "thresholds": "Threshold definitions"
      }
    }
  }
}

IMPORTANT: Return ONLY the JSON object, with no additional text, markdown formatting, or code blocks. The response must start with { and end with }.`,
		projectData.ProjectDescription,
		projectData.BackendFramework,
		projectData.FrontendFramework,
		projectData.DatabasePreference,
		projectData.MessagingQueue,
		projectData.ArchitecturePattern,
		projectData.DeploymentStrategy,
		projectData.Infrastructure,
		projectData.ScalingApproach,
		projectData.ArchitecturalNotes,
		additionalInfo,
		projectData.ArchitecturePattern,
		projectData.BackendFramework,
		projectData.FrontendFramework,
		projectData.DatabasePreference,
		projectData.MessagingQueue,
		projectData.DeploymentStrategy,
		projectData.Infrastructure,
	)

	return prompt
}

// parseAIResponse parses the AI response text into structured data
func (s *OllamaService) parseAIResponse(responseText string) (*models.AIGeneratedContent, error) {
	// Clean the response text (remove markdown code blocks if present)
	cleanedText := strings.TrimSpace(responseText)

	// Remove markdown code block markers
	if strings.HasPrefix(cleanedText, "```json") {
		cleanedText = strings.TrimPrefix(cleanedText, "```json")
		cleanedText = strings.TrimSuffix(cleanedText, "```")
		cleanedText = strings.TrimSpace(cleanedText)
	} else if strings.HasPrefix(cleanedText, "```") {
		cleanedText = strings.TrimPrefix(cleanedText, "```")
		cleanedText = strings.TrimSuffix(cleanedText, "```")
		cleanedText = strings.TrimSpace(cleanedText)
	}

	// Parse JSON
	var aiContent models.AIGeneratedContent
	if err := json.Unmarshal([]byte(cleanedText), &aiContent); err != nil {
		return nil, fmt.Errorf("failed to unmarshal AI response: %w\nResponse text: %s", err, cleanedText)
	}

	return &aiContent, nil
}
