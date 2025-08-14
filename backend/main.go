package main

import (
	"backend/internal/database"
	"log"

	"backend/internal/router"

	"github.com/joho/godotenv"
)

func main() {

	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Init database
	if err := database.Init(); err != nil {
		log.Fatalf("failed to initialize the database: %v", err)
	}

	// Init router
	r := router.Setup()
	r.Run(":8080")

}
