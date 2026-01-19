package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"skelton-api/handlers"
	"skelton-api/middleware"

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

	// Initialize handlers
	projectHandler := handlers.NewProjectHandler()

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
