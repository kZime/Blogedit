package main

import (
	"backend/internal/database"
	"log"

	"backend/internal/router"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// init database
	if err := database.Init(); err != nil {
		log.Fatalf("failed to initialize the database: %v", err)
	}

	// init router
	r := router.Setup()
	r.Run(":8080")

}
