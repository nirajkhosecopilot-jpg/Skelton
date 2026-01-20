package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"skelton-api/models"
	"skelton-api/services"
)

// EnhancedProjectHandler handles enhanced project processing with AI
type EnhancedProjectHandler struct {
	aiService       *services.AIService
	documentService *services.DocumentService
	imageService    *services.ImageService
	cache           map[string]*CachedContent
	cacheMutex      sync.RWMutex
}

// CachedContent stores generated content with expiration
type CachedContent struct {
	Content   *models.AIGeneratedContent
	ProjectData models.CompleteProjectData
	Timestamp time.Time
	ExpiresAt time.Time
}

// NewEnhancedProjectHandler creates a new enhanced project handler
func NewEnhancedProjectHandler() *EnhancedProjectHandler {
	handler := &EnhancedProjectHandler{
		aiService:       services.NewAIService(),
		documentService: services.NewDocumentService(),
		imageService:    services.NewImageService(),
		cache:           make(map[string]*CachedContent),
	}

	// Start cache cleanup goroutine
	go handler.cleanupCache()

	return handler
}

// HandleGenerateSpecification handles the generation of project specification
func (h *EnhancedProjectHandler) HandleGenerateSpecification(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow POST
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body
	var projectData models.CompleteProjectData
	if err := json.NewDecoder(r.Body).Decode(&projectData); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("Received project specification request for: %s", projectData.ProjectDescription)

	// Generate cache key
	cacheKey := h.generateCacheKey(projectData)

	// Check cache first
	h.cacheMutex.RLock()
	cached, found := h.cache[cacheKey]
	h.cacheMutex.RUnlock()

	if found && time.Now().Before(cached.ExpiresAt) {
		log.Printf("Returning cached content for key: %s", cacheKey)
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("X-Cache-Hit", "true")
		json.NewEncoder(w).Encode(cached.Content)
		return
	}

	// Generate new content using AI
	log.Println("Generating new content using AI...")
	aiContent, err := h.aiService.GenerateProjectSpecification(projectData)
	if err != nil {
		log.Printf("Error generating specification: %v", err)
		http.Error(w, "Failed to generate specification: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Cache the result
	h.cacheMutex.Lock()
	h.cache[cacheKey] = &CachedContent{
		Content:     aiContent,
		ProjectData: projectData,
		Timestamp:   time.Now(),
		ExpiresAt:   time.Now().Add(1 * time.Hour), // Cache for 1 hour
	}
	h.cacheMutex.Unlock()

	log.Println("Successfully generated specification")

	// Return response
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Cache-Hit", "false")
	json.NewEncoder(w).Encode(aiContent)
}

// HandleDownloadDocument handles document download requests
func (h *EnhancedProjectHandler) HandleDownloadDocument(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow POST
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body
	var request struct {
		Format      string                     `json:"format"` // "pdf", "docx", "jpg"
		ProjectData models.CompleteProjectData `json:"projectData"`
		Content     *models.AIGeneratedContent `json:"content,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("Download request for format: %s", request.Format)

	// If content not provided, try to get from cache
	var content *models.AIGeneratedContent
	if request.Content != nil {
		content = request.Content
	} else {
		cacheKey := h.generateCacheKey(request.ProjectData)
		h.cacheMutex.RLock()
		cached, found := h.cache[cacheKey]
		h.cacheMutex.RUnlock()

		if !found || time.Now().After(cached.ExpiresAt) {
			http.Error(w, "Content not found. Please generate specification first.", http.StatusNotFound)
			return
		}
		content = cached.Content
	}

	// Generate document based on format
	var documentBytes []byte
	var err error
	var contentType string
	var filename string

	switch request.Format {
	case "pdf":
		documentBytes, err = h.documentService.GeneratePDF(content, request.ProjectData)
		contentType = "application/pdf"
		filename = "technical-specification.pdf"
	case "docx":
		documentBytes, err = h.documentService.GenerateDOCX(content, request.ProjectData)
		contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		filename = "technical-specification.docx"
	case "jpg":
		documentBytes, err = h.imageService.GenerateCombinedImage(content)
		contentType = "image/jpeg"
		filename = "project-architecture.jpg"
	default:
		http.Error(w, "Invalid format. Must be pdf, docx, or jpg", http.StatusBadRequest)
		return
	}

	if err != nil {
		log.Printf("Error generating document: %v", err)
		http.Error(w, "Failed to generate document: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Set headers for download
	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	w.Header().Set("Content-Length", fmt.Sprintf("%d", len(documentBytes)))

	// Write document bytes
	w.Write(documentBytes)
	log.Printf("Successfully generated and sent %s document (%d bytes)", request.Format, len(documentBytes))
}

// HandleGetCachedContent retrieves cached content
func (h *EnhancedProjectHandler) HandleGetCachedContent(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow POST
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body
	var projectData models.CompleteProjectData
	if err := json.NewDecoder(r.Body).Decode(&projectData); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Generate cache key
	cacheKey := h.generateCacheKey(projectData)

	// Check cache
	h.cacheMutex.RLock()
	cached, found := h.cache[cacheKey]
	h.cacheMutex.RUnlock()

	if !found || time.Now().After(cached.ExpiresAt) {
		http.Error(w, "Content not found in cache", http.StatusNotFound)
		return
	}

	// Return cached content
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cached.Content)
}

// generateCacheKey generates a cache key from project data
func (h *EnhancedProjectHandler) generateCacheKey(projectData models.CompleteProjectData) string {
	// Simple cache key based on project description and tech stack
	return fmt.Sprintf("%s-%s-%s-%s-%s",
		projectData.ProjectDescription,
		projectData.BackendFramework,
		projectData.FrontendFramework,
		projectData.DatabasePreference,
		projectData.ArchitecturePattern,
	)
}

// cleanupCache periodically removes expired cache entries
func (h *EnhancedProjectHandler) cleanupCache() {
	ticker := time.NewTicker(15 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		h.cacheMutex.Lock()
		now := time.Now()
		for key, cached := range h.cache {
			if now.After(cached.ExpiresAt) {
				delete(h.cache, key)
				log.Printf("Removed expired cache entry: %s", key)
			}
		}
		h.cacheMutex.Unlock()
	}
}
