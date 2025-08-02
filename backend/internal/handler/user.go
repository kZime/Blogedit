// internal/handler/user.go
package handler

import (
	"net/http"

	"backend/internal/database"
	"backend/internal/model"

	"github.com/gin-gonic/gin"
)

func GetCurrentUser(c *gin.Context) {
	// ASSUME 'userID' is written into context in JWTMiddleware
	userID, _ := c.Get("userID")

	var user model.User

	// get user by id
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
	})
}
