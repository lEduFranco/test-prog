package testutil

import (
	"time"

	"github.com/google/uuid"
	"github.com/ledufranco/recruitment-system/internal/models"
	"github.com/ledufranco/recruitment-system/pkg/utils"
)
type TestUser struct {
	ID           uuid.UUID
	Email        string
	Password     string
	PasswordHash string
	Role         models.UserRole
}
func CreateTestUser(email, password string, role models.UserRole) TestUser {
	hash, _ := utils.HashPassword(password)
	return TestUser{
		ID:           uuid.New(),
		Email:        email,
		Password:     password,
		PasswordHash: hash,
		Role:         role,
	}
}
func (u TestUser) ToModel() *models.User {
	return &models.User{
		ID:           u.ID,
		Email:        u.Email,
		PasswordHash: u.PasswordHash,
		Role:         u.Role,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
}
func CreateTestJob(recruiterID uuid.UUID, title, location string, jobType models.JobType) *models.Job {
	salary := 5000.0
	return &models.Job{
		ID:          uuid.New(),
		RecruiterID: recruiterID,
		Title:       title,
		Description: "Test job description for " + title,
		Salary:      &salary,
		Location:    location,
		Type:        jobType,
		Status:      models.JobStatusOpen,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
}
func CreateTestApplication(jobID, candidateID uuid.UUID) *models.Application {
	return &models.Application{
		ID:          uuid.New(),
		JobID:       jobID,
		CandidateID: candidateID,
		Status:      models.ApplicationStatusPending,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
}
