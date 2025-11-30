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

const testSecret = "test-jwt-secret"

func TestAuthMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)

	setupRouter := func() *gin.Engine {
		r := gin.New()
		r.Use(AuthMiddleware(testSecret))
		r.GET("/protected", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "success"})
		})
		return r
	}

	t.Run("should allow access with valid access token", func(t *testing.T) {
		user := testutil.ledufranco("test@example.com", "password", models.RoleAdmin)
		token, _ := testutil.GenerateTestToken(user, testSecret, "access", 15*time.Minute)

		router := setupRouter()
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)
		req.Header.Set("Authorization", "Bearer "+token)

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("should reject request without Authorization header", func(t *testing.T) {
		router := setupRouter()
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
		assert.Contains(t, w.Body.String(), "Authorization header required")
	})

	t.Run("should reject invalid Bearer format", func(t *testing.T) {
		router := setupRouter()
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)
		req.Header.Set("Authorization", "InvalidFormat token")

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
		assert.Contains(t, w.Body.String(), "Invalid authorization format")
	})

	t.Run("should reject invalid token", func(t *testing.T) {
		router := setupRouter()
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)
		req.Header.Set("Authorization", "Bearer invalid.token.here")

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
		assert.Contains(t, w.Body.String(), "Invalid or expired token")
	})

	t.Run("should reject expired token", func(t *testing.T) {
		user := testutil.CreateTestUser("test@example.com", "password", models.RoleAdmin)
		token, _ := testutil.GenerateTestToken(user, testSecret, "access", -1*time.Hour)

		router := setupRouter()
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)
		req.Header.Set("Authorization", "Bearer "+token)

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("should reject refresh token on protected route", func(t *testing.T) {
		user := testutil.CreateTestUser("test@example.com", "password", models.RoleAdmin)
		token, _ := testutil.GenerateTestToken(user, testSecret, "refresh", 15*time.Minute)

		router := setupRouter()
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/protected", nil)
		req.Header.Set("Authorization", "Bearer "+token)

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
		assert.Contains(t, w.Body.String(), "Invalid token type")
	})

	t.Run("should set user context on successful authentication", func(t *testing.T) {
		user := testutil.CreateTestUser("admin@example.com", "password", models.RoleAdmin)
		token, _ := testutil.GenerateTestToken(user, testSecret, "access", 15*time.Minute)

		router := gin.New()
		router.Use(AuthMiddleware(testSecret))
		router.GET("/check-context", func(c *gin.Context) {
			userClaims, exists := c.Get(UserContextKey)
			assert.True(t, exists)
			assert.NotNil(t, userClaims)
			c.JSON(http.StatusOK, gin.H{"authenticated": true})
		})

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/check-context", nil)
		req.Header.Set("Authorization", "Bearer "+token)

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})
}
