package jwt

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/ledufranco/recruitment-system/internal/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const testSecret = "test-secret-key"

func createTestUser() *models.User {
	return &models.User{
		ID:    uuid.New(),
		Email: "test@example.com",
		Role:  models.RoleAdmin,
	}
}

func TestGenerateTokenPair(t *testing.T) {
	user := createTestUser()
	accessExp := 15 * time.Minute
	refreshExp := 7 * 24 * time.Hour

	t.Run("should generate valid access and refresh tokens", func(t *testing.T) {
		tokens, err := GenerateTokenPair(user, testSecret, accessExp, refreshExp)

		require.NoError(t, err)
		assert.NotEmpty(t, tokens.AccessToken)
		assert.NotEmpty(t, tokens.RefreshToken)
		assert.NotEqual(t, tokens.AccessToken, tokens.RefreshToken)
	})

	t.Run("access token should have correct claims", func(t *testing.T) {
		tokens, _ := GenerateTokenPair(user, testSecret, accessExp, refreshExp)

		claims, err := ValidateToken(tokens.AccessToken, testSecret)
		require.NoError(t, err)
		assert.Equal(t, user.ID, claims.UserID)
		assert.Equal(t, user.Email, claims.Email)
		assert.Equal(t, user.Role, claims.Role)
		assert.Equal(t, "access", claims.Type)
	})

	t.Run("refresh token should have correct type", func(t *testing.T) {
		tokens, _ := GenerateTokenPair(user, testSecret, accessExp, refreshExp)

		claims, err := ValidateRefreshToken(tokens.RefreshToken, testSecret)
		require.NoError(t, err)
		assert.Equal(t, user.ID, claims.UserID)
		assert.Equal(t, "refresh", claims.Type)
	})
}

func TestValidateToken(t *testing.T) {
	user := createTestUser()
	tokens, _ := GenerateTokenPair(user, testSecret, 15*time.Minute, 7*24*time.Hour)

	t.Run("should validate correct token", func(t *testing.T) {
		claims, err := ValidateToken(tokens.AccessToken, testSecret)

		require.NoError(t, err)
		assert.Equal(t, user.ID, claims.UserID)
		assert.Equal(t, user.Email, claims.Email)
		assert.Equal(t, user.Role, claims.Role)
	})

	t.Run("should reject token with wrong secret", func(t *testing.T) {
		_, err := ValidateToken(tokens.AccessToken, "wrong-secret")
		assert.Error(t, err)
	})

	t.Run("should reject malformed token", func(t *testing.T) {
		_, err := ValidateToken("invalid.token.here", testSecret)
		assert.Error(t, err)
	})

	t.Run("should reject empty token", func(t *testing.T) {
		_, err := ValidateToken("", testSecret)
		assert.Error(t, err)
	})

	t.Run("should reject expired token", func(t *testing.T) {
		
		expiredTokens, _ := GenerateTokenPair(user, testSecret, -1*time.Hour, 7*24*time.Hour)
		_, err := ValidateToken(expiredTokens.AccessToken, testSecret)
		assert.Error(t, err)
	})
}

func TestValidateRefreshToken(t *testing.T) {
	user := createTestUser()
	tokens, _ := GenerateTokenPair(user, testSecret, 15*time.Minute, 7*24*time.Hour)

	t.Run("should validate correct refresh token", func(t *testing.T) {
		claims, err := ValidateRefreshToken(tokens.RefreshToken, testSecret)

		require.NoError(t, err)
		assert.Equal(t, user.ID, claims.UserID)
		assert.Equal(t, "refresh", claims.Type)
	})

	t.Run("should reject access token as refresh token", func(t *testing.T) {
		_, err := ValidateRefreshToken(tokens.AccessToken, testSecret)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "invalid token type")
	})

	t.Run("should reject invalid refresh token", func(t *testing.T) {
		_, err := ValidateRefreshToken("invalid-token", testSecret)
		assert.Error(t, err)
	})

	t.Run("should reject expired refresh token", func(t *testing.T) {
		expiredTokens, _ := GenerateTokenPair(user, testSecret, 15*time.Minute, -1*time.Hour)
		_, err := ValidateRefreshToken(expiredTokens.RefreshToken, testSecret)
		assert.Error(t, err)
	})
}

func TestTokenClaims(t *testing.T) {
	t.Run("should maintain user data integrity in claims", func(t *testing.T) {
		adminUser := &models.User{
			ID:    uuid.New(),
			Email: "admin@test.com",
			Role:  models.RoleAdmin,
		}

		candidateUser := &models.User{
			ID:    uuid.New(),
			Email: "candidate@test.com",
			Role:  models.RoleCandidate,
		}

		adminTokens, _ := GenerateTokenPair(adminUser, testSecret, 15*time.Minute, 7*24*time.Hour)
		candidateTokens, _ := GenerateTokenPair(candidateUser, testSecret, 15*time.Minute, 7*24*time.Hour)

		adminClaims, _ := ValidateToken(adminTokens.AccessToken, testSecret)
		candidateClaims, _ := ValidateToken(candidateTokens.AccessToken, testSecret)

		assert.Equal(t, adminUser.ID, adminClaims.UserID)
		assert.Equal(t, models.RoleAdmin, adminClaims.Role)

		assert.Equal(t, candidateUser.ID, candidateClaims.UserID)
		assert.Equal(t, models.RoleCandidate, candidateClaims.Role)
	})
}
