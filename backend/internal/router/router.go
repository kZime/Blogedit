package router

import (
	"backend/internal/handler"

	"github.com/gin-gonic/gin"
)

func Setup() *gin.Engine {
	r := gin.Default()
	auth := r.Group("/api/auth")
	{
		auth.POST("/register", handler.Register)
		// TODO: add login, refresh
		auth.POST("/login", handler.Login)
	}
	return r
}
