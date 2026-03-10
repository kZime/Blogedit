// The user model for the boardit backend

// backend/internal/model/user.go
package model

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey"                          json:"id"`
	Username     string    `gorm:"type:varchar(100);not null"          json:"username"`
	Email        string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"type:varchar(255);not null"          json:"-"`
	CreatedAt    time.Time `gorm:"not null"                            json:"created_at"`
	UpdatedAt    time.Time `gorm:"not null"                            json:"updated_at"`
}
