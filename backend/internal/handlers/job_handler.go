package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/ledufranco/recruitment-system/internal/middleware"
	"github.com/ledufranco/recruitment-system/internal/models"
	"github.com/ledufranco/recruitment-system/internal/repository"
	"github.com/ledufranco/recruitment-system/pkg/jwt"
	"gorm.io/gorm"
)

type JobHandler struct {
	jobRepo *repository.JobRepository
}

type CreateJobRequest struct {
	Title       string           `json:"title" binding:"required"`
	Description string           `json:"description" binding:"required"`
	Salary      *float64         `json:"salary"`
	Location    string           `json:"location" binding:"required"`
	Type        models.JobType   `json:"type" binding:"required,oneof=remote onsite hybrid"`
}

type UpdateJobRequest struct {
	Title       string           `json:"title"`
	Description string           `json:"description"`
	Salary      *float64         `json:"salary"`
	Location    string           `json:"location"`
	Type        models.JobType   `json:"type" binding:"omitempty,oneof=remote onsite hybrid"`
	Status      models.JobStatus `json:"status" binding:"omitempty,oneof=open closed archived"`
}

func NewJobHandler(jobRepo *repository.JobRepository) *JobHandler {
	return &JobHandler{jobRepo: jobRepo}
}

// Create godoc
// @Summary      Criar nova vaga
// @Description  Cria uma nova vaga de emprego (apenas admin)
// @Tags         jobs
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body CreateJobRequest true "Dados da vaga"
// @Success      201 {object} models.JobResponse
// @Failure      400 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Failure      403 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /jobs [post]
func (h *JobHandler) Create(c *gin.Context) {
	var req CreateJobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userClaims, _ := c.Get(middleware.UserContextKey)
	claims := userClaims.(*jwt.Claims)

	job := &models.Job{
		RecruiterID: claims.UserID,
		Title:       req.Title,
		Description: req.Description,
		Salary:      req.Salary,
		Location:    req.Location,
		Type:        req.Type,
		Status:      models.JobStatusOpen,
	}

	if err := h.jobRepo.Create(job); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create job"})
		return
	}

	c.JSON(http.StatusCreated, job.ToResponse(false))
}

// GetByID godoc
// @Summary      Obter vaga por ID
// @Description  Retorna os detalhes de uma vaga específica
// @Tags         jobs
// @Accept       json
// @Produce      json
// @Param        id path string true "Job ID"
// @Success      200 {object} models.JobResponse
// @Failure      400 {object} map[string]string
// @Failure      404 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /jobs/{id} [get]
func (h *JobHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}

	job, err := h.jobRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get job"})
		return
	}

	c.JSON(http.StatusOK, job.ToResponse(true))
}

// List godoc
// @Summary      Listar vagas
// @Description  Lista todas as vagas com filtros opcionais
// @Tags         jobs
// @Accept       json
// @Produce      json
// @Param        search query string false "Buscar por título ou descrição"
// @Param        location query string false "Filtrar por localização"
// @Param        type query string false "Filtrar por tipo (remote, onsite, hybrid)"
// @Param        status query string false "Filtrar por status (open, closed, archived)" default(open)
// @Param        salary_min query number false "Salário mínimo"
// @Param        salary_max query number false "Salário máximo"
// @Param        page query integer false "Número da página" default(1)
// @Param        limit query integer false "Itens por página" default(10)
// @Param        sort_by query string false "Campo para ordenação" default(created_at)
// @Param        order query string false "Ordem (ASC, DESC)" default(DESC)
// @Success      200 {object} map[string]interface{}
// @Failure      500 {object} map[string]string
// @Router       /jobs [get]
func (h *JobHandler) List(c *gin.Context) {
	filters := repository.JobFilters{
		Search:   c.Query("search"),
		Location: c.Query("location"),
		Type:     c.Query("type"),
		Status:   c.DefaultQuery("status", "open"),
		SortBy:   c.DefaultQuery("sort_by", "created_at"),
		Order:    c.DefaultQuery("order", "DESC"),
	}

	if salaryMinStr := c.Query("salary_min"); salaryMinStr != "" {
		if val, err := strconv.ParseFloat(salaryMinStr, 64); err == nil {
			filters.SalaryMin = &val
		}
	}

	if salaryMaxStr := c.Query("salary_max"); salaryMaxStr != "" {
		if val, err := strconv.ParseFloat(salaryMaxStr, 64); err == nil {
			filters.SalaryMax = &val
		}
	}

	if pageStr := c.Query("page"); pageStr != "" {
		if val, err := strconv.Atoi(pageStr); err == nil {
			filters.Page = val
		}
	}

	if limitStr := c.Query("limit"); limitStr != "" {
		if val, err := strconv.Atoi(limitStr); err == nil {
			filters.Limit = val
		}
	}

	jobs, total, err := h.jobRepo.FindAll(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list jobs"})
		return
	}

	responses := make([]models.JobResponse, len(jobs))
	for i, job := range jobs {
		responses[i] = job.ToResponse(true)
	}

	c.JSON(http.StatusOK, gin.H{
		"jobs":  responses,
		"total": total,
		"page":  filters.Page,
		"limit": filters.Limit,
	})
}

// GetMyJobs godoc
// @Summary      Obter minhas vagas
// @Description  Retorna todas as vagas criadas pelo admin autenticado
// @Tags         jobs
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Success      200 {array} models.JobResponse
// @Failure      401 {object} map[string]string
// @Failure      403 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /jobs/my-jobs [get]
func (h *JobHandler) GetMyJobs(c *gin.Context) {
	userClaims, _ := c.Get(middleware.UserContextKey)
	claims := userClaims.(*jwt.Claims)

	jobs, err := h.jobRepo.FindByRecruiterID(claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get jobs"})
		return
	}

	responses := make([]models.JobResponse, len(jobs))
	for i, job := range jobs {
		responses[i] = job.ToResponse(false)
	}

	c.JSON(http.StatusOK, responses)
}

// Update godoc
// @Summary      Atualizar vaga
// @Description  Atualiza uma vaga de emprego (apenas o admin que criou)
// @Tags         jobs
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id path string true "Job ID"
// @Param        request body UpdateJobRequest true "Dados para atualização"
// @Success      200 {object} models.JobResponse
// @Failure      400 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Failure      403 {object} map[string]string
// @Failure      404 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /jobs/{id} [put]
func (h *JobHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}

	var req UpdateJobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userClaims, _ := c.Get(middleware.UserContextKey)
	claims := userClaims.(*jwt.Claims)

	job, err := h.jobRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get job"})
		return
	}

	if job.RecruiterID != claims.UserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only update your own jobs"})
		return
	}

	if req.Title != "" {
		job.Title = req.Title
	}
	if req.Description != "" {
		job.Description = req.Description
	}
	if req.Salary != nil {
		job.Salary = req.Salary
	}
	if req.Location != "" {
		job.Location = req.Location
	}
	if req.Type != "" {
		job.Type = req.Type
	}
	if req.Status != "" {
		job.Status = req.Status
	}

	if err := h.jobRepo.Update(job); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update job"})
		return
	}

	c.JSON(http.StatusOK, job.ToResponse(false))
}

// Delete godoc
// @Summary      Deletar vaga
// @Description  Remove uma vaga de emprego (apenas o admin que criou)
// @Tags         jobs
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id path string true "Job ID"
// @Success      200 {object} map[string]string
// @Failure      400 {object} map[string]string
// @Failure      401 {object} map[string]string
// @Failure      403 {object} map[string]string
// @Failure      404 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /jobs/{id} [delete]
func (h *JobHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}

	userClaims, _ := c.Get(middleware.UserContextKey)
	claims := userClaims.(*jwt.Claims)

	job, err := h.jobRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get job"})
		return
	}

	if job.RecruiterID != claims.UserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete your own jobs"})
		return
	}

	if err := h.jobRepo.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete job"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Job deleted successfully"})
}
