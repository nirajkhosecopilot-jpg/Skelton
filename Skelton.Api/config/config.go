package config

import (
	"os"
)

// LLMConfig holds the configuration for LLM providers
type LLMConfig struct {
	Provider string // "openai", "anthropic", or "local"
	APIKey   string
	Model    string
	Endpoint string // For custom endpoints
}

// GetLLMConfig returns the LLM configuration from environment variables
func GetLLMConfig() LLMConfig {
	provider := os.Getenv("LLM_PROVIDER")
	if provider == "" {
		provider = "openai" // Default to OpenAI
	}

	apiKey := os.Getenv("LLM_API_KEY")

	// Set default models based on provider
	model := os.Getenv("LLM_MODEL")
	if model == "" {
		switch provider {
		case "openai":
			model = "gpt-4o-mini"
		case "anthropic":
			model = "claude-3-5-haiku-20241022"
		default:
			model = "gpt-4o-mini"
		}
	}

	endpoint := os.Getenv("LLM_ENDPOINT")

	return LLMConfig{
		Provider: provider,
		APIKey:   apiKey,
		Model:    model,
		Endpoint: endpoint,
	}
}

// GetAvailableModels returns a list of available models for each provider
func GetAvailableModels() map[string][]string {
	return map[string][]string{
		"openai": {
			"gpt-4o",
			"gpt-4o-mini",
			"gpt-4-turbo",
			"gpt-3.5-turbo",
		},
		"anthropic": {
			"claude-3-5-sonnet-20241022",
			"claude-3-5-haiku-20241022",
			"claude-3-opus-20240229",
			"claude-3-sonnet-20240229",
			"claude-3-haiku-20240307",
		},
	}
}
