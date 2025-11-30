package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type JobType string
type JobStatus string

const (
	JobTypeRemote JobType = "remote"
	JobTypeOnsite JobType = "onsite"
	JobTypeHybrid JobType = "hybrid"

	JobStatusOpen     JobStatus = "open"
	JobStatusClosed   JobStatus = "closed"
	JobStatusArchived JobStatus = "archived"
)

type Job struct {
	ID          uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	RecruiterID uuid.UUID      `gorm:"type:uuid;not null" json:"recruiter_id"`
	Title       string         `gorm:"not null" json:"title"`
	Description string         `gorm:"type:text;not null" json:"description"`
	Salary      *float64       `json:"salary,omitempty"`
	Location    string         `json:"location"`
	Type        JobType        `gorm:"type:varchar(20);not null" json:"type"`
	Status      JobStatus      `gorm:"type:varchar(20);default:'open'" json:"status"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	
	Recruiter    User          `gorm:"foreignKey:RecruiterID" json:"recruiter,omitempty"`
	Applications []Application `gorm:"foreignKey:JobID" json:"applications,omitempty"`
}

type JobResponse struct {
	ID          uuid.UUID    `json:"id"`
	RecruiterID uuid.UUID    `json:"recruiter_id"`
	Title       string       `json:"title"`
	Description string       `json:"description"`
	Salary      *float64     `json:"salary,omitempty"`
	Location    string       `json:"location"`
	Type        JobType      `json:"type"`
	Status      JobStatus    `json:"status"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
	Recruiter   *UserResponse `json:"recruiter,omitempty"`
}

func (j *Job) ToResponse(includeRecruiter bool) JobResponse {
	resp := JobResponse{
		ID:          j.ID,
		RecruiterID: j.RecruiterID,
		Title:       j.Title,
		Description: j.Description,
		Salary:      j.Salary,
		Location:    j.Location,
		Type:        j.Type,
		Status:      j.Status,
		CreatedAt:   j.CreatedAt,
		UpdatedAt:   j.UpdatedAt,
	}

	if includeRecruiter && j.Recruiter.ID != uuid.Nil {
		userResp := j.Recruiter.ToResponse()
		resp.Recruiter = &userResp
	}

	return resp
}
