// Models with associations for querying
// These models are used for queries that need to load related data
package model

// NoteWithAssociations includes all related data
type NoteWithAssociations struct {
	Note
	User   User   `gorm:"foreignKey:UserID"`
	Folder Folder `gorm:"foreignKey:FolderID"`
}

// FolderWithAssociations includes all related data
type FolderWithAssociations struct {
	Folder
	User     User     `gorm:"foreignKey:UserID"`
	Parent   *Folder  `gorm:"foreignKey:ParentID"`
	Children []Folder `gorm:"foreignKey:ParentID"`
	Notes    []Note   `gorm:"foreignKey:FolderID"`
}

// UserWithAssociations includes all related data
type UserWithAssociations struct {
	User
	Folders []Folder `gorm:"foreignKey:UserID"`
	Notes   []Note   `gorm:"foreignKey:UserID"`
}

// NoteRevisionWithAssociations includes related data
type NoteRevisionWithAssociations struct {
	NoteRevision
	Note Note `gorm:"foreignKey:NoteID"`
}
