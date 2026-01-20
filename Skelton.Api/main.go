package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

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

	// Initialize OLLAMA service and start if needed
	log.Println("Initializing OLLAMA service...")
	ollamaService := services.NewOllamaService()
	if err := ollamaService.StartOllama(); err != nil {
		log.Printf("Warning: Failed to start OLLAMA: %v", err)
		log.Println("OLLAMA offline mode will not be available. Please ensure OLLAMA is installed and accessible.")
	} else {
		log.Println("OLLAMA service initialized successfully")
	}

	// Initialize handlers
	projectHandler := handlers.NewProjectHandler()
	enhancedProjectHandler := handlers.NewEnhancedProjectHandler()

	// Define routes
	router.HandleFunc("/health", projectHandler.HandleHealth).Methods("GET")
	router.HandleFunc("/api/project/validate", projectHandler.HandleProjectDescription).Methods("POST", "OPTIONS")

	// Enhanced project routes with AI integration
	router.HandleFunc("/api/project/generate-specification", enhancedProjectHandler.HandleGenerateSpecification).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/project/download-document", enhancedProjectHandler.HandleDownloadDocument).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/project/get-cached-content", enhancedProjectHandler.HandleGetCachedContent).Methods("POST", "OPTIONS")

	// Apply middleware
	handler := middleware.LoggingMiddleware(middleware.CORSMiddleware(router))

	// Start server
	address := fmt.Sprintf(":%s", port)
	log.Printf("Starting Skelton API server on port %s", port)
	log.Printf("Health check available at http://localhost:%s/health", port)
	log.Printf("API endpoints:")
	log.Printf("  - Project validation: http://localhost:%s/api/project/validate", port)
	log.Printf("  - Generate specification: http://localhost:%s/api/project/generate-specification", port)
	log.Printf("  - Download document: http://localhost:%s/api/project/download-document", port)
	log.Printf("  - Get cached content: http://localhost:%s/api/project/get-cached-content", port)

	if err := http.ListenAndServe(address, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
