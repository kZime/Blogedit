package main

import (
	"backend/internal/database"
	"log"
	"os"

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

	// Require JWT_SECRET for security (min 32 chars)
	const minJWTSecretLen = 32
	if secret := os.Getenv("JWT_SECRET"); len(secret) < minJWTSecretLen {
		log.Fatalf("JWT_SECRET must be at least %d characters", minJWTSecretLen)
	}

	// Init router
	r := router.Setup()
	r.Run(":8080")

}
