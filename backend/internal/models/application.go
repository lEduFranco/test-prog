package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ApplicationStatus string

const (
	ApplicationStatusPending   ApplicationStatus = "pending"
	ApplicationStatusReviewing ApplicationStatus = "reviewing"
	ApplicationStatusApproved  ApplicationStatus = "approved"
	ApplicationStatusRejected  ApplicationStatus = "rejected"
)

type Application struct {
	ID          uuid.UUID         `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	JobID       uuid.UUID         `gorm:"type:uuid;not null" json:"job_id"`
	CandidateID uuid.UUID         `gorm:"type:uuid;not null" json:"candidate_id"`
	Status      ApplicationStatus `gorm:"type:varchar(20);default:'pending'" json:"status"`
	CreatedAt   time.Time         `json:"created_at"`
	UpdatedAt   time.Time         `json:"updated_at"`
	DeletedAt   gorm.DeletedAt    `gorm:"index" json:"-"`

	
	Job       Job  `gorm:"foreignKey:JobID" json:"job,omitempty"`
	Candidate User `gorm:"foreignKey:CandidateID" json:"candidate,omitempty"`
}

type ApplicationResponse struct {
	ID          uuid.UUID         `json:"id"`
	JobID       uuid.UUID         `json:"job_id"`
	CandidateID uuid.UUID         `json:"candidate_id"`
	Status      ApplicationStatus `json:"status"`
	CreatedAt   time.Time         `json:"created_at"`
	UpdatedAt   time.Time         `json:"updated_at"`
	Job         *JobResponse      `json:"job,omitempty"`
	Candidate   *UserResponse     `json:"candidate,omitempty"`
}

func (a *Application) ToResponse(includeJob, includeCandidate bool) ApplicationResponse {
	resp := ApplicationResponse{
		ID:          a.ID,
		JobID:       a.JobID,
		CandidateID: a.CandidateID,
		Status:      a.Status,
		CreatedAt:   a.CreatedAt,
		UpdatedAt:   a.UpdatedAt,
	}

	if includeJob && a.Job.ID != uuid.Nil {
		jobResp := a.Job.ToResponse(false)
		resp.Job = &jobResp
	}

	if includeCandidate && a.Candidate.ID != uuid.Nil {
		candidateResp := a.Candidate.ToResponse()
		resp.Candidate = &candidateResp
	}

	return resp
}
