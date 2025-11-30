package database

import (
	"fmt"
	"log"

	"github.com/ledufranco/recruitment-system/internal/config"
	"github.com/ledufranco/recruitment-system/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(cfg *config.DatabaseConfig) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(cfg.DSN()), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Database connection established successfully")
	return db, nil
}

func Migrate(db *gorm.DB) error {
	log.Println("Running database migrations...")

	if err := db.AutoMigrate(
		&models.User{},
		&models.Job{},
		&models.Application{},
	); err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}

	if err := db.Exec(`
		CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_job_candidate
		ON applications(job_id, candidate_id)
		WHERE deleted_at IS NULL
	`).Error; err != nil {
		return fmt.Errorf("failed to create unique index: %w", err)
	}

	log.Println("Database migrations completed successfully")
	return nil
}
