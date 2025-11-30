package repository

import (
	"strings"

	"github.com/google/uuid"
	"github.com/ledufranco/recruitment-system/internal/models"
	"github.com/ledufranco/recruitment-system/pkg/utils"
	"gorm.io/gorm"
)

type JobRepository struct {
	db *gorm.DB
}

type JobFilters struct {
	Search    string
	Location  string
	Type      string
	SalaryMin *float64
	SalaryMax *float64
	Status    string
	SortBy    string
	Order     string
	Page      int
	Limit     int
}

func NewJobRepository(db *gorm.DB) *JobRepository {
	return &JobRepository{db: db}
}

func (r *JobRepository) Create(job *models.Job) error {
	return r.db.Create(job).Error
}

func (r *JobRepository) FindByID(id uuid.UUID) (*models.Job, error) {
	var job models.Job
	err := r.db.Preload("Recruiter").Where("id = ?", id).First(&job).Error
	if err != nil {
		return nil, err
	}
	return &job, nil
}

func (r *JobRepository) FindAll(filters JobFilters) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	query := r.db.Model(&models.Job{}).Preload("Recruiter")

	if filters.Search != "" {
		normalized := utils.NormalizeText(filters.Search)
		words := strings.Fields(normalized)
		
		for _, word := range words {
			pattern := "%" + word + "%"
			query = query.Where(
				"translate(lower(title), 'áàâãäåéèêëíìîïóòôõöúùûüçñ', 'aaaaaaeeeeiiiiooooouuuucn') LIKE ? OR translate(lower(description), 'áàâãäåéèêëíìîïóòôõöúùûüçñ', 'aaaaaaeeeeiiiiooooouuuucn') LIKE ?",
				pattern, pattern,
			)
		}
	}

	if filters.Location != "" {
		normalized := utils.NormalizeText(filters.Location)
		pattern := "%" + normalized + "%"
		query = query.Where("translate(lower(location), 'áàâãäåéèêëíìîïóòôõöúùûüçñ', 'aaaaaaeeeeiiiiooooouuuucn') LIKE ?", pattern)
	}

	if filters.Type != "" {
		query = query.Where("type = ?", filters.Type)
	}

	if filters.SalaryMin != nil {
		query = query.Where("salary >= ?", *filters.SalaryMin)
	}

	if filters.SalaryMax != nil {
		query = query.Where("salary <= ?", *filters.SalaryMax)
	}

	if filters.Status != "" {
		query = query.Where("status = ?", filters.Status)
	}

	
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	
	sortBy := "created_at"
	if filters.SortBy != "" {
		sortBy = filters.SortBy
	}

	order := "DESC"
	if filters.Order != "" {
		order = filters.Order
	}

	query = query.Order(sortBy + " " + order)

	
	limit := 20
	if filters.Limit > 0 {
		limit = filters.Limit
	}

	offset := 0
	if filters.Page > 0 {
		offset = (filters.Page - 1) * limit
	}

	query = query.Limit(limit).Offset(offset)

	
	if err := query.Find(&jobs).Error; err != nil {
		return nil, 0, err
	}

	return jobs, total, nil
}

func (r *JobRepository) FindByRecruiterID(recruiterID uuid.UUID) ([]models.Job, error) {
	var jobs []models.Job
	err := r.db.Where("recruiter_id = ?", recruiterID).Order("created_at DESC").Find(&jobs).Error
	return jobs, err
}

func (r *JobRepository) Update(job *models.Job) error {
	return r.db.Save(job).Error
}

func (r *JobRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Job{}, "id = ?", id).Error
}
