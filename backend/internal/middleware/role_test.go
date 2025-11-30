package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ledufranco/recruitment-system/internal/models"
	"github.com/ledufranco/recruitment-system/testutil"
	"github.com/stretchr/testify/assert"
)

func TestRequireRole(t *testing.T) {
	gin.SetMode(gin.TestMode)

	setupRouter := func(allowedRoles ...models.UserRole) *gin.Engine {
		r := gin.New()
		r.Use(AuthMiddleware(testSecret))
		r.Use(RequireRole(allowedRoles...))
		r.GET("/protected", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "success"})
		})
		return r
	}

	t.Run("should allow admin to access admin-only route", func(t *testing.T) {
		adminUser := testutil.CreateTestUser("admin@example.com", "password", models.RoleAdmin)
		token, _ := testutil.GenerateTestToken(adminUser, testSecret, "access", 15*time.Minute)

		router := setupRouter(models.RoleAdmin)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)
		req.Header.Set("Authorization", "Bearer "+token)

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "success")
	})

	t.Run("should allow candidate to access candidate-only route", func(t *testing.T) {
		candidateUser := testutil.CreateTestUser("candidate@example.com", "password", models.RoleCandidate)
		token, _ := testutil.GenerateTestToken(candidateUser, testSecret, "access", 15*time.Minute)

		router := setupRouter(models.RoleCandidate)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)
		req.Header.Set("Authorization", "Bearer "+token)

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "success")
	})

	t.Run("should allow admin to access routes available for both roles", func(t *testing.T) {
		adminUser := testutil.CreateTestUser("admin@example.com", "password", models.RoleAdmin)
		token, _ := testutil.GenerateTestToken(adminUser, testSecret, "access", 15*time.Minute)

		router := setupRouter(models.RoleAdmin, models.RoleCandidate)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)
		req.Header.Set("Authorization", "Bearer "+token)

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("should allow candidate to access routes available for both roles", func(t *testing.T) {
		candidateUser := testutil.CreateTestUser("candidate@example.com", "password", models.RoleCandidate)
		token, _ := testutil.GenerateTestToken(candidateUser, testSecret, "access", 15*time.Minute)

		router := setupRouter(models.RoleAdmin, models.RoleCandidate)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)
		req.Header.Set("Authorization", "Bearer "+token)

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("should reject candidate attempting admin-only route", func(t *testing.T) {
		candidateUser := testutil.CreateTestUser("candidate@example.com", "password", models.RoleCandidate)
		token, _ := testutil.GenerateTestToken(candidateUser, testSecret, "access", 15*time.Minute)

		router := setupRouter(models.RoleAdmin)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)
		req.Header.Set("Authorization", "Bearer "+token)

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.Contains(t, w.Body.String(), "Insufficient permissions")
	})

	t.Run("should reject admin attempting candidate-only route", func(t *testing.T) {
		adminUser := testutil.CreateTestUser("admin@example.com", "password", models.RoleAdmin)
		token, _ := testutil.GenerateTestToken(adminUser, testSecret, "access", 15*time.Minute)

		router := setupRouter(models.RoleCandidate)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)
		req.Header.Set("Authorization", "Bearer "+token)

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusForbidden, w.Code)
		assert.Contains(t, w.Body.String(), "Insufficient permissions")
	})

	t.Run("should reject request without user context", func(t *testing.T) {
		r := gin.New()
		r.Use(RequireRole(models.RoleAdmin))
		r.GET("/protected", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "success"})
		})

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
		assert.Contains(t, w.Body.String(), "User context not found")
	})
}
