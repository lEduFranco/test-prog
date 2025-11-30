package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/ledufranco/recruitment-system/internal/config"
	"github.com/ledufranco/recruitment-system/internal/database"
	"github.com/ledufranco/recruitment-system/internal/handlers"
	"github.com/ledufranco/recruitment-system/internal/middleware"
	"github.com/ledufranco/recruitment-system/internal/models"
	"github.com/ledufranco/recruitment-system/internal/repository"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	_ "github.com/ledufranco/recruitment-system/docs"
)

// @title           Recruitment System API
// @version         1.0
// @description     API para sistema de recrutamento e vagas de emprego
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.email  support@recruitment.com

// @license.name  MIT
// @license.url   http://opensource.org/licenses/MIT

// @host      localhost:8080
// @BasePath  /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Token de autenticação JWT no formato: Bearer {token}

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	db, err := database.Connect(&cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := database.Migrate(db); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	userRepo := repository.NewUserRepository(db)
	jobRepo := repository.NewJobRepository(db)
	applicationRepo := repository.NewApplicationRepository(db)

	authHandler := handlers.NewAuthHandler(userRepo, cfg)
	jobHandler := handlers.NewJobHandler(jobRepo)
	applicationHandler := handlers.NewApplicationHandler(applicationRepo, jobRepo)

	gin.SetMode(cfg.Server.GinMode)
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:8080", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	setupRoutes(router, authHandler, jobHandler, applicationHandler, cfg)

	log.Printf("Server starting on port %s", cfg.Server.Port)
	if err := router.Run(":" + cfg.Server.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func setupRoutes(
	router *gin.Engine,
	authHandler *handlers.AuthHandler,
	jobHandler *handlers.JobHandler,
	applicationHandler *handlers.ApplicationHandler,
	cfg *config.Config,
) {
	api := router.Group("/api")

	auth := api.Group("/auth")
	{
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
		auth.POST("/refresh", authHandler.Refresh)
	}

	authProtected := api.Group("/auth")
	authProtected.Use(middleware.AuthMiddleware(cfg.JWT.Secret))
	{
		authProtected.GET("/me", authHandler.Me)
	}

	jobs := api.Group("/jobs")
	{
		jobs.GET("", jobHandler.List)
		jobs.GET("/:id", jobHandler.GetByID)
	}

	jobsProtected := api.Group("/jobs")
	jobsProtected.Use(middleware.AuthMiddleware(cfg.JWT.Secret))
	jobsProtected.Use(middleware.RequireRole(models.RoleAdmin))
	{
		jobsProtected.POST("", jobHandler.Create)
		jobsProtected.PUT("/:id", jobHandler.Update)
		jobsProtected.DELETE("/:id", jobHandler.Delete)
		jobsProtected.GET("/my-jobs", jobHandler.GetMyJobs)
		jobsProtected.GET("/:id/applications", applicationHandler.GetJobApplications)
	}

	applicationsCandidate := api.Group("/applications")
	applicationsCandidate.Use(middleware.AuthMiddleware(cfg.JWT.Secret))
	applicationsCandidate.Use(middleware.RequireRole(models.RoleCandidate))
	{
		applicationsCandidate.POST("", applicationHandler.Create)
		applicationsCandidate.GET("/my-applications", applicationHandler.GetMyApplications)
	}

	applicationsAdmin := api.Group("/applications")
	applicationsAdmin.Use(middleware.AuthMiddleware(cfg.JWT.Secret))
	applicationsAdmin.Use(middleware.RequireRole(models.RoleAdmin))
	{
		applicationsAdmin.PUT("/:id", applicationHandler.UpdateStatus)
	}

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
}
