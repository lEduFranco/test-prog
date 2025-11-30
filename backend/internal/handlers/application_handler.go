package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/ledufranco/recruitment-system/internal/middleware"
	"github.com/ledufranco/recruitment-system/internal/models"
	"github.com/ledufranco/recruitment-system/internal/repository"
	"github.com/ledufranco/recruitment-system/pkg/jwt"
	"gorm.io/gorm"
)

type ApplicationHandler struct {
	applicationRepo *repository.ApplicationRepository
	jobRepo         *repository.JobRepository
}

type CreateApplicationRequest struct {
	JobID uuid.UUID `json:"job_id" binding:"required"`
}

type UpdateApplicationStatusRequest struct {
	Status models.ApplicationStatus `json:"status" binding:"required,oneof=pending reviewing approved rejected"`
}

func NewApplicationHandler(applicationRepo *repository.ApplicationRepository, jobRepo *repository.JobRepository) *ApplicationHandler {
	return &ApplicationHandler{
		applicationRepo: applicationRepo,
		jobRepo:         jobRepo,
	}
}

// Create godoc
// @Summary      Criar candidatura
// @Description  Candidata-se a uma vaga (apenas candidates)
// @Tags         applications
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body CreateApplicationRequest true "Dados da candidatura"
// @Success      201 {object} models.ApplicationResponse
// @Failure      400 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Failure      403 {object} map[string]string
// @Failure      404 {object} map[string]string
// @Failure      409 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /applications [post]
func (h *ApplicationHandler) Create(c *gin.Context) {
	var req CreateApplicationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userClaims, _ := c.Get(middleware.UserContextKey)
	claims := userClaims.(*jwt.Claims)

	job, err := h.jobRepo.FindByID(req.JobID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get job"})
		return
	}

	if job.Status != models.JobStatusOpen {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Job is not accepting applications"})
		return
	}

	exists, err := h.applicationRepo.ExistsForJobAndCandidate(req.JobID, claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check existing application"})
		return
	}
	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": "Você já se candidatou a esta vaga"})
		return
	}

	application := &models.Application{
		JobID:       req.JobID,
		CandidateID: claims.UserID,
		Status:      models.ApplicationStatusPending,
	}

	if err := h.applicationRepo.Create(application); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create application"})
		return
	}

	application, _ = h.applicationRepo.FindByID(application.ID)

	c.JSON(http.StatusCreated, application.ToResponse(true, false))
}

// GetMyApplications godoc
// @Summary      Obter minhas candidaturas
// @Description  Retorna todas as candidaturas do candidate autenticado
// @Tags         applications
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Success      200 {array} models.ApplicationResponse
// @Failure      401 {object} map[string]string
// @Failure      403 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /applications/my-applications [get]
func (h *ApplicationHandler) GetMyApplications(c *gin.Context) {
	userClaims, _ := c.Get(middleware.UserContextKey)
	claims := userClaims.(*jwt.Claims)

	applications, err := h.applicationRepo.FindByCandidateID(claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get applications"})
		return
	}

	responses := make([]models.ApplicationResponse, len(applications))
	for i, app := range applications {
		responses[i] = app.ToResponse(true, false)
	}

	c.JSON(http.StatusOK, responses)
}

// GetJobApplications godoc
// @Summary      Obter candidaturas de uma vaga
// @Description  Retorna todas as candidaturas de uma vaga específica (apenas o admin que criou a vaga)
// @Tags         applications
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id path string true "Job ID"
// @Success      200 {array} models.ApplicationResponse
// @Failure      400 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Failure      403 {object} map[string]string
// @Failure      404 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /jobs/{id}/applications [get]
func (h *ApplicationHandler) GetJobApplications(c *gin.Context) {
	jobID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}

	userClaims, _ := c.Get(middleware.UserContextKey)
	claims := userClaims.(*jwt.Claims)

	job, err := h.jobRepo.FindByID(jobID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get job"})
		return
	}

	if job.RecruiterID != claims.UserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only view applications for your own jobs"})
		return
	}

	applications, err := h.applicationRepo.FindByJobID(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get applications"})
		return
	}

	responses := make([]models.ApplicationResponse, len(applications))
	for i, app := range applications {
		responses[i] = app.ToResponse(false, true)
	}

	c.JSON(http.StatusOK, responses)
}

// UpdateStatus godoc
// @Summary      Atualizar status de candidatura
// @Description  Atualiza o status de uma candidatura (apenas admin da vaga)
// @Tags         applications
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id path string true "Application ID"
// @Param        request body UpdateApplicationStatusRequest true "Novo status"
// @Success      200 {object} models.ApplicationResponse
// @Failure      400 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Failure      403 {object} map[string]string
// @Failure      404 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /applications/{id} [put]
func (h *ApplicationHandler) UpdateStatus(c *gin.Context) {
	applicationID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid application ID"})
		return
	}

	var req UpdateApplicationStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userClaims, _ := c.Get(middleware.UserContextKey)
	claims := userClaims.(*jwt.Claims)

	application, err := h.applicationRepo.FindByID(applicationID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Application not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get application"})
		return
	}

	job, err := h.jobRepo.FindByID(application.JobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get job"})
		return
	}

	if job.RecruiterID != claims.UserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only update applications for your own jobs"})
		return
	}

	application.Status = req.Status
	if err := h.applicationRepo.Update(application); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update application"})
		return
	}

	c.JSON(http.StatusOK, application.ToResponse(true, true))
}
