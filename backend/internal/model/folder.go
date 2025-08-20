// Model for folder in the database
package model

import "time"

type Folder struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null;index;constraint:OnUpdate:CASCADE"`
	Name      string    `gorm:"type:varchar(255);not null"`
	ParentID  *uint     `gorm:"index;constraint:OnUpdate:CASCADE"`
	SortOrder int       `gorm:"not null;default:0"`
	CreatedAt time.Time `gorm:"not null"`
	UpdatedAt time.Time `gorm:"not null"`
}