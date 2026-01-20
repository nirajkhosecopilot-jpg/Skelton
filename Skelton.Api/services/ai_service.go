package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"skelton-api/models"
)

const (
	claudeAPIURL = "https://api.anthropic.com/v1/messages"
	claudeModel  = "claude-3-5-sonnet-20241022"
	maxTokens    = 16000
)

// AIService handles interactions with Claude AI
type AIService struct {
	apiKey     string
	httpClient *http.Client
}

// NewAIService creates a new AI service instance
func NewAIService() *AIService {
	apiKey := os.Getenv("ANTHROPIC_API_KEY")
	if apiKey == "" {
		fmt.Println("Warning: ANTHROPIC_API_KEY not set")
	}

	return &AIService{
		apiKey: apiKey,
		httpClient: &http.Client{
			Timeout: 120 * time.Second,
		},
	}
}

// ClaudeRequest represents the request to Claude API
type ClaudeRequest struct {
	Model     string          `json:"model"`
	MaxTokens int             `json:"max_tokens"`
	Messages  []ClaudeMessage `json:"messages"`
}

// ClaudeMessage represents a message in the Claude API
type ClaudeMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// ClaudeResponse represents the response from Claude API
type ClaudeResponse struct {
	ID      string `json:"id"`
	Type    string `json:"type"`
	Role    string `json:"role"`
	Content []struct {
		Type string `json:"type"`
		Text string `json:"text"`
	} `json:"content"`
	Model        string `json:"model"`
	StopReason   string `json:"stop_reason"`
	StopSequence string `json:"stop_sequence"`
	Usage        struct {
		InputTokens  int `json:"input_tokens"`
		OutputTokens int `json:"output_tokens"`
	} `json:"usage"`
}

// GenerateProjectSpecification generates folder structure and technical specification using Claude AI
func (s *AIService) GenerateProjectSpecification(projectData models.CompleteProjectData) (*models.AIGeneratedContent, error) {
	if s.apiKey == "" {
		return nil, fmt.Errorf("ANTHROPIC_API_KEY not configured")
	}

	// Generate the prompt
	prompt := s.buildPrompt(projectData)

	// Create Claude API request
	claudeReq := ClaudeRequest{
		Model:     claudeModel,
		MaxTokens: maxTokens,
		Messages: []ClaudeMessage{
			{
				Role:    "user",
				Content: prompt,
			},
		},
	}

	// Marshal request
	reqBody, err := json.Marshal(claudeReq)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", claudeAPIURL, bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", s.apiKey)
	req.Header.Set("anthropic-version", "2023-06-01")

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

	// Parse Claude response
	var claudeResp ClaudeResponse
	if err := json.Unmarshal(body, &claudeResp); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	// Extract AI response text
	if len(claudeResp.Content) == 0 {
		return nil, fmt.Errorf("empty response from Claude")
	}

	aiResponseText := claudeResp.Content[0].Text

	// Parse AI response into structured data
	aiContent, err := s.parseAIResponse(aiResponseText)
	if err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %w", err)
	}

	aiContent.Timestamp = time.Now()
	aiContent.Status = "success"
	aiContent.Message = "AI-generated project specification completed successfully"

	return aiContent, nil
}

// buildPrompt constructs the prompt for Claude AI
func (s *AIService) buildPrompt(projectData models.CompleteProjectData) string {
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
      "messaging": {
        "name": "%s",
        "version": "recommended version",
        "purpose": "Purpose description",
        "justification": "Why this technology",
        "alternatives": ["alt1", "alt2"]
      },
      "devOps": {
        "name": "%s",
        "version": "recommended version",
        "purpose": "Purpose description",
        "justification": "Why this technology",
        "alternatives": ["alt1", "alt2"]
      },
      "additional": []
    },
    "dataManagement": {
      "databaseType": "%s",
      "schemaDesign": "Schema design approach",
      "migrations": "Migration strategy",
      "backup": "Backup strategy",
      "dataRetention": "Data retention policy",
      "entities": [
        {
          "name": "entity-name",
          "description": "Entity description",
          "fields": ["field1", "field2"],
          "relationships": ["relationship1"]
        }
      ]
    },
    "securityStrategy": {
      "authentication": "Authentication approach",
      "authorization": "Authorization approach",
      "dataEncryption": "Encryption strategy",
      "apiProtection": "API security measures",
      "vulnerabilities": ["vuln1", "vuln2"],
      "compliance": ["compliance1", "compliance2"]
    },
    "deploymentPlan": {
      "strategy": "%s",
      "infrastructure": "%s",
      "environments": [
        {
          "name": "development",
          "purpose": "Local development",
          "url": "",
          "configuration": "Config details"
        }
      ],
      "ciCd": "CI/CD approach",
      "rollback": "Rollback strategy"
    },
    "developmentGuidelines": {
      "codingStandards": ["standard1", "standard2"],
      "versionControl": "Git workflow",
      "branchingStrategy": "Branching model",
      "codeReview": "Code review process",
      "documentation": "Documentation approach"
    },
    "testingStrategy": {
      "unitTesting": "Unit testing approach",
      "integrationTesting": "Integration testing approach",
      "e2eTesting": "E2E testing approach",
      "loadTesting": "Load testing approach",
      "securityTesting": "Security testing approach",
      "testCoverage": "Target coverage"
    },
    "monitoringAndLogging": {
      "loggingFramework": "Logging framework",
      "monitoringTools": ["tool1", "tool2"],
      "metrics": ["metric1", "metric2"],
      "alerting": "Alerting strategy",
      "performanceKPIs": ["kpi1", "kpi2"]
    }
  }
}

Important: Ensure the response is valid JSON without any markdown formatting or code blocks.`,
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
		projectData.Infrastructure,
		projectData.DatabasePreference,
		projectData.DeploymentStrategy,
		projectData.Infrastructure,
	)

	return prompt
}

// parseAIResponse parses the AI response text into structured data
func (s *AIService) parseAIResponse(responseText string) (*models.AIGeneratedContent, error) {
	// Try to parse as JSON
	var aiContent models.AIGeneratedContent

	// Remove any markdown code blocks if present
	responseText = cleanJSONResponse(responseText)

	err := json.Unmarshal([]byte(responseText), &aiContent)
	if err != nil {
		return nil, fmt.Errorf("failed to parse AI response as JSON: %w", err)
	}

	return &aiContent, nil
}

// cleanJSONResponse removes markdown code blocks and extra formatting
func cleanJSONResponse(text string) string {
	// Remove ```json and ``` markers if present
	if len(text) > 7 && text[:7] == "```json" {
		text = text[7:]
		if idx := bytes.Index([]byte(text), []byte("```")); idx != -1 {
			text = text[:idx]
		}
	} else if len(text) > 3 && text[:3] == "```" {
		text = text[3:]
		if idx := bytes.Index([]byte(text), []byte("```")); idx != -1 {
			text = text[:idx]
		}
	}

	return string(bytes.TrimSpace([]byte(text)))
}
