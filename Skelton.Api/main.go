package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"skelton-api/config"
	"skelton-api/handlers"
	"skelton-api/middleware"
	"skelton-api/services"

	"github.com/gorilla/mux"
)

func main() {
	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Create router
	router := mux.NewRouter()

	// Initialize LLM service
	llmConfig := config.GetLLMConfig()
	var llmService *services.LLMService

	if llmConfig.APIKey != "" {
		llmService = services.NewLLMService(llmConfig)
		log.Printf("LLM service initialized with provider: %s, model: %s", llmConfig.Provider, llmConfig.Model)
	} else {
		log.Println("Warning: LLM_API_KEY not set. Using static validation logic as fallback.")
		log.Println("To enable LLM-based validation, set the following environment variables:")
		log.Println("  - LLM_API_KEY: Your LLM provider API key")
		log.Println("  - LLM_PROVIDER: openai or anthropic (default: openai)")
		log.Println("  - LLM_MODEL: Model name (optional, uses provider default)")
	}

	// Initialize handlers
	projectHandler := handlers.NewProjectHandler(llmService)

	// Define routes
	router.HandleFunc("/health", projectHandler.HandleHealth).Methods("GET")
	router.HandleFunc("/api/project/validate", projectHandler.HandleProjectDescription).Methods("POST", "OPTIONS")

	// Apply middleware
	handler := middleware.LoggingMiddleware(middleware.CORSMiddleware(router))

	// Start server
	address := fmt.Sprintf(":%s", port)
	log.Printf("Starting Skelton API server on port %s", port)
	log.Printf("Health check available at http://localhost:%s/health", port)
	log.Printf("API endpoint available at http://localhost:%s/api/project/validate", port)

	if err := http.ListenAndServe(address, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
