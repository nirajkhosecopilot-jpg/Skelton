package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"skelton-api/models"
)

// ProjectHandler handles project description requests
type ProjectHandler struct {
	llmService models.LLMServiceInterface
}

// NewProjectHandler creates a new ProjectHandler
func NewProjectHandler(llmService models.LLMServiceInterface) *ProjectHandler {
	return &ProjectHandler{
		llmService: llmService,
	}
}

// HandleProjectDescription handles POST requests for project description validation
func (h *ProjectHandler) HandleProjectDescription(w http.ResponseWriter, r *http.Request) {
	// Set response headers
	w.Header().Set("Content-Type", "application/json")

	// Only accept POST requests
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Method not allowed. Use POST",
		})
		return
	}

	// Parse the JSON request body
	var projectDesc models.ProjectDescription
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&projectDesc); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Invalid JSON format: " + err.Error(),
		})
		return
	}
	defer r.Body.Close()

	// Validate the project description and get missing information
	// Use LLM-based validation if available, fallback to static validation
	var missingInfo models.MissingInformation
	if h.llmService != nil {
		log.Println("Using LLM-based validation")
		missingInfo = projectDesc.ValidateWithLLM(h.llmService)
	} else {
		log.Println("Using static validation (LLM service not available)")
		missingInfo = projectDesc.Validate()
	}

	// Return the response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(missingInfo)
}

// HandleHealth handles health check requests
func (h *ProjectHandler) HandleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
		"service": "skelton-api",
	})
}
