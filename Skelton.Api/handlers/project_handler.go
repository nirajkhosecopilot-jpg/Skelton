package handlers

import (
	"encoding/json"
	"net/http"
	"skelton-api/models"
)

// ProjectHandler handles project description requests
type ProjectHandler struct{}

// NewProjectHandler creates a new ProjectHandler
func NewProjectHandler() *ProjectHandler {
	return &ProjectHandler{}
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
	missingInfo := projectDesc.Validate()

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
