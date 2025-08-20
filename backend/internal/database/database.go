package database

import (
	"fmt"
	"os"

	"backend/internal/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// Init: initialize the database connection and auto migrate all models
func Init() error {

	// use environment variable to configure DSN
	// PostgreSQL DSN example:
	//   host=localhost user=youruser password=yourpw dbname=note_blog port=5432 sslmode=disable TimeZone=UTC

	// get dsn from .env file
	dsn := os.Getenv("DATABASE_DSN")

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	// Auto migrate all models in dependency order
	if err := db.AutoMigrate(
		&model.User{},        // 1. 用户表（被其他表依赖）
		&model.Folder{},      // 2. 文件夹表（依赖用户表）
		&model.Note{},        // 3. 笔记表（依赖用户表和文件夹表）
		&model.NoteRevision{}, // 4. 笔记版本表（依赖笔记表）
	); err != nil {
		return fmt.Errorf("failed to auto migrate models: %w", err)
	}

	DB = db
	return nil
}
