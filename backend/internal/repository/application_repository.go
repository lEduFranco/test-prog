package repository

import (
	"errors"

	"github.com/google/uuid"
	"github.com/ledufranco/recruitment-system/internal/models"
	"gorm.io/gorm"
)

type ApplicationRepository struct {
	db *gorm.DB
}

func NewApplicationRepository(db *gorm.DB) *ApplicationRepository {
	return &ApplicationRepository{db: db}
}

func (r *ApplicationRepository) Create(application *models.Application) error {
	return r.db.Create(application).Error
}

func (r *ApplicationRepository) FindByID(id uuid.UUID) (*models.Application, error) {
	var application models.Application
	err := r.db.Preload("Job").Preload("Candidate").Where("id = ?", id).First(&application).Error
	if err != nil {
		return nil, err
	}
	return &application, nil
}

func (r *ApplicationRepository) FindByCandidateID(candidateID uuid.UUID) ([]models.Application, error) {
	var applications []models.Application
	err := r.db.Preload("Job").Preload("Job.Recruiter").
		Where("candidate_id = ?", candidateID).
		Order("created_at DESC").
		Find(&applications).Error
	return applications, err
}

func (r *ApplicationRepository) FindByJobID(jobID uuid.UUID) ([]models.Application, error) {
	var applications []models.Application
	err := r.db.Preload("Candidate").
		Where("job_id = ?", jobID).
		Order("created_at DESC").
		Find(&applications).Error
	return applications, err
}

func (r *ApplicationRepository) Update(application *models.Application) error {
	return r.db.Save(application).Error
}

func (r *ApplicationRepository) ExistsForJobAndCandidate(jobID, candidateID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.Model(&models.Application{}).
		Where("job_id = ? AND candidate_id = ?", jobID, candidateID).
		Count(&count).Error
	return count > 0, err
}

func (r *ApplicationRepository) FindByJobAndCandidate(jobID, candidateID uuid.UUID) (*models.Application, error) {
	var application models.Application
	err := r.db.Where("job_id = ? AND candidate_id = ?", jobID, candidateID).First(&application).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &application, nil
}
