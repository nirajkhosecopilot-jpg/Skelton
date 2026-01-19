package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"skelton-api/config"
	"skelton-api/models"
	"strings"
)

// LLMService handles communication with LLM providers
type LLMService struct {
	config config.LLMConfig
}

// NewLLMService creates a new LLM service
func NewLLMService(cfg config.LLMConfig) *LLMService {
	return &LLMService{
		config: cfg,
	}
}

// AssessProjectDescription sends the project description to LLM for assessment
func (s *LLMService) AssessProjectDescription(project *models.ProjectDescription) (*models.LLMAssessmentResponse, error) {
	prompt := s.buildPrompt(project)

	switch s.config.Provider {
	case "openai":
		return s.callOpenAI(prompt)
	case "anthropic":
		return s.callAnthropic(prompt)
	default:
		return s.callOpenAI(prompt)
	}
}

// buildPrompt creates the prompt for LLM assessment
func (s *LLMService) buildPrompt(project *models.ProjectDescription) string {
	// Build a structured project description
	projectInfo := fmt.Sprintf(`Project Name: %s
Description: %s
Type: %s
Technology Stack: %s
Database Type: %s
Authentication Required: %v
Deployment Platform: %s
Features: %s
Team Size: %d
Timeline: %s`,
		project.Name,
		project.Description,
		project.Type,
		strings.Join(project.TechnologyStack, ", "),
		project.DatabaseType,
		project.AuthRequired,
		project.DeploymentPlatform,
		strings.Join(project.Features, ", "),
		project.TeamSize,
		project.Timeline,
	)

	prompt := fmt.Sprintf(`You are an expert software architect evaluating a project description for completeness from an implementation perspective.

%s

Your task is to:
1. Analyze the project description for completeness
2. Identify any missing critical information needed for implementation
3. Provide recommendations for best practices
4. Suggest appropriate tools and technologies
5. Identify security considerations
6. Estimate development effort

Please respond in the following JSON format:
{
  "missingInformation": [
    {
      "field": "field_name",
      "reason": "why this information is needed",
      "suggestions": ["suggestion1", "suggestion2"],
      "required": true/false,
      "placeholder": "Placeholder text for user to fill in"
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "suggestedTools": ["tool1", "tool2"],
  "securityConsiderations": ["security1", "security2"],
  "estimatedEffort": "time estimate",
  "status": "incomplete/partial/success",
  "message": "overall assessment message"
}

Important:
- Focus on information gaps that would prevent or complicate implementation
- For each missing piece of information, provide a clear placeholder that the user can fill in
- The placeholder should be a question or prompt that guides the user on what to provide
- Examples of good placeholders:
  * "What authentication mechanism will you use? (e.g., JWT, OAuth2, Session-based)"
  * "Describe your API endpoints and their purposes"
  * "What are the main data models/entities in your system?"
  * "What are your performance requirements? (e.g., response time, concurrent users)"
- Mark fields as required=true only if they are absolutely critical for implementation
- Be comprehensive but practical in your assessment`, projectInfo)

	return prompt
}

// OpenAI API structures
type openAIRequest struct {
	Model    string              `json:"model"`
	Messages []openAIMessage     `json:"messages"`
	Temperature float64          `json:"temperature"`
	ResponseFormat *responseFormat `json:"response_format,omitempty"`
}

type openAIMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type responseFormat struct {
	Type string `json:"type"`
}

type openAIResponse struct {
	Choices []struct {
		Message openAIMessage `json:"message"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

func (s *LLMService) callOpenAI(prompt string) (*models.LLMAssessmentResponse, error) {
	url := "https://api.openai.com/v1/chat/completions"
	if s.config.Endpoint != "" {
		url = s.config.Endpoint
	}

	reqBody := openAIRequest{
		Model: s.config.Model,
		Messages: []openAIMessage{
			{
				Role:    "user",
				Content: prompt,
			},
		},
		Temperature: 0.7,
		ResponseFormat: &responseFormat{
			Type: "json_object",
		},
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.config.APIKey))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to call OpenAI API: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("OpenAI API error (status %d): %s", resp.StatusCode, string(body))
	}

	var openAIResp openAIResponse
	if err := json.Unmarshal(body, &openAIResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if openAIResp.Error != nil {
		return nil, fmt.Errorf("OpenAI API error: %s", openAIResp.Error.Message)
	}

	if len(openAIResp.Choices) == 0 {
		return nil, fmt.Errorf("no response from OpenAI")
	}

	// Parse the JSON response
	var assessment models.LLMAssessmentResponse
	if err := json.Unmarshal([]byte(openAIResp.Choices[0].Message.Content), &assessment); err != nil {
		return nil, fmt.Errorf("failed to parse assessment: %w", err)
	}

	return &assessment, nil
}

// Anthropic API structures
type anthropicRequest struct {
	Model     string   `json:"model"`
	Messages  []anthropicMessage `json:"messages"`
	MaxTokens int      `json:"max_tokens"`
	Temperature float64 `json:"temperature"`
}

type anthropicMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type anthropicResponse struct {
	Content []struct {
		Text string `json:"text"`
	} `json:"content"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

func (s *LLMService) callAnthropic(prompt string) (*models.LLMAssessmentResponse, error) {
	url := "https://api.anthropic.com/v1/messages"
	if s.config.Endpoint != "" {
		url = s.config.Endpoint
	}

	reqBody := anthropicRequest{
		Model: s.config.Model,
		Messages: []anthropicMessage{
			{
				Role:    "user",
				Content: prompt,
			},
		},
		MaxTokens:   4096,
		Temperature: 0.7,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", s.config.APIKey)
	req.Header.Set("anthropic-version", "2023-06-01")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to call Anthropic API: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Anthropic API error (status %d): %s", resp.StatusCode, string(body))
	}

	var anthropicResp anthropicResponse
	if err := json.Unmarshal(body, &anthropicResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if anthropicResp.Error != nil {
		return nil, fmt.Errorf("Anthropic API error: %s", anthropicResp.Error.Message)
	}

	if len(anthropicResp.Content) == 0 {
		return nil, fmt.Errorf("no response from Anthropic")
	}

	// Extract JSON from the response (Anthropic may wrap it in markdown)
	content := anthropicResp.Content[0].Text
	content = strings.TrimSpace(content)

	// Remove markdown code blocks if present
	if strings.HasPrefix(content, "```json") {
		content = strings.TrimPrefix(content, "```json")
		content = strings.TrimSuffix(content, "```")
		content = strings.TrimSpace(content)
	} else if strings.HasPrefix(content, "```") {
		content = strings.TrimPrefix(content, "```")
		content = strings.TrimSuffix(content, "```")
		content = strings.TrimSpace(content)
	}

	// Parse the JSON response
	var assessment models.LLMAssessmentResponse
	if err := json.Unmarshal([]byte(content), &assessment); err != nil {
		return nil, fmt.Errorf("failed to parse assessment: %w", err)
	}

	return &assessment, nil
}
